<<<<<<< HEAD
// Every DSA task can be solved in JavaScript, Python or Java. Values keyed by language are picked at runtime.
// Java works like the other compiled courses: your code goes in `class Solution`, a hidden `Main` calls it.
// It is verified by pattern checks, and executed for real when a code runner is connected (see Settings).
const R = String.raw;
const javaSig = (ret, name, params) => R`static\s+${ret}\s+${name}\s*\(\s*${params}\s*\)`;
const noArraysSort = { desc: 'Does not use the built-in Arrays.sort', re: R`^(?![\s\S]*Arrays\s*\.\s*sort\s*\()`, flags: '' };

=======
// Every DSA task can be solved in JavaScript or Python. Values keyed by language are picked at runtime.
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
export default {
  id: 'dsa',
  title: 'Data Structures & Algorithms',
  short: 'DSA',
  hue: '#D8A4F5',
  icon: 'network',
<<<<<<< HEAD
  langs: ['javascript', 'python', 'java'],
  blurb: 'Searching, stacks, hash maps and sorting. Solve each problem in JavaScript, Python or Java.',
=======
  langs: ['javascript', 'python'],
  blurb: 'Searching, stacks, hash maps and sorting. Solve each problem in JavaScript or Python.',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'dsa-linear',
          title: 'Linear search & Big-O',
          xp: 50,
          theory: `**Linear search** checks every item, in order, until it finds the target. It works on any list.

**Big-O** describes how the work grows as the input grows. Linear search is **O(n)**: double the list, double the worst-case work. Constant-time operations such as reading \`arr[3]\` are **O(1)**.

Big-O ignores exact timings and constants. It answers "how does this scale?".`,
          example: {
            javascript: 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}\nconsole.log(linearSearch([10, 20, 30], 20));',
            python: 'def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1\n\nprint(linear_search([10, 20, 30], 20))',
<<<<<<< HEAD
            java: 'static int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          quiz: [
            { q: 'What is the worst-case time complexity of linear search on n items?', o: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], a: 2, why: 'In the worst case every item is checked once.' },
            { q: 'What does Big-O describe?', o: ['How the work grows as the input grows', 'Exactly how many milliseconds a program takes', 'How many lines the code has', 'The size of the memory address'], a: 0, why: 'Big-O is about growth rate, not exact timing.' },
          ],
          task: {
<<<<<<< HEAD
            text: 'Write a linear search that returns the index of `target` in the list, or `-1` if it is missing. Do not use the built-in `indexOf` / `index`. In Java, write the method inside the provided `class Solution`; a hidden `Main` class calls it.',
            starter: {
              javascript: 'function linearSearch(arr, target) {\n  // check each item in order\n}\n',
              python: 'def linear_search(arr, target):\n    # check each item in order\n    pass\n',
              java: 'class Solution {\n    static int linearSearch(int[] arr, int target) {\n        // check each item in order\n        return -1;\n    }\n}\n',
=======
            text: 'Write a linear search that returns the index of `target` in the list, or `-1` if it is missing. Do not use the built-in `indexOf` / `index`.',
            starter: {
              javascript: 'function linearSearch(arr, target) {\n  // check each item in order\n}\n',
              python: 'def linear_search(arr, target):\n    # check each item in order\n    pass\n',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
            harness: {
              javascript: 'console.log(linearSearch([5, 15, 30, 45], 30));\nconsole.log(linearSearch([5, 15], 99));\nconsole.log(linearSearch([], 1));',
              python: 'print(linear_search([5, 15, 30, 45], 30))\nprint(linear_search([5, 15], 99))\nprint(linear_search([], 1))',
<<<<<<< HEAD
              java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Solution.linearSearch(new int[]{5, 15, 30, 45}, 30));\n        System.out.println(Solution.linearSearch(new int[]{5, 15}, 99));\n        System.out.println(Solution.linearSearch(new int[]{}, 1));\n    }\n}',
            },
            expected: '2\n-1\n-1',
            checks: {
              java: [
                { desc: 'Declares static int linearSearch(int[] arr, int target)', re: javaSig('int', 'linearSearch', R`int\s*\[\s*\]\s*\w+\s*,\s*int\s+\w+`) },
                { desc: 'Loops over the array', re: R`\b(for|while)\s*\(` },
                { desc: 'Compares each item with the target using ==', re: R`==` },
                { desc: 'Returns -1 when the target is missing', re: R`return\s+-\s*1\s*;` },
              ],
            },
=======
            },
            expected: '2\n-1\n-1',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            hints: ['Loop over every index of the list.', 'Compare the item at that index with the target.', 'Return the index on a match; return -1 after the loop.'],
            solution: {
              javascript: 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}',
              python: 'def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1',
<<<<<<< HEAD
              java: 'class Solution {\n    static int linearSearch(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) return i;\n        }\n        return -1;\n    }\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
          },
        },
        {
          id: 'dsa-binary',
          title: 'Binary search',
          xp: 100,
          theory: `On a **sorted** list you can do much better than scanning. Look at the middle item:

- equal to the target: done
- target is smaller: search the left half
- target is larger: search the right half

Each step halves the search space, so binary search is **O(log n)**. A million items need about 20 steps. The list **must be sorted**, otherwise the halving logic is meaningless.`,
          example: {
            javascript: 'let lo = 0, hi = arr.length - 1;\nwhile (lo <= hi) {\n  const mid = Math.floor((lo + hi) / 2);\n  // compare arr[mid] with target, then move lo or hi\n}',
            python: 'lo, hi = 0, len(arr) - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    # compare arr[mid] with target, then move lo or hi',
<<<<<<< HEAD
            java: 'int lo = 0, hi = arr.length - 1;\nwhile (lo <= hi) {\n    int mid = (lo + hi) / 2;\n    // compare arr[mid] with target, then move lo or hi\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          quiz: [
            { q: 'What must be true before you can use binary search?', o: ['The list is sorted', 'All items are unique', 'The list is short', 'The items are numbers only'], a: 0, why: 'Halving only works when the order tells you which half to keep.' },
            { q: 'What is the worst-case complexity of binary search?', o: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], a: 1, why: 'The range halves each step, so about log₂(n) steps.' },
          ],
          task: {
            text: 'Write a binary search on a sorted list. Return the index of `target`, or `-1` if it is not there.',
            starter: {
              javascript: 'function binarySearch(sorted, target) {\n  let lo = 0;\n  let hi = sorted.length - 1;\n  // loop while lo <= hi\n  return -1;\n}\n',
              python: 'def binary_search(sorted_list, target):\n    lo, hi = 0, len(sorted_list) - 1\n    # loop while lo <= hi\n    return -1\n',
<<<<<<< HEAD
              java: 'class Solution {\n    static int binarySearch(int[] sorted, int target) {\n        int lo = 0;\n        int hi = sorted.length - 1;\n        // loop while lo <= hi\n        return -1;\n    }\n}\n',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
            harness: {
              javascript: 'const data = [2, 5, 8, 12, 16, 23, 38];\nconsole.log(binarySearch(data, 16));\nconsole.log(binarySearch(data, 2));\nconsole.log(binarySearch(data, 38));\nconsole.log(binarySearch(data, 7));',
              python: 'data = [2, 5, 8, 12, 16, 23, 38]\nprint(binary_search(data, 16))\nprint(binary_search(data, 2))\nprint(binary_search(data, 38))\nprint(binary_search(data, 7))',
<<<<<<< HEAD
              java: 'public class Main {\n    public static void main(String[] args) {\n        int[] data = {2, 5, 8, 12, 16, 23, 38};\n        System.out.println(Solution.binarySearch(data, 16));\n        System.out.println(Solution.binarySearch(data, 2));\n        System.out.println(Solution.binarySearch(data, 38));\n        System.out.println(Solution.binarySearch(data, 7));\n    }\n}',
            },
            expected: '4\n0\n6\n-1',
            checks: {
              java: [
                { desc: 'Declares static int binarySearch(int[] sorted, int target)', re: javaSig('int', 'binarySearch', R`int\s*\[\s*\]\s*\w+\s*,\s*int\s+\w+`) },
                { desc: 'Loops while the search range is not empty', re: R`\bwhile\s*\(` },
                { desc: 'Computes a middle index', re: R`/\s*2|>>>?\s*1` },
                { desc: 'Moves the lower bound past the middle (… = mid + 1)', re: R`=\s*\w+\s*\+\s*1` },
                { desc: 'Moves the upper bound before the middle (… = mid - 1)', re: R`=\s*\w+\s*-\s*1` },
              ],
            },
=======
            },
            expected: '4\n0\n6\n-1',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            hints: ['Compute mid as the floor of (lo + hi) / 2.', 'If the middle equals the target, return mid. If it is smaller than target, set lo = mid + 1.', 'Otherwise set hi = mid - 1.'],
            solution: {
              javascript: 'function binarySearch(sorted, target) {\n  let lo = 0;\n  let hi = sorted.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (sorted[mid] === target) return mid;\n    if (sorted[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
              python: 'def binary_search(sorted_list, target):\n    lo, hi = 0, len(sorted_list) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if sorted_list[mid] == target:\n            return mid\n        if sorted_list[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1',
<<<<<<< HEAD
              java: 'class Solution {\n    static int binarySearch(int[] sorted, int target) {\n        int lo = 0;\n        int hi = sorted.length - 1;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (sorted[mid] == target) return mid;\n            if (sorted[mid] < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        return -1;\n    }\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
          },
        },
        {
          id: 'dsa-stack',
          title: 'Stacks',
          xp: 100,
          theory: `A **stack** is last in, first out (**LIFO**), like a pile of plates. The two core operations are **push** (add on top) and **pop** (remove from the top). Both are O(1).

Stacks power undo history, the browser back button, the call stack that tracks function calls, and bracket matching in code editors.

<<<<<<< HEAD
A JavaScript array or Python list works as a stack: \`push\` / \`pop\` or \`append\` / \`pop\`. In Java use \`Deque<Character> stack = new ArrayDeque<>();\` with \`push\` and \`pop\`.`,
          example: {
            javascript: 'const stack = [];\nstack.push(1);\nstack.push(2);\nconsole.log(stack.pop());',
            python: 'stack = []\nstack.append(1)\nstack.append(2)\nprint(stack.pop())',
            java: 'Deque<Integer> stack = new ArrayDeque<>();\nstack.push(1);\nstack.push(2);\nSystem.out.println(stack.pop());',
=======
A JavaScript array or Python list works as a stack: \`push\` / \`pop\` or \`append\` / \`pop\`.`,
          example: {
            javascript: 'const stack = [];\nstack.push(1);\nstack.push(2);\nconsole.log(stack.pop());',
            python: 'stack = []\nstack.append(1)\nstack.append(2)\nprint(stack.pop())',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          quiz: [
            { q: 'In which order does a stack remove items?', o: ['Last in, first out', 'First in, first out', 'Smallest first', 'Random order'], a: 0, why: 'The most recently pushed item is popped first.' },
            { q: 'Which is a real-world use of a stack?', o: ['An undo history', 'A print queue', 'A sorted phone book', 'A hash table'], a: 0, why: 'Undo reverses the most recent action first, which is LIFO.' },
          ],
          task: {
            text: 'Write `isBalanced(s)` / `is_balanced(s)` that returns true when every bracket in `()[]{}` is closed in the right order. Use a stack.',
            starter: {
              javascript: 'function isBalanced(s) {\n  const stack = [];\n  // push openers, pop and compare on closers\n  return stack.length === 0;\n}\n',
              python: 'def is_balanced(s):\n    stack = []\n    # push openers, pop and compare on closers\n    return len(stack) == 0\n',
<<<<<<< HEAD
              java: 'import java.util.*;\n\nclass Solution {\n    static boolean isBalanced(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        // push openers, pop and compare on closers\n        return stack.isEmpty();\n    }\n}\n',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
            harness: {
              javascript: 'console.log(isBalanced("([]{})"));\nconsole.log(isBalanced("([)]"));\nconsole.log(isBalanced("(("));\nconsole.log(isBalanced(""));',
              python: 'print(is_balanced("([]{})"))\nprint(is_balanced("([)]"))\nprint(is_balanced("(("))\nprint(is_balanced(""))',
<<<<<<< HEAD
              java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Solution.isBalanced("([]{})"));\n        System.out.println(Solution.isBalanced("([)]"));\n        System.out.println(Solution.isBalanced("(("));\n        System.out.println(Solution.isBalanced(""));\n    }\n}',
            },
            expected: { javascript: 'true\nfalse\nfalse\ntrue', python: 'True\nFalse\nFalse\nTrue', java: 'true\nfalse\nfalse\ntrue' },
            checks: {
              java: [
                { desc: 'Declares static boolean isBalanced(String s)', re: javaSig('boolean', 'isBalanced', R`String\s+\w+`) },
                { desc: 'Uses a stack (Deque, ArrayDeque or Stack)', re: R`\b(Deque|ArrayDeque|Stack)\s*<` },
                { desc: 'Pushes opening brackets', re: R`\.push\s*\(` },
                { desc: 'Pops to match closing brackets', re: R`\.pop\s*\(` },
                { desc: 'Ends by checking the stack is empty', re: R`\.isEmpty\s*\(\s*\)` },
              ],
            },
=======
            },
            expected: { javascript: 'true\nfalse\nfalse\ntrue', python: 'True\nFalse\nFalse\nTrue' },
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            hints: ['Map each closer to its opener: ")" to "(" and so on.', 'Push openers. On a closer, pop and check it matches; an empty stack means unbalanced.', 'At the end the stack must be empty.'],
            solution: {
              javascript: 'function isBalanced(s) {\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n  const stack = [];\n  for (const ch of s) {\n    if ("([{".includes(ch)) stack.push(ch);\n    else if (pairs[ch]) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}',
              python: 'def is_balanced(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return len(stack) == 0',
<<<<<<< HEAD
              java: "import java.util.*;\n\nclass Solution {\n    static boolean isBalanced(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char ch : s.toCharArray()) {\n            if (ch == '(' || ch == '[' || ch == '{') {\n                stack.push(ch);\n            } else if (ch == ')' || ch == ']' || ch == '}') {\n                if (stack.isEmpty()) return false;\n                char open = stack.pop();\n                if ((ch == ')' && open != '(') || (ch == ']' && open != '[') || (ch == '}' && open != '{')) return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}",
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
          },
        },
      ],
      capstone: {
        id: 'dsa-cap-1',
        title: 'Capstone: Anagram checker',
        summary: 'Count letters with a hash map and compare, an O(n) alternative to sorting.',
        task: {
<<<<<<< HEAD
          text: 'Write `isAnagram(a, b)` / `is_anagram(a, b)`: true when both words use exactly the same letters the same number of times, ignoring case. (Java: letters a–z only.)',
          starter: {
            javascript: 'function isAnagram(a, b) {\n  // count the letters of each word\n}\n',
            python: 'def is_anagram(a, b):\n    # count the letters of each word\n    pass\n',
            java: 'class Solution {\n    static boolean isAnagram(String a, String b) {\n        // count the letters of each word\n        return false;\n    }\n}\n',
=======
          text: 'Write `isAnagram(a, b)` / `is_anagram(a, b)`: true when both words use exactly the same letters the same number of times, ignoring case.',
          starter: {
            javascript: 'function isAnagram(a, b) {\n  // count the letters of each word\n}\n',
            python: 'def is_anagram(a, b):\n    # count the letters of each word\n    pass\n',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          harness: {
            javascript: 'console.log(isAnagram("listen", "silent"));\nconsole.log(isAnagram("hello", "world"));\nconsole.log(isAnagram("Dusty", "Study"));\nconsole.log(isAnagram("a", "ab"));',
            python: 'print(is_anagram("listen", "silent"))\nprint(is_anagram("hello", "world"))\nprint(is_anagram("Dusty", "Study"))\nprint(is_anagram("a", "ab"))',
<<<<<<< HEAD
            java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Solution.isAnagram("listen", "silent"));\n        System.out.println(Solution.isAnagram("hello", "world"));\n        System.out.println(Solution.isAnagram("Dusty", "Study"));\n        System.out.println(Solution.isAnagram("a", "ab"));\n    }\n}',
          },
          expected: { javascript: 'true\nfalse\ntrue\nfalse', python: 'True\nFalse\nTrue\nFalse', java: 'true\nfalse\ntrue\nfalse' },
          checks: {
            java: [
              { desc: 'Declares static boolean isAnagram(String a, String b)', re: javaSig('boolean', 'isAnagram', R`String\s+\w+\s*,\s*String\s+\w+`) },
              { desc: 'Ignores case with toLowerCase()', re: R`\.toLowerCase\s*\(` },
              { desc: 'Counts letters (an int[26] or a Map)', re: R`new\s+int\s*\[\s*26\s*\]|\bMap\s*<|HashMap` },
              { desc: 'Loops over the characters', re: R`\bfor\s*\(` },
            ],
          },
=======
          },
          expected: { javascript: 'true\nfalse\ntrue\nfalse', python: 'True\nFalse\nTrue\nFalse' },
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          hints: ['Lowercase both words first.', 'Words of different length can never be anagrams.', 'Build a count map for a, then subtract counts using b; every count must end at 0.'],
          solution: {
            javascript: 'function isAnagram(a, b) {\n  a = a.toLowerCase();\n  b = b.toLowerCase();\n  if (a.length !== b.length) return false;\n  const counts = {};\n  for (const ch of a) counts[ch] = (counts[ch] || 0) + 1;\n  for (const ch of b) {\n    if (!counts[ch]) return false;\n    counts[ch] -= 1;\n  }\n  return true;\n}',
            python: 'def is_anagram(a, b):\n    a, b = a.lower(), b.lower()\n    if len(a) != len(b):\n        return False\n    counts = {}\n    for ch in a:\n        counts[ch] = counts.get(ch, 0) + 1\n    for ch in b:\n        if not counts.get(ch):\n            return False\n        counts[ch] -= 1\n    return True',
<<<<<<< HEAD
            java: "class Solution {\n    static boolean isAnagram(String a, String b) {\n        a = a.toLowerCase();\n        b = b.toLowerCase();\n        if (a.length() != b.length()) return false;\n        int[] counts = new int[26];\n        for (char ch : a.toCharArray()) counts[ch - 'a']++;\n        for (char ch : b.toCharArray()) {\n            if (--counts[ch - 'a'] < 0) return false;\n        }\n        return true;\n    }\n}",
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'dsa-hash',
          title: 'Hash maps: Two Sum',
          xp: 125,
<<<<<<< HEAD
          theory: `A **hash map** (object / dict / \`HashMap\`) finds a value by key in about **O(1)** time. Trading a little memory for that lookup speed turns many O(n²) nested loops into O(n).
=======
          theory: `A **hash map** (object / dict) finds a value by key in about **O(1)** time. Trading a little memory for that lookup speed turns many O(n²) nested loops into O(n).
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2

**Two Sum:** find two numbers in a list that add up to a target. The brute force checks every pair, O(n²). With a map you remember each number you have seen: for every new number \`x\`, check whether \`target - x\` was already seen.`,
          example: {
            javascript: 'const seen = new Map();\nseen.set(2, 0);\nconsole.log(seen.has(2), seen.get(2));',
            python: 'seen = {}\nseen[2] = 0\nprint(2 in seen, seen[2])',
<<<<<<< HEAD
            java: 'Map<Integer, Integer> seen = new HashMap<>();\nseen.put(2, 0);\nSystem.out.println(seen.containsKey(2) + " " + seen.get(2));',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          quiz: [
            { q: 'What is the average time to look up a key in a hash map?', o: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 0, why: 'Hashing jumps straight to where the key should be stored.' },
            { q: 'What does a hash map trade for its speed?', o: ['Extra memory', 'Accuracy', 'Readability of keys', 'Sorted order'], a: 0, why: 'You store the values you have seen, costing O(n) memory.' },
          ],
          task: {
            text: 'Write `twoSum(nums, target)` / `two_sum(nums, target)` that returns the two indexes `[i, j]` (with `i < j`) whose numbers add up to `target`. Exactly one answer exists.',
            starter: {
              javascript: 'function twoSum(nums, target) {\n  const seen = new Map();\n  // remember each value and its index\n}\n',
              python: 'def two_sum(nums, target):\n    seen = {}\n    # remember each value and its index\n    pass\n',
<<<<<<< HEAD
              java: 'import java.util.*;\n\nclass Solution {\n    static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        // remember each value and its index\n        return new int[]{};\n    }\n}\n',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
            harness: {
              javascript: 'console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));\nconsole.log(JSON.stringify(twoSum([3, 2, 4], 6)));\nconsole.log(JSON.stringify(twoSum([3, 3], 6)));',
              python: 'print(two_sum([2, 7, 11, 15], 9))\nprint(two_sum([3, 2, 4], 6))\nprint(two_sum([3, 3], 6))',
<<<<<<< HEAD
              java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(Solution.twoSum(new int[]{2, 7, 11, 15}, 9)));\n        System.out.println(Arrays.toString(Solution.twoSum(new int[]{3, 2, 4}, 6)));\n        System.out.println(Arrays.toString(Solution.twoSum(new int[]{3, 3}, 6)));\n    }\n}',
            },
            expected: { javascript: '[0,1]\n[1,2]\n[0,1]', python: '[0, 1]\n[1, 2]\n[0, 1]', java: '[0, 1]\n[1, 2]\n[0, 1]' },
            checks: {
              java: [
                { desc: 'Declares static int[] twoSum(int[] nums, int target)', re: javaSig(R`int\s*\[\s*\]`, 'twoSum', R`int\s*\[\s*\]\s*\w+\s*,\s*int\s+\w+`) },
                { desc: 'Uses a HashMap to remember values', re: R`\b(Hash)?Map\s*<` },
                { desc: 'Stores each value with its index (put)', re: R`\.put\s*\(` },
                { desc: 'Looks for the partner value (containsKey or get)', re: R`\.(containsKey|get)\s*\(` },
                { desc: 'Returns the pair of indexes as an int array', re: R`return\s+new\s+int\s*\[\s*\]\s*\{\s*[^}]+\}` },
              ],
            },
=======
            },
            expected: { javascript: '[0,1]\n[1,2]\n[0,1]', python: '[0, 1]\n[1, 2]\n[0, 1]' },
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            hints: ['For each number, compute the partner: target - number.', 'If the partner is already in the map, you found the pair.', 'Otherwise store the current number with its index and continue.'],
            solution: {
              javascript: 'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}',
              python: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i\n    return []',
<<<<<<< HEAD
              java: 'import java.util.*;\n\nclass Solution {\n    static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
          },
        },
        {
          id: 'dsa-sort',
          title: 'Merge sort',
          xp: 150,
          theory: `**Merge sort** uses divide and conquer:

1. Split the list in half
2. Sort each half (recursively)
3. **Merge** the two sorted halves by repeatedly taking the smaller front item

Splitting takes log n levels and each level does O(n) merging work, so the total is **O(n log n)**, far better than the O(n²) of simple sorts on big inputs. Lists of length 0 or 1 are already sorted: that is the base case.`,
          example: {
            javascript: 'const left = [1, 4];\nconst right = [2, 3];\n// merge => [1, 2, 3, 4]',
            python: 'left = [1, 4]\nright = [2, 3]\n# merge => [1, 2, 3, 4]',
<<<<<<< HEAD
            java: 'int[] left = {1, 4};\nint[] right = {2, 3};\n// merge => [1, 2, 3, 4]',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          quiz: [
            { q: 'What is the time complexity of merge sort?', o: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], a: 1, why: 'log n levels of splitting, with O(n) merging at each level.' },
            { q: 'What is the base case of merge sort?', o: ['A list of length 0 or 1', 'A list of length 2', 'A list that is reversed', 'A list of even length'], a: 0, why: 'A list with at most one item is already sorted.' },
          ],
          task: {
<<<<<<< HEAD
            text: 'Implement merge sort: return a **new** sorted list. Do not call the built-in `sort` / `sorted` / `Arrays.sort`.',
            starter: {
              javascript: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  // split, sort each half, then merge\n}\n',
              python: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    # split, sort each half, then merge\n',
              java: 'import java.util.*;\n\nclass Solution {\n    static int[] mergeSort(int[] arr) {\n        if (arr.length <= 1) return arr;\n        // split, sort each half, then merge\n        return arr;\n    }\n}\n',
=======
            text: 'Implement merge sort: return a **new** sorted list. Do not call the built-in `sort` / `sorted`.',
            starter: {
              javascript: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  // split, sort each half, then merge\n}\n',
              python: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    # split, sort each half, then merge\n',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
            harness: {
              javascript: 'console.log(mergeSort([5, 2, 9, 1, 5, 6]).join(","));\nconsole.log(mergeSort([]).length);\nconsole.log(mergeSort([3]).join(","));\nconsole.log(mergeSort([4, 3, 2, 1]).join(","));',
              python: 'print(merge_sort([5, 2, 9, 1, 5, 6]))\nprint(len(merge_sort([])))\nprint(merge_sort([3]))\nprint(merge_sort([4, 3, 2, 1]))',
<<<<<<< HEAD
              java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(Solution.mergeSort(new int[]{5, 2, 9, 1, 5, 6})));\n        System.out.println(Solution.mergeSort(new int[]{}).length);\n        System.out.println(Arrays.toString(Solution.mergeSort(new int[]{3})));\n        System.out.println(Arrays.toString(Solution.mergeSort(new int[]{4, 3, 2, 1})));\n    }\n}',
            },
            expected: { javascript: '1,2,5,5,6,9\n0\n3\n1,2,3,4', python: '[1, 2, 5, 5, 6, 9]\n0\n[3]\n[1, 2, 3, 4]', java: '[1, 2, 5, 5, 6, 9]\n0\n[3]\n[1, 2, 3, 4]' },
            checks: {
              java: [
                { desc: 'Declares static int[] mergeSort(int[] arr)', re: javaSig(R`int\s*\[\s*\]`, 'mergeSort', R`int\s*\[\s*\]\s*\w+`) },
                { desc: 'Calls itself recursively on both halves', re: R`mergeSort\s*\([\s\S]*mergeSort\s*\([\s\S]*mergeSort\s*\(` },
                { desc: 'Merges with a loop', re: R`\bwhile\s*\(` },
                noArraysSort,
              ],
            },
=======
            },
            expected: { javascript: '1,2,5,5,6,9\n0\n3\n1,2,3,4', python: '[1, 2, 5, 5, 6, 9]\n0\n[3]\n[1, 2, 3, 4]' },
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            hints: ['Find the midpoint and recurse on both halves.', 'Merge with two pointers, always taking the smaller front item.', 'After one side runs out, append what is left of the other side.'],
            solution: {
              javascript: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const out = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) out.push(left[i++]);\n    else out.push(right[j++]);\n  }\n  return out.concat(left.slice(i), right.slice(j));\n}',
              python: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i])\n            i += 1\n        else:\n            out.append(right[j])\n            j += 1\n    return out + left[i:] + right[j:]',
<<<<<<< HEAD
              java: 'import java.util.*;\n\nclass Solution {\n    static int[] mergeSort(int[] arr) {\n        if (arr.length <= 1) return arr;\n        int mid = arr.length / 2;\n        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));\n        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));\n        int[] out = new int[arr.length];\n        int i = 0, j = 0, k = 0;\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) out[k++] = left[i++];\n            else out[k++] = right[j++];\n        }\n        while (i < left.length) out[k++] = left[i++];\n        while (j < right.length) out[k++] = right[j++];\n        return out;\n    }\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
            },
          },
        },
      ],
      capstone: {
        id: 'dsa-cap-2',
        title: 'Capstone: Longest unique substring',
        summary: 'A sliding window with a set, a favourite interview pattern.',
        task: {
          text: 'Write `lengthOfLongestSubstring(s)` / `length_of_longest_substring(s)`: the length of the longest run of characters with no repeats.',
          starter: {
            javascript: 'function lengthOfLongestSubstring(s) {\n  // sliding window with a Set\n}\n',
            python: 'def length_of_longest_substring(s):\n    # sliding window with a set\n    pass\n',
<<<<<<< HEAD
            java: 'import java.util.*;\n\nclass Solution {\n    static int lengthOfLongestSubstring(String s) {\n        Set<Character> seen = new HashSet<>();\n        // sliding window: grow right, shrink left on a repeat\n        return 0;\n    }\n}\n',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
          harness: {
            javascript: 'console.log(lengthOfLongestSubstring("abcabcbb"));\nconsole.log(lengthOfLongestSubstring("bbbbb"));\nconsole.log(lengthOfLongestSubstring("pwwkew"));\nconsole.log(lengthOfLongestSubstring(""));',
            python: 'print(length_of_longest_substring("abcabcbb"))\nprint(length_of_longest_substring("bbbbb"))\nprint(length_of_longest_substring("pwwkew"))\nprint(length_of_longest_substring(""))',
<<<<<<< HEAD
            java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Solution.lengthOfLongestSubstring("abcabcbb"));\n        System.out.println(Solution.lengthOfLongestSubstring("bbbbb"));\n        System.out.println(Solution.lengthOfLongestSubstring("pwwkew"));\n        System.out.println(Solution.lengthOfLongestSubstring(""));\n    }\n}',
          },
          expected: '3\n1\n3\n0',
          checks: {
            java: [
              { desc: 'Declares static int lengthOfLongestSubstring(String s)', re: javaSig('int', 'lengthOfLongestSubstring', R`String\s+\w+`) },
              { desc: 'Tracks the window with a Set', re: R`\b(Hash)?Set\s*<` },
              { desc: 'Shrinks the window while a repeat exists', re: R`\bwhile\s*\(` },
              { desc: 'Adds and removes characters from the set', re: R`\.add\s*\([\s\S]*\.remove\s*\(|\.remove\s*\([\s\S]*\.add\s*\(` },
              { desc: 'Keeps the best (maximum) window length', re: R`Math\s*\.\s*max\s*\(|\b(best|max|longest|ans|result)\w*\s*=` },
            ],
          },
=======
          },
          expected: '3\n1\n3\n0',
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          hints: ['Keep a window [left, right] and a set of the characters inside it.', 'When s[right] is already in the set, shrink from the left until it is not.', 'Track the biggest window size seen.'],
          solution: {
            javascript: 'function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[left]);\n      left++;\n    }\n    seen.add(s[right]);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
            python: 'def length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        while ch in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(ch)\n        best = max(best, right - left + 1)\n    return best',
<<<<<<< HEAD
            java: 'import java.util.*;\n\nclass Solution {\n    static int lengthOfLongestSubstring(String s) {\n        Set<Character> seen = new HashSet<>();\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (seen.contains(s.charAt(right))) {\n                seen.remove(s.charAt(left));\n                left++;\n            }\n            seen.add(s.charAt(right));\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n}',
=======
>>>>>>> 371730ca95702596b08c0837fab63c3e412a30a2
          },
        },
      },
    },
  ],
};
