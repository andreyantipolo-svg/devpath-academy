import React from 'react';
import { Flame, Menu, Moon, Settings, Sun, MessageCircle, Languages } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { Logo } from './icons.jsx';
import { LANG_CODES } from '../i18n/index.js';
import { UI_LANGUAGES } from '../ai/prompts.js';
import { rankFor } from '../state/progress.js';

export default function Header({ onMenu, onSettings, onTutor, showTutor }) {
  const { state, dispatch, t } = useApp();
  const rank = rankFor(state.xp);
  return (
    <header className="z-40 flex items-center gap-1 border-b border-line bg-panel px-2 py-2.5 sm:gap-3 sm:px-5">
      <button className="btn btn-quiet !px-2 sm:!px-2.5 lg:hidden" onClick={onMenu} aria-label={t('nav.menu')}><Menu className="h-5 w-5" /></button>
      <button className="flex items-center gap-2.5 rounded-lg" onClick={() => dispatch({ type: 'nav', patch: { view: 'home' } })} aria-label={t('nav.home')}>
        <Logo />
        <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">DevPath</span>
      </button>

      <div className="flex-1" />

      <div className="hidden items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 text-sm sm:flex" title={t('rank.title')}>
        <span className="font-semibold">{state.xp} XP</span>
        <span className="text-muted">{t(`rank.${rank.key}`)}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1.5 text-sm" title={t('home.streak')}>
        <Flame className={`h-4 w-4 ${state.streak.count ? 'text-gold' : 'text-muted'}`} aria-hidden="true" />
        <span className="font-semibold">{state.streak.count}</span>
        <span className="sr-only">{t('home.streak')}</span>
      </div>

      <label className="relative flex items-center">
        <Languages className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted" aria-hidden="true" />
        <span className="sr-only">{t('settings.language')}</span>
        <select
          className="field !w-[6.75rem] cursor-pointer !py-1.5 !pl-7 !pr-1 sm:!w-auto sm:!pl-8 sm:!pr-2"
          value={state.uiLang}
          onChange={(e) => dispatch({ type: 'setLang', lang: e.target.value })}
        >
          {LANG_CODES.map((c) => <option key={c} value={c}>{UI_LANGUAGES[c].label}</option>)}
        </select>
      </label>

      <button className="btn btn-quiet !px-2 sm:!px-2.5" onClick={() => dispatch({ type: 'setTheme', theme: state.theme === 'dark' ? 'light' : 'dark' })} aria-label={t('nav.theme')}>
        {state.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      {showTutor && <button className="btn btn-quiet !px-2 sm:!px-2.5 xl:hidden" onClick={onTutor} aria-label={t('tutor.title')}><MessageCircle className="h-5 w-5" /></button>}
      <button className="btn btn-quiet !px-2 sm:!px-2.5" onClick={onSettings} aria-label={t('settings.title')}><Settings className="h-5 w-5" /></button>
    </header>
  );
}
