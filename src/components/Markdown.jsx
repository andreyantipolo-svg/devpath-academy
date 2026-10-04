import React from 'react';
import { parseBlocks } from './parseBlocks.js';

// A deliberately small markdown renderer (paragraphs, lists, fenced code, headings, **bold**, `code`).
// It builds React elements, never HTML strings, so model output and lesson text are always escaped.

function inline(text, keyBase) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={`${keyBase}-${i}`}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={`${keyBase}-${i}`}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={`${keyBase}-${i}`}>{part}</React.Fragment>;
  });
}

export default function Markdown({ text, className = 'prose-lesson' }) {
  return (
    <div className={className}>
      {parseBlocks(text).map((b, i) => {
        if (b.type === 'code') return <pre key={i} className="code-surface my-3 overflow-x-auto rounded-lg p-3 font-mono text-[13px] leading-6"><code className="!bg-transparent !p-0">{b.text}</code></pre>;
        if (b.type === 'ul') return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it, `${i}-${j}`)}</li>)}</ul>;
        if (b.type === 'ol') return <ol key={i}>{b.items.map((it, j) => <li key={j}>{inline(it, `${i}-${j}`)}</li>)}</ol>;
        if (b.type === 'h') return <p key={i}><strong>{inline(b.text, i)}</strong></p>;
        return <p key={i}>{inline(b.text, i)}</p>;
      })}
    </div>
  );
}
