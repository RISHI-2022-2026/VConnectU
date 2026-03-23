import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppliedJobsClientView from "./AppliedJobsClientView";

export default async function AppliedJobsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string },
        include: {
            applications: {
                include: {
                    job: true
                }
            }
        }
    });

    if (!user) redirect("/login");

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <h2 className="text-2xl font-bold mb-6">Applied Jobs</h2>

                <AppliedJobsClientView user={user} />
            </div>
        </DashboardLayout>
    );
}
