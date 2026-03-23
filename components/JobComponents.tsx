"use client";

import { useState } from "react";
import { Briefcase, Star, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import SkillAssessmentModal from "./SkillAssessmentModal";

export function JobCard({ job, onClick }: { job: any, onClick: () => void }) {
    return (
        <div onClick={onClick} className="p-4 bg-white border border-slate-200 rounded-xl text-sm flex flex-col gap-3 group/job cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{job.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${job.category === "Government" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                    {job.category}
                </span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400">{job.salary}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 opacity-0 group-hover/job:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">View Details &rarr;</span>
            </div>
        </div>
    );
}

export function ApplyActions({ job }: { job: any }) {
    const [status, setStatus] = useState<'IDLE' | 'APPLYING' | 'APPLIED' | 'WITHDRAWING'>('IDLE');
    const [showTest, setShowTest] = useState(false);

    async function handleApply() {
        setStatus('APPLYING');
        try {
            if (job.link) {
                setStatus('APPLIED');
                window.open(job.link, '_blank');
                return;
            }

            const res = await fetch("/api/jobs/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            if (res.ok) {
                setStatus('APPLIED');
            }
        } catch (error) {
            console.error(error);
            setStatus('IDLE');
        }
    }

    async function handleWithdraw() {
        setStatus('WITHDRAWING');
        try {
            const res = await fetch("/api/jobs/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            if (res.ok) {
                setStatus('IDLE');
            }
        } catch (error) {
            console.error(error);
            setStatus('APPLIED');
        }
    }

    if (status === 'APPLIED') {
        return (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                <span className="text-green-600 font-bold flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Applied
                </span>
                <button
                    onClick={handleWithdraw}
                    className="px-6 py-2 rounded-xl font-bold bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                >
                    Withdraw
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {job.link && (
                <button
                    onClick={handleApply}
                    disabled={status === 'APPLYING'}
                    className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02]"
                >
                    <ExternalLink className="w-4 h-4" /> Apply on Official Website
                </button>
            )}

            <button
                onClick={() => setShowTest(true)}
                disabled={status === 'APPLYING'}
                className="px-6 py-2.5 rounded-xl font-black uppercase tracking-tight bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {status === 'APPLYING'
                    ? "Processing..."
                    : (
                        <>
                            <Star className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
                            Take Assessment
                        </>
                    )
                }
            </button>

            {showTest && (
                <SkillAssessmentModal
                    job={job}
                    onClose={() => setShowTest(false)}
                    onPass={handleApply}
                />
            )}
        </div>
    );
}

export const QUESTIONS = [
    {
        id: 1,
        question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        options: ["120 metres", "180 metres", "324 metres", "150 metres"],
        answer: 3
    },
    {
        id: 2,
        question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
        options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
        answer: 1
    },
    {
        id: 3,
        question: "Which word does NOT belong with the others?",
        options: ["Parsley", "Basil", "Dill", "Mayonnaise"],
        answer: 3
    },
    {
        id: 4,
        question: "Safe workplace practices involve:",
        options: ["Ignoring signs", "Reporting hazards", "Running in halls", "Not wearing PPE"],
        answer: 1
    },
    {
        id: 5,
        question: "If you have a conflict with a coworker, the best first step is to:",
        options: ["Complain to others", "Ignore them forever", "Talk to them calmly", "Quit your job"],
        answer: 2
    }
];

export function SkillsTestModal({ mode, setMode, onComplete }: { mode: string, setMode: (m: any) => void, onComplete: () => void }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = optionIndex;
        setAnswers(newAnswers);

        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            let correct = 0;
            newAnswers.forEach((ans, idx) => {
                if (ans === QUESTIONS[idx].answer) correct++;
            });
            setScore((correct / QUESTIONS.length) * 100);
            setShowResult(true);
        }
    };

    if (showResult) {
        const passed = score >= 60;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-10 text-center animate-in fade-in zoom-in duration-300 shadow-2xl">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${passed ? 'bg-green-100 text-green-600 shadow-inner' : 'bg-orange-100 text-orange-600 shadow-inner'}`}>
                        {passed ? <Star className="w-12 h-12 fill-current" /> : <BookOpen className="w-12 h-12" />}
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">{passed ? "Congratulations!" : "Keep Going!"}</h2>
                    <p className="text-slate-500 mb-6 text-lg font-medium">
                        You scored <span className={passed ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>{score}%</span>
                    </p>

                    <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                        {passed
                            ? "You have demonstrated excellent aptitude. Your profile has been marked as Verified."
                            : "Don't worry! This is just a stepping stone. Review the Learning Hub materials and try again. You have the potential to ace this!"}
                    </p>

                    {!passed && (
                        <div className="mb-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5" /> Recommended Hubs
                            </h4>
                            <div className="space-y-3">
                                <a href="https://www.youtube.com/@FeelFreetoLearn" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-100 group transition-all shadow-sm">
                                    <span className="text-slate-700 font-bold text-sm">Quant Strategies</span>
                                    <Star className="w-4 h-4 text-slate-300 group-hover:text-yellow-500 transition-colors" />
                                </a>
                                <a href="https://www.youtube.com/@CareerRide" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-100 group transition-all shadow-sm">
                                    <span className="text-slate-700 font-bold text-sm">Reasoning Logic</span>
                                    <Star className="w-4 h-4 text-slate-300 group-hover:text-yellow-500 transition-colors" />
                                </a>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            if (passed) onComplete();
                            setMode('IDLE');
                        }}
                        className={`px-8 py-4 rounded-xl font-bold w-full transition-all active:scale-95 shadow-lg ${passed
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                    >
                        {passed ? "Complete & Verified" : "Continue Practicing"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-xl text-slate-900">Skill Verification Test</h3>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">Question {currentQ + 1} / {QUESTIONS.length}</div>
                </div>

                <div className="w-full h-1.5 bg-slate-100">
                    <div
                        className="h-full bg-purple-500 transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                        style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <div className="p-10">
                    <h4 className="text-2xl font-bold text-slate-900 mb-10 leading-relaxed font-serif italic">
                        "{QUESTIONS[currentQ].question}"
                    </h4>

                    <div className="grid gap-4">
                        {QUESTIONS[currentQ].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="p-5 rounded-2xl bg-white border border-slate-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all text-left group shadow-sm hover:shadow-md"
                            >
                                <span className="inline-block w-8 font-black text-slate-300 group-hover:text-purple-400 transition-colors">{String.fromCharCode(65 + idx)}.</span>
                                <span className="font-bold text-slate-700">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={() => setMode('IDLE')}
                        className="text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest text-xs px-4 py-2 transition-colors"
                    >
                        Cancel Verification
                    </button>
                </div>
            </div>
        </div>
    );
}

export function JobAIAnalysis({ job, user }: { job: any, user: any }) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const userProfile = `Name: ${user.name}, Qualification: ${user.qualification}, Skills: ${user.skills || "Not listed"}`;

            const res = await fetch("/api/jobs/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobDescription: job.description + " " + (job.requiredSkills || ""),
                    userProfile
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setAnalysis(data);
            } else {
                alert("Failed to analyze job match.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            {!analysis ? (
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="mr-3 px-5 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-50 hover:shadow-md"
                >
                    <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "Analyzing Alignment..." : "Check AI Compatibility"}
                </button>
            ) : (
                <div className="mr-3 flex items-center gap-4 animate-in fade-in slide-in-from-right-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col text-right">
                        <span className={`text-sm font-black uppercase tracking-tighter ${analysis.matchScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                            {analysis.matchScore}% Compatibility
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium max-w-[180px] leading-tight hidden lg:inline-block">
                            {analysis.summary}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
