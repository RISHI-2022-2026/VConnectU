"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { apiService } from "@/lib/skillvouchApi";
import { ChatView } from "@/components/skillvouch/ChatView";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const initialChatUserId = searchParams.get("user") || undefined;

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await apiService.getCurrentUser();
                setUserProfile(user);
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
                <p className="text-slate-500 font-medium">Loading your messages...</p>
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
                    <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
                    <p className="text-slate-500 mt-1">Connect and coordinate with your learning peers.</p>
                </div>
            </div>

            <div>
                <ChatView 
                    currentUser={userProfile} 
                    initialChatUserId={initialChatUserId} 
                />
            </div>
        </div>
    );
}
