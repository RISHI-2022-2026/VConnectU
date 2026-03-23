"use client";

import { useState } from "react";
import { Briefcase, X, MapPin, DollarSign, Building, ExternalLink } from "lucide-react";
import { JobAIAnalysis, ApplyActions } from "@/components/JobComponents";
import Link from "next/link";

export default function AppliedJobsClientView({ user }: { user: any }) {
    const [selectedJob, setSelectedJob] = useState<any>(null);

    return (
        <>
            {!user.applications || user.applications.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">You haven't applied to any jobs yet.</p>
                    <Link
                        href="/dashboard/jobs"
                        className="mt-4 text-purple-400 hover:text-purple-300 font-medium inline-block"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {user.applications.map((app: any) => (
                        <div key={app.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                            <div>
                                <h3 className="font-semibold text-lg">{app.job.title}</h3>
                                <p className="text-gray-400 text-sm">{app.job.company}</p>
                                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                    <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    <span className={`px-2 py-0.5 rounded-full ${app.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                        app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedJob(app.job)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

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
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedJob.description}</p>
                                </div>
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
