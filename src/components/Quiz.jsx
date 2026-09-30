import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Sparkles, XCircle } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { useUI } from './UIContext.js';
import { aiConfigured, completeJSON } from '../ai/claude.js';
import { PRACTICE_SYSTEM, practicePrompt } from '../ai/prompts.js';
import { validateQuestions } from '../ai/parse.js';
import { LANGS } from '../engine/run.js';

export default function Quiz({ lesson, lang, onNext }) {
  const { state, dispatch, t } = useApp();
  const { openSettings } = useUI();
  const [practice, setPractice] = useState([]);
  const [mode, setMode] = useState('core'); // core | practice
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const questions = mode === 'core' ? lesson.quiz : practice;
  const q = questions[qi];
  const correct = checked && sel === q?.a;

  function check() {
    if (sel === null) return;
    setChecked(true);
    if (sel === q.a) setScore((s) => s + 1);
    // Only the lesson's own questions award XP, and only once each (enforced in the reducer).
    if (mode === 'core') dispatch({ type: 'quizAnswer', lessonId: lesson.id, index: qi, correct: sel === q.a });
  }
  function next() {
    if (qi + 1 >= questions.length) { setFinished(true); return; }
    setQi(qi + 1); setSel(null); setChecked(false);
  }
  function restart(nextMode, list) {
    setMode(nextMode); setQi(0); setSel(null); setChecked(false); setScore(0); setFinished(false);
    if (list) setPractice(list);
  }

  async function generate() {
    if (!aiConfigured(state.settings)) { openSettings(); return; }
    setBusy(true); setError('');
    try {
      const out = await completeJSON({ settings: state.settings, system: PRACTICE_SYSTEM, prompt: practicePrompt({ lesson, progLang: LANGS[lang].label, count: 3, uiLang: state.uiLang }), maxTokens: 2000 });
      const list = validateQuestions(out);
      if (!list.length) throw Object.assign(new Error('empty'), { kind: 'parse' });
      restart('practice', list);
    } catch (e) {
      setError(e.kind || 'unknown');
    } finally {
      setBusy(false);
    }
  }

  if (finished) {
    return (
      <div className="space-y-6 rounded-xl border border-line bg-panel p-6 sm:p-8">
        <h3 className="font-display text-2xl font-semibold">{t('quiz.done', { n: score, total: questions.length })}</h3>
        {mode === 'practice' && <p className="text-sm text-muted">{t('quiz.practiceNoXp')}</p>}
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={onNext}>{t('lesson.toCode')} <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></button>
          <button className="btn btn-line" onClick={generate} disabled={busy}><Sparkles className="h-4 w-4" aria-hidden="true" /> {busy ? t('quiz.generating') : t('quiz.morePractice')}</button>
          {mode === 'practice' && <button className="btn btn-quiet" onClick={() => restart('core')}>{t('quiz.backToLesson')}</button>}
          {mode === 'core' && <button className="btn btn-quiet" onClick={() => restart('core')}>{t('quiz.retry')}</button>}
        </div>
        {error && <p className="text-sm text-bad" role="alert">{t(`ai.err.${error}`)}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-xl border border-line bg-panel p-5 sm:p-7">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{mode === 'practice' ? t('quiz.aiPractice') : t('quiz.title')} · {t('quiz.question', { n: qi + 1, total: questions.length })}</span>
        {mode === 'core' && state.lessons[lesson.id]?.quiz?.[qi] && <span className="flex items-center gap-1 text-good"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('quiz.earned')}</span>}
      </div>
      <h3 className="font-display text-xl font-semibold leading-snug">{q.q}</h3>
      <div role="radiogroup" aria-label={q.q} className="space-y-2.5">
        {q.o.map((opt, i) => {
          const isSel = sel === i;
          const state_ = checked ? (i === q.a ? 'right' : isSel ? 'wrong' : 'idle') : isSel ? 'sel' : 'idle';
          const cls = { right: 'border-good bg-good/10', wrong: 'border-bad bg-bad/10', sel: 'border-accent bg-accent/10', idle: 'border-line hover:bg-raised' }[state_];
          return (
            <button key={i} role="radio" aria-checked={isSel} disabled={checked} onClick={() => setSel(i)} className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] transition-colors ${cls}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSel ? 'border-accent' : 'border-line'}`}>{isSel && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {checked && (
        <div className={`flex gap-3 rounded-lg border p-4 text-sm leading-6 ${correct ? 'border-good/50 bg-good/10' : 'border-bad/50 bg-bad/10'}`} role="status">
          {correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-good" aria-hidden="true" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-bad" aria-hidden="true" />}
          <div><p className="font-semibold">{correct ? t('quiz.correct') : t('quiz.wrong')}</p><p className="text-ink/80">{q.why}</p></div>
        </div>
      )}
      <div className="flex justify-end gap-3">
        {!checked ? <button className="btn btn-primary" disabled={sel === null} onClick={check}>{t('quiz.check')}</button>
          : <button className="btn btn-primary" onClick={next}>{qi + 1 >= questions.length ? t('quiz.finish') : t('quiz.next')}</button>}
      </div>
    </div>
  );
}
