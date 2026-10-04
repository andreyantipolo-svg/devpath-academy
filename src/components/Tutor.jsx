import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, Sparkles, Square, Trash2, X } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { useUI } from './UIContext.js';
import Markdown from './Markdown.jsx';
import { aiConfigured, streamMessage } from '../ai/claude.js';
import { quickPrompt, tutorSystem } from '../ai/prompts.js';
import { LANGS } from '../engine/run.js';
import { trackTitle } from './Sidebar.jsx';

const QUICK = ['hint', 'error', 'review', 'simpler', 'quiz', 'trace'];

export default function Tutor({ ctx, lang, open, onClose, pending, onPendingHandled, chats, setChats }) {
  const { state, dispatch, t, bench } = useApp();
  const { openSettings } = useUI();
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);
  const endRef = useRef(null);

  const configured = aiConfigured(state.settings);
  const chatKey = ctx.item.id;
  const messages = useMemo(() => chats[chatKey] || [], [chats, chatKey]);
  const setMessages = (fn) => setChats((c) => ({ ...c, [chatKey]: fn(c[chatKey] || []) }));

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, streaming]);

  async function send(text, label) {
    if (!configured || streaming || !text.trim()) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const history = [...messages, { role: 'user', content: text, label }];
    setMessages(() => [...history, { role: 'assistant', content: '' }]);
    setStreaming(true);
    dispatch({ type: 'aiAsked' });

    const { track, level, item, isCapstone } = ctx;
    const b = bench.current;
    const system = tutorSystem({
      uiLang: state.uiLang,
      trackTitle: trackTitle(track, t),
      levelName: t(`level.${level.id}`),
      lesson: item,
      task: { text: item.task.text },
      progLang: LANGS[lang].label,
      code: b.code,
      result: b.result,
      hintsUsed: b.hintsShown,
      isCapstone,
      guided: LANGS[lang].kind === 'guided',
    });
    // Send only real turns: skip failed replies and start on a user message.
    const apiMessages = history.slice(-12).filter((m) => m.content && !m.error).map(({ role, content }) => ({ role, content }));
    while (apiMessages.length && apiMessages[0].role !== 'user') apiMessages.shift();

    try {
      await streamMessage({
        settings: state.settings, system, messages: apiMessages, signal: controller.signal, maxTokens: 900,
        onText: (full) => setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: full }]),
      });
    } catch (e) {
      if (e?.name !== 'AbortError') setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: m[m.length - 1]?.content || '', error: e.kind || 'unknown' }]);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  // A shortcut pressed elsewhere in the app (e.g. "Explain my error") arrives here.
  useEffect(() => {
    if (!pending) return;
    if (configured) send(quickPrompt(pending.kind), t(`tutor.q.${pending.kind}`));
    onPendingHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const r = bench.current.result;
  const disabledQuick = { error: !r || r.status === 'pass', review: !r || r.status !== 'pass' };

  return (
    <aside className={`${open ? 'fixed inset-y-0 right-0 z-50 flex w-[min(26rem,100vw)]' : 'hidden'} flex-col border-l border-line bg-panel shadow-2xl xl:static xl:flex xl:w-[24rem] xl:shrink-0 xl:shadow-none`} aria-label={t('tutor.title')}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Bot className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 className="flex-1 font-display text-base font-semibold">{t('tutor.title')}</h2>
        {messages.length > 0 && <button className="btn btn-quiet !px-2 !py-1.5" onClick={() => { abortRef.current?.abort(); setMessages(() => []); }} aria-label={t('tutor.clear')} title={t('tutor.clear')}><Trash2 className="h-4 w-4" /></button>}
        <button className="btn btn-quiet !px-2 !py-1.5 xl:hidden" onClick={onClose} aria-label={t('common.close')}><X className="h-5 w-5" /></button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {!configured && (
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-6">
            <p className="font-semibold">{t('tutor.setupTitle')}</p>
            <p className="mt-1 text-muted">{t('tutor.setupBody')}</p>
            <button className="btn btn-primary mt-3" onClick={openSettings}>{t('home.aiCta')}</button>
          </div>
        )}
        {configured && messages.length === 0 && <p className="text-sm leading-6 text-muted">{t('tutor.empty')}</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
            {m.role === 'user' ? (
              <p className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-accent-ink">{m.label || m.content}</p>
            ) : (
              <div className={`max-w-full text-sm ${streaming && i === messages.length - 1 ? 'caret' : ''}`}>
                {m.content ? <Markdown text={m.content} className="prose-tutor" /> : streaming && i === messages.length - 1 ? <span className="text-muted">{t('tutor.thinking')}</span> : null}
                {m.error && <p className="mt-2 rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-bad" role="alert">{t(`ai.err.${m.error}`)}</p>}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK.map((k) => (
            <button key={k} disabled={!configured || streaming || disabledQuick[k]} onClick={() => send(quickPrompt(k), t(`tutor.q.${k}`))} className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-40">{t(`tutor.q.${k}`)}</button>
          ))}
        </div>
        <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); const text = input; setInput(''); send(text); }}>
          <label className="flex-1"><span className="sr-only">{t('tutor.placeholder')}</span>
            <textarea
              rows={2} value={input} disabled={!configured}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); const text = input; setInput(''); send(text); } }}
              placeholder={t('tutor.placeholder')} className="field resize-none"
            />
          </label>
          {streaming
            ? <button type="button" className="btn btn-line !px-3" onClick={() => abortRef.current?.abort()} aria-label={t('tutor.stop')}><Square className="h-4 w-4" /></button>
            : <button type="submit" className="btn btn-primary !px-3" disabled={!configured || !input.trim()} aria-label={t('tutor.send')}><Send className="h-4 w-4" /></button>}
        </form>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted"><Sparkles className="h-3 w-3" aria-hidden="true" /> {t('tutor.disclaimer')}</p>
      </div>
    </aside>
  );
}
