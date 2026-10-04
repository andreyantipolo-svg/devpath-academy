import javascript from './javascript.js';
import python from './python.js';
import sql from './sql.js';
import web from './web.js';
import java from './java.js';
import cpp from './cpp.js';
import go from './go.js';
import rust from './rust.js';
import dsa from './dsa.js';
import cyber from './cyber.js';

export const TRACKS = [javascript, python, sql, web, cpp, java, go, rust, dsa, cyber];
export const TRACK_BY_ID = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
export const LEVEL_IDS = ['beginner', 'intermediate', 'advanced'];

export const lessonCount = (track) => track.levels.reduce((n, l) => n + l.lessons.length, 0);
export const TOTAL_LESSONS = TRACKS.reduce((n, t) => n + lessonCount(t), 0);

/** Stable key for a level's capstone, used for progress and unlocking. */
export const capstoneKey = (trackId, levelId) => `${trackId}:${levelId}`;
