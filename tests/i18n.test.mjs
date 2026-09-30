import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { STRINGS, makeT, detectLang } from '../src/i18n/index.js';
import { TRACKS } from '../src/data/index.js';
import { BADGES, RANKS } from '../src/state/progress.js';

const en = STRINGS.en;
const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? sourceFiles(p) : /\.(jsx?|mjs)$/.test(e.name) && !p.includes('/i18n/') && !p.includes('/data/') ? [p] : [];
  });
}

test('every literal t("key") used in the source exists in English', () => {
  const missing = new Set();
  for (const file of sourceFiles('src')) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\bt\(\s*'([\w.]+)'/g)) if (!(m[1] in en)) missing.add(`${m[1]} (${file})`);
  }
  assert.deepEqual([...missing], []);
});

test('every dynamic key family is fully defined', () => {
  const need = [];
  for (const l of ['beginner', 'intermediate', 'advanced']) need.push(`level.${l}`);
  for (const [, k] of RANKS) need.push(`rank.${k}`);
  for (const b of BADGES) need.push(`badge.${b}.name`, `badge.${b}.desc`);
  for (const k of ['hint', 'error', 'review', 'simpler', 'quiz', 'trace']) need.push(`tutor.q.${k}`);
  for (const k of ['key', 'rate', 'busy', 'model', 'network', 'request', 'parse', 'unknown']) need.push(`ai.err.${k}`);
  assert.deepEqual(need.filter((k) => !(k in en)), []);
  assert.ok(TRACKS.every((t) => t.id !== 'dsa' || 'track.dsa' in en));
});

for (const [code, table] of Object.entries(STRINGS)) {
  if (code === 'en') continue;
  test(`${code}: has exactly the English keys and the same {placeholders}`, () => {
    const missing = Object.keys(en).filter((k) => !(k in table));
    const extra = Object.keys(table).filter((k) => !(k in en));
    const badVars = Object.keys(en).filter((k) => k in table && vars(table[k]) !== vars(en[k]));
    assert.deepEqual({ missing, extra, badVars }, { missing: [], extra: [], badVars: [] });
  });
}

test('makeT interpolates, falls back to English and then to the key', () => {
  assert.equal(makeT('en')('toast.xp', { n: 50 }), '+50 XP');
  assert.equal(makeT('xx')('toast.xp', { n: 5 }), '+5 XP');
  assert.equal(makeT('en')('nope.key'), 'nope.key');
});

test('detectLang maps browser languages (tl -> fil)', () => {
  assert.equal(detectLang(['tl-PH', 'en']), 'fil');
  assert.equal(detectLang(['pt-BR']), 'pt');
  assert.equal(detectLang(['de']), 'en');
});
