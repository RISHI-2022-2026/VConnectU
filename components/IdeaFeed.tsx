"use client";

import { useState, useEffect } from "react";
import { Search, Lightbulb, User, Mail, Phone, Rocket, Target, Code, Calendar, ChevronRight } from "lucide-react";

export default function IdeaFeed() {
    const [query, setQuery] = useState("");
    const [ideas, setIdeas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIdea, setSelectedIdea] = useState<any>(null);

    const fetchIdeas = async (searchQuery = "") => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/ideas?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setIdeas(data);
        } catch (error) {
            console.error("Error fetching ideas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchIdeas(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                        <Rocket className="w-8 h-8 text-purple-600" />
                        Find Innovation
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">Discover and contact innovators behind these ideas</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, tech, or problem..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm placeholder:text-slate-400"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : ideas.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea) => (
                        <div
                            key={idea.id}
                            onClick={() => setSelectedIdea(idea)}
                            className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group relative overflow-hidden shadow-sm"
                        >
                            <div className="absolute top-0 right-0 p-12 bg-purple-500/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity rounded-full -mr-6 -mt-6" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
                                        <Lightbulb className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                                        {new Date(idea.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                                    {idea.title}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-2 text-sm text-slate-600 line-clamp-2 italic">
                                        <Target className="w-4 h-4 shrink-0 mt-0.5 text-red-500/70" />
                                        {idea.problem}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <User className="w-4 h-4 text-blue-500" />
                                        {idea.user?.name}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                    {idea.technologies.split(",").slice(0, 3).map((tech: string, i: number) => (
                                        <span key={i} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-md text-slate-500 border border-slate-100">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium font-inter">No ideas found matching your search.</p>
                </div>
            )}

            {/* Idea Modal */}
            {selectedIdea && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-12 space-y-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-200">
                                        Innovation Pitch
                                    </div>
                                    <h2 className="text-4xl font-bold text-slate-900">{selectedIdea.title}</h2>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-lg">{selectedIdea.user?.name}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedIdea(null)}
                                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm"
                                >
                                    <ChevronRight className="w-6 h-6 rotate-45" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div className="bg-red-50 border border-red-100 rounded-3xl p-7 space-y-3 shadow-sm">
                                        <h3 className="font-bold flex items-center gap-2 text-red-600">
                                            <Target className="w-5 h-5" /> The Problem
                                        </h3>
                                        <p className="text-slate-700 leading-relaxed italic text-lg line-height-relaxed">"{selectedIdea.problem}"</p>
                                    </div>

                                    <div className="bg-green-50 border border-green-100 rounded-3xl p-7 space-y-3 shadow-sm">
                                        <h3 className="font-bold flex items-center gap-2 text-green-600">
                                            <Lightbulb className="w-5 h-5" /> The Solution
                                        </h3>
                                        <p className="text-slate-700 leading-relaxed text-lg">{selectedIdea.solution}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-purple-50 border border-purple-100 rounded-3xl p-7 space-y-4 shadow-sm">
                                        <h3 className="font-bold flex items-center gap-2 text-purple-700">
                                            <Mail className="w-5 h-5" /> Get in Touch
                                        </h3>
                                        <div className="space-y-3">
                                            <a
                                                href={`mailto:${selectedIdea.contactEmail}`}
                                                className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all group shadow-sm hover:shadow-md hover:border-blue-200"
                                            >
                                                <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email Innovator</span>
                                                    <span className="font-bold text-slate-700 truncate">{selectedIdea.contactEmail}</span>
                                                </div>
                                            </a>
                                            <a
                                                href={`tel:${selectedIdea.contactPhone}`}
                                                className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all group shadow-sm hover:shadow-md hover:border-green-200"
                                            >
                                                <div className="p-2.5 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Call Innovator</span>
                                                    <span className="font-bold text-slate-700">{selectedIdea.contactPhone}</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-7 space-y-3 shadow-sm">
                                        <h3 className="font-bold flex items-center gap-2 text-blue-700">
                                            <Code className="w-5 h-5" /> Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {selectedIdea.technologies.split(",").map((tech: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-xl text-sm font-bold shadow-sm">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                                    <Calendar className="w-4 h-4" />
                                    Posted on {new Date(selectedIdea.createdAt).toLocaleDateString()}
                                </div>
                                <button
                                    onClick={() => setSelectedIdea(null)}
                                    className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-slate-200"
                                >
                                    Dismiss Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
