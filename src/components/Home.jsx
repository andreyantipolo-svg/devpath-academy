import React from 'react';
import { Award, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { TRACKS, TRACK_BY_ID, TOTAL_LESSONS } from '../data/index.js';
import { TrackIcon } from './icons.jsx';
import { trackTitle } from './Sidebar.jsx';
import { BADGES, computeBadges, dayKey, lessonDone, nextUp, rankFor, trackProgress } from '../state/progress.js';
import { LANGS } from '../engine/run.js';
import { aiConfigured } from '../ai/claude.js';

const modeOf = (track) => {
  const guided = track.langs.filter((l) => LANGS[l].kind === 'guided').length;
  return guided === 0 ? 'browser' : guided === track.langs.length ? 'guided' : 'mixed';
};

function Last14({ days }) {
  const cells = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5);
    return { key: dayKey(d), xp: days[dayKey(d)] || 0, label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }) };
  });
  const max = Math.max(50, ...cells.map((c) => c.xp));
  return (
    <div className="flex h-16 items-end gap-1" role="img" aria-label="XP per day, last 14 days">
      {cells.map((c) => (
        <div key={c.key} className="flex-1 rounded-sm bg-raised" style={{ height: `${Math.max(8, (c.xp / max) * 100)}%`, background: c.xp ? 'rgb(var(--accent))' : undefined }} title={`${c.label}: ${c.xp} XP`} />
      ))}
    </div>
  );
}

export default function Home({ onSettings }) {
  const { state, dispatch, t } = useApp();
  const up = nextUp(state);
  const upTrack = up && TRACK_BY_ID[up.track];
  const upLevel = up && upTrack.levels.find((l) => l.id === up.level);
  const upLesson = up && (up.tab === 'capstone' ? upLevel.capstone : upLevel.lessons[up.index]);
  const rank = rankFor(state.xp);
  const rankPct = rank.next ? Math.round(((state.xp - rank.floor) / (rank.next - rank.floor)) * 100) : 100;
  const earned = computeBadges(state);
  const doneAll = TRACKS.reduce((n, tr) => n + trackProgress(state, tr).done, 0);
  const fresh = doneAll === 0 && state.xp === 0;
  const open = (patch) => dispatch({ type: 'nav', patch: { view: 'learn', ...patch } });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-8 sm:py-12">
      <section aria-labelledby="hero" className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
        <div>
          <h1 id="hero" className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {fresh ? t('home.headlineNew') : t('home.headlineBack')}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">{t('home.sub', { n: TOTAL_LESSONS, c: TRACKS.length })}</p>
          {up ? (
            <button
              onClick={() => open(up)}
              className="group mt-7 flex w-full max-w-xl items-center gap-4 rounded-xl border border-line bg-panel p-4 text-left transition-colors hover:bg-raised"
              style={{ borderLeft: `4px solid ${upTrack.hue}` }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: `${upTrack.hue}26`, color: upTrack.hue }}><TrackIcon name={upTrack.icon} className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-muted">{fresh ? t('home.startHere') : t('home.continue')} · {trackTitle(upTrack, t)}</span>
                <span className="block truncate font-display text-lg font-semibold">{upLesson.title}</span>
              </span>
              <span className="btn btn-primary shrink-0">{fresh ? t('common.start') : t('common.continue')}</span>
            </button>
          ) : (
            <p className="mt-7 rounded-xl border border-line bg-panel p-4 font-medium">{t('home.allDone')}</p>
          )}
        </div>

        <div className="rounded-xl border border-line bg-panel p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl font-bold tabular-nums">{state.xp}<span className="ml-1 text-base font-medium text-muted">XP</span></p>
            <p className="text-sm font-semibold text-accent">{t(`rank.${rank.key}`)}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={rankPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="fill h-full rounded-full bg-accent" style={{ width: `${rankPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted">{rank.next ? t('home.toNextRank', { n: rank.next - state.xp }) : t('home.topRank')}</p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            <Flame className={`h-4 w-4 ${state.streak.count ? 'text-gold' : 'text-muted'}`} aria-hidden="true" />
            <span className="font-semibold">{t('home.streakDays', { n: state.streak.count })}</span>
          </div>
          <div className="mt-3"><Last14 days={state.days} /></div>
        </div>
      </section>

      {!aiConfigured(state.settings) && (
        <section className="flex flex-col gap-4 rounded-xl border border-accent/40 bg-accent/10 p-5 sm:flex-row sm:items-center">
          <Sparkles className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">{t('home.aiTitle')}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{t('home.aiBody')}</p>
          </div>
          <button className="btn btn-primary" onClick={onSettings}>{t('home.aiCta')}</button>
        </section>
      )}

      <section aria-labelledby="courses">
        <h2 id="courses" className="mb-4 font-display text-2xl font-semibold">{t('home.courses')}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {TRACKS.map((tr) => {
            const p = trackProgress(state, tr);
            const firstOpen = tr.levels[0].lessons.findIndex((l) => !lessonDone(state, l.id));
            return (
              <li key={tr.id}>
                <button
                  onClick={() => open({ track: tr.id, level: tr.levels[0].id, index: Math.max(0, firstOpen), tab: 'theory' })}
                  className="flex h-full w-full gap-4 rounded-xl border border-line bg-panel p-4 text-left transition-colors hover:bg-raised"
                  style={{ borderLeft: `4px solid ${tr.hue}` }}
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tr.hue}26`, color: tr.hue }}><TrackIcon name={tr.icon} className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-lg font-semibold">{trackTitle(tr, t)}</span>
                      <span className="text-xs tabular-nums text-muted">{p.done}/{p.total}</span>
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{tr.blurb}</span>
                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-raised"><span className="fill block h-full rounded-full" style={{ width: `${p.pct}%`, background: tr.hue }} /></span>
                    <span className="mt-2 block text-xs text-muted">
                      {t(`mode.${modeOf(tr)}`)}
                      {tr.langs.length > 1 && ` · ${tr.langs.map((l) => LANGS[l].label).join(' / ')}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="badges">
        <h2 id="badges" className="mb-4 font-display text-2xl font-semibold">{t('home.badges')}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((id) => {
            const got = earned.includes(id);
            return (
              <li key={id} className={`flex items-start gap-3 rounded-xl border border-line p-3 ${got ? 'bg-panel' : 'opacity-50'}`}>
                <Award className={`mt-0.5 h-5 w-5 shrink-0 ${got ? 'text-gold' : 'text-muted'}`} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{t(`badge.${id}.name`)}</p>
                  <p className="text-xs leading-5 text-muted">{t(`badge.${id}.desc`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
