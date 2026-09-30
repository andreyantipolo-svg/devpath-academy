// Verifies the whole curriculum end to end:
//  - structure (quiz answers in range, hints present, per-language fields complete)
//  - every reference solution PASSES its task, using the same grading rules as the app
//  - every starter FAILS (a lesson must never be solved by doing nothing)
// Engines: JS (AsyncFunction), Python (system python3), SQL (sql.js), C++ (JSCPP), HTML/CSS (headless Chromium
// via playwright-core, skipped when unavailable), guided languages (pattern checks).
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { TRACKS } from '../src/data/index.js';
import { checkPatterns, pick, sameOutput } from '../src/engine/grade.js';

const require = createRequire(import.meta.url);
const problems = [];
let checked = 0;
const fail = (msg) => problems.push(msg);

// ---------- engines ----------
async function runJs(code) {
  const out = [];
  const fmt = (v) => (typeof v === 'string' ? v : v === undefined ? 'undefined' : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v));
  const log = (...a) => out.push(a.map(fmt).join(' '));
  const timers = new Set();
  const st = (fn, ms, ...a) => { const t = setTimeout(() => { timers.delete(t); fn(...a); }, ms); timers.add(t); return t; };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  try {
    await new AsyncFunction('console', 'setTimeout', 'clearTimeout', code)({ log, info: log, warn: log, error: log }, st, clearTimeout);
    const until = Date.now() + 3000;
    while (timers.size && Date.now() < until) await new Promise((r) => setTimeout(r, 10));
    return { ok: true, output: out.join('\n') };
  } catch (e) {
    return { ok: false, error: `${e.name}: ${e.message}`, output: out.join('\n') };
  }
}
function runPython(code) {
  const r = spawnSync('python3', ['-c', code], { encoding: 'utf8', timeout: 10000 });
  if (r.status !== 0) return { ok: false, error: (r.stderr || '').trim().split('\n').slice(-2).join(' | ') };
  return { ok: true, output: r.stdout };
}
let SQL;
async function runSql(code, setup) {
  if (!SQL) SQL = await require('sql.js')();
  const db = new SQL.Database();
  try {
    if (setup) db.exec(setup);
    const sets = db.exec(code);
    if (!sets.length) return { ok: true, output: '', compare: '' };
    const last = sets[sets.length - 1];
    const rows = last.values.map((r) => r.map((v) => (v === null ? 'NULL' : String(v))).join(' | '));
    return { ok: true, output: rows.join('\n'), compare: rows.join('\n') };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    db.close();
  }
}
async function runCpp(code) {
  const { default: JSCPP } = await import('JSCPP');
  let out = '';
  try {
    JSCPP.run(code, '', { stdio: { write: (s) => { out += s; } }, maxTimeout: 4000 });
    return { ok: true, output: out };
  } catch (e) {
    return { ok: false, error: String(e.message).split('\n')[0] };
  }
}
function runGpp(code) {
  const fs = require('node:fs');
  fs.writeFileSync('/tmp/_verify.cpp', code);
  const c = spawnSync('g++', ['-std=c++17', '-o', '/tmp/_verify', '/tmp/_verify.cpp'], { encoding: 'utf8' });
  if (c.status !== 0) return { ok: false, error: c.stderr.split('\n')[0] };
  const r = spawnSync('/tmp/_verify', { encoding: 'utf8', timeout: 5000 });
  return { ok: r.status === 0, output: r.stdout };
}
let browser;
async function webRun(html, tests) {
  if (browser === undefined) {
    try {
      const { chromium } = require('playwright-core');
      browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    } catch {
      browser = null;
    }
  }
  if (!browser) return null;
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.setContent(html);
  const results = await page.evaluate((ts) => ts.map((t) => { try { return { desc: t.desc, ok: !!(new Function('return (' + t.test + ')'))() }; } catch { return { desc: t.desc, ok: false }; } }), tests);
  await page.close();
  return results;
}

// ---------- grading ----------
async function gradeCode(lang, code, task, setup) {
  const expected = pick(task.expected, lang);
  const harness = pick(task.harness, lang);
  const src = harness ? `${code}\n${harness}` : code;
  if (lang === 'html') {
    const results = await webRun(code, task.dom || []);
    if (results === null) return { skipped: true };
    return { pass: results.length > 0 && results.every((r) => r.ok), detail: results.filter((r) => !r.ok).map((r) => r.desc).join('; ') };
  }
  if (['java', 'go', 'rust'].includes(lang)) {
    const d = checkPatterns(code, task.checks || []);
    return { pass: d.length > 0 && d.every((x) => x.ok), detail: d.filter((x) => !x.ok).map((x) => x.desc).join('; ') };
  }
  const r = lang === 'javascript' ? await runJs(src) : lang === 'python' ? runPython(src) : lang === 'sql' ? await runSql(src, setup) : await runCpp(src);
  if (!r.ok) return { pass: false, detail: `error: ${r.error}` };
  const actual = r.compare ?? r.output;
  const pass = sameOutput(actual, expected);
  return { pass, detail: pass ? '' : `expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}` };
}

// ---------- walk the curriculum ----------
const ids = new Set();
for (const track of TRACKS) {
  for (const lang of track.langs) if (!['javascript', 'python', 'sql', 'html', 'cpp', 'java', 'go', 'rust'].includes(lang)) fail(`${track.id}: unknown language ${lang}`);
  for (const level of track.levels) {
    const items = [...level.lessons.map((l) => ({ ...l, kind: 'lesson' })), { ...level.capstone, kind: 'capstone' }];
    for (const item of items) {
      const where = `${track.id}/${level.id}/${item.id}`;
      if (!item.id || ids.has(item.id)) fail(`${where}: missing or duplicate id`);
      ids.add(item.id);
      if (item.kind === 'lesson') {
        if (!item.theory || !item.example || !(item.xp > 0)) fail(`${where}: missing theory/example/xp`);
        if (!item.quiz?.length) fail(`${where}: no quiz`);
        for (const q of item.quiz || []) if (!(q.o.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length && q.why)) fail(`${where}: bad quiz question "${q.q}"`);
      }
      const task = item.task;
      if (!task?.text || (task.hints || []).length < 2) fail(`${where}: task needs text and 2+ hints`);
      for (const lang of track.langs) {
        const starter = pick(task.starter, lang);
        const solution = pick(task.solution, lang);
        if (starter == null || solution == null) { fail(`${where} [${lang}]: missing starter or solution`); continue; }
        if (item.kind === 'lesson' && item.example && typeof item.example === 'object' && !item.example[lang]) fail(`${where} [${lang}]: missing example`);
        const kind = ['java', 'go', 'rust'].includes(lang) ? 'guided' : lang === 'html' ? 'web' : 'run';
        if (kind === 'run' && pick(task.expected, lang) == null) fail(`${where} [${lang}]: missing expected`);
        if (kind === 'guided' && !task.checks?.length) fail(`${where} [${lang}]: missing checks`);
        if (kind === 'web' && !task.dom?.length) fail(`${where} [${lang}]: missing dom tests`);
        const setup = task.setup ?? track.setup;
        const sol = await gradeCode(lang, solution, task, setup);
        if (sol.skipped) { console.log(`  (skipped ${where}: no headless browser)`); continue; }
        checked++;
        if (!sol.pass) fail(`${where} [${lang}]: reference solution FAILS. ${sol.detail}`);
        const st = await gradeCode(lang, starter, task, setup);
        if (st.pass) fail(`${where} [${lang}]: starter already PASSES (task is trivial)`);
        if (lang === 'cpp') {
          const gpp = runGpp(`${solution}\n${pick(task.harness, lang) || ''}`);
          if (!gpp.ok || !sameOutput(gpp.output, pick(task.expected, lang))) fail(`${where} [cpp]: real g++ disagrees with expected: ${gpp.error || JSON.stringify(gpp.output)}`);
        }
      }
    }
  }
}
if (browser) await browser.close();
console.log(`Checked ${checked} task/language combinations across ${TRACKS.length} tracks.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('Curriculum OK: every solution passes, every starter fails.');
