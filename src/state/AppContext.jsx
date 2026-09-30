import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { reducer, hydrate, serialize, STORAGE_KEY, initialState } from './progress.js';
import { makeT, detectLang } from '../i18n/index.js';

const KEY_SLOT = 'devpath.key';
const Ctx = createContext(null);

const safe = {
  get: (store, k) => { try { return store.getItem(k); } catch { return null; } },
  set: (store, k, v) => { try { store.setItem(k, v); } catch { /* storage full or blocked */ } },
  del: (store, k) => { try { store.removeItem(k); } catch { /* ignore */ } },
};

function load() {
  const saved = safe.get(localStorage, STORAGE_KEY);
  let state = hydrate(saved);
  if (!saved) {
    // First visit: pick the browser language and migrate XP from the original app if present.
    state = { ...state, uiLang: detectLang(navigator.languages || [navigator.language]) };
    const legacy = parseInt(safe.get(localStorage, 'devpath_xp') || '0', 10);
    if (legacy > 0) state = { ...state, xp: legacy };
  }
  const key = safe.get(localStorage, KEY_SLOT) || safe.get(sessionStorage, KEY_SLOT) || '';
  return { ...state, settings: { ...state.settings, apiKey: key } };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const bench = useRef({ code: '', result: null, hintsShown: 0 }); // live editor context shared with the tutor

  // Persist progress (without the API key) after each change.
  useEffect(() => { safe.set(localStorage, STORAGE_KEY, serialize(state)); }, [state]);

  // The API key gets its own slot: localStorage if "remember", otherwise this tab's sessionStorage only.
  const { apiKey, remember } = state.settings;
  useEffect(() => {
    safe.del(localStorage, KEY_SLOT);
    safe.del(sessionStorage, KEY_SLOT);
    if (apiKey) safe.set(remember ? localStorage : sessionStorage, KEY_SLOT, apiKey);
  }, [apiKey, remember]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.lang = state.uiLang;
  }, [state.theme, state.uiLang]);

  const t = useMemo(() => makeT(state.uiLang), [state.uiLang]);
  const value = useMemo(() => ({ state, dispatch, t, bench }), [state, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
export { initialState };
