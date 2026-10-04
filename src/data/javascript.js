export default {
  id: 'javascript',
  title: 'JavaScript',
  hue: '#F5C542',
  icon: 'braces',
  langs: ['javascript'],
  blurb: 'The language of the web. Logic, functions, data and async code that runs in every browser.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'js-vars',
          title: 'Variables & data types',
          xp: 50,
          theory: `Variables give a name to a value so you can reuse it. Use \`const\` for values that never change and \`let\` for values that will. Avoid \`var\` in new code.

The everyday data types are **numbers**, **strings** (text in quotes), **booleans** (\`true\` / \`false\`), \`null\` and \`undefined\`.

- \`typeof 42\` gives \`"number"\`
- Strings can be joined with \`+\`, or built with a template literal: backticks and \`\${name}\`.`,
          example: `const platform = "DevPath";
let lessons = 3;
lessons = lessons + 1;
console.log(platform + " has " + lessons + " lessons");
console.log(typeof lessons);`,
          quiz: [
            { q: 'Which keyword declares a variable whose value will NOT change?', o: ['let', 'var', 'const', 'static'], a: 2, why: '`const` creates a binding that cannot be reassigned after it is declared.' },
            { q: 'What does `typeof "42"` return?', o: ['"number"', '"string"', '"boolean"', '"undefined"'], a: 1, why: 'Anything in quotes is a string, even if it looks like a number.' },
          ],
          task: {
            text: 'Declare a constant named `language` with the value `"JavaScript"` and print it with `console.log(language)`.',
            starter: '// Write your code below\n',
            expected: 'JavaScript',
            hints: ['Start with the keyword for a value that never changes.', 'The shape is: const name = "text";', 'Finish with console.log(language);'],
            solution: 'const language = "JavaScript";\nconsole.log(language);',
          },
        },
        {
          id: 'js-cond',
          title: 'Conditionals & logic',
          xp: 75,
          theory: `Conditionals run code only when a test is true: \`if\`, \`else if\`, \`else\`.

Compare values with \`===\` (equal in value **and** type) and \`!==\`, or with \`<\`, \`>\`, \`<=\`, \`>=\`. Combine tests with \`&&\` (and), \`||\` (or) and \`!\` (not).

Prefer \`===\` over \`==\`. The double version converts types behind your back.`,
          example: `function label(score) {
  if (score >= 80) {
    return "Passed";
  } else {
    return "Needs practice";
  }
}
console.log(label(85));`,
          quiz: [
            { q: 'Which operator checks both value AND type equality?', o: ['==', '=', '===', '!='], a: 2, why: 'Strict equality `===` never converts types, so `5 === "5"` is false.' },
            { q: 'What does `5 > 3 && 2 > 4` evaluate to?', o: ['true', 'false', 'undefined', 'It throws an error'], a: 1, why: '`&&` needs both sides true. `2 > 4` is false, so the whole expression is false.' },
          ],
          task: {
            text: 'Write a function `describe(n)` that returns `"Greater"` when `n` is greater than 5, and `"Smaller"` otherwise.',
            starter: 'function describe(n) {\n  // your code here\n}\n',
            harness: 'console.log(describe(10));\nconsole.log(describe(3));\nconsole.log(describe(5));',
            expected: 'Greater\nSmaller\nSmaller',
            hints: ['Use an if statement with the test n > 5.', 'Return one string inside the if and another in the else.', 'Watch the edge case: 5 is not greater than 5.'],
            solution: 'function describe(n) {\n  if (n > 5) {\n    return "Greater";\n  }\n  return "Smaller";\n}',
          },
        },
        {
          id: 'js-loops',
          title: 'Loops',
          xp: 75,
          theory: `Loops repeat code. A \`for\` loop has three parts: start, condition, step.

\`for (let i = 0; i < 3; i++) { ... }\` runs three times with \`i\` = 0, 1, 2.

Use \`while\` when you don't know the count in advance, and \`for...of\` to walk through the items of an array. \`break\` leaves a loop and \`continue\` skips to the next round.`,
          example: `let total = 0;
for (let i = 1; i <= 3; i++) {
  total += i;
}
console.log(total);`,
          quiz: [
            { q: 'How many times does `for (let i = 0; i < 4; i++)` run its body?', o: ['3', '4', '5', 'Forever'], a: 1, why: '`i` takes the values 0, 1, 2 and 3. That is four rounds.' },
            { q: 'Which statement skips the rest of this round and starts the next one?', o: ['break', 'continue', 'return', 'next'], a: 1, why: '`continue` jumps to the next iteration. `break` would end the loop entirely.' },
          ],
          task: {
            text: 'Write a function `sumTo(n)` that returns 1 + 2 + … + n using a loop.',
            starter: 'function sumTo(n) {\n  let total = 0;\n  // add a loop here\n  return total;\n}\n',
            harness: 'console.log(sumTo(1));\nconsole.log(sumTo(5));\nconsole.log(sumTo(100));',
            expected: '1\n15\n5050',
            hints: ['Loop with a counter i that starts at 1.', 'Keep going while i <= n.', 'Inside the loop: total += i;'],
            solution: 'function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}',
          },
        },
        {
          id: 'js-functions',
          title: 'Functions',
          xp: 100,
          theory: `A function packages reusable logic. It takes **parameters**, does work, and hands back a result with \`return\`. A function with no \`return\` gives back \`undefined\`.

- Declaration: \`function add(a, b) { return a + b; }\`
- Arrow function: \`const add = (a, b) => a + b;\`
- Default value: \`function greet(name = "friend") { ... }\``,
          example: `const double = (n) => n * 2;
console.log(double(21));`,
          quiz: [
            { q: 'What does a function return if it has no return statement?', o: ['0', 'null', 'undefined', 'An empty string'], a: 2, why: 'Without an explicit return, a JavaScript function returns `undefined`.' },
            { q: 'Which is a valid arrow function?', o: ['(a, b) => a + b', 'function => (a, b)', '(a, b) -> a + b', '=> (a, b) a + b'], a: 0, why: 'Arrow syntax is parameters, then `=>`, then the body.' },
          ],
          task: {
            text: 'Write `greet(name, greeting)` that returns text like `Hello, Ana!`. If no greeting is given, use `"Hello"`.',
            starter: 'function greet(name, greeting) {\n  // return the greeting text\n}\n',
            harness: 'console.log(greet("Ana"));\nconsole.log(greet("Ben", "Hi"));',
            expected: 'Hello, Ana!\nHi, Ben!',
            hints: ['Give the parameter a default: greeting = "Hello".', 'Join the pieces with +, remembering the comma and space.', 'return greeting + ", " + name + "!";'],
            solution: 'function greet(name, greeting = "Hello") {\n  return greeting + ", " + name + "!";\n}',
          },
        },
      ],
      capstone: {
        id: 'js-cap-1',
        title: 'Capstone: Grade calculator',
        summary: 'Combine conditionals and functions to turn scores into letter grades.',
        task: {
          text: 'Write `grade(score)`: return `"A"` for 90 and above, `"B"` for 80 to 89, `"C"` for 70 to 79, `"D"` for 60 to 69, and `"F"` for anything lower.',
          starter: 'function grade(score) {\n  // return the letter grade\n}\n',
          harness: 'console.log(grade(95));\nconsole.log(grade(85));\nconsole.log(grade(72));\nconsole.log(grade(65));\nconsole.log(grade(30));\nconsole.log(grade(90));',
          expected: 'A\nB\nC\nD\nF\nA',
          hints: ['Check the highest grade first so lower checks can stay simple.', 'if (score >= 90) return "A"; then else if for 80, 70, 60.', 'Finish with a plain return "F"; for everything else.'],
          solution: 'function grade(score) {\n  if (score >= 90) return "A";\n  if (score >= 80) return "B";\n  if (score >= 70) return "C";\n  if (score >= 60) return "D";\n  return "F";\n}',
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'js-arrays',
          title: 'Arrays & array methods',
          xp: 100,
          theory: `Arrays hold ordered lists: \`const nums = [1, 2, 3];\`. Read with \`nums[0]\`, add with \`push\`, count with \`length\`.

Modern JavaScript transforms arrays without manual loops:

- \`.map(fn)\` returns a new array with each item transformed
- \`.filter(fn)\` keeps only items where \`fn\` returns true
- \`.reduce(fn, start)\` folds the array into a single value`,
          example: `const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
console.log(doubled.join(","));`,
          quiz: [
            { q: 'Which array method returns a new array containing only the items that pass a test?', o: ['.map()', '.filter()', '.forEach()', '.push()'], a: 1, why: '`.filter()` keeps the items for which your callback returns true.' },
            { q: 'What does `[1, 2, 3].reduce((sum, n) => sum + n, 0)` return?', o: ['6', '"123"', '[1, 2, 3]', '0'], a: 0, why: 'reduce carries a running total: 0+1+2+3 = 6.' },
          ],
          task: {
            text: 'Write `bigNumbers(list)` that returns only the numbers greater than 10, using `.filter()`.',
            starter: 'function bigNumbers(list) {\n  // use .filter()\n}\n',
            harness: 'console.log(bigNumbers([5, 12, 8, 130, 44]).join(","));\nconsole.log(bigNumbers([1, 2]).length);',
            expected: '12,130,44\n0',
            hints: ['list.filter(...) takes a function that returns true or false.', 'The function can be an arrow: (n) => n > 10', 'return list.filter((n) => n > 10);'],
            solution: 'function bigNumbers(list) {\n  return list.filter((n) => n > 10);\n}',
          },
        },
        {
          id: 'js-objects',
          title: 'Objects & destructuring',
          xp: 100,
          theory: `Objects group related data as key/value pairs: \`const user = { name: "Ana", age: 21 };\`. Read with \`user.name\`.

**Destructuring** pulls properties into variables in one line: \`const { name, age } = user;\`.

Other useful tools: the spread operator \`{ ...user, age: 22 }\` copies an object with changes, and \`Object.keys\`, \`Object.values\` and \`Object.entries\` list its contents.`,
          example: `const user = { name: "Ana", age: 21 };
const { name, age } = user;
console.log(name + " is " + age);`,
          quiz: [
            { q: 'How do you read the `name` property of an object called `user`?', o: ['user.name', 'user::name', 'user->name', 'user(name)'], a: 0, why: 'Dot notation is the everyday way to read a property.' },
            { q: 'What does `const { a, b } = { a: 1, b: 2 };` do?', o: ['It throws an error', 'It creates variables a and b holding 1 and 2', 'It creates an array', 'It copies the object into a'], a: 1, why: 'Destructuring unpacks matching properties into new variables.' },
          ],
          task: {
            text: 'Write `summarize(user)` that returns `"<name> (<age>)"`, for example `Ana (21)`. Use destructuring.',
            starter: 'function summarize(user) {\n  // destructure name and age, then return the text\n}\n',
            harness: 'console.log(summarize({ name: "Ana", age: 21 }));\nconsole.log(summarize({ name: "Ben", age: 34, city: "Cebu" }));',
            expected: 'Ana (21)\nBen (34)',
            hints: ['const { name, age } = user; gives you both variables.', 'Build the text with + and parentheses inside quotes.', 'return name + " (" + age + ")";'],
            solution: 'function summarize(user) {\n  const { name, age } = user;\n  return name + " (" + age + ")";\n}',
          },
        },
        {
          id: 'js-async',
          title: 'Promises & async/await',
          xp: 125,
          theory: `Some work takes time: network requests, timers, file reads. A **Promise** represents a value that will arrive later.

An \`async\` function always returns a promise. Inside it, \`await\` pauses that function until a promise settles, without freezing the rest of the program. Handle failures with \`try / catch\`.

\`setTimeout\` is the simplest way to practise: wrap it in a promise and \`await\` it.`,
          example: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("start");
  await wait(100);
  console.log("done");
}
main();`,
          quiz: [
            { q: 'What does `await` do inside an async function?', o: ['Pauses that function until the promise settles', 'Blocks the entire browser', 'Creates a new thread', 'Turns a promise into a string'], a: 0, why: 'Only the async function pauses. Other code keeps running.' },
            { q: 'How do you handle a rejected promise when using async/await?', o: ['try / catch', 'if / else', 'switch', 'A for loop'], a: 0, why: 'A rejected `await` throws, so a `try / catch` block catches it.' },
          ],
          task: {
            text: 'Write `async function fetchScore()` that waits 50 ms using the provided `wait`, then returns `42`. The tests call it and print the result.',
            starter: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function fetchScore() {\n  // wait, then return 42\n}\n',
            harness: 'fetchScore().then((v) => console.log("Score: " + v));',
            expected: 'Score: 42',
            hints: ['Inside an async function you can use the await keyword.', 'await wait(50); pauses for 50 milliseconds.', 'After the await line, return 42;'],
            solution: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nasync function fetchScore() {\n  await wait(50);\n  return 42;\n}',
          },
        },
      ],
      capstone: {
        id: 'js-cap-2',
        title: 'Capstone: Shopping cart total',
        summary: 'Use arrays and objects to price an order like a real checkout.',
        task: {
          text: 'Write `cartTotal(items)`. Each item is `{ price, qty }`. Return the order total rounded to 2 decimal places (as a number). An empty cart totals `0`.',
          starter: 'function cartTotal(items) {\n  // add up price * qty for every item\n}\n',
          harness: 'console.log(cartTotal([{ price: 1.5, qty: 4 }, { price: 12.99, qty: 1 }]));\nconsole.log(cartTotal([]));\nconsole.log("Total: " + cartTotal([{ price: 29.99, qty: 1 }, { price: 9.99, qty: 1 }, { price: 4.99, qty: 1 }]).toFixed(2));',
          expected: '18.99\n0\nTotal: 44.97',
          hints: ['reduce() is a natural fit: start the total at 0.', 'Add item.price * item.qty on each step.', 'Round with Math.round(total * 100) / 100 to avoid floating point noise.'],
          solution: 'function cartTotal(items) {\n  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);\n  return Math.round(total * 100) / 100;\n}',
        },
      },
    },
    {
      id: 'advanced',
      lessons: [
        {
          id: 'js-closures',
          title: 'Closures & higher-order functions',
          xp: 150,
          theory: `A **closure** is a function that remembers the variables from the place where it was created, even after that place has finished running.

That makes it possible to keep private state: a factory function creates a variable, returns an inner function that uses it, and nothing else can touch the variable.

A function that takes or returns other functions is called a **higher-order function**. \`map\` and \`filter\` are examples.`,
          example: `function makeAdder(x) {
  return (y) => x + y;
}
const addFive = makeAdder(5);
console.log(addFive(3));`,
          quiz: [
            { q: 'What is a closure?', o: ['A function bundled with the variables from its surrounding scope', 'A way to close the browser tab', 'A function with no parameters', 'A loop that stops early'], a: 0, why: 'The inner function keeps access to outer variables after the outer function returns.' },
            { q: 'A function that accepts another function as an argument is called…', o: ['A constructor', 'A higher-order function', 'A generator', 'A callback-free function'], a: 1, why: 'Functions are values in JavaScript, so they can be passed in and returned.' },
          ],
          task: {
            text: 'Write `makeCounter()` that returns a function. Each call to that function returns the next number: 1, 2, 3… Two counters must not affect each other.',
            starter: 'function makeCounter() {\n  // keep a private count and return a function\n}\n',
            harness: 'const a = makeCounter();\nconsole.log(a(), a(), a());\nconst b = makeCounter();\nconsole.log(b());',
            expected: '1 2 3\n1',
            hints: ['Declare let count = 0; inside makeCounter, outside the returned function.', 'The returned function should increase count and return it.', 'return () => { count += 1; return count; };'],
            solution: 'function makeCounter() {\n  let count = 0;\n  return () => {\n    count += 1;\n    return count;\n  };\n}',
          },
        },
        {
          id: 'js-classes',
          title: 'Classes & objects',
          xp: 150,
          theory: `A **class** is a blueprint for objects that share structure and behaviour.

\`\`\`
class Dog {
  constructor(name) { this.name = name; }
  speak() { return this.name + " barks"; }
}
\`\`\`

\`new Dog("Rex")\` creates an instance. \`this\` refers to the instance. Use \`extends\` to build a class on top of another one.`,
          example: `class Dog {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " barks";
  }
}
console.log(new Dog("Rex").speak());`,
          quiz: [
            { q: 'What does the `constructor` method do?', o: ['It runs when you create an instance with `new`', 'It deletes an object', 'It converts a class to a string', 'It runs once when the page loads'], a: 0, why: 'The constructor sets up each new instance.' },
            { q: 'Inside a class method, what does `this` refer to?', o: ['The global window', 'The class itself', 'The instance the method was called on', 'The parent class'], a: 2, why: '`this` is the object the method belongs to for this call.' },
          ],
          task: {
            text: 'Create a class `Account` whose `balance` starts at `0`. Add `deposit(n)` and `withdraw(n)`. A withdrawal larger than the balance must be ignored.',
            starter: 'class Account {\n  // constructor, deposit(n), withdraw(n)\n}\n',
            harness: 'const acc = new Account();\nacc.deposit(100);\nacc.withdraw(30);\nacc.withdraw(500);\nconsole.log(acc.balance);',
            expected: '70',
            hints: ['In the constructor, set this.balance = 0;', 'deposit adds n to this.balance.', 'withdraw only subtracts when n <= this.balance.'],
            solution: 'class Account {\n  constructor() {\n    this.balance = 0;\n  }\n  deposit(n) {\n    this.balance += n;\n  }\n  withdraw(n) {\n    if (n <= this.balance) this.balance -= n;\n  }\n}',
          },
        },
      ],
      capstone: {
        id: 'js-cap-3',
        title: 'Capstone: Word frequency counter',
        summary: 'Text processing with objects, string methods and a bit of care.',
        task: {
          text: 'Write `wordCount(text)` that returns an object mapping each lowercase word to how many times it appears. Ignore punctuation.',
          starter: 'function wordCount(text) {\n  // return an object like { the: 2, cat: 1 }\n}\n',
          harness: 'console.log(JSON.stringify(wordCount("the cat and The hat")));\nconsole.log(JSON.stringify(wordCount("Go, go! GO?")));',
          expected: '{"the":2,"cat":1,"and":1,"hat":1}\n{"go":3}',
          hints: ['Lowercase the text first, then strip punctuation with .replace(/[^a-z\\s]/g, "").', 'Split on whitespace: .split(/\\s+/) and skip empty strings.', 'Count with counts[word] = (counts[word] || 0) + 1;'],
          solution: 'function wordCount(text) {\n  const counts = {};\n  const words = text.toLowerCase().replace(/[^a-z\\s]/g, "").split(/\\s+/).filter(Boolean);\n  for (const word of words) {\n    counts[word] = (counts[word] || 0) + 1;\n  }\n  return counts;\n}',
        },
      },
    },
  ],
};
