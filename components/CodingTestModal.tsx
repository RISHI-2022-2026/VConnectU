// components/CodingTestModal.tsx
"use client";

import { useState } from "react";
import { X, CheckCircle, XCircle, Code, Rocket, BookOpen } from "lucide-react";

interface CodingTestModalProps {
    mode: string;
    setMode: (mode: string) => void;
    onComplete: () => void;
}

// Simple placeholder questions for coding test
const QUESTIONS = [
    {
        id: 1,
        question: "What does the `===` operator do in JavaScript?",
        options: [
            "Assigns a value",
            "Compares value and type",
            "Compares only value",
            "None of the above",
        ],
        answer: 1,
    },
    {
        id: 2,
        question: "Which data structure uses FIFO ordering?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: 1,
    },
];

export default function CodingTestModal({ mode, setMode, onComplete }: CodingTestModalProps) {
    const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
    const [score, setScore] = useState<number | null>(null);

    const handleOptionSelect = (qIdx: number, optIdx: number) => {
        const newAns = [...answers];
        newAns[qIdx] = optIdx;
        setAnswers(newAns);
    };

    const submit = () => {
        let correct = 0;
        QUESTIONS.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });
        setScore((correct / QUESTIONS.length) * 100);
        setMode("CODING_RESULT");
    };

    const reset = () => {
        setAnswers(Array(QUESTIONS.length).fill(-1));
        setScore(null);
        setMode("IDLE");
        onComplete();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-2xl p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={() => setMode("IDLE")} className="absolute top-8 right-8 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
                    <X className="w-5 h-5" />
                </button>

                {mode === "CODING_START" && (
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 border border-blue-200 shadow-sm">
                                <Code className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Coding Proficiency</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Algorithm & Logic Assessment</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {QUESTIONS.map((q, qIdx) => (
                                <div key={q.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">{qIdx + 1}</span>
                                        <p className="font-bold text-slate-900 text-lg">{q.question}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, optIdx) => (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                className={`p-4 rounded-xl text-left font-bold transition-all border ${answers[qIdx] === optIdx
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-100"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                                                    }`}
                                            >
                                                <span className="mr-3 opacity-40">{String.fromCharCode(65 + optIdx)}.</span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={submit}
                            disabled={answers.includes(-1)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all disabled:opacity-20 active:scale-[0.98]"
                        >
                            Finalize and Submit Test
                        </button>
                    </div>
                )}

                {mode === "CODING_RESULT" && score !== null && (
                    <div className="text-center space-y-8 py-4">
                        <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-all shadow-inner ${score >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {score >= 70 ? <CheckCircle className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
                        </div>

                        <div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{score}% Score</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Official Assessment Result</p>
                        </div>

                        {score >= 70 ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-green-700 font-bold flex items-center justify-center gap-3">
                                <Rocket className="w-6 h-6 animate-bounce" />
                                <span>Excellent! You've successfully passed the verification test.</span>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 font-bold">
                                    <span>Score target not met. Let's strengthen your foundations.</span>
                                </div>
                                <div className="text-left bg-slate-50 border border-slate-100 rounded-3xl p-8">
                                    <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <BookOpen className="w-4 h-4 text-blue-600" /> Recommended Learning Hubs
                                    </h4>
                                    <div className="grid gap-3">
                                        <a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                                            <span className="font-bold text-slate-700">Advanced JS Logic - freeCodeCamp</span>
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Rocket className="w-4 h-4" />
                                            </div>
                                        </a>
                                        <a href="https://www.youtube.com/@TraversyMedia" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                                            <span className="font-bold text-slate-700">Modern Dev - Traversy Media</span>
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Rocket className="w-4 h-4" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button onClick={reset} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all">
                            Back to Learning Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
