import React, { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';

const LOADERS = {
  javascript: () => import('@codemirror/lang-javascript').then((m) => m.javascript()),
  python: () => import('@codemirror/lang-python').then((m) => m.python()),
  sql: () => import('@codemirror/lang-sql').then((m) => m.sql()),
  html: () => import('@codemirror/lang-html').then((m) => m.html()),
  cpp: () => import('@codemirror/lang-cpp').then((m) => m.cpp()),
  java: () => import('@codemirror/lang-java').then((m) => m.java()),
  go: () => import('@codemirror/lang-go').then((m) => m.go()),
  rust: () => import('@codemirror/lang-rust').then((m) => m.rust()),
};

const theme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0d1024', foreground: '#dfe4ff', caret: '#8494ff',
    selection: '#2c3a8c88', selectionMatch: '#2c3a8c55', lineHighlight: '#ffffff08',
    gutterBackground: '#0d1024', gutterForeground: '#5b638f', gutterBorder: 'transparent',
  },
  styles: [
    { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: '#b9a4ff' },
    { tag: [t.string, t.special(t.string)], color: '#8ee6b8' },
    { tag: [t.number, t.bool, t.null], color: '#ffbd7a' },
    { tag: [t.comment], color: '#6d7699', fontStyle: 'italic' },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#86b8ff' },
    { tag: [t.typeName, t.className], color: '#f6d67a' },
    { tag: [t.tagName], color: '#ff93a8' },
    { tag: [t.attributeName], color: '#f6d67a' },
    { tag: [t.propertyName], color: '#a5d3ff' },
    { tag: [t.operator, t.punctuation], color: '#9ba4d8' },
  ],
});

export default function Editor({ value, onChange, lang, onRun, label, minHeight = '260px' }) {
  const [langExt, setLangExt] = useState(null);
  useEffect(() => {
    let live = true;
    setLangExt(null);
    LOADERS[lang]?.().then((ext) => live && setLangExt(ext));
    return () => { live = false; };
  }, [lang]);

  // Ctrl/Cmd+Enter runs the code from inside the editor.
  const extensions = useMemo(
    () => [Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { onRun?.(); return true; } }])), ...(langExt ? [langExt] : [])],
    [langExt, onRun],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line" style={{ minHeight }}>
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={theme}
        extensions={extensions}
        height={minHeight}
        aria-label={label}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true, autocompletion: false, bracketMatching: true, closeBrackets: true }}
      />
    </div>
  );
}
