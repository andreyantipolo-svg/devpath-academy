import React, { useState } from 'react';
import { ChevronRight, Languages, Lightbulb } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { useUI } from './UIContext.js';
import Markdown from './Markdown.jsx';
import { aiConfigured, completeJSON } from '../ai/claude.js';
import { TRANSLATE_SYSTEM, UI_LANGUAGES, translatePrompt } from '../ai/prompts.js';
import { pick } from '../engine/grade.js';

export default function Theory({ lesson, lang, onNext }) {
  const { state, dispatch, t } = useApp();
  const { ask, openSettings } = useUI();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [original, setOriginal] = useState(false);
  const key = `${lesson.id}:${state.uiLang}`;
  const translated = state.translations[key];
  const canTranslate = state.uiLang !== 'en';

  async function translate() {
    if (!aiConfigured(state.settings)) { openSettings(); return; }
    setBusy(true);
    setError('');
    try {
      const out = await completeJSON({
        settings: state.settings,
        system: TRANSLATE_SYSTEM,
        prompt: translatePrompt({ title: lesson.title, theory: lesson.theory, task: lesson.task.text }, state.uiLang),
        maxTokens: 3000,
      });
      if (typeof out.theory !== 'string') throw Object.assign(new Error('bad'), { kind: 'parse' });
      dispatch({ type: 'setTranslation', key, value: { title: String(out.title || lesson.title), theory: out.theory, task: String(out.task || lesson.task.text) } });
      setOriginal(false);
    } catch (e) {
      setError(e.kind || 'unknown');
    } finally {
      setBusy(false);
    }
  }

  const showing = translated && !original ? translated.theory : lesson.theory;
  const example = pick(lesson.example, lang);

  return (
    <div className="space-y-6">
      {canTranslate && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3 text-sm">
          <Languages className="h-4 w-4 text-accent" aria-hidden="true" />
          {translated ? (
            <>
              <span className="text-muted">{t('theory.translatedBy', { lang: UI_LANGUAGES[state.uiLang].name })}</span>
              <button className="btn btn-quiet !px-2 !py-1" onClick={() => setOriginal((o) => !o)}>{original ? t('theory.showTranslation') : t('theory.showOriginal')}</button>
            </>
          ) : (
            <button className="btn btn-line !py-1.5" onClick={translate} disabled={busy}>{busy ? t('theory.translating') : t('theory.translate', { lang: UI_LANGUAGES[state.uiLang].name })}</button>
          )}
          {error && <span className="text-bad" role="alert">{t(`ai.err.${error}`)}</span>}
        </div>
      )}

      <article className="rounded-xl border border-line bg-panel p-5 sm:p-7">
        <Markdown text={showing} className="prose-lesson max-w-[68ch] text-[15px] text-ink/90" />
      </article>

      <section>
        <h3 className="mb-2 font-display text-lg font-semibold">{t('theory.example')}</h3>
        <pre className="code-surface overflow-x-auto rounded-xl p-4 font-mono text-[13px] leading-6"><code>{example}</code></pre>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="btn btn-line" onClick={() => ask('simpler')}><Lightbulb className="h-4 w-4" aria-hidden="true" /> {t('tutor.q.simpler')}</button>
        <button className="btn btn-primary" onClick={onNext}>{t('lesson.toQuiz')} <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></button>
      </div>
    </div>
  );
}
