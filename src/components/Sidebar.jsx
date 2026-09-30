import React from 'react';
import { Award, Check, Home as HomeIcon, Lock, X } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { TRACKS, TRACK_BY_ID, capstoneKey } from '../data/index.js';
import { TrackIcon } from './icons.jsx';
import { levelUnlocked, lessonDone, trackProgress } from '../state/progress.js';

export const trackTitle = (track, t) => (track.id === 'dsa' ? t('track.dsa') : track.title);

function Node({ state, hue }) {
  const base = 'absolute -left-[22px] top-[9px] flex h-3 w-3 items-center justify-center rounded-full border-2';
  if (state === 'done') return <span className={base} style={{ background: hue, borderColor: hue }}><Check className="h-2 w-2 text-canvas" strokeWidth={4} /></span>;
  if (state === 'current') return <span className={base} style={{ borderColor: hue, background: 'rgb(var(--canvas))', boxShadow: `0 0 0 3px ${hue}33` }} />;
  return <span className={`${base} border-line bg-canvas`} />;
}

export default function Sidebar({ open, onClose }) {
  const { state, dispatch, t } = useApp();
  const { nav } = state;
  const track = TRACK_BY_ID[nav.track];
  const go = (patch) => { dispatch({ type: 'nav', patch: { view: 'learn', ...patch } }); onClose?.(); };

  const content = (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto p-4" aria-label={t('nav.courses')}>
      <button className={`btn justify-start ${nav.view === 'home' ? 'bg-raised text-ink' : 'btn-quiet'}`} onClick={() => { dispatch({ type: 'nav', patch: { view: 'home' } }); onClose?.(); }}>
        <HomeIcon className="h-4 w-4" aria-hidden="true" /> {t('nav.home')}
      </button>

      <div>
        <h2 className="mb-2 px-2 text-sm font-semibold text-muted">{t('nav.courses')}</h2>
        <ul className="space-y-0.5">
          {TRACKS.map((tr) => {
            const p = trackProgress(state, tr);
            const active = nav.view === 'learn' && nav.track === tr.id;
            return (
              <li key={tr.id}>
                <button
                  onClick={() => go({ track: tr.id, level: tr.levels[0].id, index: 0, tab: 'theory' })}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${active ? 'bg-raised font-semibold text-ink' : 'text-muted hover:bg-raised/60 hover:text-ink'}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: `${tr.hue}26`, color: tr.hue }}><TrackIcon name={tr.icon} className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1 truncate">{trackTitle(tr, t)}</span>
                  <span className="text-xs tabular-nums text-muted">{p.done}/{p.total}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {nav.view === 'learn' && track && (
        <div className="space-y-5 border-t border-line pt-4">
          {track.levels.map((level, li) => {
            const unlocked = levelUnlocked(state, track, li);
            const capDone = state.capstones[capstoneKey(track.id, level.id)];
            return (
              <section key={level.id} aria-label={t(`level.${level.id}`)}>
                <h3 className="mb-2 flex items-center justify-between px-2 text-sm font-semibold">
                  <span>{t(`level.${level.id}`)}</span>
                  {!unlocked && <Lock className="h-3.5 w-3.5 text-muted" aria-label={t('lesson.locked')} />}
                </h3>
                <ol className="relative ml-4 space-y-0.5 border-l border-line pl-4">
                  {level.lessons.map((lesson, idx) => {
                    const done = lessonDone(state, lesson.id);
                    const current = nav.level === level.id && nav.index === idx && nav.tab !== 'capstone';
                    return (
                      <li key={lesson.id} className="relative">
                        <Node state={done ? 'done' : current ? 'current' : 'todo'} hue={track.hue} />
                        <button
                          disabled={!unlocked}
                          onClick={() => go({ level: level.id, index: idx, tab: 'theory' })}
                          className={`w-full rounded-md px-2 py-1.5 text-left text-sm leading-snug transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${current ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
                        >
                          {lesson.title}
                        </button>
                      </li>
                    );
                  })}
                  <li className="relative">
                    <Node state={capDone ? 'done' : nav.level === level.id && nav.tab === 'capstone' ? 'current' : 'todo'} hue={track.hue} />
                    <button
                      disabled={!unlocked}
                      onClick={() => go({ level: level.id, index: 0, tab: 'capstone' })}
                      className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm leading-snug disabled:cursor-not-allowed disabled:opacity-50 ${nav.level === level.id && nav.tab === 'capstone' ? 'font-semibold text-gold' : 'text-muted hover:text-gold'}`}
                    >
                      <Award className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {t('lesson.capstone')}
                    </button>
                  </li>
                </ol>
              </section>
            );
          })}
        </div>
      )}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-line bg-panel lg:block">{content}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[19rem] max-w-[86vw] border-r border-line bg-panel shadow-2xl">
            <button className="btn btn-quiet absolute right-2 top-2 !px-2" onClick={onClose} aria-label={t('common.close')}><X className="h-5 w-5" /></button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
