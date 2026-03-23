"use client";

import { useState } from "react";
import { JobCard, ApplyActions, JobAIAnalysis } from "@/components/JobComponents";
import { X, MapPin, DollarSign, Briefcase, Building, ExternalLink } from "lucide-react";

export default function JobsClientView({ jobs, user }: { jobs: any[], user: any }) {
    const [selectedJob, setSelectedJob] = useState<any>(null);

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <p className="text-gray-500 text-sm">No jobs found for your qualification.</p>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                    ))
                )}
            </div>

            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                                    <p className="text-purple-400 text-lg">{selectedJob.company}</p>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {selectedJob.location}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    {selectedJob.salary}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    {selectedJob.type}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                    <Building className="w-4 h-4 text-orange-400" />
                                    {selectedJob.category}
                                </div>
                                {selectedJob.deadline && (
                                    <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full text-red-300 border border-red-500/20">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        Apply by {new Date(selectedJob.deadline).toLocaleDateString()}
                                    </div>
                                )}
                                {selectedJob.examDate && (
                                    <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full text-yellow-300 border border-yellow-500/20">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        Exam: {new Date(selectedJob.examDate).toLocaleDateString()}
                                    </div>
                                )}
                                {selectedJob.examMode && (
                                    <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full text-purple-300 border border-purple-500/20">
                                        Mode: {selectedJob.examMode}
                                    </div>
                                )}
                                {selectedJob.link && (
                                    <a href={selectedJob.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full text-blue-300 border border-blue-500/20 hover:bg-blue-500/20">
                                        <ExternalLink className="w-4 h-4" />
                                        View Official Posting
                                    </a>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedJob.description}</p>
                                </div>

                                {selectedJob.selectionProcessString && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Selection Process</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.selectionProcessString.split(',').map((step: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                                    {step.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.requiredSkills && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.requiredSkills.split(',').map((skill: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="px-6 py-2 rounded-xl font-medium hover:bg-white/5 transition-colors"
                                >
                                    Close
                                </button>
                                <JobAIAnalysis job={selectedJob} user={user} />
                                <ApplyActions job={selectedJob} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
