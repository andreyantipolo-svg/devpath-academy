import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { streamMessage, completeJSON, AIError } from '../src/ai/claude.js';

function server(handler) {
  return new Promise((resolve) => {
    const s = http.createServer(handler);
    s.listen(0, () => resolve({ s, url: `http://127.0.0.1:${s.address().port}/v1/messages` }));
  });
}
const readBody = (req) => new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(JSON.parse(b))); });

test('streamMessage sends the right request and assembles streamed text', async () => {
  let seen;
  const { s, url } = await server(async (req, res) => {
    seen = { headers: req.headers, body: await readBody(req) };
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    const ev = (t) => `event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: t } })}\n\n`;
    const all = 'event: message_start\ndata: {"type":"message_start"}\n\n' + ev('Try ') + ev('a for loop') + 'event: message_stop\ndata: {"type":"message_stop"}\n\n';
    for (let i = 0; i < all.length; i += 11) res.write(all.slice(i, i + 11));
    res.end();
  });
  const seenText = [];
  const out = await streamMessage({ settings: { apiKey: 'sk-test', model: 'claude-sonnet-5-5', proxyUrl: url }, system: 'sys', messages: [{ role: 'user', content: 'hi' }], onText: (t) => seenText.push(t) });
  s.close();
  assert.equal(out, 'Try a for loop');
  assert.deepEqual(seenText, ['Try ', 'Try a for loop']);
  assert.equal(seen.headers['x-api-key'], 'sk-test');
  assert.equal(seen.headers['anthropic-version'], '2023-06-01');
  assert.equal(seen.headers['anthropic-dangerous-direct-browser-access'], 'true');
  assert.equal(seen.body.stream, true);
  assert.equal(seen.body.model, 'claude-sonnet-5-5');
  assert.equal(seen.body.system, 'sys');
});

test('a proxy without an API key receives no key headers', async () => {
  let headers;
  const { s, url } = await server(async (req, res) => {
    headers = req.headers;
    await readBody(req);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ content: [{ type: 'text', text: '```json\n{"questions":[]}\n```' }] }));
  });
  const json = await completeJSON({ settings: { proxyUrl: url }, system: 's', prompt: 'p' });
  s.close();
  assert.deepEqual(json, { questions: [] });
  assert.equal(headers['x-api-key'], undefined);
  assert.equal(headers['anthropic-dangerous-direct-browser-access'], undefined);
});

test('HTTP errors map to friendly error kinds', async () => {
  for (const [status, kind] of [[401, 'key'], [429, 'rate'], [529, 'busy'], [404, 'model']]) {
    const { s, url } = await server(async (req, res) => {
      await readBody(req);
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'nope' } }));
    });
    await assert.rejects(streamMessage({ settings: { apiKey: 'k', proxyUrl: url }, system: '', messages: [] }), (e) => e instanceof AIError && e.kind === kind);
    s.close();
  }
});

test('an unreachable endpoint becomes a network error', async () => {
  await assert.rejects(streamMessage({ settings: { apiKey: 'k', proxyUrl: 'http://127.0.0.1:9/x' }, system: '', messages: [] }), (e) => e.kind === 'network');
});
