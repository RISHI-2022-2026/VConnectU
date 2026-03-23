"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, LogOut, User, FileText, Briefcase, Trophy, ClipboardList, Building, Lightbulb, Monitor, ArrowLeft, Rocket, Award, Users, Map, MessageSquare, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import QualificationForm from "@/components/QualificationForm";
import DocumentUploader from "@/components/DocumentUploader";

export default function DashboardLayout({
    children,
    user
}: {
    children: React.ReactNode;
    user: any;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasDocs = () => {
        if (!user.qualification) return false;
        return !!user.marksheet10thUrl;
    };

    const [profileCompleted, setProfileCompleted] = useState(hasDocs());
    const [detailsFilled, setDetailsFilled] = useState(!!user.firstName && !!user.address);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    if (!profileCompleted) {
        const initialDocs = {
            marksheet10th: user.marksheet10thUrl,
            marksheet12th: user.marksheet12thUrl,
            resume: user.resumeUrl,
            highestMarkSheet: user.highestQualMarksheetUrl,
        };

        return (
            <div className="min-h-screen text-slate-900 p-6 pt-20">
                <div className="max-w-7xl mx-auto flex justify-end mb-4">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                {!detailsFilled ? (
                    <QualificationForm
                        qualification={user.qualification}
                        onComplete={() => {
                            setDetailsFilled(true);
                            router.refresh();
                        }}
                    />
                ) : (
                    <DocumentUploader
                        qualification={user.qualification}
                        initialData={initialDocs}
                        onComplete={() => {
                            setProfileCompleted(true);
                            router.refresh();
                        }}
                    />
                )}
            </div>
        );
    }

    const menuItems = [
        { name: "Home Dashboard", icon: Menu, href: "/dashboard" },
        { name: "View Jobs", icon: Briefcase, href: "/dashboard/jobs" },
        { name: "Challenges", icon: Trophy, href: "/dashboard/competitions" },
        { name: "Skill Verification", icon: Award, href: "/dashboard/skillvouch/skills" },
        { name: "Learning Paths", icon: Map, href: "/dashboard/skillvouch/roadmap" },
        { name: "Find Peers", icon: Users, href: "/dashboard/skillvouch/peers" },
        { name: "Upload Idea", icon: Lightbulb, href: "/dashboard/upload-idea" },
        { name: "Resume Analyzer", icon: ClipboardList, href: "/dashboard/resume-analyzer" },
        { name: "AI Mock Interview", icon: Monitor, href: "/dashboard/mock-interview" },
        { name: "Messages", icon: MessageSquare, href: "/dashboard/skillvouch/messages" },
        { name: "Applied Jobs", icon: FileText, href: "/dashboard/applied-jobs" },
        { name: "My Profile", icon: User, href: "/dashboard/profile" },
    ];

    return (
        <div className="min-h-screen text-slate-900">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>
                        <Link href="/dashboard" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            VconnectU
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center font-bold text-white shadow-sm overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name && user.name[0]
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-slate-700 leading-tight">{user.name}</p>
                                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[100px]">{user.email}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <Link 
                                    href="/dashboard/profile" 
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <User className="w-4 h-4" /> My Profile
                                </Link>
                                <Link 
                                    href="/dashboard/applied-jobs" 
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <FileText className="w-4 h-4" /> Applied Jobs
                                </Link>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute top-16 left-0 w-64 bg-white border-r border-slate-200 shadow-2xl h-[calc(100vh-64px)] animate-in slide-in-from-left duration-200 z-40">
                            <nav className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href ? 'bg-purple-50 text-purple-600 border border-purple-100 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </>
                )}
            </nav>

            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
