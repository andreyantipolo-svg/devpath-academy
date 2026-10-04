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
let javaOk;
function runJava(code) {
  // Compile with the JDK's compiler module and run Main. Returns null when no JDK is available.
  const fs = require('node:fs');
  if (javaOk === undefined) javaOk = spawnSync('java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '--version'], { encoding: 'utf8' }).status === 0;
  if (!javaOk) return null;
  fs.rmSync('/tmp/_vjava', { recursive: true, force: true });
  fs.mkdirSync('/tmp/_vjava', { recursive: true });
  fs.writeFileSync('/tmp/_vjava/Main.java', code);
  const c = spawnSync('java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '-d', '/tmp/_vjava/out', '/tmp/_vjava/Main.java'], { encoding: 'utf8' });
  if (c.status !== 0) return { ok: false, error: (c.stderr || c.stdout).split('\n').slice(0, 3).join(' | ') };
  const r = spawnSync('java', ['-cp', '/tmp/_vjava/out', 'Main'], { encoding: 'utf8', timeout: 10000 });
  return { ok: r.status === 0, output: r.stdout, error: r.stderr };
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
    const d = checkPatterns(code, pick(task.checks, lang) || []);
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
        if (kind === 'guided' && !pick(task.checks, lang)?.length) fail(`${where} [${lang}]: missing checks`);
        if (kind === 'web' && !task.dom?.length) fail(`${where} [${lang}]: missing dom tests`);
        const setup = task.setup ?? track.setup;
        const sol = await gradeCode(lang, solution, task, setup);
        if (sol.skipped) { console.log(`  (skipped ${where}: no headless browser)`); continue; }
        checked++;
        if (!sol.pass) fail(`${where} [${lang}]: reference solution FAILS. ${sol.detail}`);
        const st = await gradeCode(lang, starter, task, setup);
        if (st.pass) fail(`${where} [${lang}]: starter already PASSES (task is trivial)`);
        if (lang === 'java') {
          const jr = runJava(`${solution}\n${pick(task.harness, lang) || ''}`);
          if (jr === null) console.log(`  (java not executed for ${where}: no JDK)`);
          else if (!jr.ok || !sameOutput(jr.output, pick(task.expected, lang))) fail(`${where} [java]: real javac/java disagrees with expected: ${jr.error || JSON.stringify(jr.output)}`);
        }
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
