const R = String.raw;

export default {
  id: 'rust',
  title: 'Rust',
  hue: '#F08A3C',
  icon: 'hammer',
  langs: ['rust'],
  blurb: 'Memory safety without a garbage collector. Real runs use the official Rust Playground when online.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'rust-hello',
          title: 'fn main & println!',
          xp: 50,
          theory: `A Rust program starts in \`fn main()\`. Printing uses the **macro** \`println!\`. The exclamation mark tells you it is a macro, not a normal function.

Statements end with semicolons. Use \`{}\` inside the text as a placeholder for a value: \`println!("Hi {}", name);\``,
          example: `fn main() {
    println!("Hello, Rust!");
}`,
          quiz: [
            { q: 'What does the `!` in `println!` mean?', o: ['It is a macro call', 'It negates the value', 'It marks an error', 'It is required after every function'], a: 0, why: 'Macros end with `!` and expand into code at compile time.' },
            { q: 'What is the placeholder for a value inside a format string?', o: ['%s', '{}', '$var', '<>'], a: 1, why: 'Rust format strings use `{}`.' },
          ],
          task: {
            text: 'Print `Hello, Rust!` from `main`.',
            starter: 'fn main() {\n    // print here\n}\n',
            expected: 'Hello, Rust!',
            checks: [
              { desc: 'Defines fn main()', re: R`fn\s+main\s*\(\s*\)` },
              { desc: 'Prints "Hello, Rust!" with println!', re: R`println!\s*\(\s*"Hello, Rust!"\s*\)\s*;` },
            ],
            hints: ['The call belongs inside the braces of main.', 'Do not forget the ! after println.', 'println!("Hello, Rust!");'],
            solution: 'fn main() {\n    println!("Hello, Rust!");\n}',
          },
        },
        {
          id: 'rust-vars',
          title: 'Variables & mutability',
          xp: 75,
          theory: `Variables in Rust are **immutable by default**: \`let x = 1;\` cannot be changed. Opt in to change with \`let mut x = 1;\`.

Immutability makes code easier to reason about. **Shadowing** lets you reuse a name with a new \`let\`: \`let x = x + 1;\`.

Common types: \`i32\` (integer), \`f64\` (decimal), \`bool\`, \`String\` and \`&str\`.`,
          example: `let mut count = 0;
count += 1;
println!("Count: {}", count);`,
          quiz: [
            { q: 'How do you declare a variable you can change?', o: ['let mut x = 1;', 'let x = 1;', 'var x = 1;', 'mut let x = 1;'], a: 0, why: '`mut` after `let` makes the binding mutable.' },
            { q: 'What happens if you assign twice to `let x = 1;`?', o: ['A compile error', 'x becomes 2', 'The second assignment is ignored', 'A runtime panic'], a: 0, why: 'Immutable variables cannot be reassigned. The compiler stops you.' },
          ],
          task: {
            text: 'Create `let mut count = 0;`, add `5` to it, and print `Count: 5` using `println!("Count: {}", count)`.',
            starter: 'fn main() {\n    // mutable counter\n}\n',
            expected: 'Count: 5',
            checks: [
              { desc: 'Declares let mut count = 0', re: R`let\s+mut\s+count\s*(:\s*\w+\s*)?=\s*0\s*;` },
              { desc: 'Adds 5 to count', re: R`count\s*\+=\s*5|count\s*=\s*count\s*\+\s*5` },
              { desc: 'Prints "Count: {}" with count', re: R`println!\s*\(\s*"Count: \{\}"\s*,\s*count\s*\)` },
            ],
            hints: ['Remember the mut keyword.', 'count += 5; adds in place.', 'println!("Count: {}", count);'],
            solution: 'fn main() {\n    let mut count = 0;\n    count += 5;\n    println!("Count: {}", count);\n}',
          },
        },
        {
          id: 'rust-fn',
          title: 'Functions',
          xp: 100,
          theory: `Functions declare parameter **types** and a return type after \`->\`:

\`fn add(a: i32, b: i32) -> i32 { a + b }\`

The last expression in a function, **without a semicolon**, is its return value. A semicolon turns an expression into a statement that yields nothing. Explicit \`return x;\` also works.`,
          example: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
          quiz: [
            { q: 'What is the return value of `fn f() -> i32 { 5 }`?', o: ['5', 'Nothing, it needs return', 'It will not compile', 'null'], a: 0, why: 'The final expression without a semicolon is returned.' },
            { q: 'Where is the return type written?', o: ['Before fn', 'After -> in the signature', 'Inside the body', 'It is inferred'], a: 1, why: '`fn name(params) -> Type`.' },
          ],
          task: {
            text: 'Write `fn double(n: i32) -> i32` returning `n * 2`, and print `double(21)` from `main`.',
            starter: 'fn main() {\n    // call double(21) and print it\n}\n\n// write double here\n',
            expected: '42',
            checks: [
              { desc: 'Declares fn double(n: i32) -> i32', re: R`fn\s+double\s*\(\s*n\s*:\s*i32\s*\)\s*->\s*i32` },
              { desc: 'Returns n * 2', re: R`n\s*\*\s*2|2\s*\*\s*n` },
              { desc: 'Prints double(21) with println!', re: R`println!\s*\(\s*"\{\}"\s*,\s*double\s*\(\s*21\s*\)\s*\)` },
            ],
            hints: ['Type annotations are required on parameters.', 'The body can be just n * 2 with no semicolon.', 'println!("{}", double(21));'],
            solution: 'fn main() {\n    println!("{}", double(21));\n}\n\nfn double(n: i32) -> i32 {\n    n * 2\n}',
          },
        },
      ],
      capstone: {
        id: 'rust-cap-1',
        title: 'Capstone: Squares',
        summary: 'A for loop over a range, the idiomatic way to count in Rust.',
        task: {
          text: 'Print the squares of `1` to `4`, one per line (`1`, `4`, `9`, `16`), using `for i in 1..=4`.',
          starter: 'fn main() {\n    // loop over 1..=4\n}\n',
          expected: '1\n4\n9\n16',
          checks: [
            { desc: 'Loops with for … in 1..=4', re: R`for\s+\w+\s+in\s+1\s*\.\.=\s*4` },
            { desc: 'Multiplies the counter by itself', re: R`(\w+)\s*\*\s*\1` },
            { desc: 'Prints with println!', re: R`println!\s*\(` },
          ],
          hints: ['1..=4 is an inclusive range: 1, 2, 3, 4.', 'The square of i is i * i.', 'println!("{}", i * i);'],
          solution: 'fn main() {\n    for i in 1..=4 {\n        println!("{}", i * i);\n    }\n}',
        },
      },
    },
  ],
};
