"use client";

import { useState } from "react";
import { Book, GraduationCap, School } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QualificationSelector() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const qualifications = [
        { id: "TENTH", label: "Class 10th", icon: School, desc: "Secondary School Certificate" },
        { id: "TWELFTH", label: "Class 12th", icon: Book, desc: "Higher Secondary Certificate" },
        { id: "UG", label: "Undergraduate", icon: GraduationCap, desc: "Bachelor's Degree & Above" },
        { id: "PG", label: "Postgraduate", icon: GraduationCap, desc: "Master's Degree & Above" },
    ];

    async function selectQualification(level: string) {
        setLoading(true);
        try {
            const res = await fetch("/api/user/qualification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qualification: level }),
            });

            if (res.ok) {
                router.refresh(); // Reload to show dashboard/upload view
            }
        } catch (error) {
            console.error("Failed to set qualification");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Tell us about yourself
                    </h1>
                    <p className="text-xl text-gray-400">
                        Select your highest qualification to get started
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {qualifications.map((q) => (
                        <button
                            key={q.id}
                            disabled={loading}
                            onClick={() => selectQualification(q.id)}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all text-left space-y-4 hover:scale-105"
                        >
                            <div className="p-3 bg-purple-500/20 w-fit rounded-xl text-purple-400 group-hover:text-purple-300">
                                <q.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{q.label}</h3>
                                <p className="text-sm text-gray-400 mt-1">{q.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
