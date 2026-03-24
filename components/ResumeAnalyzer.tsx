"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowLeft, Loader2, RefreshCw, ChevronRight, Briefcase, Lightbulb } from "lucide-react";

import { useRouter } from "next/navigation";

export default function ResumeAnalyzer({ user, onBack }: { user: any; onBack?: () => void }) {
    const router = useRouter();
    const handleBack = onBack || (() => router.push("/dashboard"));
    const [state, setState] = useState<'IDLE' | 'ANALYZING' | 'RESULT'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState("Initializing...");
    const [file, setFile] = useState<File | null>(null);
    const [score, setScore] = useState(0);
    const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
    const [suggestedRoles, setSuggestedRoles] = useState<{ software?: string[]; nonIT?: string[]; private?: string[]; government?: string[] }>({});
    const [improvementTips, setImprovementTips] = useState<{ tip: string; explanation: string }[]>([]);
    const [formattingChecks, setFormattingChecks] = useState<any[]>([]);

    // Simulated Analysis Logic
    useEffect(() => {
        if (state === 'ANALYZING' && file) {

            const analyzeResume = async () => {
                setAnalysisStep("Uploading and Scanning...");
                setProgress(10);

                try {
                    const formData = new FormData();
                    formData.append("resume", file);

                    // Simulate some progress steps while waiting (since we can't track real upload progress easily with fetch)
                    const progressInterval = setInterval(() => {
                        setProgress(prev => {
                            if (prev >= 80) return prev;
                            return prev + 10;
                        });
                        setAnalysisStep(prev => prev === "Scanning..." ? "Analyzing Content..." : "Scanning...");
                    }, 1000);

                    const response = await fetch("/api/resume/analyze", {
                        method: "POST",
                        body: formData
                    });

                    clearInterval(progressInterval);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || "Analysis failed");
                    }

                    const data = await response.json();

                    setProgress(100);
                    setAnalysisStep("Finalizing Report...");

                    setTimeout(() => {
                        setScore(data.score || 0);
                        setMissingKeywords(data.missingKeywords || []);
                        setSuggestedRoles(data.suggestedRoles || {});
                        setImprovementTips(data.improvementTips || []);
                        setFormattingChecks(data.formattingChecks || []);
                        setState('RESULT');
                    }, 500);

                } catch (error: any) {
                    console.error("Resume analysis error:", error);
                    setAnalysisStep(error.message || "Error occurred. Please try again.");
                    // Give user time to read the error
                    setTimeout(() => setState('IDLE'), 5000);
                }
            };

            analyzeResume();
        }
    }, [state, file]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setState('ANALYZING');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setState('ANALYZING');
        }
    };

    const handleDownload = () => {
        const reportTitle = `Resume Analysis Report - ${file?.name || 'Candidate'}`;
        const reportContent = `
${reportTitle}
==========================================
Date: ${new Date().toLocaleDateString()}
ATS Compatibility Score: ${score}/100
Grade: ${getScoreGrade(score)}

Missing Keywords & Skills
-------------------------
${missingKeywords.length > 0 ? missingKeywords.map(kw => `- ${kw}`).join('\n') : "No critical keywords missing."}

Suggested Job Roles
-------------------
${Object.keys(suggestedRoles).length > 0 ? Object.entries(suggestedRoles).map(([category, roles]) => `
${category.toUpperCase()}:
${Array.isArray(roles) ? roles.map(role => `- ${role}`).join('\n') : "N/A"}`).join('\n') : "N/A"}

Improvement Tips & Explanations
-------------------------------
${improvementTips.length > 0 ? improvementTips.map(t => `- ${t.tip}: ${t.explanation}`).join('\n') : "No specific improvements suggested."}

Formatting & Content Checks
---------------------------
${formattingChecks.map(check => `${check.passed ? '✓' : '✗'} ${check.label}: ${check.passed ? 'Passed' : ('Issue Found' + (check.issue ? ' - ' + check.issue : ''))}`).join('\n')}

Analysis Summary
----------------
${score >= 80 ? "Your resume is well-optimized for ATS and contains the necessary structure and keywords." : "Your resume needs some improvements to better pass through Applicant Tracking Systems. Focus on the job-role-specific keywords and the actionable tips provided above."}

Generated by VConnectU x Skillvouch AI Resume Analyzer
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Resume_Report_${file?.name.replace(/\.[^/.]+$/, "") || 'Analysis'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-600 border-green-200 bg-green-50";
        if (s >= 60) return "text-yellow-600 border-yellow-200 bg-yellow-50";
        return "text-red-600 border-red-200 bg-red-50";
    };

    const getScoreGrade = (s: number) => {
        if (s >= 80) return "Great";
        if (s >= 60) return "Good";
        return "Needs Improvement";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl text-green-600 border border-green-200">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Resume Analyzer</h2>
                    <p className="text-slate-500 text-sm font-medium">AI-Powered ATS Checker</p>
                </div>
            </div>

            {state === 'IDLE' && (
                <div
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-green-500/50 hover:bg-green-50/30 transition-all cursor-pointer relative"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                    />
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 font-inter">Upload your Resume</h3>
                    <p className="text-slate-500 mb-6 font-medium">Drag & drop or click to browse (PDF, DOCX)</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-bold uppercase tracking-tight">ATS Friendly Check</span>
                    </div>
                </div>
            )}

            {state === 'ANALYZING' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-xl">
                    <div className="w-24 h-24 relative mx-auto mb-8">
                        <Loader2 className="w-full h-full text-green-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-900">
                            {progress}%
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Analyzing Resume...</h3>
                    <p className="text-green-600 animate-pulse font-bold">{analysisStep}</p>

                    <div className="mt-8 w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-green-500 transition-all duration-500 ease-out shadow-sm"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {file && <p className="mt-4 text-sm text-slate-400 font-medium">Filename: {file.name}</p>}
                </div>
            )}

            {state === 'RESULT' && (
                <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
                    {/* Score Card */}
                    <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                        <h3 className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">ATS Compatibility Score</h3>
                        <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center mx-auto mb-4 ${getScoreColor(score)} shadow-inner`}>
                            <div>
                                <span className="text-4xl font-bold">{score}</span>
                                <span className="text-sm text-slate-400 block font-bold">/100</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black uppercase tracking-tight ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {getScoreGrade(score)}
                        </div>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                            {score >= 80 ? "Your resume is well-optimized for ATS!" : "Found some critical issues to fix."}
                        </p>
                    </div>

                    {/* Feedback Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Suggested Roles */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                Recommended Job Roles
                            </h3>
                            <div className="space-y-6">
                                {Object.keys(suggestedRoles).length > 0 ? (
                                    Object.entries(suggestedRoles).map(([category, roles]) => (
                                        <div key={category}>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                {category === 'software' ? 'Software / IT' :
                                                    category === 'nonIT' ? 'Non-IT Sector' :
                                                        category === 'private' ? 'Private Sector' :
                                                            category === 'government' ? 'Government Sector' : category}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(roles) && roles.map((role, i) => (
                                                    <span key={i} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:scale-105 cursor-default ${category === 'government' ? 'bg-orange-50 text-orange-700 border-orange-100 shadow-sm shadow-orange-50' :
                                                        category === 'software' ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm shadow-blue-50' :
                                                            category === 'private' ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm shadow-purple-50' :
                                                                'bg-slate-50 text-slate-700 border-slate-100'
                                                        }`}>
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic">No specific roles identified.</span>
                                )}
                            </div>
                        </div>

                        {/* Improvement Tips */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                Critical Improvements
                            </h3>
                            <div className="space-y-4">
                                {improvementTips.length > 0 ? (
                                    improvementTips.map((tip, i) => (
                                        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-yellow-200">
                                            <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                {tip.tip}
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                {tip.explanation}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic font-medium">No specific improvements suggested.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Missing Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {missingKeywords.length > 0 ? (
                                    missingKeywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                                            {keyword}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic font-medium">No critical keywords missing detected.</span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-3">PRO TIP: Try including these keywords to better match recruiter search filters.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Formatting Checks
                            </h3>
                            <div className="space-y-3">
                                {formattingChecks.map((check, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{check.label}</span>
                                            {check.issue && <span className="text-xs text-red-500 mt-1 font-medium">{check.issue}</span>}
                                        </div>
                                        {check.passed ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 font-black uppercase tracking-tighter">
                                                <CheckCircle className="w-3 h-3" /> Passed
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1 font-black uppercase tracking-tighter">
                                                <X className="w-3 h-3" /> Fix Needed
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setState('IDLE')}
                                className="flex-1 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Start New Analysis
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-slate-200 flex items-center justify-center gap-2"
                            >
                                Download Detailed Report <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
