"use client";

import { useState } from "react";
import { ArrowLeft, Building, Users, BookOpen, Brain, Globe, Search, ChevronRight, Code } from "lucide-react";

const COMPANIES = [
    {
        id: "tcs",
        name: "TCS (Tata Consultancy Services)",
        logo: "🏢",
        color: "bg-blue-600",
        about: "A global leader in IT services, consulting, and business solutions.",
        process: ["Online Aptitude Test (NQT)", "Technical Interview", "Managerial Round", "HR Interview"],
        aptitude: ["Numerical Ability", "Verbal Ability", "Reasoning Ability", "Coding (Logic based)"],
        technical: ["Java/Python Basics", "DBMS/SQL", "Data Structures", "Project Discussion"],
        hr: ["Willingness to relocate", "Service agreement (Bond)", "Communication skills"],
        website: "https://www.tcs.com/careers"
    },
    {
        id: "wipro",
        name: "Wipro",
        logo: "🌈",
        color: "bg-indigo-600",
        about: "A leading global information technology, consulting and business process services company.",
        process: ["Online Assessment (NLTH)", "Technical Interview", "HR Interview"],
        aptitude: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Essay Writing"],
        technical: ["C/C++/Java", "Operating Systems", "Networking Basics", "Final Year Project"],
        hr: ["Flexibility", "Teamwork examples", "Knowledge about Wipro"],
        website: "https://careers.wipro.com/"
    },
    {
        id: "cognizant",
        name: "Cognizant",
        logo: "⚙️",
        color: "bg-teal-600",
        about: "One of the world's leading professional services companies, transforming clients' business, operating and technology models.",
        process: ["GenC / GenC Next Assessment", "Technical Interview", "HR Discussion"],
        aptitude: ["Quants", "Logical Reasoning", "Automata Fix (Code Debugging)"],
        technical: ["OOPs Concepts", "Java/Python", "SQL Queries", "Problem Solving"],
        hr: ["Relocation", "Shift flexibility", "Career goals"],
        website: "https://careers.cognizant.com/"
    },
    {
        id: "infosys",
        name: "Infosys",
        logo: "📘",
        color: "bg-blue-500",
        about: "A global leader in next-generation digital services and consulting.",
        process: ["Online Test (InfyTQ)", "Technical Round", "HR Round"],
        aptitude: ["Mathematical Ability", "Reasoning Ability", "Verbal Ability", "Pseudocode", "Puzzle Solving"],
        technical: ["dbms", "Software Engineering", "Coding Questions", "Latest Tech Trends"],
        hr: ["Strengths/Weaknesses", "Why Infosys?", "Communication check"],
        website: "https://www.infosys.com/careers/"
    },
    {
        id: "deloitte",
        name: "Deloitte",
        logo: "⚫",
        color: "bg-green-600",
        about: "Deloitte provides industry-leading audit, consulting, tax and advisory services.",
        process: ["Online Aptitude Test", "Group Discussion / JAM", "Technical Interview", "HR Interview"],
        aptitude: ["Quantitative Ability", "Logical Reasoning", "Verbal Ability", "Business Technology"],
        technical: ["Resume based questions", "Case Studies", "Core Subject Knowledge"],
        hr: ["Situational questions", "Culture fit", "Long term goals"],
        website: "https://www2.deloitte.com/ui/en/careers.html"
    },
    {
        id: "paltech",
        name: "Paltech",
        logo: "🚀",
        color: "bg-orange-600",
        about: "A specialized technology company focusing on niche solutions.",
        process: ["Aptitude & Coding Test", "Technical Interview 1", "Technical Interview 2", "HR Round"],
        aptitude: ["General Aptitude", "C Programming limit", "Data Interpretation"],
        technical: ["Deep Dive into Coding", "Algorithm Efficiency", "System Design Basics"],
        hr: ["Passion for tech", "Learning agility", "Stability"],
        website: "#"
    },
    {
        id: "zelis",
        name: "Zelis",
        logo: "⚕️",
        color: "bg-purple-600",
        about: "A healthcare technology company modernizing the healthcare financial experience.",
        process: ["Screening Call", "Technical Assessment", "Panel Interview", "Culture Round"],
        aptitude: ["Healthcare Domain logic", "Problem Solving", "Analytical Skills"],
        technical: ["Healthcare IT standards", ".NET/Java Stack", "Database Management"],
        hr: ["Healthcare interest", "Values alignment", "Remote/Hybrid work ethics"],
        website: "https://www.zelis.com/careers/"
    }
];

export default function CompanyInsights({ onBack }: { onBack: () => void }) {
    const [selectedCompany, setSelectedCompany] = useState<typeof COMPANIES[0] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCompanies = COMPANIES.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCompany) {
        return (
            <div className="animate-in slide-in-from-right duration-500">
                <button
                    onClick={() => setSelectedCompany(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Company List
                </button>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 mb-8 relative overflow-hidden shadow-xl shadow-slate-100">
                    <div className={`absolute top-0 right-0 p-32 ${selectedCompany.color} opacity-10 blur-3xl rounded-full -mr-16 -mt-16`} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                {selectedCompany.logo}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{selectedCompany.name}</h2>
                                <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-bold flex items-center gap-1 transition-all">
                                    <Globe className="w-4 h-4" /> Official Career Site
                                </a>
                            </div>
                        </div>
                        <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed italic">"{selectedCompany.about}"</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Recruitment Process */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Selection Flow</h3>
                        </div>
                        <ul className="space-y-6 relative">
                            {/* Line connector */}
                            <div className="absolute left-[19px] top-4 bottom-6 w-0.5 bg-slate-100" />

                            {selectedCompany.process.map((step, i) => (
                                <li key={i} className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-sm font-black text-blue-600 shadow-sm">
                                        {i + 1}
                                    </div>
                                    <span className="text-slate-700 font-bold">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Aptitude & Tech */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-green-300 transition-all">
                                <div className="flex items-center gap-3 mb-6 text-green-600">
                                    <Brain className="w-6 h-6" />
                                    <h3 className="font-black text-lg text-slate-900">Aptitude Topics</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCompany.aptitude.map((item, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold shadow-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-purple-300 transition-all">
                                <div className="flex items-center gap-3 mb-6 text-purple-600">
                                    <Code className="w-6 h-6" />
                                    <h3 className="font-black text-lg text-slate-900">Technical Focus</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCompany.technical.map((item, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-bold shadow-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-yellow-300 transition-all">
                            <div className="flex items-center gap-3 mb-6 text-yellow-600">
                                <BookOpen className="w-6 h-6" />
                                <h3 className="font-black text-lg text-slate-900">Interview Insights</h3>
                            </div>
                            <ul className="space-y-3">
                                {selectedCompany.hr.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
                                        <ChevronRight className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600 border border-blue-200">
                        <Building className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Company Insights</h2>
                        <p className="text-slate-500 font-medium tracking-tight">Expert guides for top-tier placements</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search top companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCompanies.map((company) => (
                    <button
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-2xl hover:border-blue-300 transition-all text-left group shadow-lg shadow-slate-100 flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
                                {company.logo}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${company.color} shadow-lg shadow-${company.color.split('-')[1]}-200`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{company.name}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 italic opacity-80">"{company.about}"</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Explore Career Tracks &rarr;
                        </div>
                    </button>
                ))}
            </div>

            {filteredCompanies.length === 0 && (
                <div className="text-center py-24 bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg italic">No results found for "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}
