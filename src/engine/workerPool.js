// Small lifecycle manager around a Blob-backed Web Worker.
// - The time limit starts when the worker reports 'started', so slow first-time engine
//   downloads (Pyodide) never count against the learner.
// - On timeout the worker is terminated and recreated on the next run.

export function createWorkerRunner(getSource, { timeoutMs = 5000, loadTimeoutMs = 45000, persistent = false, label = 'code' } = {}) {
  let worker = null;
  let url = null;
  let seq = 0;

  const dispose = () => {
    if (worker) worker.terminate();
    if (url) URL.revokeObjectURL(url);
    worker = null;
    url = null;
  };

  const ensure = () => {
    if (worker) return worker;
    url = URL.createObjectURL(new Blob([getSource()], { type: 'text/javascript' }));
    const created = new Worker(url);
    // A worker that dies on its own (e.g. its engine failed to download during warm-up) must be
    // discarded, otherwise the next run would wait on a corpse.
    created.addEventListener('error', () => { if (worker === created) dispose(); });
    worker = created;
    return worker;
  };

  const run = (payload, { onStatus } = {}) =>
    new Promise((resolve) => {
      const id = ++seq;
      let timer = null;
      let loadTimer = null;
      let w;
      try {
        w = ensure();
      } catch (err) {
        resolve({ ok: false, fatal: true, error: `Could not start the ${label} engine: ${err.message}` });
        return;
      }
      const finish = (result, kill) => {
        clearTimeout(timer);
        clearTimeout(loadTimer);
        w.removeEventListener('message', onMessage);
        w.removeEventListener('error', onError);
        if (kill || !persistent) dispose();
        resolve(result);
      };
      const onMessage = (e) => {
        if (e.data.id !== id) return;
        if (e.data.type === 'started') {
          clearTimeout(loadTimer);
          onStatus?.('running');
          timer = setTimeout(
            () => finish({ ok: false, timeout: true, error: `Time limit exceeded (${timeoutMs / 1000}s). Check for an infinite loop.` }, true),
            timeoutMs,
          );
          return;
        }
        finish(e.data, !!e.data.fatal);
      };
      const onError = () => finish({ ok: false, fatal: true, error: `The ${label} engine failed to load. Check your internet connection and try again.` }, true);
      w.addEventListener('message', onMessage);
      w.addEventListener('error', onError);
      onStatus?.('loading');
      // If the engine never finishes downloading (offline, blocked CDN), fail with a clear message.
      loadTimer = setTimeout(() => finish({ ok: false, fatal: true, error: `The ${label} engine did not load. Check your internet connection and try again.` }, true), loadTimeoutMs);
      w.postMessage({ ...payload, id });
    });

  return { run, dispose, warmUp: () => { try { ensure(); } catch { /* ignore */ } } };
}
