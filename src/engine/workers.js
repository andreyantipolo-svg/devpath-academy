// Source code for the sandboxed Web Workers. They are built as Blobs at runtime so the app
// needs no extra bundler configuration. Learner code never runs on the main thread, so an
// infinite loop can be terminated and code cannot touch the page, cookies or localStorage.

export const JS_WORKER = `
const fmt = (v) => {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return String(v);
  if (typeof v === 'bigint') return v + 'n';
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (v instanceof Set) return 'Set(' + v.size + ') {' + [...v].map(fmt).join(', ') + '}';
  if (v instanceof Map) return 'Map(' + v.size + ') {' + [...v].map(([k, x]) => fmt(k) + ' => ' + fmt(x)).join(', ') + '}';
  if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
  return String(v);
};
self.onmessage = async (e) => {
  const { id, code } = e.data;
  const out = [];
  const log = (...a) => out.push(a.map(fmt).join(' '));
  const cons = { log, info: log, warn: log, error: log, debug: log, table: log };
  const timers = new Set();
  const nativeSet = self.setTimeout.bind(self);
  const nativeClear = self.clearTimeout.bind(self);
  const setTimeoutTracked = (fn, ms, ...args) => {
    const t = nativeSet(() => { timers.delete(t); fn(...args); }, ms);
    timers.add(t);
    return t;
  };
  const clearTimeoutTracked = (t) => { timers.delete(t); nativeClear(t); };
  self.postMessage({ id, type: 'started' });
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction('console', 'setTimeout', 'clearTimeout', code)(cons, setTimeoutTracked, clearTimeoutTracked);
    const until = Date.now() + 3000;
    while (timers.size && Date.now() < until) await new Promise((r) => nativeSet(r, 10));
    self.postMessage({ id, ok: true, output: out.join('\\n') });
  } catch (err) {
    const name = err && err.name ? err.name + ': ' : '';
    self.postMessage({ id, ok: false, output: out.join('\\n'), error: name + ((err && err.message) || err) });
  }
};
`;

export const makePythonWorker = (indexURL) => `
importScripts('${indexURL}pyodide.js');
let py = null;
let loadError = null;
const ready = loadPyodide({ indexURL: '${indexURL}' }).then((p) => { py = p; }).catch((e) => { loadError = e; });
const cleanTrace = (msg) => {
  const lines = String(msg).split('\\n');
  const idx = lines.findIndex((l) => l.includes('<exec>'));
  if (idx < 0) return lines.filter(Boolean).slice(-3).join('\\n');
  const head = idx > 0 && !lines[idx].startsWith('Traceback') ? 'Traceback (most recent call last):\\n' : '';
  return head + lines.slice(idx).join('\\n').trim();
};
self.onmessage = async (e) => {
  const { id, code } = e.data;
  await ready;
  if (loadError || !py) {
    self.postMessage({ id, ok: false, fatal: true, error: 'Could not load the Python engine: ' + ((loadError && loadError.message) || 'unknown error') + '. Check your connection and try again.' });
    return;
  }
  const out = [];
  py.setStdout({ batched: (s) => out.push(s) });
  py.setStderr({ batched: (s) => out.push(s) });
  const ns = py.globals.get('dict')();
  self.postMessage({ id, type: 'started' });
  try {
    await py.runPythonAsync(code, { globals: ns });
    self.postMessage({ id, ok: true, output: out.join('\\n') });
  } catch (err) {
    self.postMessage({ id, ok: false, output: out.join('\\n'), error: cleanTrace((err && err.message) || err) });
  } finally {
    ns.destroy();
  }
};
`;

export const makeSqlWorker = (jsUrl, wasmUrl) => `
importScripts('${jsUrl}');
const ready = initSqlJs({ locateFile: () => '${wasmUrl}' });
self.onmessage = async (e) => {
  const { id, code, setup } = e.data;
  let SQL;
  try { SQL = await ready; } catch (err) {
    self.postMessage({ id, ok: false, fatal: true, error: 'Could not load the SQL engine: ' + (err && err.message || err) });
    return;
  }
  const db = new SQL.Database();
  self.postMessage({ id, type: 'started' });
  try {
    if (setup) db.exec(setup);
    const sets = db.exec(code);
    if (!sets.length) {
      self.postMessage({ id, ok: true, output: '(query returned no rows)', compare: '' });
    } else {
      const last = sets[sets.length - 1];
      const rows = last.values.map((r) => r.map((v) => (v === null ? 'NULL' : String(v))).join(' | '));
      self.postMessage({ id, ok: true, output: last.columns.join(' | ') + '\\n' + rows.join('\\n'), compare: rows.join('\\n') });
    }
  } catch (err) {
    self.postMessage({ id, ok: false, error: 'SQL error: ' + (err && err.message || err) });
  } finally {
    db.close();
  }
};
`;
