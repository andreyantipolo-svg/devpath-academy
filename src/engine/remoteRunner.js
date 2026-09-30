// Optional real execution for compiled languages (Java, Go, Rust, C++) over the network.
//  1. A Piston-compatible endpoint the learner configures (self-hosted: github.com/engineer-man/piston).
//     The shared public Piston instance is no longer open to everyone, so there is no default.
//  2. The official Rust Playground for Rust.
// If neither is available, the caller falls back to pattern checks and says so.

const PISTON = {
  java: { language: 'java', file: 'Main.java' },
  go: { language: 'go', file: 'main.go' },
  rust: { language: 'rust', file: 'main.rs' },
  cpp: { language: 'c++', file: 'main.cpp' },
};

export const remoteAvailable = (lang, settings) =>
  Boolean(settings?.runnerUrl && PISTON[lang]) || lang === 'rust';

async function runPiston(lang, code, { runnerUrl, runnerToken }) {
  const spec = PISTON[lang];
  const res = await fetch(`${runnerUrl.replace(/\/+$/, '')}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(runnerToken ? { Authorization: runnerToken } : {}) },
    body: JSON.stringify({ language: spec.language, version: '*', files: [{ name: spec.file, content: code }] }),
  });
  if (!res.ok) throw new Error(`Runner responded with ${res.status}`);
  const data = await res.json();
  if (data.compile && data.compile.code !== 0) {
    return { ok: false, error: (data.compile.stderr || data.compile.output || 'Compile error').trim() };
  }
  const run = data.run || {};
  if (run.code !== 0 && run.stderr) return { ok: false, output: run.stdout || '', error: run.stderr.trim() };
  return { ok: true, output: run.stdout ?? run.output ?? '' };
}

async function runRustPlayground(code) {
  const res = await fetch('https://play.rust-lang.org/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: 'stable', mode: 'debug', edition: '2021', crateType: 'bin', tests: false, code, backtrace: false }),
  });
  if (!res.ok) throw new Error(`Rust Playground responded with ${res.status}`);
  const data = await res.json();
  if (!data.success) return { ok: false, output: data.stdout || '', error: (data.stderr || 'Compile error').trim() };
  return { ok: true, output: data.stdout || '' };
}

/** Returns a result, or throws if the network/runner is unreachable (caller falls back). */
export async function runRemote(lang, code, settings) {
  if (settings?.runnerUrl && PISTON[lang]) return runPiston(lang, code, settings);
  if (lang === 'rust') return runRustPlayground(code);
  throw new Error('No runner configured');
}
