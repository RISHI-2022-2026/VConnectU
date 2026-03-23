
"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Video, Upload, CheckCircle, AlertCircle, Loader2, Brain, Sparkles, User, FileText, Camera, Monitor } from "lucide-react";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


// Speech Recognition Type Definitions
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

type Step = 'RESUME' | 'MEDIA_CHECK' | 'INTERVIEW_TECH' | 'INTERVIEW_HR' | 'FEEDBACK';


export default function MockInterviewView({ onBack }: { onBack?: () => void }) {
    const router = useRouter();
    const handleBack = onBack || (() => router.push("/dashboard"));
    const [step, setStep] = useState<Step>('RESUME');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isMediaReady, setIsMediaReady] = useState(false);

    // Dynamic Questions State
    const [questions, setQuestions] = useState<{ tech: string[], hr: string[] }>({
        tech: [],
        hr: []
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

    // Interview State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentTranscript, setCurrentTranscript] = useState("");

    // Feedback State
    const [clarityScore, setClarityScore] = useState(0);
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [missingPoints, setMissingPoints] = useState<string[]>([]);
    const [overallFeedback, setOverallFeedback] = useState("");

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoElementRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<any>(null);

    // Recording Timer
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

    // Cleanup Media Stream and Recognition on unmount
    useEffect(() => {
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setCurrentTranscript(finalTranscript + interimTranscript);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setResumeFile(file);
            setIsGenerating(true);

            try {
                const formData = new FormData();
                formData.append("resume", file);

                const response = await fetch("/api/interview/setup", {
                    method: "POST",
                    body: formData, // No Content-Type header needed, browser sets it for FormData
                });

                const data = await response.json();
                if (response.ok) {
                    setQuestions({
                        tech: data.techQuestions,
                        hr: data.hrQuestions
                    });
                    setDetectedSkills(data.detectedSkills);
                    setStep('MEDIA_CHECK');
                } else {
                    console.error("Failed to setup interview:", data.error);
                    alert("Failed to analyze resume. Please try again.");
                }
            } catch (error) {
                console.error("Error generating questions:", error);
                alert("Something went wrong connecting to the AI interviewer.");
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const startMediaCheck = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaStreamRef.current = stream;
            if (videoElementRef.current) {
                videoElementRef.current.srcObject = stream;
            }
            setIsMediaReady(true);
        } catch (err) {
            console.error("Error accessing media devices:", err);
            alert("Could not access camera/microphone. Please check permissions.");
        }
    };

    const nextRound = () => {
        setIsRecording(false);
        setRecordingTime(0);
        setCurrentQuestionIndex(0);

        if (step === 'INTERVIEW_TECH') {
            setStep('INTERVIEW_HR');
        } else if (step === 'INTERVIEW_HR') {
            setIsAnalyzing(true);
            setTimeout(() => {
                generateFeedback();
                setIsAnalyzing(false);
                setStep('FEEDBACK');
            }, 2500);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop
            setIsRecording(false);
            stopSpeechRecognition();

            const currentQuestions = step === 'INTERVIEW_TECH' ? questions.tech : questions.hr;
            const currentQ = currentQuestions[currentQuestionIndex];

            // Save answer
            setAnswers(prev => ({
                ...prev,
                [currentQ]: currentTranscript
            }));

            if (currentQuestionIndex < currentQuestions.length - 1) {
                setTimeout(() => {
                    setRecordingTime(0);
                    setCurrentTranscript("");
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 1000);
            } else {
                nextRound();
            }
        } else {
            // Start
            setIsRecording(true);
            setCurrentTranscript("");
            startSpeechRecognition();
        }
    };

    const generateFeedback = async () => {
        try {
            // Collect questions asked (tech + hr)
            const questionsAsked = [...questions.tech, ...questions.hr];

            const response = await fetch("/api/interview/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: Object.entries(answers).map(([question, answer]) => ({ question, answer })),
                    duration: recordingTime
                })
            });

            const data = await response.json();

            if (response.ok) {
                setClarityScore(data.clarityScore || 85);
                setConfidenceScore(data.confidenceScore || 80);
                setMissingPoints(data.missingPoints || ["Focus on STAR method"]);
                setOverallFeedback(data.overallFeedback || "");
            } else {
                throw new Error("API Failed");
            }
        } catch (error) {
            console.error("Feedback error:", error);
            // Fallback to 0 if real evaluation fails
            setClarityScore(0);
            setConfidenceScore(0);
            setOverallFeedback("We encountered an error while analyzing your responses. Please ensure your microphone is working and try again.");
            setMissingPoints([
                "Could not connect to AI for detailed analysis.",
                "Ensure you speak clearly into the microphone.",
                "Verify your internet connection and Ollama status."
            ]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderSafeText = (item: any) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
            // Handle {answerId, comment} or similar
            return item.comment || item.text || item.question || JSON.stringify(item);
        }
        return String(item);
    };

    const getCurrentQuestion = () => {
        if (step === 'INTERVIEW_TECH') return renderSafeText(questions.tech[currentQuestionIndex]);
        if (step === 'INTERVIEW_HR') return renderSafeText(questions.hr[currentQuestionIndex]);
        return "";
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 min-h-screen pb-12">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-100 rounded-xl text-red-600 border border-red-200">
                    <Monitor className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900">AI Mock Interview</h2>
                    <p className="text-slate-500 font-medium">Master your Technical and HR rounds</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 px-4 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10" />
                {[
                    { id: 'RESUME', icon: FileText, label: "Resume" },
                    { id: 'MEDIA_CHECK', icon: Camera, label: "System" },
                    { id: 'INTERVIEW_TECH', icon: Brain, label: "Tech" },
                    { id: 'INTERVIEW_HR', icon: User, label: "HR Round" },
                    { id: 'FEEDBACK', icon: Sparkles, label: "Report" }
                ].map((s, i) => {
                    const isActive = s.id === step;
                    const isPast = ['RESUME', 'MEDIA_CHECK', 'INTERVIEW_TECH', 'INTERVIEW_HR', 'FEEDBACK'].indexOf(step) > i;

                    return (
                        <div key={s.id} className={`flex flex-col items-center gap-2 bg-white px-3 relative z-10 ${isActive ? 'text-slate-900' : isPast ? 'text-green-600' : 'text-slate-400'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${isActive ? 'border-red-500 bg-red-50 text-red-600 scale-110' :
                                isPast ? 'border-green-500 bg-green-50 text-green-600' :
                                    'border-slate-200 bg-slate-50'
                                }`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 min-h-[450px] flex flex-col items-center justify-center relative shadow-xl shadow-slate-100">

                {/* Step 1: Resume Upload */}
                {step === 'RESUME' && (
                    <div className="text-center max-w-lg w-full">
                        <div className="w-24 h-24 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-inner">
                            <Upload className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Ready for your interview?</h3>
                        <p className="text-slate-500 mb-10 font-medium">Upload your resume to receive personalized technical questions based on your experience.</p>

                        <label className="block w-full h-48 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden bg-slate-50/50">
                            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleResumeUpload} disabled={isGenerating} />
                            {isGenerating ? (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in transition-all">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                    <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Analyzing Your Career Path...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 bg-white rounded-2xl border border-slate-100 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <FileText className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <span className="text-slate-400 group-hover:text-slate-900 font-bold">Select Resume (PDF/DOCX)</span>
                                </>
                            )}
                        </label>
                    </div>
                )}

                {/* Step 2: Media Check */}
                {step === 'MEDIA_CHECK' && (
                    <div className="text-center w-full max-w-2xl">
                        <h3 className="text-3xl font-black text-slate-900 mb-8">Final Stage Prep</h3>

                        <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-video mb-8 relative border-4 border-white shadow-2xl">
                            <video
                                ref={videoElementRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                            {!isMediaReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
                                    <div className="text-center p-8">
                                        <Camera className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Camera & Microphone Access Required</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isMediaReady ? (
                            <button
                                onClick={startMediaCheck}
                                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 transition-all active:scale-95"
                            >
                                Grant System Access
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep('INTERVIEW_TECH')}
                                className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all animate-in bounce-in flex items-center gap-3 mx-auto"
                            >
                                Begin Official Round <CheckCircle className="w-6 h-6 text-green-400" />
                            </button>
                        )}
                    </div>
                )}

                {/* Steps 3 & 4: Interview */}
                {(step === 'INTERVIEW_TECH' || step === 'INTERVIEW_HR') && (
                    <div className="w-full max-w-3xl flex flex-col items-center">
                        <div className="absolute top-10 left-10 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live AI Interview</span>
                        </div>

                        {/* Question */}
                        <div className="text-center mb-16 animate-in slide-in-from-bottom duration-500">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                                {step === 'INTERVIEW_TECH' ? "Foundational Tech Phase" : "Culture & Values Phase"} • Round {currentQuestionIndex + 1}
                            </span>
                            <h3 className="text-4xl font-black leading-tight text-slate-900 font-serif italic">
                                "{getCurrentQuestion()}"
                            </h3>
                        </div>

                        {/* Visualizer / Camera Overlay */}
                        <div className="relative w-full max-w-lg aspect-video bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 mb-10 shadow-2xl group">
                            <video
                                ref={(el) => {
                                    if (el && mediaStreamRef.current) el.srcObject = mediaStreamRef.current;
                                }}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-900/10">
                                {isRecording ? Array.from({ length: 24 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2.5 bg-white rounded-full animate-pulse shadow-sm"
                                        style={{
                                            height: `${Math.random() * 70 + 15}%`,
                                            animationDelay: `${Math.random() * 0.2}s`,
                                            animationDuration: '0.6s'
                                        }}
                                    />
                                )) : (
                                    <div className="p-8 bg-white/20 backdrop-blur-md rounded-full shadow-xl">
                                        <Mic className="w-12 h-12 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-6 w-full">
                            {isRecording && currentTranscript && (
                                <div className="w-full max-w-lg p-5 bg-slate-50 border border-slate-200 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                                    <p className="text-[10px] text-slate-400 mb-2 flex items-center gap-2 font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Capturing Insights...
                                    </p>
                                    <p className="text-slate-700 italic font-medium leading-relaxed">"{currentTranscript}"</p>
                                </div>
                            )}

                            <div className="text-5xl font-black text-slate-900 tabular-nums">
                                {formatTime(recordingTime)}
                            </div>
                            <button
                                onClick={toggleRecording}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-2xl ${isRecording
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
                                    }`}
                            >
                                {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-10 h-10" />}
                            </button>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {isRecording ? "Stop round and submit" : "Press to start speaking"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 5: Feedback */}
                {step === 'FEEDBACK' && (
                    <div className="w-full animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-green-100 rounded-2xl text-green-600 shadow-inner">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Session Analysis</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI Evaluation complete</p>
                                </div>
                            </div>
                            <button onClick={handleBack} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <span className="text-slate-500 text-[10px] mb-4 uppercase tracking-[0.3em] font-black">Speech Logic</span>
                                <span className="text-7xl font-black text-blue-600 tracking-tighter">{clarityScore}%</span>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                <span className="text-slate-500 text-[10px] mb-4 uppercase tracking-[0.3em] font-black">Confidence Level</span>
                                <span className="text-7xl font-black text-purple-600 tracking-tighter">{confidenceScore}%</span>
                            </div>
                        </div>

                        {overallFeedback && (
                            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-10 mb-10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-24 bg-blue-200/20 blur-3xl rounded-full -mr-12 -mt-12" />
                                <h3 className="font-black text-2xl flex items-center gap-3 mb-6 text-slate-900 relative z-10">
                                    <Sparkles className="w-8 h-8 text-blue-500" /> Professional Summary
                                </h3>
                                <p className="text-slate-700 leading-relaxed text-xl italic font-serif relative z-10">
                                    "{overallFeedback}"
                                </p>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 mb-12 shadow-sm">
                            <h3 className="font-black text-2xl flex items-center gap-3 mb-8 text-slate-900">
                                <AlertCircle className="w-8 h-8 text-yellow-500" /> Strategic Improvements
                            </h3>
                            <ul className="space-y-4">
                                {missingPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-transform hover:scale-[1.01]">
                                        <div className="mt-1.5 w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200 shrink-0" />
                                        <span className="text-slate-700 font-bold leading-relaxed">{renderSafeText(point)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Loading Overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 backdrop-blur-xl rounded-[2.5rem]">
                                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Evaluating Performance...</h3>
                                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Simulating hiring manager feedback</p>
                            </div>
                        )}

                        <div className="flex gap-6 justify-center">
                            <button
                                onClick={() => setStep('RESUME')}
                                className="px-10 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm"
                            >
                                Re-simulate Assessment
                            </button>
                            <button
                                onClick={handleBack}
                                className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl hover:shadow-slate-200"
                            >
                                Finalize Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
