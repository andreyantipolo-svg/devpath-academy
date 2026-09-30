// Every SQL task runs against this fresh in-memory SQLite database (via sql.js).
const SETUP = `
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, city TEXT, score INTEGER);
INSERT INTO students VALUES (1,'Ana','Manila',92),(2,'Ben','Cebu',78),(3,'Carla','Davao',85),(4,'Dev','Manila',64),(5,'Eli','Cebu',91),(6,'Faye','Manila',73);
CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, language TEXT);
INSERT INTO courses VALUES (1,'Intro to JS','JavaScript'),(2,'Python Basics','Python'),(3,'SQL Essentials','SQL');
CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, finished INTEGER);
INSERT INTO enrollments VALUES (1,1,1),(1,2,1),(2,1,0),(3,2,1),(3,3,0),(4,3,0),(5,1,1),(5,2,1),(5,3,1),(6,2,0);
`;

const SCHEMA = `Tables in this database:
- students(id, name, city, score)
- courses(id, title, language)
- enrollments(student_id, course_id, finished)  (finished is 1 or 0)`;

export default {
  id: 'sql',
  title: 'SQL',
  hue: '#2DD4BF',
  icon: 'database',
  langs: ['sql'],
  setup: SETUP,
  schema: SCHEMA,
  blurb: 'Ask questions of real data. Queries run on a live SQLite database in your browser.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'sql-select',
          title: 'SELECT: reading data',
          xp: 50,
          theory: `A database stores information in **tables**. A table has **columns** (fields) and **rows** (records).

\`SELECT\` chooses which columns to read and \`FROM\` says which table: \`SELECT name, city FROM students;\`

\`SELECT *\` means "every column". End statements with a semicolon.

${SCHEMA}`,
          example: 'SELECT name, city FROM students;',
          quiz: [
            { q: 'Which clause names the table you are reading from?', o: ['FROM', 'TABLE', 'WHERE', 'SOURCE'], a: 0, why: '`FROM` points at the table.' },
            { q: 'What does `SELECT *` return?', o: ['Only the first column', 'All columns', 'Only the first row', 'The name of the table'], a: 1, why: 'The star is shorthand for every column.' },
          ],
          task: {
            text: 'Select the `name` and `score` of every student.',
            starter: '-- Write your query below\n',
            expected: 'Ana | 92\nBen | 78\nCarla | 85\nDev | 64\nEli | 91\nFaye | 73',
            hints: ['You need two columns separated by a comma.', 'The table is students.', 'SELECT name, score FROM students;'],
            solution: 'SELECT name, score FROM students;',
          },
        },
        {
          id: 'sql-where',
          title: 'Filtering with WHERE',
          xp: 75,
          theory: `\`WHERE\` keeps only the rows that match a condition.

- Compare with \`=\`, \`<>\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- Combine with \`AND\`, \`OR\`, \`NOT\`
- \`IN ('Cebu', 'Davao')\` matches any value in a list
- \`LIKE 'A%'\` matches text that starts with A

Text values use single quotes: \`city = 'Manila'\`.`,
          example: "SELECT name FROM students WHERE city = 'Cebu';",
          quiz: [
            { q: 'Which keyword filters rows?', o: ['FILTER', 'WHERE', 'HAVING ROWS', 'ONLY'], a: 1, why: '`WHERE` is evaluated per row, before anything is returned.' },
            { q: 'How do you write the text Manila in SQL?', o: ['"Manila" only', "'Manila'", '[Manila]', 'Manila'], a: 1, why: 'Standard SQL text literals use single quotes.' },
          ],
          task: {
            text: 'List the names of students who live in Manila and scored above 70.',
            starter: '-- Manila AND score > 70\n',
            expected: 'Ana\nFaye',
            hints: ['Two conditions must both be true, so join them with AND.', "city = 'Manila' is one condition.", "SELECT name FROM students WHERE city = 'Manila' AND score > 70;"],
            solution: "SELECT name FROM students WHERE city = 'Manila' AND score > 70;",
          },
        },
        {
          id: 'sql-order',
          title: 'Sorting & limiting',
          xp: 75,
          theory: `\`ORDER BY column\` sorts results. Add \`DESC\` for highest first; the default is ascending.

\`LIMIT n\` returns only the first n rows, which is perfect for "top 3" questions.

Order of clauses: \`SELECT … FROM … WHERE … ORDER BY … LIMIT …\``,
          example: 'SELECT name, score FROM students ORDER BY score DESC LIMIT 2;',
          quiz: [
            { q: 'How do you sort from highest to lowest?', o: ['ORDER BY score', 'ORDER BY score DESC', 'SORT score HIGH', 'ORDER score DOWN'], a: 1, why: '`DESC` reverses the default ascending order.' },
            { q: 'What does LIMIT 3 do?', o: ['Returns rows with id 3', 'Returns at most 3 rows', 'Skips 3 rows', 'Adds 3 to each value'], a: 1, why: 'LIMIT caps the number of rows returned.' },
          ],
          task: {
            text: 'Show the top 3 students by score: their `name` and `score`, highest first.',
            starter: '-- ORDER BY ... DESC and LIMIT\n',
            expected: 'Ana | 92\nEli | 91\nCarla | 85',
            hints: ['Sort by score in descending order.', 'Then keep only three rows.', 'SELECT name, score FROM students ORDER BY score DESC LIMIT 3;'],
            solution: 'SELECT name, score FROM students ORDER BY score DESC LIMIT 3;',
          },
        },
      ],
      capstone: {
        id: 'sql-cap-1',
        title: 'Capstone: Honour roll',
        summary: 'Filter and sort together to build a real report.',
        task: {
          text: 'Return the names of students who scored 75 or more, sorted alphabetically.',
          starter: '-- filter, then sort\n',
          expected: 'Ana\nBen\nCarla\nEli',
          hints: ['Filter with WHERE score >= 75.', 'Sort names with ORDER BY name.', 'SELECT name FROM students WHERE score >= 75 ORDER BY name;'],
          solution: 'SELECT name FROM students WHERE score >= 75 ORDER BY name;',
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'sql-aggregate',
          title: 'Aggregates & GROUP BY',
          xp: 100,
          theory: `Aggregate functions summarise many rows into one value: \`COUNT(*)\`, \`SUM(x)\`, \`AVG(x)\`, \`MIN(x)\`, \`MAX(x)\`.

\`GROUP BY column\` makes one summary row per distinct value of that column. \`HAVING\` filters groups, the way \`WHERE\` filters rows.

Give results a friendly name with \`AS\`, and use \`ROUND(x, 2)\` for tidy decimals.`,
          example: 'SELECT city, ROUND(AVG(score), 1) AS average FROM students GROUP BY city;',
          quiz: [
            { q: 'Which clause creates one result row per city?', o: ['ORDER BY city', 'GROUP BY city', 'WHERE city', 'LIMIT city'], a: 1, why: '`GROUP BY` collapses rows that share a value.' },
            { q: 'What does COUNT(*) return?', o: ['The number of columns', 'The number of rows in the group', 'The largest value', 'The sum of all values'], a: 1, why: 'COUNT(*) counts rows.' },
          ],
          task: {
            text: 'For each city, show the city and the number of students (call it `total`), ordered by city.',
            starter: '-- GROUP BY city\n',
            expected: 'Cebu | 2\nDavao | 1\nManila | 3',
            hints: ['COUNT(*) AS total counts students per group.', 'Add GROUP BY city.', 'SELECT city, COUNT(*) AS total FROM students GROUP BY city ORDER BY city;'],
            solution: 'SELECT city, COUNT(*) AS total FROM students GROUP BY city ORDER BY city;',
          },
        },
        {
          id: 'sql-join',
          title: 'Joins',
          xp: 125,
          theory: `Real data is split across tables. A **JOIN** connects them through a shared column.

\`SELECT s.name, c.title FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id;\`

\`JOIN\` (an inner join) keeps only rows with a match on both sides. \`LEFT JOIN\` keeps every row from the left table even when there is no match. Table aliases (\`s\`, \`c\`, \`e\`) keep queries short.`,
          example: `SELECT s.name, e.finished
FROM enrollments e
JOIN students s ON s.id = e.student_id
WHERE e.course_id = 1;`,
          quiz: [
            { q: 'What does the ON part of a JOIN describe?', o: ['Which columns to sort by', 'How rows from the two tables match', 'How many rows to return', 'Which database to use'], a: 1, why: '`ON` states the matching rule, usually primary key = foreign key.' },
            { q: 'Which join keeps every row of the left table, even without a match?', o: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN only', 'MATCH JOIN'], a: 1, why: 'LEFT JOIN fills the missing side with NULL.' },
          ],
          task: {
            text: 'List each student\'s `name` and the `title` of every course they finished (`finished = 1`), ordered by name and then title.',
            starter: '-- join enrollments, students and courses\n',
            expected: 'Ana | Intro to JS\nAna | Python Basics\nCarla | Python Basics\nEli | Intro to JS\nEli | Python Basics\nEli | SQL Essentials',
            hints: ['Start from enrollments and JOIN students and courses.', 'Filter with WHERE e.finished = 1.', 'ORDER BY s.name, c.title'],
            solution: 'SELECT s.name, c.title\nFROM enrollments e\nJOIN students s ON s.id = e.student_id\nJOIN courses c ON c.id = e.course_id\nWHERE e.finished = 1\nORDER BY s.name, c.title;',
          },
        },
      ],
      capstone: {
        id: 'sql-cap-2',
        title: 'Capstone: Course completion report',
        summary: 'Join, filter, group and sort: the full analyst toolkit.',
        task: {
          text: 'For each course show its `title` and how many students finished it (call it `finishers`). Most finishers first; break ties by title.',
          starter: '-- join, filter finished, group, sort\n',
          expected: 'Python Basics | 3\nIntro to JS | 2\nSQL Essentials | 1',
          hints: ['Join enrollments to courses and keep finished = 1.', 'GROUP BY the course title and COUNT(*).', 'ORDER BY finishers DESC, title'],
          solution: 'SELECT c.title, COUNT(*) AS finishers\nFROM enrollments e\nJOIN courses c ON c.id = e.course_id\nWHERE e.finished = 1\nGROUP BY c.title\nORDER BY finishers DESC, c.title;',
        },
      },
    },
  ],
};
