import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CompanyInsights from "@/components/CompanyInsights";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function InsightsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string }
    });

    if (!user) redirect("/login");

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6 animate-in fade-in duration-500">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <CompanyInsights onBack={() => { }} />
            </div>
        </DashboardLayout>
    );
}
