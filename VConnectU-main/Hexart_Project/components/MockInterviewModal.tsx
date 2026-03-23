"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Play, RefreshCw, X, ChevronRight, CheckCircle, AlertCircle, Loader2, Brain, Sparkles } from "lucide-react";

type Role = "Software Engineer" | "Data Analyst" | "Product Manager" | "HR Manager";

const ROLES: Role[] = ["Software Engineer", "Data Analyst", "Product Manager", "HR Manager"];

// Simulated Question Bank
const QUESTIONS: Record<Role, string[]> = {
    "Software Engineer": [
        "Explain the difference between process and thread.",
        "How do you handle error handling in your preferred language?",
        "Describe a challenging bug you fixed recently.",
        "What is your approach to optimizing code performance?"
    ],
    "Data Analyst": [
        "How do you handle missing data in a dataset?",
        "Explain the difference between supervised and unsupervised learning.",
        "Which visualization tool do you prefer and why?",
        "Describe a time you found an unexpected insight in data."
    ],
    "Product Manager": [
        "How do you prioritize features for a roadmap?",
        "Describe a product you love and how you'd improve it.",
        "How do you handle conflicts between stakeholders?",
        "What metrics do you track for success?"
    ],
    "HR Manager": [
        "How do you handle a conflict between two employees?",
        "Describe your strategy for talent acquisition.",
        "How do you ensure diversity and inclusion in hiring?",
        "How would you handle a layoff situation?"
    ]
};

export default function MockInterviewModal({ companyName, onClose }: { companyName: string, onClose: () => void }) {
    const [step, setStep] = useState<'ROLE' | 'INTERVIEW' | 'FEEDBACK'>('ROLE');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Feedback State
    const [clarityScore, setClarityScore] = useState(0);
    const [confidenceScore, setConfidenceScore] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Recording Timer Logic
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    const handleStartInterview = (role: Role) => {
        setSelectedRole(role);
        setStep('INTERVIEW');
        setCurrentQuestionIndex(0);
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop Recording & "Analyze"
            setIsRecording(false);
            if (currentQuestionIndex < (QUESTIONS[selectedRole!].length - 1)) {
                // Next question after a brief pause
                setTimeout(() => {
                    setRecordingTime(0);
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 1000);
            } else {
                // Finish Interview
                setIsAnalyzing(true);
                setTimeout(() => {
                    generateFeedback();
                    setIsAnalyzing(false);
                    setStep('FEEDBACK');
                }, 2000);
            }
        } else {
            // Start Recording
            setIsRecording(true);
        }
    };

    const generateFeedback = () => {
        // Random "AI" Scores
        setClarityScore(Math.floor(Math.random() * (95 - 70 + 1)) + 70);
        setConfidenceScore(Math.floor(Math.random() * (95 - 65 + 1)) + 65);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'ROLE' && (
                    <div className="p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Brain className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">AI Interview Simulator</h2>
                        <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
                            Tailoring session for <span className="text-slate-900 font-black italic">{companyName}</span>. Choose your career track to begin.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ROLES.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleStartInterview(role)}
                                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50/30 hover:shadow-xl hover:shadow-purple-50 transition-all font-bold text-left flex items-center justify-between group"
                                >
                                    <span className="text-slate-700 group-hover:text-purple-700 transition-colors uppercase tracking-tight text-sm">{role}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-all group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'INTERVIEW' && selectedRole && (
                    <div className="p-10 relative">
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-20 backdrop-blur-xl rounded-[2.5rem]">
                                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Evaluating Insights...</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Checking semantic clarity and confidence</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-10">
                            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Phase {currentQuestionIndex + 1} / {QUESTIONS[selectedRole].length}</div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 px-4 py-1.5 rounded-full text-white shadow-lg">
                                <div className={`w-2 h-2 rounded-full bg-red-400 ${isRecording ? 'animate-pulse' : ''}`} />
                                {isRecording ? "Capturing Audio" : "Awaiting Input"}
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-12 min-h-[6rem] leading-tight font-serif italic text-center">
                            "{QUESTIONS[selectedRole][currentQuestionIndex]}"
                        </h3>

                        {/* Visualizer Placeholder */}
                        <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] mb-10 flex items-end justify-center gap-1.5 p-8 overflow-hidden shadow-inner">
                            {isRecording ? Array.from({ length: 48 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-purple-500/40 rounded-full animate-pulse shadow-sm"
                                    style={{
                                        height: `${Math.random() * 80 + 20}%`,
                                        animationDelay: `${Math.random() * 0.5}s`
                                    }}
                                />
                            )) : (
                                <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] self-center">Press to answer through voice</p>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="text-5xl font-black text-slate-900/40 tabular-nums tracking-tighter">
                                {formatTime(recordingTime)}
                            </div>

                            <button
                                onClick={toggleRecording}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-2xl ${isRecording
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
                                    }`}
                            >
                                {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-10 h-10" />}
                            </button>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {isRecording ? "Stop round and evaluate" : "Tap microphone to begin"}
                            </p>
                        </div>
                    </div>
                )}

                {step === 'FEEDBACK' && (
                    <div className="p-10 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="p-5 bg-green-50 border border-green-100 rounded-3xl text-green-600 shadow-sm">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Analysis</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Session Report for {companyName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm group">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <span className="text-slate-400 text-[10px] mb-2 uppercase tracking-[0.3em] font-black">Clarity</span>
                                <span className="text-6xl font-black text-blue-600 tracking-tighter">{clarityScore}%</span>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm group">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <span className="text-slate-400 text-[10px] mb-2 uppercase tracking-[0.3em] font-black">Confidence</span>
                                <span className="text-6xl font-black text-purple-600 tracking-tighter">{confidenceScore}%</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <h3 className="font-black text-xl flex items-center gap-3 text-slate-900 mb-6 uppercase tracking-tight">
                                <AlertCircle className="w-6 h-6 text-yellow-500" /> Strategic Tips
                            </h3>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-transform hover:scale-[1.01]">
                                <p className="text-slate-700 text-sm font-medium leading-relaxed"><strong className="text-slate-900 font-black">Answer Structure:</strong> Strong attempt. Implement the STAR method (Situation, Task, Action, Result) for more impactful delivery.</p>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-transform hover:scale-[1.01]">
                                <p className="text-slate-700 text-sm font-medium leading-relaxed"><strong className="text-slate-900 font-black">Pacing Control:</strong> Your tempo was stable. Minimize filler words like "um" to sound more authoritative.</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200"
                        >
                            Return to Insights Hub
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
