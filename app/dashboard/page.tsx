import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import QualificationSelector from "@/components/QualificationSelector";
import DashboardView from "@/components/DashboardView";
import DashboardLayout from "@/components/DashboardLayout";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    let user;
    try {
        user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            include: {
                applications: {
                    include: {
                        job: true
                    }
                }
            }
        });
    } catch (e) {
        console.error("DB Error", e);
        user = { id: session.userId, name: "User", email: "user@example.com", qualification: null };
    }

    if (!user) redirect("/login");

    if (!user.qualification) {
        return <QualificationSelector />;
    }

    return (
        <DashboardLayout user={user}>
            <DashboardView user={user} />
        </DashboardLayout>
    );
}
