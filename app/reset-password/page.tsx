"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || "Something went wrong");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="p-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl">
                    Invalid or missing reset token.
                </div>
                <Link href="/login" className="text-purple-600 hover:underline font-bold">
                    Back to Login
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="p-4 text-sm font-bold text-green-700 bg-green-50 border border-green-100 rounded-2xl">
                    Password Reset Successfully!
                </div>
                <p className="text-slate-500 text-sm">
                    Redirecting you to login page...
                </p>
            </div>
        );
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
                <div className="p-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    New Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full bg-white/60 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                    placeholder="••••••••"
                />
            </div>

            <div className="space-y-3">
                <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full bg-white/60 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 shadow-2xl shadow-slate-200 flex justify-center items-center"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    "Reset Password"
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen text-slate-900 flex items-center justify-center p-6 relative">
            <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>

            <div className="w-full max-w-md space-y-10 relative z-10">
                <div className="text-center">
                    <Link href="/" className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tighter">
                        VConnectU x Skillvouch AI
                    </Link>
                    <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-900">Set New Password</h2>
                    <p className="mt-2 text-slate-500 font-medium">
                        Enter your new credentials below
                    </p>
                </div>

                <div className="bg-white/40 border border-white/60 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl shadow-slate-200">
                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
