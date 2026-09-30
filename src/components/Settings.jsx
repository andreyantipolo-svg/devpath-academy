import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, Loader2, Upload, X } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { MODELS, streamMessage } from '../ai/claude.js';
import { LANG_CODES } from '../i18n/index.js';
import { UI_LANGUAGES } from '../ai/prompts.js';
import { hydrate, serialize } from '../state/progress.js';

const Section = ({ title, children }) => (
  <section className="space-y-3 border-t border-line pt-5 first:border-0 first:pt-0">
    <h3 className="font-display text-lg font-semibold">{title}</h3>
    {children}
  </section>
);
const Label = ({ text, hint, children }) => (
  <label className="block space-y-1.5"><span className="text-sm font-medium">{text}</span>{children}{hint && <span className="block text-xs leading-5 text-muted">{hint}</span>}</label>
);

export default function Settings({ onClose }) {
  const { state, dispatch, t } = useApp();
  const s = state.settings;
  const set = (patch) => dispatch({ type: 'setSettings', patch });
  const [test, setTest] = useState({ phase: 'idle', kind: '' });
  const [confirmReset, setConfirmReset] = useState(false);
  const boxRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    boxRef.current?.querySelector('select, input, button')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { // keep focus inside the dialog
        const els = [...boxRef.current.querySelectorAll('button, input, select, a[href]')].filter((x) => !x.disabled);
        const first = els[0]; const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);

  async function testConnection() {
    setTest({ phase: 'busy', kind: '' });
    try {
      await streamMessage({ settings: s, system: 'Reply with the single word: ok', messages: [{ role: 'user', content: 'ping' }], maxTokens: 10 });
      setTest({ phase: 'ok', kind: '' });
    } catch (e) {
      setTest({ phase: 'fail', kind: e.kind || 'unknown' });
    }
  }

  function exportData() {
    const url = URL.createObjectURL(new Blob([serialize(state)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'devpath-progress.json'; a.click();
    URL.revokeObjectURL(url);
  }
  async function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch({ type: 'import', state: hydrate(await file.text()) });
    e.target.value = '';
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/65" onClick={onClose} />
      <div ref={boxRef} role="dialog" aria-modal="true" aria-label={t('settings.title')} className="relative max-h-[90vh] w-full max-w-lg space-y-6 overflow-y-auto rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t('settings.title')}</h2>
          <button className="btn btn-quiet !px-2" onClick={onClose} aria-label={t('common.close')}><X className="h-5 w-5" /></button>
        </div>

        <Section title={t('settings.language')}>
          <Label text={t('settings.languageLabel')} hint={t('settings.languageHint')}>
            <select className="field" value={state.uiLang} onChange={(e) => dispatch({ type: 'setLang', lang: e.target.value })}>
              {LANG_CODES.map((c) => <option key={c} value={c}>{UI_LANGUAGES[c].label}</option>)}
            </select>
          </Label>
        </Section>

        <Section title={t('settings.ai')}>
          <Label text={t('settings.apiKey')} hint={t('settings.apiKeyHelp')}>
            <input className="field font-mono" type="password" autoComplete="off" spellCheck="false" placeholder="sk-ant-…" value={s.apiKey} onChange={(e) => { set({ apiKey: e.target.value.trim() }); setTest({ phase: 'idle', kind: '' }); }} />
          </Label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[rgb(var(--accent))]" checked={s.remember} onChange={(e) => set({ remember: e.target.checked })} /> {t('settings.remember')}</label>
          <Label text={t('settings.model')}>
            <select className="field" value={s.model} onChange={(e) => set({ model: e.target.value })}>
              {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label} · {m.note}</option>)}
            </select>
          </Label>
          <Label text={t('settings.proxy')} hint={t('settings.proxyHelp')}>
            <input className="field font-mono" type="url" placeholder="https://your-proxy.example.com/v1/messages" value={s.proxyUrl} onChange={(e) => set({ proxyUrl: e.target.value.trim() })} />
          </Label>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-line" onClick={testConnection} disabled={(!s.apiKey && !s.proxyUrl) || test.phase === 'busy'}>
              {test.phase === 'busy' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {t('settings.test')}
            </button>
            {test.phase === 'ok' && <span className="flex items-center gap-1.5 text-sm text-good" role="status"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('settings.testOk')}</span>}
            {test.phase === 'fail' && <span className="text-sm text-bad" role="alert">{t(`ai.err.${test.kind}`)}</span>}
          </div>
        </Section>

        <Section title={t('settings.runner')}>
          <Label text={t('settings.runnerUrl')} hint={t('settings.runnerHelp')}>
            <input className="field font-mono" type="url" placeholder="http://localhost:2000/api/v2/piston" value={s.runnerUrl} onChange={(e) => set({ runnerUrl: e.target.value.trim() })} />
          </Label>
          <Label text={t('settings.runnerToken')}>
            <input className="field font-mono" type="password" autoComplete="off" value={s.runnerToken} onChange={(e) => set({ runnerToken: e.target.value.trim() })} />
          </Label>
        </Section>

        <Section title={t('settings.data')}>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-line" onClick={exportData}><Download className="h-4 w-4" aria-hidden="true" /> {t('settings.export')}</button>
            <button className="btn btn-line" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden="true" /> {t('settings.import')}</button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={importData} />
          </div>
          {!confirmReset ? (
            <button className="btn btn-quiet !px-2 text-bad" onClick={() => setConfirmReset(true)}>{t('settings.reset')}</button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 text-sm"><span>{t('settings.resetConfirm')}</span><button className="btn btn-line !py-1.5 text-bad" onClick={() => { dispatch({ type: 'reset' }); setConfirmReset(false); onClose(); }}>{t('settings.resetYes')}</button><button className="btn btn-quiet !py-1.5" onClick={() => setConfirmReset(false)}>{t('common.cancel')}</button></div>
          )}
        </Section>
      </div>
    </div>
  );
}
