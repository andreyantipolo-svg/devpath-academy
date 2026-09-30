import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBlocks } from '../src/components/parseBlocks.js';

test('parses paragraphs, lists, headings and fences', () => {
  const b = parseBlocks('# Title\n\nHello `x`\nworld\n\n- a\n- b\n\n1. one\n2. two\n\n```js\nlet x = 1;\n```');
  assert.deepEqual(b.map((x) => x.type), ['h', 'p', 'ul', 'ol', 'code']);
  assert.equal(b[1].text, 'Hello `x` world');
  assert.equal(b[2].items.length, 2);
  assert.equal(b[4].text, 'let x = 1;');
});

test('an unclosed fence (streaming reply) renders as code instead of swallowing nothing', () => {
  const b = parseBlocks('Try this:\n```python\nprint(1)');
  assert.deepEqual(b.map((x) => x.type), ['p', 'code']);
  assert.equal(b[1].text, 'print(1)');
});

test('HTML in text stays plain text (React escapes it)', () => {
  const b = parseBlocks('<img src=x onerror=alert(1)>');
  assert.equal(b[0].type, 'p');
  assert.equal(b[0].text, '<img src=x onerror=alert(1)>');
});
