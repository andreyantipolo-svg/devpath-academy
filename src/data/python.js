export default {
  id: 'python',
  title: 'Python',
  hue: '#5C8DF0',
  icon: 'terminal',
  langs: ['python'],
  blurb: 'Readable, friendly and everywhere: automation, data, web backends. Runs for real in your browser.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'py-vars',
          title: 'Variables & print',
          xp: 50,
          theory: `In Python a variable is created the moment you assign to it. There is no \`let\` or \`const\`.

\`print()\` writes to the console. **f-strings** put values inside text: \`f"Hello {name}"\`.

Core types: \`int\` (whole numbers), \`float\` (decimals), \`str\` (text) and \`bool\` (\`True\` / \`False\`). Check one with \`type(x)\`.`,
          example: `name = "DevPath"
lessons = 3
print(f"{name} has {lessons} lessons")
print(type(lessons))`,
          quiz: [
            { q: 'Which function outputs text in Python?', o: ['console.log()', 'print()', 'echo()', 'System.out.println()'], a: 1, why: 'Python uses `print()` for standard output.' },
            { q: 'What does `type(3.14)` show?', o: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'decimal'>"], a: 1, why: 'Numbers with a decimal point are floats.' },
          ],
          task: {
            text: 'The variables `name` and `points` are already set. Print `Ana has 120 points` using an f-string.',
            starter: 'name = "Ana"\npoints = 120\n# print the sentence with an f-string\n',
            expected: 'Ana has 120 points',
            hints: ['An f-string starts with f before the opening quote.', 'Put variable names inside curly braces: {name}', 'print(f"{name} has {points} points")'],
            solution: 'name = "Ana"\npoints = 120\nprint(f"{name} has {points} points")',
          },
        },
        {
          id: 'py-cond',
          title: 'Conditionals',
          xp: 75,
          theory: `Python marks blocks of code with **indentation** (four spaces), not curly braces. A colon \`:\` opens the block.

\`\`\`
if score >= 50:
    print("Pass")
elif score >= 40:
    print("Almost")
else:
    print("Fail")
\`\`\`

Combine tests with \`and\`, \`or\` and \`not\`. Compare with \`==\`, \`!=\`, \`<\`, \`>\`.`,
          example: `score = 85
if score >= 80:
    print("Passed")
else:
    print("Needs practice")`,
          quiz: [
            { q: 'How does Python mark a block of code?', o: ['Curly braces', 'Indentation', 'begin / end', 'Semicolons'], a: 1, why: 'Indentation is part of the syntax in Python.' },
            { q: 'Which keyword means "else if" in Python?', o: ['elseif', 'else if', 'elif', 'otherwise'], a: 2, why: 'Python shortens it to `elif`.' },
          ],
          task: {
            text: 'Write `grade(score)` that returns `"Pass"` when the score is 50 or higher and `"Fail"` otherwise.',
            starter: 'def grade(score):\n    # your code here\n    pass\n',
            harness: 'print(grade(50))\nprint(grade(49))\nprint(grade(100))',
            expected: 'Pass\nFail\nPass',
            hints: ['Use if score >= 50: and return "Pass" inside.', 'Add a return "Fail" after the if block.', 'Remember the colon and the indentation.'],
            solution: 'def grade(score):\n    if score >= 50:\n        return "Pass"\n    return "Fail"',
          },
        },
        {
          id: 'py-loops',
          title: 'Loops & range',
          xp: 75,
          theory: `\`for\` walks through a sequence. \`range(n)\` produces 0 up to n-1, and \`range(1, 6)\` produces 1 to 5.

\`while\` repeats as long as a test stays true. Use \`break\` to stop early and \`continue\` to skip to the next round.

You can loop over strings and lists directly: \`for letter in "hey":\`.`,
          example: `for i in range(1, 4):
    print("Round", i)`,
          quiz: [
            { q: 'What numbers does `range(1, 4)` produce?', o: ['1, 2, 3', '1, 2, 3, 4', '0, 1, 2, 3', '2, 3, 4'], a: 0, why: 'The end value is excluded, so it stops at 3.' },
            { q: 'Which loop is best when you do not know how many rounds you need?', o: ['for i in range(10)', 'while', 'if', 'def'], a: 1, why: '`while` keeps going until its condition becomes false.' },
          ],
          task: {
            text: 'Print the 3 times table from 1 to 5, one line each, like `3 x 1 = 3`, `3 x 2 = 6`, and so on.',
            starter: '# use a for loop with range()\n',
            expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
            hints: ['range(1, 6) gives 1 to 5.', 'Inside the loop, multiply 3 * i.', 'print(f"3 x {i} = {3 * i}")'],
            solution: 'for i in range(1, 6):\n    print(f"3 x {i} = {3 * i}")',
          },
        },
        {
          id: 'py-functions',
          title: 'Functions',
          xp: 100,
          theory: `Define a function with \`def\`. Parameters go in parentheses and \`return\` sends a value back.

Give a parameter a **default value** with \`=\`: \`def greet(name, greeting="Hello"):\`. Callers can then leave it out.

A short description in triple quotes right under the \`def\` line is called a docstring. It documents the function.`,
          example: `def double(n):
    return n * 2

print(double(21))`,
          quiz: [
            { q: 'Which keyword defines a function?', o: ['function', 'def', 'fn', 'lambda only'], a: 1, why: '`def` starts a function definition.' },
            { q: 'What does `print(greet("Ana"))` show if greet has no return statement?', o: ['Ana', 'An error', 'None', 'An empty line only'], a: 2, why: 'A function without return gives back `None`.' },
          ],
          task: {
            text: 'Write `greet(name, greeting="Hello")` that returns text like `Hello, Ana!`.',
            starter: 'def greet(name, greeting="Hello"):\n    # return the greeting text\n    pass\n',
            harness: 'print(greet("Ana"))\nprint(greet("Ben", "Hi"))',
            expected: 'Hello, Ana!\nHi, Ben!',
            hints: ['The default value is already in the def line.', 'Build the text with an f-string.', 'return f"{greeting}, {name}!"'],
            solution: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"',
          },
        },
      ],
      capstone: {
        id: 'py-cap-1',
        title: 'Capstone: Password checker',
        summary: 'Strings, loops and conditionals working together.',
        task: {
          text: 'Write `is_strong(pw)` that returns `True` when the password has at least 8 characters, at least one digit and at least one uppercase letter. Otherwise return `False`.',
          starter: 'def is_strong(pw):\n    # check length, a digit and an uppercase letter\n    pass\n',
          harness: 'print(is_strong("abc"))\nprint(is_strong("Abcdefg1"))\nprint(is_strong("abcdefgh1"))\nprint(is_strong("ABCDEFGH1"))\nprint(is_strong("Abcdefgh"))',
          expected: 'False\nTrue\nFalse\nTrue\nFalse',
          hints: ['Three separate checks joined with and.', 'any(c.isdigit() for c in pw) tests for a digit.', 'len(pw) >= 8 and any(c.isdigit() for c in pw) and any(c.isupper() for c in pw)'],
          solution: 'def is_strong(pw):\n    return len(pw) >= 8 and any(c.isdigit() for c in pw) and any(c.isupper() for c in pw)',
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'py-lists',
          title: 'Lists & comprehensions',
          xp: 100,
          theory: `Lists hold ordered, changeable items: \`nums = [3, 1, 2]\`. Use \`append\`, \`len\`, slicing (\`nums[1:]\`) and negative indexes (\`nums[-1]\` is the last item).

A **list comprehension** builds a new list in one readable line:

\`[n * 2 for n in nums]\` doubles every item, and \`[n for n in nums if n > 1]\` keeps only some of them.`,
          example: `nums = [1, 2, 3, 4]
squares = [n * n for n in nums]
print(squares)`,
          quiz: [
            { q: 'What does `[x * 2 for x in [1, 2, 3]]` produce?', o: ['[2, 4, 6]', '[1, 2, 3]', '[2, 4]', '(2, 4, 6)'], a: 0, why: 'The expression before `for` is applied to every item.' },
            { q: 'Which index refers to the last item of a list?', o: ['-1', '0', 'len(x)', '-0'], a: 0, why: 'Negative indexes count from the end.' },
          ],
          task: {
            text: 'Write `evens(nums)` that returns a new list containing only the even numbers, using a list comprehension.',
            starter: 'def evens(nums):\n    # use a list comprehension\n    pass\n',
            harness: 'print(evens([1, 2, 3, 4, 5, 6]))\nprint(evens([7, 9]))',
            expected: '[2, 4, 6]\n[]',
            hints: ['The pattern is [item for item in nums if condition].', 'A number is even when n % 2 == 0.', 'return [n for n in nums if n % 2 == 0]'],
            solution: 'def evens(nums):\n    return [n for n in nums if n % 2 == 0]',
          },
        },
        {
          id: 'py-dicts',
          title: 'Dictionaries',
          xp: 100,
          theory: `A dictionary maps keys to values: \`ages = {"Ana": 21, "Ben": 34}\`. Read with \`ages["Ana"]\`, or with \`ages.get("Zed", 0)\` to get a default instead of an error.

Loop with \`for key, value in ages.items():\`. Dictionaries keep the order in which keys were added.

Counting things is the classic use: \`counts[x] = counts.get(x, 0) + 1\`.`,
          example: `ages = {"Ana": 21, "Ben": 34}
ages["Cy"] = 19
for name, age in ages.items():
    print(name, age)`,
          quiz: [
            { q: 'What does `d.get("x", 0)` return when "x" is not a key?', o: ['An error', 'None', '0', '"x"'], a: 2, why: 'The second argument is the default returned for a missing key.' },
            { q: 'Which method lets you loop over keys and values together?', o: ['.keys()', '.values()', '.items()', '.pairs()'], a: 2, why: '`.items()` yields (key, value) pairs.' },
          ],
          task: {
            text: 'Write `count_letters(word)` that returns a dictionary of how many times each letter appears.',
            starter: 'def count_letters(word):\n    # build and return a dictionary\n    pass\n',
            harness: 'print(count_letters("banana"))\nprint(count_letters(""))',
            expected: "{'b': 1, 'a': 3, 'n': 2}\n{}",
            hints: ['Start with counts = {}', 'Loop over the letters of the word.', 'counts[ch] = counts.get(ch, 0) + 1'],
            solution: 'def count_letters(word):\n    counts = {}\n    for ch in word:\n        counts[ch] = counts.get(ch, 0) + 1\n    return counts',
          },
        },
        {
          id: 'py-classes',
          title: 'Classes & objects',
          xp: 125,
          theory: `A class bundles data and behaviour. \`__init__\` runs when you create an object, and \`self\` is the object itself.

\`\`\`
class Dog:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return self.name + " barks"
\`\`\`

Create one with \`Dog("Rex")\` and call \`Dog("Rex").speak()\`.`,
          example: `class Dog:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return self.name + " barks"

print(Dog("Rex").speak())`,
          quiz: [
            { q: 'What is `self` inside a method?', o: ['The class itself', 'The object the method is called on', 'A reserved global', 'The parent class'], a: 1, why: 'Python passes the instance as the first argument, named `self` by convention.' },
            { q: 'Which method runs automatically when an object is created?', o: ['__start__', '__new_object__', '__init__', 'constructor'], a: 2, why: '`__init__` initialises each new instance.' },
          ],
          task: {
            text: 'Create a class `Rectangle` with `width` and `height`, plus methods `area()` and `perimeter()`.',
            starter: 'class Rectangle:\n    # __init__, area, perimeter\n    pass\n',
            harness: 'r = Rectangle(3, 4)\nprint(r.area())\nprint(r.perimeter())\nprint(Rectangle(10, 2).area())',
            expected: '12\n14\n20',
            hints: ['__init__(self, width, height) stores both values on self.', 'area is width times height.', 'perimeter is 2 * (width + height)'],
            solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def perimeter(self):\n        return 2 * (self.width + self.height)',
          },
        },
      ],
      capstone: {
        id: 'py-cap-2',
        title: 'Capstone: Inventory summary',
        summary: 'Lists, tuples and dictionaries to summarise stock like a small business would.',
        task: {
          text: 'Write `summary(items)`. Each item is a tuple `(name, qty, price)`. Return a dictionary with `count` (number of items) and `total` (the sum of qty * price, rounded to 2 decimals).',
          starter: 'def summary(items):\n    # return {"count": ..., "total": ...}\n    pass\n',
          harness: 'print(summary([("pen", 10, 1.5), ("book", 2, 12.99)]))\nprint(summary([("cable", 3, 4.99)]))',
          expected: "{'count': 2, 'total': 40.98}\n{'count': 1, 'total': 14.97}",
          hints: ['Use len(items) for the count.', 'sum(qty * price for name, qty, price in items) adds everything up.', 'Wrap the total in round(total, 2).'],
          solution: 'def summary(items):\n    total = sum(qty * price for name, qty, price in items)\n    return {"count": len(items), "total": round(total, 2)}',
        },
      },
    },
  ],
};
