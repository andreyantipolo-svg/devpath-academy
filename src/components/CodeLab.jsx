import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, Lightbulb, Loader2, Play, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { useUI } from './UIContext.js';
import Markdown from './Markdown.jsx';
import { LANGS, evaluate, warmUp } from '../engine/run.js';
import { diffLines, pick } from '../engine/grade.js';
<<<<<<< HEAD
import { remoteAvailable } from '../engine/remoteRunner.js';
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
import { capstoneKey } from '../data/index.js';
import { lessonDone } from '../state/progress.js';

const Editor = lazy(() => import('./Editor.jsx'));

const Placeholder = () => <div className="code-surface flex h-[260px] items-center justify-center rounded-lg border border-line text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" /></div>;

export default function CodeLab({ track, level, item, isCapstone, lang, onNextLesson }) {
  const { state, dispatch, t, bench } = useApp();
  const { ask, bump } = useUI();
  const info = LANGS[lang];
  const task = item.task;
  const starter = pick(task.starter, lang) ?? '';
  const draftKey = `${item.id}:${lang}`;

  const [code, setCode] = useState(() => state.drafts[draftKey] ?? starter);
  const [preview, setPreview] = useState(code);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | loading | running
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(0); // 0 hidden, 1 confirm, 2 shown

  const translatedTask = state.translations[`${item.id}:${state.uiLang}`]?.task;
  const taskText = translatedTask || task.text;
  const harness = pick(task.harness, lang);
  const expected = pick(task.expected, lang);
  const hintList = task.hints || [];

  // Autosave a draft and refresh the live preview shortly after typing stops.
  useEffect(() => {
    const id = setTimeout(() => {
      if (code !== state.drafts[draftKey]) dispatch({ type: 'draft', key: draftKey, code });
      setPreview(code);
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => { bench.current = { code, result, hintsShown: hints }; });
  useEffect(() => { bump(); }, [result, hints, bump]);
  useEffect(() => { warmUp(lang); }, [lang]);

  const run = useCallback(async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    setResult(null);
    dispatch({ type: 'ran' });
    const firstTime = isCapstone ? !state.capstones[capstoneKey(track.id, level.id)] : !lessonDone(state, item.id);
    const r = await evaluate({ lang, code, task, setup: track.setup, settings: state.settings, onStatus: setPhase });
    setPhase('idle');
    const earned = r.status === 'pass' && firstTime ? item.xp : 0;
    setResult({ ...r, earned });
    if (r.status === 'pass') {
      if (isCapstone) dispatch({ type: 'capstonePassed', trackId: track.id, levelId: level.id });
      else dispatch({ type: 'taskPassed', lessonId: item.id, xp: item.xp });
    }
  }, [phase, dispatch, isCapstone, state, track, level, item, lang, code, task]);

  // Keep the editor's Ctrl/Cmd+Enter binding stable while `run` changes on every keystroke.
  const runRef = useRef(run);
  runRef.current = run;
  const stableRun = useCallback(() => runRef.current(), []);

  const busy = phase !== 'idle';
  const passed = result?.status === 'pass';

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-line bg-panel p-5" aria-label={t('code.instructions')}>
        <h3 className="mb-2 font-display text-lg font-semibold">{t('code.instructions')}</h3>
        <Markdown text={taskText} className="prose-lesson text-[15px]" />
        {track.schema && (
          <details className="mt-3 text-sm" open>
            <summary className="cursor-pointer font-medium text-muted">{t('code.schema')}</summary>
            <pre className="code-surface mt-2 overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{track.schema}</pre>
          </details>
        )}
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-muted">{t('code.howTested')}</summary>
          <div className="mt-2 space-y-2 text-ink/80">
            {info.kind === 'web' && <ul className="list-disc space-y-1 pl-5">{task.dom.map((d) => <li key={d.desc}>{d.desc}</li>)}</ul>}
<<<<<<< HEAD
            {info.kind === 'guided' && <ul className="list-disc space-y-1 pl-5">{(pick(task.checks, lang) || []).map((c) => <li key={c.desc}>{c.desc}</li>)}</ul>}
            {harness && (info.kind !== 'guided' || remoteAvailable(lang, state.settings)) && (<><p>{t('code.testsAppended')}</p><pre className="code-surface overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{harness}</pre></>)}
=======
            {info.kind === 'guided' && <ul className="list-disc space-y-1 pl-5">{task.checks.map((c) => <li key={c.desc}>{c.desc}</li>)}</ul>}
            {harness && (<><p>{t('code.testsAppended')}</p><pre className="code-surface overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{harness}</pre></>)}
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            {info.kind !== 'web' && expected != null && (<><p>{t('code.expected')}</p><pre className="code-surface overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{expected}</pre></>)}
          </div>
        </details>
      </section>

      <section aria-label={t('code.editor')}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold">{t('code.editor')} <span className="ml-1 text-sm font-normal text-muted">{info.label}</span></h3>
          <button className="btn btn-quiet !px-2.5 !py-1.5" onClick={() => { setCode(starter); setResult(null); }}><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t('code.reset')}</button>
        </div>
        <Suspense fallback={<Placeholder />}>
          <Editor value={code} onChange={setCode} lang={lang} onRun={stableRun} label={t('code.editor')} minHeight="280px" />
        </Suspense>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" onClick={run} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {busy ? (phase === 'loading' && (lang === 'python' || lang === 'sql') ? t('code.loading', { lang: info.label }) : t('code.running')) : t('code.run')}
          </button>
          <span className="text-xs text-muted">{t('code.shortcut')}</span>
        </div>
      </section>

      {info.kind === 'web' && (
        <section aria-label={t('code.preview')}>
          <h3 className="mb-2 font-display text-lg font-semibold">{t('code.preview')}</h3>
          <iframe title={t('code.preview')} sandbox="allow-scripts" srcDoc={preview} className="h-56 w-full rounded-lg border border-line bg-white" />
        </section>
      )}

      <section aria-label={t('code.output')} aria-live="polite">
        <h3 className="mb-2 font-display text-lg font-semibold">{t('code.output')}</h3>
        <div className="code-surface min-h-[96px] rounded-xl border border-line p-4 font-mono text-[13px] leading-6">
          {!result && !busy && <span className="text-muted">{info.kind === 'web' ? t('code.outputEmptyWeb') : t('code.outputEmpty')}</span>}
          {busy && <span className="text-muted">{phase === 'loading' && (lang === 'python' || lang === 'sql') ? t('code.loading', { lang: info.label }) : t('code.running')}</span>}
          {result && !busy && (
            <>
              {result.status === 'error' && <pre className="whitespace-pre-wrap text-bad">{result.output}</pre>}
              {result.status !== 'error' && result.output && <pre className="whitespace-pre-wrap">{result.output}</pre>}
              {result.status !== 'error' && !result.output && !result.details && <span className="text-muted">{t('code.noOutput')}</span>}
              {result.details && (
                <ul className="space-y-1">
                  {result.details.map((d) => (
                    <li key={d.desc} className="flex items-start gap-2">
                      {d.ok ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-good" aria-hidden="true" /> : <XCircle className="mt-1 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />}
                      <span className={d.ok ? 'text-good' : 'text-bad'}>{d.desc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {result && !busy && (
          <div className={`mt-3 rounded-xl border p-4 text-sm ${passed ? 'border-good/50 bg-good/10' : 'border-bad/40 bg-bad/10'}`} role="status">
            <div className="flex items-center gap-2 font-semibold">
              {passed ? <CheckCircle2 className="h-5 w-5 text-good" aria-hidden="true" /> : <AlertTriangle className="h-5 w-5 text-bad" aria-hidden="true" />}
              {passed ? (result.earned ? t('code.passed', { xp: result.earned }) : t('code.passedAgain')) : result.status === 'error' ? t('code.error') : t('code.failed')}
              <span className="ml-auto text-xs font-normal text-muted">{result.ms} ms</span>
            </div>
            {result.via === 'pattern' && <p className="mt-2 text-muted">{t('code.viaPattern')}</p>}
            {result.via === 'remote' && <p className="mt-2 text-muted">{t('code.viaRemote')}</p>}
            {result.status === 'fail' && info.kind === 'browser' && expected != null && result.via !== 'pattern' && (
              <table className="mt-3 w-full font-mono text-xs">
                <thead><tr className="text-left text-muted"><th className="w-8 pb-1 font-normal">#</th><th className="pb-1 font-normal">{t('code.yours')}</th><th className="pb-1 font-normal">{t('code.expectedShort')}</th></tr></thead>
                <tbody>
                  {diffLines(result.compare ?? result.output, expected).map((r) => (
                    <tr key={r.line} className={r.same ? 'text-muted' : 'text-bad'}><td className="pr-2 align-top">{r.line}</td><td className="whitespace-pre-wrap pr-3 align-top">{r.actual || '∅'}</td><td className="whitespace-pre-wrap align-top">{r.expected || '∅'}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {passed ? (
                <>
                  <button className="btn btn-primary" onClick={onNextLesson}>{isCapstone ? t('code.backToCourse') : t('lesson.nextLesson')}</button>
                  <button className="btn btn-line" onClick={() => ask('review')}><Sparkles className="h-4 w-4" aria-hidden="true" /> {t('tutor.q.review')}</button>
                </>
              ) : (
                <button className="btn btn-line" onClick={() => ask('error')}><Sparkles className="h-4 w-4" aria-hidden="true" /> {t('tutor.q.error')}</button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-line bg-panel p-5" aria-label={t('code.hints')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Lightbulb className="h-5 w-5 text-gold" aria-hidden="true" /> {t('code.hints')}</h3>
          <div className="flex flex-wrap gap-2">
            {hints < hintList.length && <button className="btn btn-line !py-1.5" onClick={() => setHints((h) => h + 1)}>{t('code.showHint', { n: hints + 1 })}</button>}
            <button className="btn btn-line !py-1.5" onClick={() => ask('hint')}><Sparkles className="h-4 w-4" aria-hidden="true" /> {t('tutor.q.hint')}</button>
          </div>
        </div>
        {hints > 0 && <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6">{hintList.slice(0, hints).map((h, i) => <li key={i}>{h}</li>)}</ol>}
        {hints >= hintList.length && (
          <div className="mt-4 border-t border-line pt-4">
            {solution === 0 && <button className="btn btn-quiet !px-2" onClick={() => setSolution(1)}><Eye className="h-4 w-4" aria-hidden="true" /> {t('code.showSolution')}</button>}
            {solution === 1 && (
              <div className="flex flex-wrap items-center gap-3 text-sm"><span>{t('code.solutionConfirm')}</span><button className="btn btn-line !py-1.5" onClick={() => setSolution(2)}>{t('code.solutionYes')}</button><button className="btn btn-quiet !py-1.5" onClick={() => setSolution(0)}>{t('common.cancel')}</button></div>
            )}
            {solution === 2 && <pre className="code-surface overflow-x-auto rounded-lg p-3 font-mono text-[13px] leading-6">{pick(task.solution, lang)}</pre>}
          </div>
        )}
      </section>
    </div>
  );
}
