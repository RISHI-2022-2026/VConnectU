export const APTITUDE_QUESTIONS = [
    {
        question: "A train running at 60 km/hr crosses a pole in 9 seconds. Length of the train is?",
        options: ["120 m", "150 m", "180 m", "324 m"],
        answer: 1
    },
    {
        question: "If A is brother of B; B is sister of C; and C is father of D, how D is related to A?",
        options: ["Brother", "Sister", "Nephew", "Cannot be determined"],
        answer: 3
    },
    {
        question: "12, 11, 13, 12, 14, 13, ... What comes next?",
        options: ["10", "16", "13", "15"],
        answer: 3
    },
    {
        question: "A shopkeeper sells an article for Rs 200 with a loss of 20%. Find the cost price.",
        options: ["220", "250", "240", "260"],
        answer: 1
    }
];

export const VERBAL_QUESTIONS = [
    {
        question: "Select the synonym of: ABANDON",
        options: ["Keep", "Cherish", "Forsake", "Enlarge"],
        answer: 2
    },
    {
        question: "Find the correctly spelt word.",
        options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
        answer: 1
    },
    {
        question: "Antonym of: ARTIFICIAL",
        options: ["Red", "Natural", "Truthful", "Solid"],
        answer: 1
    },
    {
        question: "Complete the idiom: A blessing in ____.",
        options: ["disguise", "sky", "time", "hand"],
        answer: 0
    }
];

export const REASONING_QUESTIONS = [
    {
        question: "Statement: All mangoes are golden in colour. No golden-coloured things are cheap.\nConclusion:\n1) All mangoes are cheap.\n2) Golden-coloured mangoes are not cheap.",
        options: ["Only 1 follows", "Only 2 follows", "Both follow", "None follows"],
        answer: 1
    },
    {
        question: "Which number replaces the question mark?\n2, 7, 14, 23, ?, 47",
        options: ["31", "28", "34", "38"],
        answer: 2 // +5, +7, +9... +11 -> 34
    }
];

export const TECH_QUESTIONS: Record<string, any[]> = {
    "React": [
        { question: "What acts as a bridge between React and the browser's DOM?", options: ["Virtual DOM", "Controllers", "Redux", "Webpack"], answer: 0 },
        { question: "Which hook is used for side effects?", options: ["useState", "useContext", "useEffect", "useReducer"], answer: 2 },
        { question: "What prevents a component from re-rendering?", options: ["useMemo", "React.memo", "useEffect", "None"], answer: 1 },
        { question: "JSX stands for?", options: ["JavaScript XML", "JSON XML", "Java Syntax Extension", "None"], answer: 0 },
        { question: "How do you pass data to child components?", options: ["State", "Props", "Context", "Redux"], answer: 1 }
    ],
    "Node.js": [
        { question: "Which core module provides asynchronous I/O?", options: ["fs", "http", "path", "All of above"], answer: 3 },
        { question: "Node.js is...", options: ["Multi-threaded", "Single-threaded", "Triple-threaded", "None"], answer: 1 },
        { question: "Which event is emitted when an uncaught exception occurs?", options: ["error", "uncaughtException", "exit", "exception"], answer: 1 },
        { question: "What is the default scope of a module?", options: ["Global", "Local", "Public", "Private"], answer: 1 },
        { question: "Which library is used for testing?", options: ["Mocha", "Express", "Axios", "Pug"], answer: 0 }
    ],
    "Python": [
        { question: "Is Python case sensitive?", options: ["Yes", "No", "Depends on OS", "Sometimes"], answer: 0 },
        { question: "Correct extension of Python file?", options: [".python", ".pl", ".py", ".p"], answer: 2 },
        { question: "How to output text to screen?", options: ["echo", "print", "write", "send"], answer: 1 },
        { question: "List is mutable or immutable?", options: ["Mutable", "Immutable", "Both", "None"], answer: 0 },
        { question: "What is correct syntax for function?", options: ["func x():", "def x():", "function x():", "define x():"], answer: 1 }
    ],
    "General": [
        { question: "HTML stands for?", options: ["Hyper Text Markup Language", "High Text...", "Hyper Tab...", "None"], answer: 0 },
        { question: "Which is a CSS framework?", options: ["React", "Laravel", "Tailwind", "Django"], answer: 2 },
        { question: "HTTP status code 200 means?", options: ["Error", "OK", "Not Found", "Server Error"], answer: 1 },
        { question: "Common database language?", options: ["HTML", "SQL", "PHP", "XML"], answer: 1 },
        { question: "GIT is used for?", options: ["Version Control", "Testing", "Hosting", "Designing"], answer: 0 }
    ]
};

export const CODING_CHALLENGES: Record<string, any> = {
    "React": {
        title: "Counter Component",
        description: "Create a simple Counter component with Increment and Decrement buttons. The count should not go below zero.",
        template: "function Counter() {\n  // Write your code here\n  return (\n    <div>\n    \n    </div>\n  );\n}"
    },
    "Node.js": {
        title: "HTTP Server",
        description: "Create a basic HTTP server that listens on port 3000 and responds with 'Hello World' to GET requests.",
        template: "const http = require('http');\n\n// Write your code here"
    },
    "Python": {
        title: "Fibonacci Series",
        description: "Write a function that returns the nth number in the Fibonacci sequence.",
        template: "def fibonacci(n):\n    # Write your code here\n    pass"
    },
    "General": {
        title: "Palindrome Check",
        description: "Write a function to check if a given string is a palindrome.",
        template: "function isPalindrome(str) {\n  // Write your code here\n}"
    }
};
