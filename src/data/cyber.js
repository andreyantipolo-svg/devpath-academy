// Defensive security only: learners build protections (ciphers, validation, hashing, rate limits, log analysis).
export default {
  id: 'cyber',
  title: 'Cybersecurity',
  hue: '#84CC16',
  icon: 'shield',
  langs: ['javascript'],
  blurb: 'Think like a defender: ciphers, password safety, input validation, rate limiting and log analysis.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'sec-caesar',
          title: 'Ciphers: the Caesar shift',
          xp: 50,
          theory: `**Symmetric encryption** uses one shared secret key to scramble and unscramble data.

The oldest example is the **Caesar cipher**: shift every letter forward by a fixed number. With a shift of 3, \`A\` becomes \`D\`, and \`Z\` wraps around to \`C\`.

It is easy to learn and easy to break. There are only 25 possible keys, so an attacker simply tries them all (**brute force**). Modern systems use ciphers such as AES with keys far too large to guess.`,
          example: `const shift = (ch, n) => String.fromCharCode(((ch.charCodeAt(0) - 65 + n) % 26) + 65);
console.log(shift("A", 3));`,
          quiz: [
            { q: 'Which type of cryptography uses the same key to encrypt and decrypt?', o: ['Asymmetric', 'Symmetric', 'Hashing', 'Public key infrastructure'], a: 1, why: 'Symmetric algorithms share one secret key between both sides.' },
            { q: 'Why is a Caesar cipher insecure?', o: ['It has only 25 keys, so it is trivially brute-forced', 'It is too slow', 'It needs a public key', 'It cannot encode letters'], a: 0, why: 'A tiny key space means every key can be tried in an instant.' },
          ],
          task: {
            text: 'Write `caesar(text, shift)` that shifts each letter A–Z / a–z forward by `shift`, wrapping around the alphabet and keeping case. Leave other characters unchanged.',
            starter: 'function caesar(text, shift) {\n  // shift letters, keep everything else\n}\n',
            harness: 'console.log(caesar("ABC", 1));\nconsole.log(caesar("xyz", 3));\nconsole.log(caesar("Hello, World!", 5));',
            expected: 'BCD\nabc\nMjqqt, Btwqi!',
            hints: ['Handle uppercase and lowercase separately using their starting char codes (65 and 97).', 'newCode = ((code - base + shift) % 26) + base', 'Anything that is not a letter should be returned as it is.'],
            solution: 'function caesar(text, shift) {\n  return text.replace(/[a-z]/gi, (ch) => {\n    const base = ch <= "Z" ? 65 : 97;\n    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);\n  });\n}',
          },
        },
        {
          id: 'sec-passwords',
          title: 'Passwords & hashing',
          xp: 75,
          theory: `Length beats cleverness: a long passphrase is far harder to crack than a short "complex" password.

Websites should **never store passwords**. They store a **hash**: a one-way fingerprint of the password. Even if the database leaks, attackers get hashes instead of passwords. A random **salt** added per user makes identical passwords hash differently and defeats precomputed tables.

Real systems use slow, purpose-built functions such as **bcrypt**, **scrypt** or **Argon2**, never a fast hash like plain SHA-256 alone.`,
          example: `const rules = [/[a-z]/, /[A-Z]/, /\\d/];
console.log(rules.filter((r) => r.test("Abc1")).length);`,
          quiz: [
            { q: 'Why store password hashes instead of passwords?', o: ['A breach does not directly reveal the passwords', 'Hashes are shorter to type', 'It makes logins faster', 'Hashes can easily be reversed'], a: 0, why: 'A good hash is one-way, so leaked hashes cannot simply be read back.' },
            { q: 'What does a salt do?', o: ['Makes identical passwords produce different hashes', 'Encrypts the hash with a key', 'Speeds up hashing', 'Removes special characters'], a: 0, why: 'A unique salt per user stops attackers reusing one precomputed table.' },
          ],
          task: {
            text: 'Write `passwordScore(pw)` returning how many of these five rules pass: length of at least 12, has a lowercase letter, has an uppercase letter, has a digit, has a symbol (any character that is not a letter or digit).',
            starter: 'function passwordScore(pw) {\n  // count how many of the 5 rules pass\n}\n',
            harness: 'console.log(passwordScore("abc"));\nconsole.log(passwordScore("Abcdefghijk1!"));\nconsole.log(passwordScore("PASSWORD123"));\nconsole.log(passwordScore("Correct-Horse-Battery"));',
            expected: '1\n5\n2\n4',
            hints: ['Put the five tests in an array of booleans.', 'Use regular expressions such as /[a-z]/.test(pw).', 'A symbol matches /[^a-zA-Z0-9]/. Count the true values.'],
            solution: 'function passwordScore(pw) {\n  const rules = [pw.length >= 12, /[a-z]/.test(pw), /[A-Z]/.test(pw), /\\d/.test(pw), /[^a-zA-Z0-9]/.test(pw)];\n  return rules.filter(Boolean).length;\n}',
          },
        },
        {
          id: 'sec-xss',
          title: 'Input validation & XSS',
          xp: 75,
          theory: `**Never trust user input.** Anything a visitor types, or a URL contains, can be hostile.

**Cross-site scripting (XSS)** happens when a site puts untrusted text into a page without escaping it, so the browser runs an attacker's script in other visitors' sessions.

The defence is to **escape output** for the place it is used. For HTML that means turning \`& < > " '\` into entities. Escape \`&\` first, otherwise you would double-escape the entities you just created. Frameworks like React do this for you by default; know why.`,
          example: 'console.log("5 < 6".replace(/</g, "&lt;"));',
          quiz: [
            { q: 'What is XSS?', o: ['Injecting scripts into pages other users view', 'Cracking passwords offline', 'Overloading a server with traffic', 'Stealing a router'], a: 0, why: 'XSS abuses unescaped output to run attacker-controlled script.' },
            { q: 'What is the best defence when printing user text into HTML?', o: ['Escape special characters', 'Trust the user', 'Hide the form', 'Use longer URLs'], a: 0, why: 'Escaping turns markup characters into harmless text.' },
          ],
          task: {
            text: 'Write `escapeHtml(str)` that replaces `&`, `<`, `>`, `"` and `\'` with `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&#39;`.',
            starter: 'function escapeHtml(str) {\n  // replace & first, then the rest\n}\n',
            harness: 'console.log(escapeHtml("<script>alert(\'x\')</script>"));\nconsole.log(escapeHtml(\'Tom & "Jerry"\'));',
            expected: '&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;\nTom &amp; &quot;Jerry&quot;',
            hints: ['A chain of .replace calls works.', 'Use a regex with the g flag so every match is replaced: /&/g', 'Do the & replacement first.'],
            solution: 'function escapeHtml(str) {\n  return str\n    .replace(/&/g, "&amp;")\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;")\n    .replace(/"/g, "&quot;")\n    .replace(/\'/g, "&#39;");\n}',
          },
        },
      ],
      capstone: {
        id: 'sec-cap-1',
        title: 'Capstone: Safe login check',
        summary: 'Compare hashes instead of plain passwords, and never reveal which part of a login failed.',
        task: {
          text: 'A user database stores password **hashes** using the toy `hash()` provided (real apps must use bcrypt or Argon2). Write `login(name, password)` returning `"Access Granted"` only when the user exists and the hash matches. In every other case return `"Access Denied"`, with the same message for an unknown user and a wrong password.',
          starter: 'function hash(text) {\n  // toy hash for practice only\n  let h = 5381;\n  for (const ch of text) h = (h * 33 + ch.charCodeAt(0)) % 1000003;\n  return h;\n}\n\nconst users = { ana: hash("s3cret!") };\n\nfunction login(name, password) {\n  // compare hash(password) with the stored hash\n}\n',
          harness: 'console.log(login("ana", "s3cret!"));\nconsole.log(login("ana", "wrong"));\nconsole.log(login("bob", "s3cret!"));',
          expected: 'Access Granted\nAccess Denied\nAccess Denied',
          hints: ['Look the user up in the users object; it may be undefined.', 'Compare hash(password) with the stored value, not the raw password.', 'Both failure paths must return the identical "Access Denied" message.'],
          solution: 'function hash(text) {\n  let h = 5381;\n  for (const ch of text) h = (h * 33 + ch.charCodeAt(0)) % 1000003;\n  return h;\n}\n\nconst users = { ana: hash("s3cret!") };\n\nfunction login(name, password) {\n  const stored = users[name];\n  if (stored !== undefined && stored === hash(password)) return "Access Granted";\n  return "Access Denied";\n}',
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'sec-sqli',
          title: 'SQL injection & safe queries',
          xp: 100,
          theory: `**SQL injection** happens when user input is glued into a query string. Input like \`x' OR '1'='1\` then changes the meaning of the query and can expose or destroy data.

The fix is **parameterised queries** (prepared statements). The query text contains placeholders, and the database receives the values separately, so data can never be mistaken for SQL code.

\`{ text: "SELECT * FROM users WHERE name = ?", values: [name] }\`

Never build SQL with string concatenation or template strings using user input.`,
          example: `const q = { text: "SELECT * FROM users WHERE id = ?", values: [7] };
console.log(JSON.stringify(q));`,
          quiz: [
            { q: 'What is the correct defence against SQL injection?', o: ['Parameterised queries', 'Hiding the database name', 'Longer passwords', 'Escaping only the letter x'], a: 0, why: 'Placeholders keep input as data and never as executable SQL.' },
            { q: 'Which of these is unsafe?', o: ['"WHERE name = \'" + input + "\'"', '"WHERE name = ?" with values [input]', 'An ORM query builder using bound parameters', 'A prepared statement'], a: 0, why: 'Concatenating input into SQL text lets attackers change the query.' },
          ],
          task: {
            text: 'Write `buildQuery(name)` that returns `{ text, values }`. `text` must be `"SELECT * FROM users WHERE name = ?"` and `values` must be an array holding the name. Never put the name inside the text.',
            starter: 'function buildQuery(name) {\n  // return { text, values }\n}\n',
            harness: 'console.log(JSON.stringify(buildQuery("Ana")));\nconsole.log(JSON.stringify(buildQuery("x\' OR \'1\'=\'1")));',
            expected: '{"text":"SELECT * FROM users WHERE name = ?","values":["Ana"]}\n{"text":"SELECT * FROM users WHERE name = ?","values":["x\' OR \'1\'=\'1"]}',
            hints: ['The text is a fixed string with a ? placeholder.', 'The user input goes in the values array only.', 'return { text: "SELECT * FROM users WHERE name = ?", values: [name] };'],
            solution: 'function buildQuery(name) {\n  return { text: "SELECT * FROM users WHERE name = ?", values: [name] };\n}',
          },
        },
        {
          id: 'sec-ratelimit',
          title: 'Rate limiting',
          xp: 100,
          theory: `Attackers guess passwords by trying thousands of times. **Rate limiting** puts a cap on attempts, so brute force becomes impractical.

Common patterns: allow N attempts per window, lock the account temporarily after repeated failures, add growing delays (**exponential backoff**), and require extra proof (such as a second factor) after suspicious activity.

A limiter is a great use of a **closure**: the counter stays private inside the function that guards the login.`,
          example: `function once() {
  let used = false;
  return () => (used ? false : (used = true));
}`,
          quiz: [
            { q: 'What does rate limiting protect against most directly?', o: ['Brute-force guessing', 'Typos in passwords', 'Slow websites', 'Broken HTML'], a: 0, why: 'Capping attempts makes trying thousands of guesses infeasible.' },
            { q: 'What is exponential backoff?', o: ['Delays that grow after each failure', 'Encrypting twice', 'A faster hash', 'Deleting old accounts'], a: 0, why: 'Each failure makes the next wait longer, e.g. 1s, 2s, 4s…' },
          ],
          task: {
            text: 'Write `createLimiter(max)` returning a function `attempt()`. It returns `true` for the first `max` calls and `false` for every call after that.',
            starter: 'function createLimiter(max) {\n  // keep a private counter and return attempt()\n}\n',
            harness: 'const tryLogin = createLimiter(3);\nconsole.log(tryLogin(), tryLogin(), tryLogin(), tryLogin());\nconst other = createLimiter(1);\nconsole.log(other(), other());',
            expected: 'true true true false\ntrue false',
            hints: ['Declare let used = 0; outside the returned function.', 'Increase used on each call.', 'return used <= max;'],
            solution: 'function createLimiter(max) {\n  let used = 0;\n  return () => {\n    used += 1;\n    return used <= max;\n  };\n}',
          },
        },
      ],
      capstone: {
        id: 'sec-cap-2',
        title: 'Capstone: Log analyser',
        summary: 'Spot brute-force attempts in a login log, the daily work of a security analyst.',
        task: {
          text: 'Write `suspiciousIps(lines)`. Each log line looks like `10:00:01 FAILED login from 10.0.0.5`. Return a sorted array of IP addresses that have **3 or more** `FAILED` lines.',
          starter: 'function suspiciousIps(lines) {\n  // count FAILED lines per IP\n}\n',
          harness: 'const logs = [\n  "10:00:01 FAILED login from 10.0.0.5",\n  "10:00:03 FAILED login from 10.0.0.5",\n  "10:00:04 OK login from 10.0.0.9",\n  "10:00:07 FAILED login from 10.0.0.7",\n  "10:00:09 FAILED login from 10.0.0.5",\n  "10:00:11 FAILED login from 10.0.0.7",\n];\nconsole.log(JSON.stringify(suspiciousIps(logs)));\nconsole.log(JSON.stringify(suspiciousIps([])));',
          expected: '["10.0.0.5"]\n[]',
          hints: ['Skip lines that do not contain FAILED.', 'The IP is the last word on the line: line.split(" ").pop()', 'Count per IP in an object, then keep those with count >= 3 and sort them.'],
          solution: 'function suspiciousIps(lines) {\n  const counts = {};\n  for (const line of lines) {\n    if (!line.includes("FAILED")) continue;\n    const ip = line.split(" ").pop();\n    counts[ip] = (counts[ip] || 0) + 1;\n  }\n  return Object.keys(counts).filter((ip) => counts[ip] >= 3).sort();\n}',
        },
      },
    },
  ],
};
