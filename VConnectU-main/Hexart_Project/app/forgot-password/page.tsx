"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || "Something went wrong");
            }

            setMessage(json.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen text-slate-900 flex items-center justify-center p-6 relative">
            <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>

            <div className="w-full max-w-md space-y-10 relative z-10">
                <div className="text-center">
                    <Link href="/" className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tighter">
                        VconnectU
                    </Link>
                    <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-900">Forgot Password?</h2>
                    <p className="mt-2 text-slate-500 font-medium">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <div className="bg-white/40 border border-white/60 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl shadow-slate-200">
                    {message ? (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="p-4 text-sm font-bold text-purple-700 bg-purple-50 border border-purple-100 rounded-2xl">
                                {message}
                            </div>
                            <p className="text-slate-400 text-sm italic">
                                Check your inbox (and spam folder) for the reset link.
                            </p>
                            <Link
                                href="/login"
                                className="block w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-slate-800 transition-all text-center"
                            >
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/60 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="you@example.com"
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
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
