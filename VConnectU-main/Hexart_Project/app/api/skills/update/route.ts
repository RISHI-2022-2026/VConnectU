import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillsKnown, skillsToLearn } = await request.json();
    const userId = session.userId as string;

    // We store the structured array as a JSON string in SQLite
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        skillsKnown: JSON.stringify(skillsKnown || []),
        skillsToLearn: JSON.stringify(skillsToLearn || []),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update skills:", err);
    return NextResponse.json(
      { error: "Failed to save skills to database" },
      { status: 500 }
    );
  }
}
