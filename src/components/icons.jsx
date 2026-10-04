import React from 'react';
import { Braces, Terminal, Database, Layout, Cpu, Coffee, Zap, Hammer, Network, Shield, BookOpen } from 'lucide-react';

const MAP = { braces: Braces, terminal: Terminal, database: Database, layout: Layout, cpu: Cpu, coffee: Coffee, zap: Zap, hammer: Hammer, network: Network, shield: Shield };
export const TrackIcon = ({ name, ...props }) => {
  const Icon = MAP[name] || BookOpen;
  return <Icon aria-hidden="true" {...props} />;
};

/** The DevPath mark: a winding trail with a start and a destination. */
export const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="9" className="fill-raised" />
    <path d="M8 24c0-6 16-4 16-10" fill="none" stroke="rgb(var(--accent))" strokeWidth="3" strokeLinecap="round" />
    <circle cx="8" cy="24" r="3" fill="rgb(var(--gold))" />
    <circle cx="24" cy="11" r="3" fill="rgb(var(--accent))" />
  </svg>
);
