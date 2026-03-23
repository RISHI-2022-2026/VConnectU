import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ProfileEditor } from "@/components/ProfileEditor";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string }
    });

    if (!user) redirect("/login");

    return (
        <DashboardLayout user={user}>
            <div className="container mx-auto pb-12">
                <ProfileEditor user={user} />
            </div>
        </DashboardLayout>
    );
}
