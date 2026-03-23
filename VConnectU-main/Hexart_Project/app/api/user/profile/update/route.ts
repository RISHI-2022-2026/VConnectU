import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const userId = session.userId as string;

        // Strip out fields that shouldn't be edited via this endpoint for security or consistency
        // e.g., name and email should be read-only as requested
        const { id, name, email, createdAt, updatedAt, role, ...updatableFields } = data;

        // Format dates if present
        if (updatableFields.dob) {
            updatableFields.dob = new Date(updatableFields.dob);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...updatableFields,
                // Ensure skillsKnown and skillsToLearn are strings if they come as objects
                skillsKnown: typeof updatableFields.skillsKnown === 'object' ? JSON.stringify(updatableFields.skillsKnown) : updatableFields.skillsKnown,
                skillsToLearn: typeof updatableFields.skillsToLearn === 'object' ? JSON.stringify(updatableFields.skillsToLearn) : updatableFields.skillsToLearn
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 });
    }
}
