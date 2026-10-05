import sqlJsUrl from 'sql.js/dist/sql-wasm.js?url';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { JS_WORKER, makePythonWorker, makeSqlWorker } from './workers.js';
import { createWorkerRunner } from './workerPool.js';
import { runWebTests } from './webRunner.js';
import { remoteAvailable, runRemote } from './remoteRunner.js';
import { checkPatterns, pick, sameOutput } from './grade.js';

// Pyodide (CPython compiled to WebAssembly). Served from the jsDelivr npm mirror; to self-host,
// copy node_modules/pyodide into /public/pyodide/ and point this at '/pyodide/'.
export const PYODIDE_URL = 'https://cdn.jsdelivr.net/npm/pyodide@0.27.8/';

const abs = (u) => new URL(u, document.baseURI).href;

const jsRunner = createWorkerRunner(() => JS_WORKER, { timeoutMs: 5000, label: 'JavaScript' });
const pyRunner = createWorkerRunner(() => makePythonWorker(PYODIDE_URL), { timeoutMs: 8000, persistent: true, label: 'Python' });
const sqlRunner = createWorkerRunner(() => makeSqlWorker(abs(sqlJsUrl), abs(sqlWasmUrl)), { timeoutMs: 5000, persistent: true, label: 'SQL' });

let cppSeq = 0;
function runCpp(code) {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./cppWorker.js', import.meta.url), { type: 'module' });
    const id = ++cppSeq;
    let timer = setTimeout(() => finish({ ok: false, error: 'Time limit exceeded. Check for an infinite loop.' }), 9000);
    const finish = (r) => { clearTimeout(timer); worker.terminate(); resolve(r); };
    worker.onmessage = (e) => { if (e.data.id === id && e.data.type !== 'started') finish(e.data); };
    worker.onerror = (e) => finish({ ok: false, error: `The C++ engine failed to load: ${e.message || 'unknown error'}` });
    worker.postMessage({ id, code });
  });
}

/** Static description of every language the platform can teach. */
export const LANGS = {
  javascript: { label: 'JavaScript', cm: 'javascript', kind: 'browser' },
  python: { label: 'Python', cm: 'python', kind: 'browser' },
  sql: { label: 'SQL', cm: 'sql', kind: 'browser' },
  html: { label: 'HTML & CSS', cm: 'html', kind: 'web' },
  cpp: { label: 'C++', cm: 'cpp', kind: 'browser' },
  java: { label: 'Java', cm: 'java', kind: 'guided' },
  go: { label: 'Go', cm: 'go', kind: 'guided' },
  rust: { label: 'Rust', cm: 'rust', kind: 'guided' },
};

export function warmUp(lang) {
  if (lang === 'python') pyRunner.warmUp();
  if (lang === 'sql') sqlRunner.warmUp();
}

async function runBrowser(lang, code, setup, onStatus) {
  if (lang === 'javascript') return jsRunner.run({ code }, { onStatus });
  if (lang === 'python') return pyRunner.run({ code }, { onStatus });
  if (lang === 'sql') return sqlRunner.run({ code, setup }, { onStatus });
  if (lang === 'cpp') return runCpp(code);
  throw new Error(`No browser runner for ${lang}`);
}

/**
 * Run and grade a learner's code against a task.
 * Result: { status: 'pass'|'fail'|'error', output, details?, via, ms }
 *  via = 'browser' (executed here) | 'remote' (executed by a runner) | 'pattern' (guided check, not executed)
 */
export async function evaluate({ lang, code, task, setup, settings, onStatus }) {
  const started = performance.now();
  const done = (r) => ({ ...r, ms: Math.round(performance.now() - started) });
  const info = LANGS[lang];
  const expected = pick(task.expected, lang);
  const harness = pick(task.harness, lang);
  const source = harness ? `${code}\n${harness}` : code;

  if (info.kind === 'web') {
    const r = await runWebTests(code, task.dom || []);
    if (!r.ok) return done({ status: 'error', output: r.error, via: 'browser' });
    const pass = r.results.length > 0 && r.results.every((x) => x.ok);
    return done({ status: pass ? 'pass' : 'fail', output: '', details: r.results, via: 'browser' });
  }

  const grade = (r, via) => {
    if (!r.ok) return done({ status: 'error', output: r.error || r.output || 'Something went wrong.', via });
    const actual = r.compare ?? r.output;
    return done({ status: sameOutput(actual, expected) ? 'pass' : 'fail', output: r.output, via });
  };

  if (info.kind === 'browser') return grade(await runBrowser(lang, source, task.setup ?? setup, onStatus), 'browser');

  // Guided languages: prefer real execution when a runner is reachable.
  if (remoteAvailable(lang, settings)) {
    onStatus?.('running');
    try {
      return grade(await runRemote(lang, source, settings), 'remote');
    } catch {
      /* unreachable: fall back to pattern checks below */
    }
  }
  const details = checkPatterns(code, pick(task.checks, lang) || []);
  const pass = details.length > 0 && details.every((d) => d.ok);
  return done({ status: pass ? 'pass' : 'fail', output: '', details, via: 'pattern' });
}
