import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer, XP, levelUnlocked, nextUp, trackProgress, computeBadges, rankFor, serialize, hydrate, dayKey } from '../src/state/progress.js';
import { TRACK_BY_ID } from '../src/data/index.js';

const at = (iso) => new Date(iso).getTime();
const run = (s, ...actions) => actions.reduce((acc, a) => reducer(acc, a), s);

test('quiz XP is granted once per question and never for wrong answers', () => {
  let s = initialState();
  s = run(s, { type: 'quizAnswer', lessonId: 'js-vars', index: 0, correct: false });
  assert.equal(s.xp, 0);
  s = run(s, { type: 'quizAnswer', lessonId: 'js-vars', index: 0, correct: true });
  assert.equal(s.xp, XP.quiz);
  // the original app let you farm +25 XP by resubmitting: that must be impossible now
  for (let i = 0; i < 5; i++) s = run(s, { type: 'quizAnswer', lessonId: 'js-vars', index: 0, correct: true });
  assert.equal(s.xp, XP.quiz);
  assert.equal(s.stats.quizCorrect, 1);
});

test('lesson and capstone XP are awarded exactly once', () => {
  let s = initialState();
  s = run(s, { type: 'taskPassed', lessonId: 'js-vars', xp: 50 }, { type: 'taskPassed', lessonId: 'js-vars', xp: 50 });
  assert.equal(s.xp, 50);
  s = run(s, { type: 'capstonePassed', trackId: 'javascript', levelId: 'beginner' }, { type: 'capstonePassed', trackId: 'javascript', levelId: 'beginner' });
  assert.equal(s.xp, 50 + XP.capstone);
});

test('passing a capstone unlocks the next level of that course only', () => {
  const js = TRACK_BY_ID.javascript;
  const py = TRACK_BY_ID.python;
  let s = initialState();
  assert.equal(levelUnlocked(s, js, 0), true);
  assert.equal(levelUnlocked(s, js, 1), false);
  s = run(s, { type: 'capstonePassed', trackId: 'javascript', levelId: 'beginner' });
  assert.equal(levelUnlocked(s, js, 1), true);
  assert.equal(levelUnlocked(s, js, 2), false);
  assert.equal(levelUnlocked(s, py, 1), false);
  assert.ok(s.toasts.some((t) => t.kind === 'unlock' && t.level === 'intermediate'));
});

test('streak counts consecutive days and resets after a gap', () => {
  let s = initialState();
  s = run(s, { type: 'taskPassed', lessonId: 'a', xp: 1, at: at('2026-03-01T10:00:00') });
  s = run(s, { type: 'taskPassed', lessonId: 'b', xp: 1, at: at('2026-03-01T18:00:00') });
  assert.equal(s.streak.count, 1);
  s = run(s, { type: 'taskPassed', lessonId: 'c', xp: 1, at: at('2026-03-02T09:00:00') });
  assert.equal(s.streak.count, 2);
  s = run(s, { type: 'taskPassed', lessonId: 'd', xp: 1, at: at('2026-03-05T09:00:00') });
  assert.equal(s.streak.count, 1);
  assert.equal(s.days['2026-03-01'], 2);
});

test('badges unlock once and raise a toast', () => {
  let s = run(initialState(), { type: 'ran' });
  assert.ok(computeBadges(s).includes('firstRun'));
  s = run(s, { type: 'taskPassed', lessonId: 'js-vars', xp: 50 });
  assert.ok(s.badges.firstLesson);
  const badgeToasts = () => s.toasts.filter((t) => t.kind === 'badge').length;
  const before = badgeToasts();
  s = run(s, { type: 'taskPassed', lessonId: 'js-cond', xp: 75 });
  assert.equal(badgeToasts(), before, 'no duplicate badge toasts');
});

test('nextUp finds the first unfinished lesson, then the capstone, and skips locked levels', () => {
  let s = initialState();
  assert.deepEqual(nextUp(s), { track: 'javascript', level: 'beginner', index: 0, tab: 'theory' });
  for (const id of ['js-vars', 'js-cond', 'js-loops', 'js-functions']) s = run(s, { type: 'taskPassed', lessonId: id, xp: 1 });
  assert.equal(nextUp(s).tab, 'capstone');
  assert.equal(trackProgress(s, TRACK_BY_ID.javascript).done, 4);
});

test('rank thresholds', () => {
  assert.equal(rankFor(0).key, 'newcomer');
  assert.equal(rankFor(320).key, 'builder');
  assert.equal(rankFor(99999).next, null);
});

test('serialize never writes the API key; hydrate tolerates junk', () => {
  let s = run(initialState(), { type: 'setSettings', patch: { apiKey: 'sk-secret', model: 'claude-haiku-4-5-20251001' } });
  const json = serialize(s);
  assert.ok(!json.includes('sk-secret'));
  assert.equal(hydrate(json).settings.model, 'claude-haiku-4-5-20251001');
  assert.equal(hydrate('{not json').xp, 0);
  assert.equal(hydrate(null).v, 2);
  assert.match(dayKey(new Date(2026, 0, 5)), /^2026-01-05$/);
});
