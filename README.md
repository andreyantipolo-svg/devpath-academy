# DevPath Academy

Learn to code in **10 courses and 52 lessons**, with an **AI tutor that answers in your language**.
Everything runs in the browser: no backend is needed.

## What's inside

| Course | Runs how | Notes |
| --- | --- | --- |
| JavaScript | Real, in a sandboxed Web Worker | 3 levels, async/await included |
| Python | Real, CPython via Pyodide (WebAssembly) | Loads on first run (needs internet) |
| SQL | Real SQLite (sql.js) | Preloaded sample database |
| HTML & CSS | Real, sandboxed iframe + DOM tests | Live preview, checks computed styles |
| C++ | Real, JSCPP interpreter in a worker | Fundamentals: I/O, control flow, functions, arrays, pointers |
<<<<<<< HEAD
| Data Structures & Algorithms | **JavaScript or Python** run for real; **Java** uses guided checks | Search, stacks, hash maps, sorting. Pick your language per lesson |
| Cybersecurity | Real (JavaScript) | Defensive only: ciphers, hashing, XSS, SQLi, rate limiting, log analysis |
| Java, Go, Rust (and Java inside DSA) | **Guided checks** (pattern based) | Real execution if you connect a runner (see below) |
=======
| Data Structures & Algorithms | Real, **JavaScript or Python** (your choice) | Search, stacks, hash maps, sorting |
| Cybersecurity | Real (JavaScript) | Defensive only: ciphers, hashing, XSS, SQLi, rate limiting, log analysis |
| Java, Go, Rust | **Guided checks** (pattern based) | Real execution if you connect a runner (see below) |
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2

Every level ends with a **capstone** that unlocks the next level. Progress, XP, streaks, badges and
code drafts are saved in the browser.

### AI tutor (Claude)
- Context-aware chat: it sees the lesson, the task, your code and your last result
- Shortcuts: hint, explain my error, review my code, explain simply, quiz me, trace my code
- Guides instead of spoiling: it hints first and only writes solutions when asked
- **Answers in the interface language** (English, Filipino, Español, Português, Français, Bahasa Indonesia, हिन्दी, 简体中文, 日本語)
- Translates lessons on demand and writes extra practice questions (practice gives no XP)

The tutor is optional. Everything else works without it.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Open **Settings** (gear icon) and paste a Claude API key to enable the tutor.

### API key safety
This is a static site, so the key is used from the browser and sent only to Anthropic. It is stored
in `localStorage` (or `sessionStorage` if you untick "remember"). Anyone with access to the device can
read it, so use a key with a spend limit. **For any shared or public deployment, use a proxy**:
run a tiny server that adds your key and forwards to `https://api.anthropic.com/v1/messages`, then put its
URL in Settings ("Proxy address"). The browser then never sees the key.

### Real execution for Java, Go, Rust (optional)
The public Piston service is no longer free, so no runner is bundled. To run these languages for real,
self-host [Piston](https://github.com/engineer-man/piston) and paste its `/api/v2/piston` address in
Settings. Rust also tries the official Rust Playground automatically. Without a runner, those courses use
pattern checks and label the result "not executed".

### Self-hosting Python
Pyodide loads from jsDelivr. To self-host, copy `node_modules/pyodide` (run `npm i pyodide`) into
`public/pyodide/` and set `PYODIDE_URL` in `src/engine/run.js` to `'./pyodide/'`.

## Quality checks

```bash
npm test          # unit + integration tests (grading, XP rules, i18n, AI streaming against a mock server)
npm run verify    # runs EVERY lesson's reference solution through the real engines
npm run lint
```

<<<<<<< HEAD
`npm run verify` proves each solution passes and each starter fails. It uses Node, `python3`, sql.js, JSCPP, a real JDK (Java solutions are compiled and run) and,
=======
`npm run verify` proves each solution passes and each starter fails. It uses Node, `python3`, sql.js, JSCPP and,
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
if available, headless Chromium for HTML/CSS (`CHROMIUM_PATH=/path/to/chrome npm run verify`; it uses
`playwright-core`). C++ answers are also cross-checked against real `g++` when installed.

## Adding a lesson

Lessons are plain data in `src/data/<course>.js`:

```js
{
  id: 'js-example', title: 'A new lesson', xp: 75,
  theory: 'Markdown-lite: **bold**, `code`, lists, fenced code.',
  example: 'console.log("hi");',
  quiz: [{ q: 'Question?', o: ['A', 'B', 'C', 'D'], a: 1, why: 'Why B is right.' }],
  task: {
    text: 'What the learner must do.',
    starter: '// code\n',
    harness: 'console.log(myFn(2));',   // optional hidden tests appended after the learner's code
    expected: '4',                       // compared after whitespace normalisation
    hints: ['Nudge', 'Bigger nudge', 'Nearly the answer'],
    solution: 'function myFn(n) { return n * 2; }',
  },
}
```

HTML tasks use `dom: [{ desc, test }]`, Java/Go/Rust use `checks: [{ desc, re }]`, and any value can be
per-language (`{ javascript: '...', python: '...' }`) for multi-language courses. Run `npm run verify`.

To add a UI language: copy `src/i18n/en.js`, translate the values, register it in `src/i18n/index.js` and
`src/ai/prompts.js`. `npm test` fails if any key or `{placeholder}` is missing.

## Structure

```
src/
  data/       curriculum (one file per course)
  engine/     sandboxed runners (JS, Python, SQL, C++, web) and grading
  ai/         Claude client (streaming), prompts, parsers
  state/      pure progress logic (XP, streaks, unlocking, badges) + React context
  i18n/       9 UI languages
  components/ screens
tests/  scripts/verify-curriculum.mjs
```
