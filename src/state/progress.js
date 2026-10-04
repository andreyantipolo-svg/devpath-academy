// Pure progress logic: state shape, reducer, unlocking, badges. No React, no browser APIs,
// so every rule (especially XP farming protection) is unit-tested in Node.
import { TRACKS, TRACK_BY_ID, capstoneKey, lessonCount } from '../data/index.js';
import { DEFAULT_MODEL } from '../ai/claude.js';

export const STORAGE_KEY = 'devpath.v2';
export const XP = { quiz: 10, capstone: 150 };
export const RANKS = [
  [0, 'newcomer'],
  [100, 'apprentice'],
  [300, 'builder'],
  [700, 'engineer'],
  [1500, 'architect'],
  [3000, 'wizard'],
];
export const BADGES = ['firstRun', 'firstLesson', 'quizAce', 'polyglot', 'streak3', 'streak7', 'capstone', 'aiCurious', 'trailBlazer'];

export const rankFor = (xp) => {
  let idx = 0;
  RANKS.forEach(([min], i) => { if (xp >= min) idx = i; });
  const next = RANKS[idx + 1];
  return { key: RANKS[idx][1], next: next ? next[0] : null, floor: RANKS[idx][0] };
};

const pad = (n) => String(n).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const initialState = () => ({
  v: 2,
  xp: 0,
  uiLang: 'en',
  theme: 'dark',
  streak: { count: 0, last: null },
  days: {},
  lessons: {}, // lessonId -> { task: true, quiz: { [index]: true } }
  capstones: {}, // 'track:level' -> true
  badges: {}, // badgeId -> timestamp
  stats: { runs: 0, quizCorrect: 0, aiAsks: 0 },
  codeLang: {}, // trackId -> chosen language
  drafts: {}, // `${itemId}:${lang}` -> code
  translations: {}, // `${lessonId}:${uiLang}` -> { title, theory, task }
  nav: { view: 'home', track: 'javascript', level: 'beginner', index: 0, tab: 'theory' },
  settings: { apiKey: '', model: DEFAULT_MODEL, proxyUrl: '', runnerUrl: '', runnerToken: '', remember: true },
  toasts: [],
  toastSeq: 0,
});

// ---------- derived data ----------
export const lessonDone = (s, id) => Boolean(s.lessons[id]?.task);
export const trackProgress = (s, track) => {
  const total = lessonCount(track);
  const done = track.levels.reduce((n, l) => n + l.lessons.filter((x) => lessonDone(s, x.id)).length, 0);
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
};
/** A level unlocks when the previous level's capstone has been passed (the "gatekeeper"). */
export const levelUnlocked = (s, track, idx) => idx === 0 || Boolean(s.capstones[capstoneKey(track.id, track.levels[idx - 1].id)]);
export const trackComplete = (s, track) =>
  track.levels.every((l) => l.lessons.every((x) => lessonDone(s, x.id)) && s.capstones[capstoneKey(track.id, l.id)]);

/** Where "Continue" should take the learner: the first unfinished lesson, starting with the current course. */
export function nextUp(s) {
  const order = [TRACK_BY_ID[s.nav.track], ...TRACKS.filter((t) => t.id !== s.nav.track)].filter(Boolean);
  for (const track of order) {
    for (let li = 0; li < track.levels.length; li++) {
      if (!levelUnlocked(s, track, li)) break;
      const level = track.levels[li];
      const index = level.lessons.findIndex((x) => !lessonDone(s, x.id));
      if (index >= 0) return { track: track.id, level: level.id, index, tab: 'theory' };
      if (!s.capstones[capstoneKey(track.id, level.id)]) return { track: track.id, level: level.id, index: 0, tab: 'capstone' };
    }
  }
  return null;
}

export function computeBadges(s) {
  const doneByTrack = TRACKS.map((t) => trackProgress(s, t).done);
  return BADGES.filter((id) => {
    switch (id) {
      case 'firstRun': return s.stats.runs >= 1;
      case 'firstLesson': return doneByTrack.some((n) => n >= 1);
      case 'quizAce': return s.stats.quizCorrect >= 10;
      case 'polyglot': return doneByTrack.filter((n) => n >= 1).length >= 3;
      case 'streak3': return s.streak.count >= 3;
      case 'streak7': return s.streak.count >= 7;
      case 'capstone': return Object.keys(s.capstones).length >= 1;
      case 'aiCurious': return s.stats.aiAsks >= 1;
      case 'trailBlazer': return TRACKS.some((t) => trackComplete(s, t));
      default: return false;
    }
  });
}

// ---------- reducer ----------
const toast = (s, t) => ({ ...s, toasts: [...s.toasts, { id: s.toastSeq + 1, ...t }].slice(-4), toastSeq: s.toastSeq + 1 });

function award(s, xp, now) {
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 864e5));
  let { count, last } = s.streak;
  if (last !== today) {
    count = last === yesterday ? count + 1 : 1;
    last = today;
  }
  return { ...s, xp: s.xp + xp, days: { ...s.days, [today]: (s.days[today] || 0) + xp }, streak: { count, last } };
}

function finalize(s, now) {
  let out = s;
  for (const id of computeBadges(s)) {
    if (!out.badges[id]) out = toast({ ...out, badges: { ...out.badges, [id]: now.getTime() } }, { kind: 'badge', id });
  }
  return out;
}

export function reducer(state, action) {
  const now = action.at ? new Date(action.at) : new Date();
  switch (action.type) {
    case 'nav': return { ...state, nav: { ...state.nav, ...action.patch } };
    case 'ran': return { ...state, stats: { ...state.stats, runs: state.stats.runs + 1 } };
    case 'aiAsked': return finalize({ ...state, stats: { ...state.stats, aiAsks: state.stats.aiAsks + 1 } }, now);
    case 'setLang': return { ...state, uiLang: action.lang };
    case 'setTheme': return { ...state, theme: action.theme };
    case 'setSettings': return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'setCodeLang': return { ...state, codeLang: { ...state.codeLang, [action.trackId]: action.lang } };
    case 'draft': return { ...state, drafts: { ...state.drafts, [action.key]: action.code } };
    case 'setTranslation': return { ...state, translations: { ...state.translations, [action.key]: action.value } };
    case 'dismissToast': return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'reset': return { ...initialState(), uiLang: state.uiLang, theme: state.theme, settings: state.settings };
    case 'import': return { ...initialState(), ...action.state, toasts: [], settings: state.settings };

    case 'quizAnswer': {
      // XP is granted once per question, and only for a correct answer, so it cannot be farmed by resubmitting.
      const entry = state.lessons[action.lessonId] || {};
      const already = entry.quiz?.[action.index];
      if (!action.correct || already) return state;
      let s = { ...state, lessons: { ...state.lessons, [action.lessonId]: { ...entry, quiz: { ...entry.quiz, [action.index]: true } } } };
      s = { ...award(s, XP.quiz, now), stats: { ...s.stats, quizCorrect: s.stats.quizCorrect + 1 } };
      return finalize(toast(s, { kind: 'xp', n: XP.quiz }), now);
    }
    case 'taskPassed': {
      if (lessonDone(state, action.lessonId)) return state;
      const entry = state.lessons[action.lessonId] || {};
      let s = { ...state, lessons: { ...state.lessons, [action.lessonId]: { ...entry, task: true } } };
      s = award(s, action.xp, now);
      return finalize(toast(s, { kind: 'xp', n: action.xp }), now);
    }
    case 'capstonePassed': {
      const key = capstoneKey(action.trackId, action.levelId);
      if (state.capstones[key]) return state;
      let s = award({ ...state, capstones: { ...state.capstones, [key]: true } }, XP.capstone, now);
      s = toast(s, { kind: 'xp', n: XP.capstone });
      const track = TRACK_BY_ID[action.trackId];
      const next = track?.levels[track.levels.findIndex((l) => l.id === action.levelId) + 1];
      if (next) s = toast(s, { kind: 'unlock', level: next.id, track: action.trackId });
      return finalize(s, now);
    }
    default: return state;
  }
}

// ---------- persistence helpers (pure: take/return plain objects) ----------
/** Keep secrets out of the main blob; the API key lives in its own storage slot. */
export const serialize = (s) => JSON.stringify({ ...s, toasts: [], settings: { ...s.settings, apiKey: '' } });

export function hydrate(json) {
  const base = initialState();
  if (!json) return base;
  try {
    const saved = JSON.parse(json);
    if (!saved || typeof saved !== 'object') return base;
    return {
      ...base,
      ...saved,
      streak: { ...base.streak, ...saved.streak },
      stats: { ...base.stats, ...saved.stats },
      nav: { ...base.nav, ...saved.nav },
      settings: { ...base.settings, ...saved.settings, apiKey: '' },
      toasts: [],
      toastSeq: 0,
    };
  } catch {
    return base;
  }
}
