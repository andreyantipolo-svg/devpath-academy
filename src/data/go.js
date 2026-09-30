const R = String.raw;

export default {
  id: 'go',
  title: 'Go',
  hue: '#38BDF8',
  icon: 'zap',
  langs: ['go'],
  blurb: 'Simple, fast and built for the cloud. A small language you can learn in a weekend.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'go-hello',
          title: 'Packages & main',
          xp: 50,
          theory: `Go code is organised in **packages**. An executable program is \`package main\` and starts at \`func main()\`.

Import what you need with \`import "fmt"\`, and print with \`fmt.Println("text")\`. Go has no semicolons at line ends and formats code with a single standard style (\`gofmt\`).`,
          example: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}`,
          quiz: [
            { q: 'Which package provides `Println`?', o: ['io', 'fmt', 'print', 'os only'], a: 1, why: '`fmt` (format) handles formatted printing.' },
            { q: 'Where does a Go program start running?', o: ['func start()', 'func main() in package main', 'The first line of the file', 'init.go'], a: 1, why: 'The entry point is `func main()` inside `package main`.' },
          ],
          task: {
            text: 'Print `Hello, Go!`.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // print here\n}\n',
            expected: 'Hello, Go!',
            checks: [
              { desc: 'Declares package main', re: R`^\s*package\s+main\b` },
              { desc: 'Imports fmt', re: R`import\s+(\(\s*)?"fmt"` },
              { desc: 'Defines func main()', re: R`func\s+main\s*\(\s*\)` },
              { desc: 'Prints "Hello, Go!" with fmt.Println', re: R`fmt\.Println\s*\(\s*"Hello, Go!"\s*\)` },
            ],
            hints: ['The call goes inside the braces of main.', 'The function is fmt.Println.', 'fmt.Println("Hello, Go!")'],
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}',
          },
        },
        {
          id: 'go-vars',
          title: 'Variables & types',
          xp: 75,
          theory: `Declare variables two ways:

- \`var age int = 20\`: explicit
- \`age := 20\`: **short declaration**, the type is inferred (only inside functions)

Go's basic types include \`int\`, \`float64\`, \`string\` and \`bool\`. Variables you declare but never use cause a compile error, which keeps code tidy. \`fmt.Println(a, b)\` prints values separated by a space.`,
          example: `name := "Gopher"
year := 2009
fmt.Println(name, year)`,
          quiz: [
            { q: 'What does `x := 5` do?', o: ['Compares x and 5', 'Declares x and infers its type', 'Assigns to an existing x only', 'Creates a constant'], a: 1, why: 'The short declaration creates a new variable and infers its type.' },
            { q: 'What happens if you declare a local variable and never use it?', o: ['Nothing', 'A warning', 'A compile error', 'A runtime panic'], a: 2, why: 'Go refuses to compile unused local variables.' },
          ],
          task: {
            text: 'Declare `name := "Gopher"` and `year := 2009`, then print both with a single `fmt.Println` so the output is `Gopher 2009`.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // declare and print\n}\n',
            expected: 'Gopher 2009',
            checks: [
              { desc: 'Declares name := "Gopher"', re: R`name\s*:=\s*"Gopher"` },
              { desc: 'Declares year := 2009', re: R`year\s*:=\s*2009` },
              { desc: 'Prints both with fmt.Println(name, year)', re: R`fmt\.Println\s*\(\s*name\s*,\s*year\s*\)` },
            ],
            hints: ['Use := for both declarations.', 'Println accepts several values separated by commas.', 'fmt.Println(name, year)'],
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    name := "Gopher"\n    year := 2009\n    fmt.Println(name, year)\n}',
          },
        },
        {
          id: 'go-funcs',
          title: 'Functions & loops',
          xp: 100,
          theory: `Functions declare parameter types after the names and the return type last: \`func add(a, b int) int { return a + b }\`.

Go has **one** loop keyword, \`for\`:

- Classic: \`for i := 1; i <= n; i++ { ... }\`
- While-style: \`for x < 10 { ... }\`
- Forever: \`for { ... }\` (leave with \`break\`)`,
          example: `func add(a, b int) int {
    return a + b
}`,
          quiz: [
            { q: 'Which keyword creates a loop in Go?', o: ['while', 'for', 'loop', 'repeat'], a: 1, why: '`for` covers every kind of loop in Go.' },
            { q: 'Where does the return type go in a Go function signature?', o: ['Before the name', 'After the parameter list', 'Inside the braces', 'It is inferred'], a: 1, why: '`func name(params) returnType`.' },
          ],
          task: {
            text: 'Write `func sum(n int) int` that returns 1 + 2 + … + n using a `for` loop, and print `sum(10)`.',
            starter: 'package main\n\nimport "fmt"\n\n// write sum here\n\nfunc main() {\n    // print sum(10)\n}\n',
            expected: '55',
            checks: [
              { desc: 'Declares func sum(n int) int', re: R`func\s+sum\s*\(\s*n\s+int\s*\)\s*int` },
              { desc: 'Uses a for loop', re: R`for\s+` },
              { desc: 'Returns a value', re: R`return\s+\w+` },
              { desc: 'Prints sum(10)', re: R`fmt\.Println\s*\(\s*sum\s*\(\s*10\s*\)\s*\)` },
            ],
            hints: ['Keep a total variable starting at 0.', 'for i := 1; i <= n; i++ { total += i }', 'Return total, then call fmt.Println(sum(10)) in main.'],
            solution: 'package main\n\nimport "fmt"\n\nfunc sum(n int) int {\n    total := 0\n    for i := 1; i <= n; i++ {\n        total += i\n    }\n    return total\n}\n\nfunc main() {\n    fmt.Println(sum(10))\n}',
          },
        },
      ],
      capstone: {
        id: 'go-cap-1',
        title: 'Capstone: Even numbers',
        summary: 'A loop, a condition and the modulo operator in idiomatic Go.',
        task: {
          text: 'Print the even numbers from `1` to `10`, one per line, using a `for` loop and `%`.',
          starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // loop 1..10\n}\n',
          expected: '2\n4\n6\n8\n10',
          checks: [
            { desc: 'Uses a for loop over 1..10', re: R`for\s+\w+\s*:=\s*1\s*;\s*\w+\s*<=\s*10` },
            { desc: 'Tests evenness with % 2 == 0', re: R`%\s*2\s*==\s*0` },
            { desc: 'Prints with fmt.Println', re: R`fmt\.Println\s*\(` },
          ],
          hints: ['Loop i from 1 to 10.', 'An even number leaves no remainder when divided by 2.', 'if i%2 == 0 { fmt.Println(i) }'],
          solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 10; i++ {\n        if i%2 == 0 {\n            fmt.Println(i)\n        }\n    }\n}',
        },
      },
    },
  ],
};
