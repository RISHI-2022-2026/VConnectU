import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";
import JobsClientView from "./JobsClientView";

export default async function JobsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string }
    });

    if (!user || !user.qualification) redirect("/dashboard");

    const jobs = await prisma.job.findMany({
        where: {
            minQualification: user.qualification
        }
    });

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6 animate-in fade-in duration-500">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Recommended Jobs</h2>
                </div>

                <JobsClientView jobs={jobs} user={user} />
            </div>
        </DashboardLayout>
    );
}
