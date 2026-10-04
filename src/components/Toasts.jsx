import React, { useEffect } from 'react';
import { Award, Flame, Lock, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';

function Toast({ toast }) {
  const { dispatch, t } = useApp();
  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: 'dismissToast', id: toast.id }), toast.kind === 'xp' ? 2600 : 5000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  let icon = <Flame className="h-4 w-4 text-gold" aria-hidden="true" />;
  let text = t('toast.xp', { n: toast.n });
  if (toast.kind === 'badge') { icon = <Award className="h-4 w-4 text-gold" aria-hidden="true" />; text = t('toast.badge', { name: t(`badge.${toast.id}.name`) }); }
  if (toast.kind === 'unlock') { icon = <Lock className="h-4 w-4 text-good" aria-hidden="true" />; text = t('toast.unlock', { level: t(`level.${toast.level}`) }); }
  if (toast.kind === 'info') { icon = <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />; text = toast.text; }
  return (
    <div className="toast pointer-events-auto flex items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2.5 text-sm font-medium shadow-lg shadow-black/30">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default function Toasts() {
  const { state } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2" role="status" aria-live="polite">
      {state.toasts.map((tt) => <Toast key={tt.id} toast={tt} />)}
    </div>
  );
}
