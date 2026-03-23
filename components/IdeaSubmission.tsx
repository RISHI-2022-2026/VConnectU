"use client";

import { useState } from "react";
import { ArrowLeft, Lightbulb, Rocket, Code, Target, CheckCircle, Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IdeaSubmission({ onBack }: { onBack?: () => void }) {
    const router = useRouter();
    const handleBack = onBack || (() => router.push("/dashboard"));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        problem: "",
        solution: "",
        impact: "",
        contactEmail: "",
        contactPhone: ""
    });

    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPending(true);

        try {
            const response = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    technologies: tags.join(", ")
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit idea");
            }

            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Idea Shared Successfully!</h2>
                <p className="text-slate-500 max-w-md mb-8 font-medium">
                    Your innovative concept has been submitted. Our team and potential mentors will review it shortly. Keep innovating!
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                                title: "",
                                problem: "",
                                solution: "",
                                impact: "",
                                contactEmail: "",
                                contactPhone: ""
                            });
                            setTags([]);
                        }}
                        className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-medium transition-colors shadow-sm"
                    >
                        Submit Another Idea
                    </button>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 border border-yellow-200">
                    <Lightbulb className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-inter">Share Your Innovation</h2>
                    <p className="text-slate-500 font-medium">Pitch your project idea to the world</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 rotate-135" /> {error}
                    </div>
                )}

                {/* Title */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <label className="block font-bold text-slate-700 mb-2">Project Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Smart Traffic Management System"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <label className="block font-bold text-slate-700 mb-2">Contact Email</label>
                        <input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder="innovator@example.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <label className="block font-bold text-slate-700 mb-2">Contact Phone</label>
                        <input
                            type="tel"
                            required
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <Target className="w-5 h-5" />
                            <h3 className="font-bold">The Problem</h3>
                        </div>
                        <textarea
                            required
                            rows={6}
                            value={formData.problem}
                            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                            placeholder="What specific problem does this solve? Who is facing this issue?"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all resize-none placeholder:text-slate-400 italic"
                        />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-green-600">
                            <Lightbulb className="w-5 h-5" />
                            <h3 className="font-bold">Your Solution</h3>
                        </div>
                        <textarea
                            required
                            rows={6}
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            placeholder="How does your idea fix the problem? What makes it unique?"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all resize-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Technologies */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <Code className="w-5 h-5" />
                        <h3 className="font-bold">Technologies Used</h3>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Add tech (e.g., React, Python, IoT)"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-100"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-sm font-bold flex items-center gap-2">
                                {tag}
                                <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-blue-800"><Plus className="w-3 h-3 rotate-45" /></button>
                            </span>
                        ))}
                        {tags.length === 0 && <span className="text-slate-400 text-sm font-medium">No technologies added yet.</span>}
                    </div>
                </div>

                {/* Impact */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-purple-600">
                        <Rocket className="w-5 h-5" />
                        <h3 className="font-bold">Social Impact & Benefits</h3>
                    </div>
                    <textarea
                        required
                        rows={4}
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                        placeholder="How will this help people? What is the potential impact on society?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all resize-none placeholder:text-slate-400"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl hover:shadow-slate-200 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                        {isPending ? <Plus className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isPending ? "Sharing Innovation..." : "Submit Pitch"}
                    </button>
                </div>
            </form>
        </div>
    );
}
