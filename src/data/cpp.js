// C++ tasks run in the browser through JSCPP, which covers the fundamentals below.
// (STL containers, std::string and classes are not supported by the in-browser engine.)
const HEAD = '#include <iostream>\nusing namespace std;\n\n';

export default {
  id: 'cpp',
  title: 'C++',
  hue: '#7C6CF5',
  icon: 'cpu',
  langs: ['cpp'],
  blurb: 'Fast, close to the machine. Learn types, control flow, functions, arrays and pointers.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'cpp-hello',
          title: 'Output & headers',
          xp: 50,
          theory: `C++ programs start at \`main()\`. To print, include the \`<iostream>\` header and send text to \`cout\` with the stream operator \`<<\`.

\`endl\` ends the line. \`using namespace std;\` lets you write \`cout\` instead of \`std::cout\`.

Every statement ends with a semicolon, and \`return 0;\` at the end of \`main\` means "success".`,
          example: `#include <iostream>
using namespace std;

int main() {
  cout << "C++ Engine" << endl;
  return 0;
}`,
          quiz: [
            { q: 'Which object sends output to the console in C++?', o: ['cout', 'cin', 'print', 'write'], a: 0, why: '`cout` combined with `<<` writes to standard output.' },
            { q: 'What ends every C++ statement?', o: ['A period', 'A semicolon', 'A colon', 'Nothing'], a: 1, why: 'The compiler needs the semicolon to know a statement is finished.' },
          ],
          task: {
            text: 'Print two lines: `C++ Engine` and then `Ready`.',
            starter: `${HEAD}int main() {\n  // print two lines\n  return 0;\n}\n`,
            expected: 'C++ Engine\nReady',
            hints: ['Use cout << "text" << endl; for each line.', 'You need two separate cout statements (or chain them).', 'cout << "C++ Engine" << endl;\ncout << "Ready" << endl;'],
            solution: `${HEAD}int main() {\n  cout << "C++ Engine" << endl;\n  cout << "Ready" << endl;\n  return 0;\n}`,
          },
        },
        {
          id: 'cpp-types',
          title: 'Variables & types',
          xp: 75,
          theory: `C++ is **statically typed**: every variable has a type fixed at compile time.

- \`int\` whole numbers, \`double\` decimals, \`char\` one character, \`bool\` true/false
- Arithmetic: \`+ - * / %\`. Dividing two ints drops the decimals: \`7 / 2\` is \`3\`, but \`7 / 2.0\` is \`3.5\`.
- Chain several values in one \`cout\`: \`cout << "Area: " << w * h << endl;\``,
          example: `int w = 6;
int h = 7;
cout << "Area: " << w * h << endl;`,
          quiz: [
            { q: 'What does `7 / 2` evaluate to when both are ints?', o: ['3.5', '3', '4', '2'], a: 1, why: 'Integer division discards the remainder.' },
            { q: 'Which type stores a decimal number?', o: ['int', 'char', 'double', 'bool'], a: 2, why: '`double` stores floating-point numbers.' },
          ],
          task: {
            text: 'The variables `w` and `h` are set. Print `Area: ` followed by the area of the rectangle.',
            starter: `${HEAD}int main() {\n  int w = 6;\n  int h = 7;\n  // print Area: 42\n  return 0;\n}\n`,
            expected: 'Area: 42',
            hints: ['Multiply the two variables: w * h', 'Chain the label and the number in one cout.', 'cout << "Area: " << w * h << endl;'],
            solution: `${HEAD}int main() {\n  int w = 6;\n  int h = 7;\n  cout << "Area: " << w * h << endl;\n  return 0;\n}`,
          },
        },
        {
          id: 'cpp-control',
          title: 'Conditionals',
          xp: 75,
          theory: `\`if\`, \`else if\` and \`else\` choose between paths. \`switch\` picks by exact value.

\`\`\`
if (n > 0) { ... }
else if (n < 0) { ... }
else { ... }
\`\`\`

Conditions go in parentheses. \`&&\`, \`||\` and \`!\` combine them. Functions declare their return type first: \`int sign(int n)\`.`,
          example: `int sign(int n) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}`,
          quiz: [
            { q: 'Which operator means logical AND in C++?', o: ['and only', '&&', '&', '||'], a: 1, why: '`&&` is logical AND. A single `&` is a bitwise operation.' },
            { q: 'What must every `case` in a switch usually end with?', o: ['continue;', 'break;', 'end;', 'stop;'], a: 1, why: 'Without `break`, execution falls through into the next case.' },
          ],
          task: {
            text: 'Write `int sign(int n)` that returns `1` for positive numbers, `-1` for negative numbers and `0` for zero. A `main` that tests it is added automatically.',
            starter: `${HEAD}int sign(int n) {\n  // return 1, -1 or 0\n}\n`,
            harness: 'int main() {\n  cout << sign(5) << endl;\n  cout << sign(-3) << endl;\n  cout << sign(0) << endl;\n  return 0;\n}',
            expected: '1\n-1\n0',
            hints: ['Three cases: greater than 0, less than 0, and everything else.', 'Return inside each if.', 'if (n > 0) return 1; if (n < 0) return -1; return 0;'],
            solution: `${HEAD}int sign(int n) {\n  if (n > 0) return 1;\n  if (n < 0) return -1;\n  return 0;\n}`,
          },
        },
        {
          id: 'cpp-loops',
          title: 'Loops',
          xp: 75,
          theory: `\`for (init; condition; step)\` is the workhorse loop. \`while (condition)\` repeats while true, and \`do { } while (condition);\` always runs at least once.

\`\`\`
for (int i = 1; i <= 3; i++) {
  cout << i << " ";
}
\`\`\`

\`i++\` adds one. \`break\` and \`continue\` work like in other languages.`,
          example: `for (int i = 1; i <= 3; i++) {
  cout << i << " ";
}
cout << endl;`,
          quiz: [
            { q: 'What does `i++` do?', o: ['Doubles i', 'Adds 1 to i', 'Adds i to itself', 'Prints i'], a: 1, why: '`i++` is shorthand for `i = i + 1`.' },
            { q: 'Which loop always runs its body at least once?', o: ['for', 'while', 'do … while', 'if'], a: 2, why: 'The `do … while` condition is checked after the body.' },
          ],
          task: {
            text: 'Print the numbers `1` to `5` on one line, separated by spaces: `1 2 3 4 5`.',
            starter: `${HEAD}int main() {\n  // use a for loop\n  return 0;\n}\n`,
            expected: '1 2 3 4 5',
            hints: ['Loop with int i = 1 while i <= 5.', 'Print each number followed by a space.', 'for (int i = 1; i <= 5; i++) { cout << i << " "; }'],
            solution: `${HEAD}int main() {\n  for (int i = 1; i <= 5; i++) {\n    cout << i << " ";\n  }\n  cout << endl;\n  return 0;\n}`,
          },
        },
      ],
      capstone: {
        id: 'cpp-cap-1',
        title: 'Capstone: FizzBuzz',
        summary: 'The classic interview warm-up: loops and conditionals under one roof.',
        task: {
          text: 'For the numbers `1` to `15`, print one per line. For multiples of 3 print `Fizz`, for multiples of 5 print `Buzz`, and for multiples of both print `FizzBuzz`.',
          starter: `${HEAD}int main() {\n  // loop 1..15\n  return 0;\n}\n`,
          expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
          hints: ['Check "divisible by both" first, using i % 15 == 0.', 'Then i % 3 == 0, then i % 5 == 0.', 'Anything else: print the number.'],
          solution: `${HEAD}int main() {\n  for (int i = 1; i <= 15; i++) {\n    if (i % 15 == 0) cout << "FizzBuzz" << endl;\n    else if (i % 3 == 0) cout << "Fizz" << endl;\n    else if (i % 5 == 0) cout << "Buzz" << endl;\n    else cout << i << endl;\n  }\n  return 0;\n}`,
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'cpp-functions',
          title: 'Functions & recursion',
          xp: 100,
          theory: `Break programs into functions: \`int add(int a, int b) { return a + b; }\`. A function that returns nothing has the return type \`void\`.

**Recursion** means a function calling itself. It needs a **base case** that stops the chain and a step that moves toward it:

\`n! = n * (n-1)!\`, and \`1! = 1\`.`,
          example: `int fact(int n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}`,
          quiz: [
            { q: 'What does a recursive function need to avoid running forever?', o: ['A base case', 'A global variable', 'The void keyword', 'A loop'], a: 0, why: 'The base case is the condition where recursion stops.' },
            { q: 'Which return type means "returns nothing"?', o: ['null', 'empty', 'void', 'none'], a: 2, why: '`void` functions produce no value.' },
          ],
          task: {
            text: 'Write `int factorial(int n)` using recursion. `factorial(1)` is `1`, and `factorial(5)` is `120`.',
            starter: `${HEAD}int factorial(int n) {\n  // base case, then recursive step\n}\n`,
            harness: 'int main() {\n  cout << factorial(1) << endl;\n  cout << factorial(5) << endl;\n  cout << factorial(10) << endl;\n  return 0;\n}',
            expected: '1\n120\n3628800',
            hints: ['Base case: if n <= 1, return 1.', 'Otherwise multiply n by the factorial of n - 1.', 'return n * factorial(n - 1);'],
            solution: `${HEAD}int factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}`,
          },
        },
        {
          id: 'cpp-arrays',
          title: 'Arrays',
          xp: 100,
          theory: `An array stores a fixed number of values of one type: \`int a[5] = {3, 9, 2, 7, 5};\`. Indexes start at **0**, so the last valid index of a 5-item array is 4.

Arrays do not remember their own length, so functions receive it separately: \`int maxOf(int a[], int n)\`.

Reading past the end is **undefined behaviour**: one of the classic sources of C++ bugs.`,
          example: `int a[3] = {4, 8, 15};
int sum = 0;
for (int i = 0; i < 3; i++) {
  sum += a[i];
}
cout << sum << endl;`,
          quiz: [
            { q: 'What is the index of the first item in an array?', o: ['1', '0', '-1', 'It depends'], a: 1, why: 'C++ arrays are zero-indexed.' },
            { q: 'Why do functions taking arrays usually also take a length?', o: ['Arrays are slow', 'Arrays do not carry their length', 'To save memory', 'It is optional syntax'], a: 1, why: 'A raw array decays to a pointer and loses its size.' },
          ],
          task: {
            text: 'Write `int maxOf(int a[], int n)` that returns the largest of the first `n` items.',
            starter: `${HEAD}int maxOf(int a[], int n) {\n  // find the largest value\n}\n`,
            harness: 'int main() {\n  int a[5] = {3, 9, 2, 7, 5};\n  cout << maxOf(a, 5) << endl;\n  int b[3] = {-4, -9, -1};\n  cout << maxOf(b, 3) << endl;\n  return 0;\n}',
            expected: '9\n-1',
            hints: ['Start with best = a[0], not with 0 (negatives!).', 'Loop from index 1 up to n - 1.', 'if (a[i] > best) best = a[i];'],
            solution: `${HEAD}int maxOf(int a[], int n) {\n  int best = a[0];\n  for (int i = 1; i < n; i++) {\n    if (a[i] > best) best = a[i];\n  }\n  return best;\n}`,
          },
        },
        {
          id: 'cpp-pointers',
          title: 'Pointers',
          xp: 125,
          theory: `A **pointer** stores the memory address of another variable.

- \`&x\` gives the address of \`x\`
- \`int* p = &x;\` declares a pointer to an int
- \`*p\` **dereferences**: it reads or writes the value at that address

Passing pointers lets a function change the caller's variables: \`void inc(int* p) { *p = *p + 1; }\` called as \`inc(&x);\``,
          example: `int x = 10;
int* p = &x;
*p = 20;
cout << x << endl;`,
          quiz: [
            { q: 'What does `&x` give you?', o: ['The value of x', 'The address of x', 'x squared', 'A copy of x'], a: 1, why: 'The address-of operator returns where x lives in memory.' },
            { q: 'What does `*p = 5;` do when p is an int pointer?', o: ['Changes p to 5', 'Writes 5 into the variable p points to', 'Multiplies p by 5', 'Declares a new pointer'], a: 1, why: 'Dereferencing with `*` reaches the pointed-to value.' },
          ],
          task: {
            text: 'Write `void swapValues(int* a, int* b)` that swaps two integers through their pointers.',
            starter: `${HEAD}void swapValues(int* a, int* b) {\n  // swap using a temporary variable\n}\n`,
            harness: 'int main() {\n  int x = 3;\n  int y = 8;\n  swapValues(&x, &y);\n  cout << x << " " << y << endl;\n  return 0;\n}',
            expected: '8 3',
            hints: ['Save one value in a temp first: int t = *a;', 'Copy *b into *a, then t into *b.', '*a = *b; *b = t;'],
            solution: `${HEAD}void swapValues(int* a, int* b) {\n  int t = *a;\n  *a = *b;\n  *b = t;\n}`,
          },
        },
      ],
      capstone: {
        id: 'cpp-cap-2',
        title: 'Capstone: Prime counter',
        summary: 'Functions, loops and logic combine to answer a classic number theory question.',
        task: {
          text: 'Write `bool isPrime(int n)`. A prime is greater than 1 and divisible only by 1 and itself. The tests count primes below 30 and check `isPrime(97)`.',
          starter: `${HEAD}bool isPrime(int n) {\n  // return true or false\n}\n`,
          harness: 'int main() {\n  int count = 0;\n  for (int i = 1; i < 30; i++) {\n    if (isPrime(i)) count++;\n  }\n  cout << count << endl;\n  cout << isPrime(97) << endl;\n  cout << isPrime(1) << endl;\n  return 0;\n}',
          expected: '10\n1\n0',
          hints: ['Numbers below 2 are not prime.', 'Try dividing by every i from 2 while i * i <= n.', 'If n % i == 0 for any i, return false; otherwise return true.'],
          solution: `${HEAD}bool isPrime(int n) {\n  if (n < 2) return false;\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) return false;\n  }\n  return true;\n}`,
        },
      },
    },
  ],
};
