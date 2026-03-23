import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function CompetitionsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string }
    });

    if (!user) redirect("/login");

    const competitions = await prisma.competition.findMany({
        orderBy: {
            deadline: 'asc'
        }
    });

    const researchPapers = (prisma as any).researchPaper
        ? await (prisma as any).researchPaper.findMany({
            orderBy: {
                deadline: 'asc'
            }
        })
        : [];

    return (
        <DashboardLayout user={user}>
            <div className="space-y-12 animate-in fade-in duration-500">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                {/* Competitions Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Competitions & Challenges</h2>
                            <p className="text-slate-600 mt-1">Showcase your skills and win rewards</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitions.map((comp, i) => (
                            <div key={i} className="bg-white/40 backdrop-blur-sm border border-slate-200 rounded-xl p-5 hover:bg-white/60 transition-all group shadow-sm hover:shadow-md flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md mb-2 inline-block">
                                            {comp.platform}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">{comp.title}</h3>
                                    </div>
                                    {comp.prize && (
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium bg-yellow-400/10 px-2 py-1 rounded-full">
                                                <Trophy className="w-3 h-3" />
                                                {comp.prize}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{comp.description}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    {comp.startDate && (
                                        <div>Start: {new Date(comp.startDate).toLocaleDateString()}</div>
                                    )}
                                    {comp.deadline && (
                                        <div>End: {new Date(comp.deadline).toLocaleDateString()}</div>
                                    )}
                                </div>

                                <a
                                    href={comp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20"
                                >
                                    Participate Now
                                </a>
                            </div>
                        ))}
                    </div>
                    {competitions.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200">
                            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No active competitions found at the moment.</p>
                        </div>
                    )}
                </section>

                <div className="h-px bg-slate-200" />

                {/* Research Papers Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Call for Papers</h2>
                            <p className="text-slate-600 mt-1">Publish your research in top journals and conferences</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {researchPapers.map((paper: any, i: number) => (
                            <div key={i} className="bg-white/40 backdrop-blur-sm border border-slate-200 rounded-xl p-5 hover:bg-white/60 transition-all group flex flex-col shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-md inline-block">
                                                {paper.publisher}
                                            </span>
                                            {paper.topic && (
                                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md inline-block">
                                                    {paper.topic}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">{paper.title}</h3>
                                        {paper.conference && (
                                            <div className="text-xs text-purple-600 mt-1 font-medium">{paper.conference}</div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-3 italic flex-grow">"{paper.description}"</p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    {paper.deadline && (
                                        <div className="flex items-center gap-1">
                                            <span className="opacity-60">Submission Deadline:</span>
                                            <span className="text-rose-600 font-medium">{new Date(paper.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20"
                                >
                                    View Call Details
                                </a>
                            </div>
                        ))}
                    </div>
                    {researchPapers.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No active calls for research papers found.</p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
