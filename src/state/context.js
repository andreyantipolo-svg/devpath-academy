import { TRACK_BY_ID } from '../data/index.js';
import { XP } from './progress.js';

/** Resolve the learner's current position into concrete objects. Capstones look like lessons to the UI and tutor. */
export function resolveNav(nav) {
  const track = TRACK_BY_ID[nav.track];
  if (!track) return null;
  const found = track.levels.findIndex((l) => l.id === nav.level);
  const levelIndex = found < 0 ? 0 : found;
  const level = track.levels[levelIndex];
  const isCapstone = nav.tab === 'capstone';
  const lesson = level.lessons[Math.min(Math.max(nav.index, 0), level.lessons.length - 1)];
  const item = isCapstone ? { ...level.capstone, theory: level.capstone.summary, quiz: [], xp: XP.capstone } : lesson;
  return { track, level, levelIndex, lesson, item, isCapstone };
}
