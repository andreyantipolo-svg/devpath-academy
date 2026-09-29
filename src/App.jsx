import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Code, Trophy, Shield, CheckCircle2, XCircle, Play, 
  Terminal, Award, Lock, ChevronRight, RotateCcw, Sparkles, AlertCircle,
  Cpu, Flame, Check, RefreshCw, Layout, Database, FileCode
} from 'lucide-react';

// --- CURRICULUM TRACKS & LEVEL STRUCTURE ---
const TRACKS = {
  js: {
    id: 'js',
    title: 'JavaScript',
    icon: Code,
    description: 'Master core programming logic, dynamic web scripting, and modern ES6+ concepts.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'js-1',
            title: 'Variables & Data Types',
            xp: 50,
            theory: 'In JavaScript, variables store data values. Use `let` for variables that change, `const` for constants, and `var` (legacy). Data types include numbers, strings, booleans, objects, and null/undefined.',
            exampleCode: 'let userAge = 18;\nconst platform = "DevPath";\nconsole.log(platform + " user age is " + userAge);',
            quiz: {
              question: 'Which keyword should you use for a variable whose value will NOT change?',
              options: ['let', 'var', 'const', 'static'],
              correct: 2,
              explanation: '`const` creates block-scoped variables that cannot be reassigned once declared.'
            },
            codingTask: {
              instructions: 'Declare a constant named `language` with the value `"JavaScript"` and print it using `console.log(language)`.',
              initialCode: '// Write your code below\n',
              expectedOutput: 'JavaScript'
            }
          },
          {
            id: 'js-2',
            title: 'Conditionals & Logic',
            xp: 75,
            theory: 'Conditional statements run code based on boolean checks (`if`, `else if`, `else`). Use comparison operators like `===` (strict equality) and `!==` (strict inequality).',
            exampleCode: 'let score = 85;\nif (score >= 80) {\n  console.log("Passed");\n} else {\n  console.log("Needs Practice");\n}',
            quiz: {
              question: 'Which operator checks both value AND type equality in JavaScript?',
              options: ['==', '=', '===', '!='],
              correct: 2,
              explanation: 'The strict equality operator `===` evaluates both value and variable type without coercion.'
            },
            codingTask: {
              instructions: 'Write an `if` statement checking if `num` (set to 10) is greater than 5. Print `"Greater"` if true.',
              initialCode: 'let num = 10;\n// Add if statement here\n',
              expectedOutput: 'Greater'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Simple Grading Algorithm',
          instructions: 'Create a script that evaluates a student score (let score = 92). If score >= 90 print "A", if score >= 80 print "B", otherwise print "C".',
          initialCode: 'let score = 92;\n// Write logic to evaluate score and log grade\n',
          expectedOutput: 'A'
        }
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        requiredXp: 125,
        lessons: [
          {
            id: 'js-3',
            title: 'Arrays & Functional Iteration',
            xp: 100,
            theory: 'Arrays hold ordered lists. Modern JS utilizes higher-order methods like `.map()`, `.filter()`, and `.reduce()` for clean data transformations.',
            exampleCode: 'const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled.join(","));',
            quiz: {
              question: 'Which array method returns a new array with elements that pass a test condition?',
              options: ['.map()', '.filter()', '.forEach()', '.push()'],
              correct: 1,
              explanation: '`.filter()` creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.'
            },
            codingTask: {
              instructions: 'Filter the array `[5, 12, 8, 130, 44]` to keep only numbers greater than 10, then print the result separated by comma using `.join(",")`.',
              initialCode: 'const numbers = [5, 12, 8, 130, 44];\n// Add filter logic\n',
              expectedOutput: '12,130,44'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: E-Commerce Cart Total Calculator',
          instructions: 'Given an array of item prices `[29.99, 9.99, 4.99]`, calculate the total sum using array reduction or loops and log `Total: 44.97`.',
          initialCode: 'const prices = [29.99, 9.99, 4.99];\n// Calculate total\n',
          expectedOutput: 'Total: 44.97'
        }
      }
    ]
  },
  python: {
    id: 'python',
    title: 'Python',
    icon: Terminal,
    description: 'Learn clear syntax, automation, scripting, and data handling with Python concepts.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'py-1',
            title: 'Variables & Output',
            xp: 50,
            theory: 'In Python, variables are created when assigned a value. Use `print()` to output values to the console.',
            exampleCode: 'name = "DevPath"\nprint(name)',
            quiz: {
              question: 'Which function outputs text in Python?',
              options: ['console.log()', 'print()', 'echo()', 'System.out.println()'],
              correct: 1,
              explanation: 'Python uses print() for standard output.'
            },
            codingTask: {
              instructions: 'Declare a variable `status` assigned to `"Active"` and print it.',
              initialCode: 'let status = "Active";\nconsole.log(status);',
              expectedOutput: 'Active'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Value Evaluator',
          instructions: 'Simulate Python conditional evaluation. Given value = 50, print "Pass" if value >= 50 else print "Fail".',
          initialCode: 'let value = 50;\n// Write evaluation logic\n',
          expectedOutput: 'Pass'
        }
      }
    ]
  },
  java: {
    id: 'java',
    title: 'Java',
    icon: Cpu,
    description: 'Understand strongly-typed syntax, object-oriented principles, and class definitions.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'java-1',
            title: 'Classes & Main Method',
            xp: 50,
            theory: 'Java programs are structured around classes and require a `main` entry point for execution.',
            exampleCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}',
            quiz: {
              question: 'What is the entry point method for running a Java application?',
              options: ['run()', 'start()', 'main()', 'execute()'],
              correct: 2,
              explanation: 'Java execution starts inside `public static void main(String[] args)`.'
            },
            codingTask: {
              instructions: 'Simulate printing a string in Java style. Print `"Hello Java"`.',
              initialCode: 'console.log("Hello Java");',
              expectedOutput: 'Hello Java'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: OOP Instantiation Simulation',
          instructions: 'Output `"Class Initialized"` to pass the check.',
          initialCode: 'console.log("Class Initialized");',
          expectedOutput: 'Class Initialized'
        }
      }
    ]
  },
  cpp: {
    id: 'cpp',
    title: 'C++',
    icon: FileCode,
    description: 'Learn systems programming concepts, memory pointers, and high-performance algorithms.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'cpp-1',
            title: 'Output & Headers',
            xp: 50,
            theory: 'C++ relies on `<iostream>` for standard input and output stream operations.',
            exampleCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "C++ Engine" << endl;\n  return 0;\n}',
            quiz: {
              question: 'Which object is used in C++ to send output to the stream?',
              options: ['cout', 'cin', 'print', 'write'],
              correct: 0,
              explanation: '`cout` combined with `<<` sends output to standard console stream.'
            },
            codingTask: {
              instructions: 'Log `"C++ Engine"` to match expected execution output.',
              initialCode: 'console.log("C++ Engine");',
              expectedOutput: 'C++ Engine'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Memory Management Logic',
          instructions: 'Output `"Allocated"` to pass testing.',
          initialCode: 'console.log("Allocated");',
          expectedOutput: 'Allocated'
        }
      }
    ]
  },
  web: {
    id: 'web',
    title: 'HTML & CSS',
    icon: Layout,
    description: 'Structure web pages with HTML elements and style visual layouts with CSS.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'web-1',
            title: 'DOM Structure & Tags',
            xp: 50,
            theory: 'HTML defines the semantic structure of web documents using nested element tags.',
            exampleCode: '<h1>DevPath Academy</h1>\n<p>Welcome to learning.</p>',
            quiz: {
              question: 'Which tag represents the top-level heading on a standard HTML page?',
              options: ['<h6>', '<head>', '<h1>', '<header>'],
              correct: 2,
              explanation: '`<h1>` defines the most important primary heading.'
            },
            codingTask: {
              instructions: 'Print `"<h1>Title</h1>"` to complete the task.',
              initialCode: 'console.log("<h1>Title</h1>");',
              expectedOutput: '<h1>Title</h1>'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Markup Validator',
          instructions: 'Output `"<main>Content</main>"` to pass verification.',
          initialCode: 'console.log("<main>Content</main>");',
          expectedOutput: '<main>Content</main>'
        }
      }
    ]
  },
  dsa: {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: BookOpen,
    description: 'Master core computer science algorithms, arrays, linked lists, and time complexity.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'dsa-1',
            title: 'Linear Search & Complexity',
            xp: 50,
            theory: 'Linear Search inspects every element in a list sequentially until the targeted key is found. Time complexity is O(N) in worst-case scenarios.',
            exampleCode: 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}\nconsole.log(linearSearch([10, 20, 30], 20));',
            quiz: {
              question: 'What is the worst-case time complexity of Linear Search on an array of size N?',
              options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
              correct: 2,
              explanation: 'In the worst case, Linear Search must check every single item in the array once.'
            },
            codingTask: {
              instructions: 'Complete the linear search function to return the index of target `30` in array `[5, 15, 30, 45]`.',
              initialCode: 'const list = [5, 15, 30, 45];\nconst target = 30;\n// Find and log index\nconsole.log(list.indexOf(target));',
              expectedOutput: '2'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Binary Search Implementation',
          instructions: 'Implement Binary Search on a sorted array `[2, 5, 8, 12, 16, 23, 38]` to find index of target `16`. Print the index.',
          initialCode: 'const sortedArr = [2, 5, 8, 12, 16, 23, 38];\nconst target = 16;\n// Implement Binary Search logic\n',
          expectedOutput: '4'
        }
      }
    ]
  },
  cybersec: {
    id: 'cybersec',
    title: 'Cybersecurity',
    icon: Shield,
    description: 'Understand cryptography, secure networking principles, and authentication logic.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        requiredXp: 0,
        lessons: [
          {
            id: 'sec-1',
            title: 'Symmetric Cryptography & Ciphers',
            xp: 50,
            theory: 'Symmetric encryption uses a single shared secret key for encryption and decryption. A classic example is the Caesar cipher, shifting alphabet characters by a fixed offset.',
            exampleCode: 'const shiftChar = (char, shift) => String.fromCharCode(char.charCodeAt(0) + shift);\nconsole.log(shiftChar("A", 3)); // Outputs "D"',
            quiz: {
              question: 'Which type of cryptography uses the same key for encryption and decryption?',
              options: ['Asymmetric Cryptography', 'Symmetric Cryptography', 'Hashing', 'Public Key Infrastructure'],
              correct: 1,
              explanation: 'Symmetric encryption algorithms use identical keys for both scrambling and unscrambling data.'
            },
            codingTask: {
              instructions: 'Implement a simple 1-character shift cipher on string `"ABC"` (shifting ASCII by +1) and log result.',
              initialCode: 'const input = "ABC";\nconst shifted = input.split("").map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join("");\nconsole.log(shifted);',
              expectedOutput: 'BCD'
            }
          }
        ],
        capstoneProject: {
          title: 'Capstone: Hashing & Auth Verification',
          instructions: 'Simulate a basic hash check. Create a function that compares plain input "admin123" against stored string "admin123". If matched print "Access Granted", else "Access Denied".',
          initialCode: 'const storedPass = "admin123";\nconst inputPass = "admin123";\n// Perform check and log\n',
          expectedOutput: 'Access Granted'
        }
      }
    ]
  }
};

export default function DevPathAcademy() {
  // Persistence & Progress Tracking
  const [activeTrack, setActiveTrack] = useState('js');
  const [userLevel, setUserLevel] = useState('beginner');
  const [unlockedLevels, setUnlockedLevels] = useState(['beginner']);
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('devpath_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedLessons, setCompletedLessons] = useState([]);
  
  // Selection States
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('lesson'); // lesson | quiz | coding | capstone
  
  // Interactive Quiz States
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(null);
  
  // Code Playground States
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [testPassed, setTestPassed] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('devpath_xp', xp.toString());
  }, [xp]);

  // Selected Track & Level Objects
  const currentTrackObj = TRACKS[activeTrack];
  const currentLevelObj = currentTrackObj.levels.find(l => l.id === userLevel) || currentTrackObj.levels[0];
  const currentLesson = currentLevelObj.lessons[currentLessonIndex] || currentLevelObj.lessons[0];

  useEffect(() => {
    if (currentLesson) {
      setCode(currentLesson.codingTask.initialCode);
      setCodeOutput('');
      setTestPassed(null);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  }, [currentLessonIndex, activeTrack, userLevel]);

  // Execute Code Logic
  const runCodeExecution = (expected) => {
    setCodeOutput('Executing in virtual engine...');
    setTimeout(() => {
      let logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.join(' ')),
        error: (...args) => logs.push('ERROR: ' + args.join(' '))
      };

      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        
        const resultString = logs.join('\n').trim();
        setCodeOutput(resultString || 'Code executed with no output.');

        if (resultString === expected.trim()) {
          setTestPassed(true);
          if (!completedLessons.includes(currentLesson.id)) {
            setCompletedLessons([...completedLessons, currentLesson.id]);
            setXp(prev => prev + currentLesson.xp);
          }
        } else {
          setTestPassed(false);
        }
      } catch (err) {
        setCodeOutput(`Runtime Error: ${err.message}`);
        setTestPassed(false);
      }
    }, 400);
  };

  // Evaluate Capstone Gatekeeper Project
  const runCapstoneEvaluation = () => {
    const capstone = currentLevelObj.capstoneProject;
    setCodeOutput('Evaluating Capstone Project solution...');
    
    setTimeout(() => {
      let logs = [];
      const customConsole = { log: (...args) => logs.push(args.join(' ')) };

      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        
        const resultString = logs.join('\n').trim();
        setCodeOutput(resultString);

        if (resultString === capstone.expectedOutput.trim()) {
          setTestPassed(true);
          if (userLevel === 'beginner' && !unlockedLevels.includes('intermediate')) {
            setUnlockedLevels([...unlockedLevels, 'intermediate']);
            setXp(prev => prev + 150);
            alert('🎉 CAPSTONE PASSED! You have unlocked the Intermediate Level!');
          } else {
            alert('🎉 Capstone evaluation passed successfully!');
          }
        } else {
          setTestPassed(false);
          alert('❌ Capstone Failed: Output did not match expected requirements. Revise code and try again.');
        }
      } catch (err) {
        setCodeOutput(`Evaluation Error: ${err.message}`);
        setTestPassed(false);
      }
    }, 500);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === currentLesson.quiz.correct;
    setQuizPassed(isCorrect);
    if (isCorrect) {
      setXp(prev => prev + 25);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg text-white shadow-lg shadow-cyan-500/20">
            <Code className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">DevPath Academy</h1>
            <p className="text-xs text-cyan-400 font-mono">GATEKEEPER LEARNING PLATFORM</p>
          </div>
        </div>

        {/* METRICS DISPLAY */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 text-sm">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-slate-400 text-xs font-mono">XP:</span>
            <span className="font-bold text-amber-400 font-mono">{xp}</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/80 text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs font-mono">LEVEL:</span>
            <span className="font-bold capitalize text-cyan-400 font-mono">{userLevel}</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col space-y-6">
          <div>
            <h2 className="text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-3 px-1">Curriculum Tracks</h2>
            <div className="space-y-1.5">
              {Object.values(TRACKS).map((track) => {
                const Icon = track.icon;
                const isActive = activeTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => { setActiveTrack(track.id); setCurrentLessonIndex(0); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{track.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEVEL SELECTOR */}
          <div>
            <h2 className="text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-3 px-1">Difficulty Levels</h2>
            <div className="space-y-1.5">
              {['beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => {
                const isUnlocked = unlockedLevels.includes(lvl);
                const isCurrent = userLevel === lvl;
                return (
                  <button
                    key={lvl}
                    disabled={!isUnlocked}
                    onClick={() => { setUserLevel(lvl); setCurrentLessonIndex(0); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      isCurrent 
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold' 
                        : isUnlocked 
                          ? 'text-slate-300 hover:bg-slate-800/50' 
                          : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>{lvl}</span>
                    {!isUnlocked ? <Lock className="w-3 h-3 text-slate-600" /> : isCurrent && <ChevronRight className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
          {/* TRACK BANNER & TAB SELECTOR */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <span>{currentTrackObj.title}</span>
                <span>•</span>
                <span className="capitalize">{userLevel} Level</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{currentLesson.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{currentTrackObj.description}</p>
            </div>

            {/* TAB SELECTOR BUTTONS */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('lesson')}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold transition ${
                  activeTab === 'lesson' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Theory
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold transition ${
                  activeTab === 'quiz' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Quiz
              </button>
              <button
                onClick={() => setActiveTab('coding')}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold transition ${
                  activeTab === 'coding' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Coding
              </button>
              <button
                onClick={() => {
                  setActiveTab('capstone');
                  setCode(currentLevelObj.capstoneProject.initialCode);
                }}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold transition flex items-center space-x-1 ${
                  activeTab === 'capstone' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Capstone</span>
              </button>
            </div>
          </div>

          {/* TAB 1: THEORY LESSON */}
          {activeTab === 'lesson' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-lg font-bold text-white">Lesson Overview</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{currentLesson.theory}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-lg font-bold text-white">Syntax & Example</h3>
                <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-emerald-400 font-mono overflow-x-auto">
                  <code>{currentLesson.exampleCode}</code>
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-cyan-500/20"
                >
                  <span>Take Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white">Knowledge Check</h3>
              <p className="text-sm text-slate-300">{currentLesson.quiz.question}</p>

              <div className="space-y-3">
                {currentLesson.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedQuizOption(idx)}
                    className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition ${
                      selectedQuizOption === idx 
                        ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300' 
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizSubmitted && (
                <div className={`p-4 rounded-lg border text-sm space-y-2 ${
                  quizPassed ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                }`}>
                  <div className="flex items-center space-x-2 font-bold">
                    {quizPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                    <span>{quizPassed ? 'Correct Answer!' : 'Incorrect Answer'}</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentLesson.quiz.explanation}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => { setSelectedQuizOption(null); setQuizSubmitted(false); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Reset Choice
                </button>
                <button
                  disabled={selectedQuizOption === null || quizSubmitted}
                  onClick={handleQuizSubmit}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-sm transition"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CODING PLAYGROUND */}
          {activeTab === 'coding' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CODE EDITOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>In-Browser Code Editor</span>
                  </span>
                  <button 
                    onClick={() => setCode(currentLesson.codingTask.initialCode)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                  <strong>Instructions:</strong> {currentLesson.codingTask.instructions}
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-emerald-400 focus:outline-none focus:border-cyan-500"
                  spellCheck="false"
                />

                <button
                  onClick={() => runCodeExecution(currentLesson.codingTask.expectedOutput)}
                  className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Run Code & Verify</span>
                </button>
              </div>

              {/* CONSOLE TERMINAL */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
                <div>
                  <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4">Output Console</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-200 min-h-[200px]">
                    {codeOutput || <span className="text-slate-600">// Click "Run Code & Verify" to execute...</span>}
                  </div>
                </div>

                {testPassed !== null && (
                  <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 text-sm ${
                    testPassed ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                  }`}>
                    {testPassed ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />}
                    <span>{testPassed ? `Passed! Earned +${currentLesson.xp} XP.` : 'Output did not match requirements.'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CAPSTONE GATEKEEPER TEST */}
          {activeTab === 'capstone' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center space-x-3 text-amber-400">
                <Award className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">{currentLevelObj.capstoneProject.title}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{currentLevelObj.capstoneProject.instructions}</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={12}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                    spellCheck="false"
                  />
                  <button
                    onClick={runCapstoneEvaluation}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit Capstone Project</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-200">
                  <span className="text-xs text-slate-500 block mb-2">// Capstone Grading Console</span>
                  {codeOutput || <span className="text-slate-600">Submit solution for automated grading...</span>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}