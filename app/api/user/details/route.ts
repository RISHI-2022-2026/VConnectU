import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Basic validation could be done here, but usually handled in frontend

        await prisma.user.update({
            where: { id: session.userId as string },
            data: {
                dob: body.dob ? new Date(body.dob) : undefined,
                address: body.address,
                firstName: body.firstName,
                middleName: body.middleName,
                lastName: body.lastName,
                tenthSchool: body.tenthSchool,
                tenthPercent: body.tenthPercent ? parseFloat(body.tenthPercent) : undefined,
                twelfthCollege: body.twelfthCollege,
                twelfthPercent: body.twelfthPercent ? parseFloat(body.twelfthPercent) : undefined,
                ugCollege: body.ugCollege,
                ugUniversity: body.ugUniversity,
                ugPercent: body.ugPercent ? parseFloat(body.ugPercent) : undefined,
                pgCollege: body.pgCollege,
                pgUniversity: body.pgUniversity,
                pgPercent: body.pgPercent ? parseFloat(body.pgPercent) : undefined,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update user details", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
