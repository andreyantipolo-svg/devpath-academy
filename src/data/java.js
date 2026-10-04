// Java, Go and Rust are "guided" tracks: they are verified with pattern checks in the browser
// (the tutor acts as your compiler), and run for real if a code runner is configured in Settings.
const R = String.raw;

export default {
  id: 'java',
  title: 'Java',
  hue: '#EF4E5A',
  icon: 'coffee',
  langs: ['java'],
  blurb: 'Strongly typed and object-oriented, the backbone of enterprise software and Android.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'java-hello',
          title: 'Classes & the main method',
          xp: 50,
          theory: `Every Java program lives inside a **class**. Execution starts in the \`main\` method, whose signature never changes:

\`public static void main(String[] args)\`

Print with \`System.out.println("text");\`. Statements end with a semicolon, and blocks use curly braces.`,
          example: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}`,
          quiz: [
            { q: 'What is the entry point method of a Java application?', o: ['run()', 'start()', 'main()', 'execute()'], a: 2, why: 'The JVM starts your program in `public static void main(String[] args)`.' },
            { q: 'Which statement prints a line of text?', o: ['print("x");', 'System.out.println("x");', 'console.log("x");', 'echo "x";'], a: 1, why: '`System.out.println` writes a line to standard output.' },
          ],
          task: {
            text: 'Print `Hello, Java!` from the `main` method.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // print here\n    }\n}\n',
            expected: 'Hello, Java!',
            checks: [
              { desc: 'Has a main method with the standard signature', re: R`public\s+static\s+void\s+main\s*\(\s*String\s*(\[\s*\]\s*\w+|\w+\s*\[\s*\])\s*\)` },
              { desc: 'Prints "Hello, Java!" with System.out.println', re: R`System\.out\.println\s*\(\s*"Hello, Java!"\s*\)\s*;` },
            ],
            hints: ['The println call goes inside the main method braces.', 'Text in Java uses double quotes.', 'System.out.println("Hello, Java!");'],
            solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
          },
        },
        {
          id: 'java-types',
          title: 'Variables & types',
          xp: 75,
          theory: `Java is **statically typed**: you declare each variable's type, and the compiler checks it.

- \`int\` whole numbers, \`double\` decimals, \`boolean\`, \`char\`
- \`String\` is text (capital S; it is a class)
- \`final\` makes a variable a constant

Join text and values with \`+\`: \`"Age: " + age\`.`,
          example: `int age = 20;
String name = "Ana";
System.out.println(name + " is " + age);`,
          quiz: [
            { q: 'Which type stores whole numbers?', o: ['double', 'int', 'String', 'boolean'], a: 1, why: '`int` holds 32-bit whole numbers.' },
            { q: 'Java is statically typed. What does that mean?', o: ['Types are checked at compile time', 'Variables have no types', 'You cannot use numbers', 'Types change at runtime'], a: 0, why: 'The compiler rejects type mistakes before the program ever runs.' },
          ],
          task: {
            text: 'Inside `main`, declare an `int` named `age` set to `20` and a `String` named `name` set to `"Ana"`, then print `Ana is 20` using `+`.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // declare age and name, then print\n    }\n}\n',
            expected: 'Ana is 20',
            checks: [
              { desc: 'Declares int age = 20', re: R`int\s+age\s*=\s*20\s*;` },
              { desc: 'Declares String name = "Ana"', re: R`String\s+name\s*=\s*"Ana"\s*;` },
              { desc: 'Prints with System.out.println', re: R`System\.out\.println\s*\(` },
              { desc: 'Joins name, " is " and age with +', re: R`name\s*\+\s*" is "\s*\+\s*age` },
            ],
            hints: ['Two declarations first: the type comes before the name.', 'String is written with a capital S.', 'System.out.println(name + " is " + age);'],
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int age = 20;\n        String name = "Ana";\n        System.out.println(name + " is " + age);\n    }\n}',
          },
        },
        {
          id: 'java-methods',
          title: 'Methods',
          xp: 100,
          theory: `A **method** is a named block of code that can take parameters and return a value. Its signature lists the return type first:

\`static int square(int n) { return n * n; }\`

\`static\` lets \`main\` call it without creating an object. A method that returns nothing uses \`void\`. Call it by name: \`square(7)\`.`,
          example: `static int square(int n) {
    return n * n;
}`,
          quiz: [
            { q: 'What does the `int` in `static int square(int n)` describe?', o: ['The return type', 'The parameter name', 'The class name', 'The number of calls'], a: 0, why: 'The type before the method name is what the method returns.' },
            { q: 'Which keyword do you use for a method that returns nothing?', o: ['null', 'void', 'empty', 'none'], a: 1, why: '`void` means no return value.' },
          ],
          task: {
            text: 'Add a method `static int square(int n)` that returns `n * n`, and call it from `main` to print `square(7)` (which is `49`).',
            starter: 'public class Main {\n    // add square here\n\n    public static void main(String[] args) {\n        // print square(7)\n    }\n}\n',
            expected: '49',
            checks: [
              { desc: 'Declares static int square(int n)', re: R`static\s+int\s+square\s*\(\s*int\s+\w+\s*\)` },
              { desc: 'The method returns n * n', re: R`return\s+(\w+)\s*\*\s*\1\s*;` },
              { desc: 'main prints square(7)', re: R`System\.out\.println\s*\(\s*square\s*\(\s*7\s*\)\s*\)` },
            ],
            hints: ['The signature is already spelled out in the task.', 'Inside the method: return n * n;', 'System.out.println(square(7));'],
            solution: 'public class Main {\n    static int square(int n) {\n        return n * n;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(square(7));\n    }\n}',
          },
        },
      ],
      capstone: {
        id: 'java-cap-1',
        title: 'Capstone: Sum with a loop',
        summary: 'Loops, variables and printing in one program.',
        task: {
          text: 'Use a `for` loop to add the numbers `1` to `10` into an `int sum`, then print `Sum: 55`.',
          starter: 'public class Main {\n    public static void main(String[] args) {\n        // loop and print\n    }\n}\n',
          expected: 'Sum: 55',
          checks: [
            { desc: 'Declares int sum starting at 0', re: R`int\s+sum\s*=\s*0\s*;` },
            { desc: 'Uses a for loop', re: R`for\s*\(` },
            { desc: 'Adds to sum inside the loop', re: R`sum\s*(\+=|=\s*sum\s*\+)` },
            { desc: 'Prints "Sum: " followed by sum', re: R`System\.out\.println\s*\(\s*"Sum: "\s*\+\s*sum\s*\)` },
          ],
          hints: ['Start with int sum = 0; before the loop.', 'for (int i = 1; i <= 10; i++) { ... }', 'Inside: sum += i; then print after the loop.'],
          solution: 'public class Main {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            sum += i;\n        }\n        System.out.println("Sum: " + sum);\n    }\n}',
        },
      },
    },
  ],
};
