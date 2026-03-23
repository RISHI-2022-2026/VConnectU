import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await req.json();
        if (!jobId) {
            return NextResponse.json({ error: "Job ID required" }, { status: 400 });
        }

        // Delete the application
        await prisma.application.deleteMany({
            where: {
                userId: session.userId as string,
                jobId: jobId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Withdraw error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
