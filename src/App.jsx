import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppProvider, useApp } from './state/AppContext.jsx';
import { UIContext } from './components/UIContext.js';
import { resolveNav } from './state/context.js';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/Home.jsx';
import Lesson from './components/Lesson.jsx';
import Tutor from './components/Tutor.jsx';
import Settings from './components/Settings.jsx';
import Toasts from './components/Toasts.jsx';

function Shell() {
  const { state, t } = useApp();
  const [menu, setMenu] = useState(false);
  const [settings, setSettings] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [chats, setChats] = useState({});
  const [, setTick] = useState(0);
  const mainRef = useRef(null);
  const { nav } = state;

  const ui = useMemo(() => ({
    openSettings: () => setSettings(true),
    bump: () => setTick((n) => n + 1),
    ask: (kind) => { setTutorOpen(true); setPending({ id: Date.now(), kind }); },
  }), []);

  const learning = nav.view === 'learn';
  const ctx = learning ? resolveNav(nav) : null;
  const lang = ctx ? (ctx.track.langs.includes(state.codeLang[ctx.track.id]) ? state.codeLang[ctx.track.id] : ctx.track.langs[0]) : null;

  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [nav.view, nav.track, nav.level, nav.index, nav.tab]);
  useEffect(() => { document.title = learning && ctx ? `${ctx.item.title} · DevPath Academy` : `DevPath Academy · ${t('app.tagline')}`; });

  return (
    <UIContext.Provider value={ui}>
      <div className="flex h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[80] focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">{t('nav.skip')}</a>
        <Header onMenu={() => setMenu(true)} onSettings={() => setSettings(true)} onTutor={() => setTutorOpen(true)} showTutor={learning} />
        <div className="flex min-h-0 flex-1">
          <Sidebar open={menu} onClose={() => setMenu(false)} />
          <main id="main" ref={mainRef} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            {learning ? <Lesson /> : <Home onSettings={() => setSettings(true)} />}
          </main>
          {learning && ctx && (
            <>
              {tutorOpen && <div className="fixed inset-0 z-40 bg-black/50 xl:hidden" onClick={() => setTutorOpen(false)} />}
              <Tutor ctx={ctx} lang={lang} open={tutorOpen} onClose={() => setTutorOpen(false)} pending={pending} onPendingHandled={() => setPending(null)} chats={chats} setChats={setChats} />
            </>
          )}
        </div>
        {settings && <Settings onClose={() => setSettings(false)} />}
        <Toasts />
      </div>
    </UIContext.Provider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
