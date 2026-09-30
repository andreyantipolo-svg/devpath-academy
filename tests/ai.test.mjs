import test from 'node:test';
import assert from 'node:assert/strict';
import { createSSEParser, extractJSON, validateQuestions } from '../src/ai/parse.js';

test('SSE parser handles events split across arbitrary chunk boundaries', () => {
  const events = [];
  const p = createSSEParser((e) => events.push(e));
  const stream =
    'event: message_start\ndata: {"type":"message_start"}\n\n' +
    'event: content_block_delta\ndata: {"delta":{"type":"text_delta","text":"Hel"}}\n\n' +
    'event: content_block_delta\r\ndata: {"delta":{"type":"text_delta","text":"lo"}}\r\n\r\n' +
    'event: ping\ndata: {"type": "ping"}\n\n';
  for (let i = 0; i < stream.length; i += 7) p.push(stream.slice(i, i + 7));
  p.end();
  const text = events.filter((e) => e.event === 'content_block_delta').map((e) => e.data.delta.text).join('');
  assert.equal(text, 'Hello');
  assert.equal(events.length, 4);
});

test('SSE parser flushes a trailing event without blank line', () => {
  const events = [];
  const p = createSSEParser((e) => events.push(e));
  p.push('event: x\ndata: {"a":1}');
  p.end();
  assert.deepEqual(events[0].data, { a: 1 });
});

test('extractJSON tolerates fences and surrounding chatter', () => {
  assert.deepEqual(extractJSON('Sure!\n```json\n{"a":[1,2]}\n```\nEnjoy'), { a: [1, 2] });
  assert.deepEqual(extractJSON('here {"k":"v"} done'), { k: 'v' });
  assert.throws(() => extractJSON('no json here'));
});

test('validateQuestions drops malformed items and keeps good ones', () => {
  const good = { q: 'Q?', o: ['a', 'b', 'c', 'd'], a: 2, why: 'because' };
  const out = validateQuestions({ questions: [good, { q: 'bad', o: ['a'], a: 0 }, { q: 'bad2', o: ['a', 'b'], a: 5 }, null] });
  assert.equal(out.length, 1);
  assert.equal(out[0].a, 2);
  assert.deepEqual(validateQuestions({}), []);
});
