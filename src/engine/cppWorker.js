// C++ runs through JSCPP, an interpreter that supports the fundamentals taught in the
// C++ track (I/O, types, control flow, functions, recursion, arrays, pointers).
// It runs in a dedicated module worker so a runaway loop can be terminated.
import JSCPP from 'JSCPP';

self.onmessage = (e) => {
  const { id, code, stdin = '' } = e.data;
  let out = '';
  self.postMessage({ id, type: 'started' });
  try {
    JSCPP.run(code, stdin, {
      stdio: { write: (s) => { out += s; } },
      maxTimeout: 4000,
    });
    self.postMessage({ id, ok: true, output: out });
  } catch (err) {
    const msg = String((err && err.message) || err);
    const pos = msg.match(/line (\d+) \(column (\d+)\)/) || msg.match(/^(\d+):(\d+)/);
    let friendly = msg.split('\n')[0];
    if (/Parsing Failure/i.test(msg) && pos) friendly = `Syntax error near line ${pos[1]}, column ${pos[2]}. Check for a missing semicolon, bracket or quote.`;
    else if (/cannot find library/i.test(msg)) friendly = `${friendly}. The in-browser C++ engine covers core C++ (no STL containers or classes yet).`;
    else if (/timeout/i.test(msg)) friendly = 'Time limit exceeded. Check for an infinite loop.';
    self.postMessage({ id, ok: false, output: out, error: friendly });
  }
};
