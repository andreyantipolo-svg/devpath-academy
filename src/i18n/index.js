import en from './en.js';
import fil from './fil.js';
import es from './es.js';
import pt from './pt.js';
import fr from './fr.js';
import id from './id.js';
import hi from './hi.js';
import zh from './zh.js';
import ja from './ja.js';

export const STRINGS = { en, fil, es, pt, fr, id, hi, zh, ja };
export const LANG_CODES = Object.keys(STRINGS);

/** Translator factory: falls back to English, then to the key itself. {vars} are interpolated. */
export const makeT = (lang) => (key, vars) => {
  const raw = STRINGS[lang]?.[key] ?? en[key] ?? key;
  return vars ? raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`)) : raw;
};

/** Guess a supported UI language from the browser's preferences. */
export function detectLang(navigatorLanguages = []) {
  for (const l of navigatorLanguages) {
    const base = String(l).toLowerCase().split('-')[0];
    const code = base === 'tl' ? 'fil' : base;
    if (STRINGS[code]) return code;
  }
  return 'en';
}
