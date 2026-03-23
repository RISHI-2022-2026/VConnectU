"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { apiService } from "@/lib/skillvouchApi";
import { RoadmapView } from "@/components/skillvouch/RoadmapView";
import { ArrowLeft, Rocket, Loader2, Target } from "lucide-react";
import Link from "next/link";

export default function LearningPathPage() {
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState<string>("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await apiService.getCurrentUser();
                setUserProfile(user);
                if (user.skillsToLearn && user.skillsToLearn.length > 0) {
                    setSelectedSkill(user.skillsToLearn[0]);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your learning path...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
                <p className="text-slate-600 mb-6">We couldn't load your profile. Please try logging in again.</p>
                <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">Log In</Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in space-y-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-slate-600 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Rocket className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Learning Paths</h1>
                    <p className="text-slate-500 mt-1">AI-generated roadmaps to help you achieve your goals.</p>
                </div>
            </div>

            <div className="space-y-6">
                {userProfile.skillsToLearn.length > 0 ? (
                    <>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.skillsToLearn.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        selectedSkill === skill
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                        
                        {selectedSkill && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
                                <RoadmapView skillName={selectedSkill} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Learning Goals Set</h3>
                        <p className="text-slate-500 mb-6">Add skills you want to learn in the Skill Management section to generate paths.</p>
                        <Link href="/dashboard/skillvouch/skills" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium inline-block">
                            Add Skills
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
