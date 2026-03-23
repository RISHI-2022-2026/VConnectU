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

        // Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                userId: session.userId as string,
                jobId: jobId
            }
        });

        if (existing) {
            return NextResponse.json({ message: "Already applied" }, { status: 200 });
        }

        await prisma.application.create({
            data: {
                userId: session.userId as string,
                jobId: jobId,
                status: "PENDING"
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Apply error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
