"use client";

import { useState } from "react";
import { Briefcase, Trophy, ClipboardList, Lightbulb, Monitor, ChevronLeft, ChevronRight, Rocket, Award, Users, Map, MessageSquare } from "lucide-react";
import Link from "next/link";
import IdeaFeed from "./IdeaFeed";

export default function DashboardView({ user }: { user: any }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const cards = [
        {
            title: "View Jobs",
            description: "Explore internships and job openings tailored to your qualifications and career goals.",
            icon: Briefcase,
            href: "/dashboard/jobs",
            color: "blue",
            accent: "purple",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Challenges",
            description: "Participate in global challenges, hackathons, and calls for research papers to showcase your expertise.",
            icon: Trophy,
            href: "/dashboard/competitions",
            color: "orange",
            accent: "pink",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Skill Verification",
            description: "Verify your expertise with AI-powered quizzes and manage your verified skills profile.",
            icon: Award,
            href: "/dashboard/skillvouch/skills",
            color: "indigo",
            accent: "violet",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Learning Paths",
            description: "Generate customized AI roadmaps to help you master new skills efficiently.",
            icon: Map,
            href: "/dashboard/skillvouch/roadmap",
            color: "rose",
            accent: "pink",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Find Learning Peers",
            description: "Connect with verified mentors and partners for skill exchange and collaborative learning.",
            icon: Users,
            href: "/dashboard/skillvouch/peers",
            color: "cyan",
            accent: "blue",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Upload Idea",
            description: "Pitch your innovative ideas to the community and find collaborators for your next big project.",
            icon: Lightbulb,
            href: "/dashboard/upload-idea",
            color: "yellow",
            accent: "amber",
            image: "https://images.unsplash.com/photo-1454165833767-027eeea160d7?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Resume Analyzer",
            description: "Get instant AI-powered feedback on your resume to boost your ATS score and visibility.",
            icon: ClipboardList,
            href: "/dashboard/resume-analyzer",
            color: "green",
            accent: "emerald",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "AI Mock Interview",
            description: "Practice with our adaptive AI to master your interviewing skills in realistic scenarios.",
            icon: Monitor,
            href: "/dashboard/mock-interview",
            color: "red",
            accent: "rose",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Peer Messages",
            description: "Connect and coordinate with your learning peers through our integrated messaging system.",
            icon: MessageSquare,
            href: "/dashboard/skillvouch/messages",
            color: "teal",
            accent: "emerald",
            image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const next = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

    const currentCard = cards[currentIndex];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                    Welcome back, {user.name}
                </h1>
                <p className="text-slate-500 mt-3 text-lg font-medium">Your personalized career growth platform</p>
            </div>

            <div className="relative group max-w-5xl mx-auto">
                {/* Main Carousel Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:border-purple-200 hover:shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                        {/* Visual Side */}
                        <div className="relative h-64 lg:h-auto overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br from-${currentCard.color}-500/20 to-transparent z-10`} />
                            <img
                                src={currentCard.image}
                                alt={currentCard.title}
                                className="object-cover w-full h-full transition-transform duration-1000 scale-105 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-slate-100/10 z-20" />
                            <div className="absolute center inset-0 flex items-center justify-center z-30">
                                <div className={`p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl transform transition-transform duration-500 group-hover:scale-110`}>
                                    <currentCard.icon className={`w-12 h-12 text-${currentCard.color}-400`} />
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8">
                            <div className="space-y-4">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${currentCard.color}-500/10 text-${currentCard.color}-400 text-sm font-semibold border border-${currentCard.color}-500/20 uppercase tracking-wider`}>
                                    Step {currentIndex + 1} of {cards.length}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                    {currentCard.title}
                                </h2>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    {currentCard.description}
                                </p>
                            </div>

                            <Link
                                href={currentCard.href}
                                className={`w-full lg:w-fit px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 text-center`}
                            >
                                Explore Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 px-4">
                    <button
                        onClick={prev}
                        className="p-5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-purple-200 transition-all text-slate-400 hover:text-purple-600 shadow-sm"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="flex gap-4 items-center">
                        {cards.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-12 bg-gradient-to-r from-purple-500 to-pink-500 shadow-md shadow-purple-200' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="p-5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-purple-200 transition-all text-slate-400 hover:text-purple-600 shadow-sm"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>

            {/* Innovation Feed */}
            <div className="my-20 pb-16 border-y border-white/5">
                <IdeaFeed />
            </div>

            {/* Quick Access Info */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-500">
                <div className="text-center p-4">
                    <div className="text-3xl font-bold text-slate-900 font-serif">100+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest mt-1 font-bold">Jobs Added</div>
                </div>
                <div className="text-center p-4 border-l border-slate-200">
                    <div className="text-3xl font-bold text-slate-900 font-serif">500+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest mt-1 font-bold">Users Joined</div>
                </div>
                <div className="text-center p-4 border-l border-slate-200">
                    <div className="text-3xl font-bold text-slate-900 font-serif">50+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest mt-1 font-bold">Interviews</div>
                </div>
                <div className="text-center p-4 border-l border-slate-200">
                    <div className="text-3xl font-bold text-slate-900 font-serif">20+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest mt-1 font-bold">Competitions</div>
                </div>
            </div>
        </div>
    );
}
