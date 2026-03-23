"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Login failed");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen text-slate-900 flex items-center justify-center p-6 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
            </Link>

            <div className="w-full max-w-md space-y-10 relative z-10">
                <div className="text-center">
                    <Link href="/" className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tighter">
                        VconnectU
                    </Link>
                    <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
                    <p className="mt-2 text-slate-500 font-medium">
                        Enter your credentials to access your dashboard
                    </p>
                </div>

                <div className="bg-white/40 border border-white/60 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl shadow-slate-200">
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
                                autoComplete="email"
                                required
                                className="w-full bg-white/60 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full bg-white/60 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                                placeholder="••••••••"
                            />
                            <div className="flex justify-end px-1">
                                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-purple-700 transition-all">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 shadow-2xl shadow-slate-200 flex justify-center items-center"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                "Authenticate Session"
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm font-bold text-slate-400 italic">
                        New here?{" "}
                        <Link href="/register" className="text-purple-600 hover:text-purple-700 hover:underline transition-all">
                            Create Professional Profile
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
