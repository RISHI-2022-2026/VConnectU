import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedJobsForQualification } from "@/lib/seed-jobs";
import { QualificationLevel } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // body should contain mapping of key -> url (or boolean to indicate upload)
        // keys: marksheet10th, marksheet12th, resume, highestMarkSheet

        const updateData: any = {};
        if (body.marksheet10th) {
            updateData.marksheet10thUrl = body.marksheet10th;
            // Seed jobs if 10th marksheet is uploaded
            try {
                await seedJobsForQualification(QualificationLevel.TENTH);
            } catch (seedError) {
                console.error("Error seeding jobs:", seedError);
                // Don't fail the upload if seeding fails
            }
        }
        if (body.marksheet12th) updateData.marksheet12thUrl = body.marksheet12th;
        if (body.resume) updateData.resumeUrl = body.resume;
        if (body.highestMarkSheet) updateData.highestQualMarksheetUrl = body.highestMarkSheet;

        await prisma.user.update({
            where: { id: session.userId as string },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save documents", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
