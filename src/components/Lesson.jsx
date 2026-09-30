import React from 'react';
import { Award, ChevronLeft, Lock } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { resolveNav } from '../state/context.js';
import { levelUnlocked, lessonDone } from '../state/progress.js';
import { capstoneKey } from '../data/index.js';
import { LANGS } from '../engine/run.js';
import { TrackIcon } from './icons.jsx';
import { trackTitle } from './Sidebar.jsx';
import Theory from './Theory.jsx';
import Quiz from './Quiz.jsx';
import CodeLab from './CodeLab.jsx';

export default function Lesson() {
  const { state, dispatch, t } = useApp();
  const { nav } = state;
  const ctx = resolveNav(nav);
  if (!ctx) return null;
  const { track, level, levelIndex, item, isCapstone } = ctx;
  const lang = track.langs.includes(state.codeLang[track.id]) ? state.codeLang[track.id] : track.langs[0];
  const go = (patch) => dispatch({ type: 'nav', patch });

  if (!levelUnlocked(state, track, levelIndex)) {
    const prev = track.levels[levelIndex - 1];
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Lock className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-semibold">{t('lesson.locked')}</h1>
        <p className="mt-2 text-muted">{t('lesson.lockedBody', { level: t(`level.${prev.id}`) })}</p>
        <button className="btn btn-primary mt-6" onClick={() => go({ level: prev.id, index: 0, tab: 'capstone' })}>{t('lesson.goCapstone')}</button>
      </div>
    );
  }

  // "Next lesson": the following lesson, or this level's capstone after the last one, or back to the course.
  function nextLesson() {
    if (isCapstone) {
      const next = track.levels[levelIndex + 1];
      go(next ? { level: next.id, index: 0, tab: 'theory' } : { view: 'home' });
    } else if (nav.index + 1 < level.lessons.length) go({ index: nav.index + 1, tab: 'theory' });
    else go({ tab: 'capstone', index: 0 });
  }

  const tabs = [['theory', 'lesson.theory'], ['quiz', 'lesson.quiz'], ['code', 'lesson.code']];
  const tab = isCapstone ? 'code' : ['theory', 'quiz', 'code'].includes(nav.tab) ? nav.tab : 'theory';
  const title = state.translations[`${item.id}:${state.uiLang}`]?.title || item.title;
  const done = isCapstone ? state.capstones[capstoneKey(track.id, level.id)] : lessonDone(state, item.id);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
      <header className="mb-6">
        <p className="flex items-center gap-2 text-sm text-muted">
          <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: `${track.hue}26`, color: track.hue }}><TrackIcon name={track.icon} className="h-3.5 w-3.5" /></span>
          {trackTitle(track, t)} · {t(`level.${level.id}`)}
          {!isCapstone && <span>· {nav.index + 1}/{level.lessons.length}</span>}
        </p>
        <h1 className="mt-2 flex flex-wrap items-center gap-3 font-display text-3xl font-bold leading-tight tracking-tight">
          {isCapstone && <Award className="h-7 w-7 text-gold" aria-hidden="true" />}
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{done ? t('lesson.completed') : t('lesson.reward', { xp: item.xp })}</p>

        {track.langs.length > 1 && (
          <div className="mt-4 flex items-center gap-3" role="group" aria-label={t('lesson.codeIn')}>
            <span className="text-sm text-muted">{t('lesson.codeIn')}</span>
            <div className="flex rounded-lg border border-line p-0.5">
              {track.langs.map((l) => (
                <button key={l} aria-pressed={l === lang} onClick={() => dispatch({ type: 'setCodeLang', trackId: track.id, lang: l })} className={`rounded-md px-3 py-1 text-sm font-medium ${l === lang ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}>{LANGS[l].label}</button>
              ))}
            </div>
          </div>
        )}

        {!isCapstone && (
          <div className="mt-5 flex gap-1 border-b border-line" role="tablist">
            {tabs.map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => go({ tab: id })} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>{t(label)}</button>
            ))}
          </div>
        )}
      </header>

      {tab === 'theory' && <Theory key={`${item.id}:${state.uiLang}`} lesson={item} lang={lang} onNext={() => go({ tab: 'quiz' })} />}
      {tab === 'quiz' && <Quiz key={item.id} lesson={item} lang={lang} onNext={() => go({ tab: 'code' })} />}
      {tab === 'code' && <CodeLab key={`${item.id}:${lang}`} track={track} level={level} item={item} isCapstone={isCapstone} lang={lang} onNextLesson={nextLesson} />}

      {!isCapstone && nav.index > 0 && tab === 'theory' && (
        <button className="btn btn-quiet mt-8" onClick={() => go({ index: nav.index - 1, tab: 'theory' })}><ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {t('lesson.prev')}</button>
      )}
    </div>
  );
}
