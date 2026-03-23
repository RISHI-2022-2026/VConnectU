"use client";

import { useState, useEffect } from "react";
import { APTITUDE_QUESTIONS, VERBAL_QUESTIONS, REASONING_QUESTIONS, TECH_QUESTIONS, CODING_CHALLENGES } from "@/lib/skillTestData";
import { CheckCircle, XCircle, Clock, Code, BookOpen, AlertCircle, Loader2 } from "lucide-react";

interface SkillAssessmentModalProps {
    job: any;
    onClose: () => void;
    onPass: () => void;
}

export default function SkillAssessmentModal({ job, onClose, onPass }: SkillAssessmentModalProps) {
    const [stage, setStage] = useState<'INSTRUCTION' | 'MCQ' | 'CODING' | 'RESULT'>('INSTRUCTION');
    const [questions, setQuestions] = useState<any[]>([]);
    const [codingChallenge, setCodingChallenge] = useState<any>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [codingAnswer, setCodingAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total

    // Initialize Questions based on Job Skills
    useEffect(() => {
        const generatedQuestions: any[] = [];

        // 1. General Aptitude (2 Qs)
        generatedQuestions.push(...APTITUDE_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 2));
        // 2. Verbal (2 Qs)
        generatedQuestions.push(...VERBAL_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 2));
        // 3. Reasoning (2 Qs)
        generatedQuestions.push(...REASONING_QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 2));

        // 4. Technical Skills (5 Qs)
        const jobSkills = job.requiredSkills ? job.requiredSkills.split(',').map((s: string) => s.trim()) : [];
        let techPool: any[] = [];

        // Find matching tech questions or fallback to General
        let primarySkill = "General";
        jobSkills.forEach((skill: string) => {
            if (TECH_QUESTIONS[skill]) {
                techPool.push(...TECH_QUESTIONS[skill]);
                if (primarySkill === "General") primarySkill = skill; // Prioritize first match for coding
            }
        });

        if (techPool.length === 0) techPool = TECH_QUESTIONS["General"];

        generatedQuestions.push(...techPool.sort(() => 0.5 - Math.random()).slice(0, 5));

        setQuestions(generatedQuestions);

        // 5. Coding Challenge
        const challengeKey = CODING_CHALLENGES[primarySkill] ? primarySkill : "General";
        setCodingChallenge(CODING_CHALLENGES[challengeKey]);
        setCodingAnswer(CODING_CHALLENGES[challengeKey].template);

    }, [job]);

    // Timer Logic
    useEffect(() => {
        if (stage === 'MCQ' || stage === 'CODING') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSubmit(); // Auto-submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [stage]);

    const handleAnswer = (optionIdx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = optionIdx;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            setStage('CODING');
        }
    };

    const handleSubmit = () => {
        // Calculate MCQ Score
        let correct = 0;
        answers.forEach((ans, idx) => {
            if (questions[idx] && ans === questions[idx].answer) correct++;
        });

        // Simulated Coding Score (Check if code length changes significantly or basic keywords exist)
        let codingScore = 0;
        if (codingAnswer.length > codingChallenge.template.length + 10) codingScore = 1; // Basic effort check

        const totalScore = ((correct + codingScore) / (questions.length + 1)) * 100;
        setScore(totalScore);
        setStage('RESULT');

        if (totalScore >= 60) {
            setTimeout(() => {
                onPass();
                onClose();
            }, 3000); // Wait 3s then close
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight">Skill Verification</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Applying for: {job.title}</p>
                    </div>
                    {stage !== 'INSTRUCTION' && stage !== 'RESULT' && (
                        <div className={`px-6 py-2.5 rounded-2xl font-black text-sm border shadow-sm flex items-center gap-3 transition-colors ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-white text-slate-900 border-slate-200'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10">
                    {stage === 'INSTRUCTION' && (
                        <div className="space-y-10 text-center py-8">
                            <div className="w-24 h-24 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-inner">
                                <BookOpen className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Verification Guidelines</h2>
                                <p className="text-slate-500 font-medium">Please review these standards before beginning the assessment.</p>
                            </div>
                            <div className="max-w-lg mx-auto grid gap-4 text-left">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
                                    <span className="font-bold text-slate-700">Aptitude & Reasoning: 10 Core Questions</span>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Code className="w-5 h-5" /></div>
                                    <span className="font-bold text-slate-700">1 Hands-on Coding Challenge</span>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                                    <span className="font-bold text-slate-700">Time Limit: Exactly 10 Minutes</span>
                                </div>
                            </div>
                            <button onClick={() => setStage('MCQ')} className="w-full md:w-auto px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95">
                                Begin Official Test
                            </button>
                        </div>
                    )}

                    {stage === 'MCQ' && questions.length > 0 && (
                        <div className="animate-in slide-in-from-right duration-500">
                            <div className="mb-10 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objective Section</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg">Item {currentQ + 1} of {questions.length}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-10 leading-tight font-serif italic">"{questions[currentQ].question}"</h4>
                            <div className="grid gap-4">
                                {questions[currentQ].options.map((opt: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`p-5 text-left rounded-2xl border-2 transition-all font-bold group ${answers[currentQ] === idx ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-lg shadow-purple-50' : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        <span className="inline-block w-8 font-black text-slate-300 group-hover:text-purple-400 transition-colors">{String.fromCharCode(65 + idx)}.</span> {opt}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-12 flex justify-end">
                                <button
                                    onClick={nextQuestion}
                                    disabled={answers[currentQ] === undefined}
                                    className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-30 shadow-xl transition-all"
                                >
                                    Proceed &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === 'CODING' && codingChallenge && (
                        <div className="h-full flex flex-col animate-in slide-in-from-right duration-500">
                            <div className="mb-8">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full w-fit">Scripting Challenge</span>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{codingChallenge.title}</h3>
                                <p className="text-slate-500 mt-4 font-medium leading-relaxed">{codingChallenge.description}</p>
                            </div>
                            <div className="flex-1 min-h-[400px] bg-slate-900 rounded-[2rem] border-8 border-slate-100 p-8 font-mono text-sm relative shadow-inner overflow-hidden">
                                <textarea
                                    className="w-full h-full bg-transparent resize-none focus:outline-none text-emerald-400 placeholder:text-slate-700 caret-white"
                                    value={codingAnswer}
                                    onChange={(e) => setCodingAnswer(e.target.value)}
                                    spellCheck={false}
                                    placeholder="// Enter your solution here..."
                                />
                                <div className="absolute top-4 right-8 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 pointer-events-none">
                                    Editor Context: Node.js / ES6+
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100 transition-all hover:scale-105"
                                >
                                    Submit Final Work
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === 'RESULT' && (
                        <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                            {score >= 60 ? (
                                <div className="max-w-md mx-auto">
                                    <div className="w-28 h-28 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <CheckCircle className="w-14 h-14" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Verification Successful</h2>
                                    <p className="text-emerald-500 text-3xl font-black mb-10 tracking-tighter">{score.toFixed(0)}% Match Profile</p>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center gap-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
                                        <span className="font-bold text-slate-700">Submitting application on your behalf...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-md mx-auto">
                                    <div className="w-28 h-28 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <XCircle className="w-14 h-14" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Target Not Met</h2>
                                    <p className="text-rose-500 text-3xl font-black mb-10 tracking-tighter">{score.toFixed(0)}% Score Rate</p>
                                    <p className="text-slate-500 mb-10 font-medium">This role requires a minimum 60% verification score. Strengthen your skills and attempt again later.</p>
                                    <button onClick={onClose} className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200">
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
