// Pure grading helpers. No browser APIs here so they can be unit-tested in Node.

/** Normalise program output so harmless whitespace differences never fail a learner. */
export const normalize = (s) =>
  String(s ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .trim();

export const sameOutput = (actual, expected) => normalize(actual) === normalize(expected);

/** Tasks may give per-language values ({ javascript: '..', python: '..' }) or a single value. */
export const pick = (value, lang) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] : value;

/**
 * Remove line and block comments (and # comments when hash=true) while respecting string
 * literals, so a commented-out solution can't satisfy a pattern check.
 */
export function stripComments(code, { hash = false } = {}) {
  let out = '';
  let i = 0;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    const d = code[i + 1];
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      out += c;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < n) {
          out += code[i++];
        }
        out += code[i++];
      }
      if (i < n) out += code[i++];
    } else if (c === '/' && d === '/') {
      while (i < n && code[i] !== '\n') i++;
    } else if (c === '/' && d === '*') {
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
    } else if (hash && c === '#') {
      while (i < n && code[i] !== '\n') i++;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** Pattern-based verification used by "guided" languages when no runner is available. */
export function checkPatterns(code, checks = []) {
  const clean = stripComments(code);
  return checks.map((c) => {
    let ok = false;
    try {
      ok = new RegExp(c.re, c.flags ?? 'm').test(clean);
    } catch {
      ok = false;
    }
    return { desc: c.desc, ok };
  });
}

/** Turn engine results into a single verdict. */
export function verdict({ ok, error, output, compare, expected }) {
  if (!ok) return { status: 'error', output: error || output || 'Something went wrong.' };
  const pass = sameOutput(compare ?? output, expected);
  return { status: pass ? 'pass' : 'fail', output };
}

/** Line-by-line diff of expected vs actual, used to show learners exactly what differs. */
export function diffLines(actual, expected) {
  const a = normalize(actual).split('\n');
  const e = normalize(expected).split('\n');
  const rows = [];
  for (let i = 0; i < Math.max(a.length, e.length); i++) {
    rows.push({ line: i + 1, actual: a[i] ?? '', expected: e[i] ?? '', same: (a[i] ?? '') === (e[i] ?? '') });
  }
  return rows;
}
