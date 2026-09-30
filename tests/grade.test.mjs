import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, sameOutput, stripComments, checkPatterns, pick, diffLines } from '../src/engine/grade.js';

test('normalize ignores trailing spaces, CRLF and outer blank lines', () => {
  assert.equal(normalize('a  \r\nb\t\n\n'), 'a\nb');
  assert.ok(sameOutput('  12,130,44\n', '12,130,44'));
  assert.ok(!sameOutput('1 2', '1  2'));
});

test('stripComments removes comments but keeps string contents', () => {
  const src = 'int x = 1; // note\n/* block */ printf("http://a.b"); // tail';
  const out = stripComments(src);
  assert.ok(!out.includes('note') && !out.includes('block') && !out.includes('tail'));
  assert.ok(out.includes('"http://a.b"'));
});

test('commented-out code does not satisfy a pattern check', () => {
  const checks = [{ desc: 'prints hello', re: 'println\\("Hello"\\)' }];
  assert.equal(checkPatterns('// System.out.println("Hello");', checks)[0].ok, false);
  assert.equal(checkPatterns('System.out.println("Hello");', checks)[0].ok, true);
});

test('pick supports per-language values', () => {
  assert.equal(pick({ python: 'p', javascript: 'j' }, 'python'), 'p');
  assert.equal(pick('same', 'python'), 'same');
  assert.deepEqual(pick(['a'], 'python'), ['a']);
});

test('diffLines pinpoints the differing row', () => {
  const rows = diffLines('a\nX', 'a\nb');
  assert.equal(rows[0].same, true);
  assert.equal(rows[1].same, false);
});
