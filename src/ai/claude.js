import { createSSEParser, extractJSON } from './parse.js';

export const MODELS = [
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', note: 'Balanced (recommended)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', note: 'Fastest and cheapest' },
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', note: 'Deepest reasoning' },
];
export const DEFAULT_MODEL = MODELS[0].id;
const API_URL = 'https://api.anthropic.com/v1/messages';

export class AIError extends Error {
  constructor(kind, message) {
    super(message || kind);
    this.kind = kind; // maps to i18n key ai.err.<kind>
  }
}

/** The tutor is available with either the learner's own key or a proxy that adds one. */
export const aiConfigured = (s) => Boolean(s?.apiKey || s?.proxyUrl);

const KIND_BY_STATUS = { 400: 'request', 401: 'key', 403: 'key', 404: 'model', 413: 'request', 429: 'rate', 500: 'busy', 502: 'busy', 503: 'busy', 529: 'busy' };

async function toError(res) {
  let detail = '';
  try {
    detail = (await res.json())?.error?.message || '';
  } catch {
    /* ignore */
  }
  return new AIError(KIND_BY_STATUS[res.status] || 'unknown', detail);
}

function request(settings, body, signal) {
  const headers = { 'content-type': 'application/json', 'anthropic-version': '2023-06-01' };
  if (settings.apiKey) {
    headers['x-api-key'] = settings.apiKey;
    // Required by Anthropic for calls made straight from a browser (the key stays on this device).
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return fetch(settings.proxyUrl || API_URL, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({ model: settings.model || DEFAULT_MODEL, ...body }),
  }).catch((err) => {
    if (err?.name === 'AbortError') throw err;
    throw new AIError('network');
  });
}

/** Stream a reply; onText receives the full text so far on every delta. Resolves to the final text. */
export async function streamMessage({ settings, system, messages, maxTokens = 1024, signal, onText }) {
  const res = await request(settings, { max_tokens: maxTokens, system, messages, stream: true }, signal);
  if (!res.ok) throw await toError(res);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  const parser = createSSEParser(({ event, data }) => {
    if (event === 'content_block_delta' && data?.delta?.type === 'text_delta') {
      full += data.delta.text;
      onText?.(full);
    } else if (event === 'error') {
      throw new AIError(data?.error?.type === 'overloaded_error' ? 'busy' : 'unknown', data?.error?.message);
    }
  });
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.push(decoder.decode(value, { stream: true }));
  }
  parser.end();
  return full;
}

/** One-shot request that returns parsed JSON (used for practice questions and translation). */
export async function completeJSON({ settings, system, prompt, maxTokens = 2048, signal }) {
  const res = await request(settings, { max_tokens: maxTokens, system, messages: [{ role: 'user', content: prompt }] }, signal);
  if (!res.ok) throw await toError(res);
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
  try {
    return extractJSON(text);
  } catch {
    throw new AIError('parse');
  }
}
