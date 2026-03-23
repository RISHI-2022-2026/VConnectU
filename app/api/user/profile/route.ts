import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          rating: true,
          skillsKnown: true,
          skillsToLearn: true,
          learningHours: true,
          weeklyActivity: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse JSON fields
    return NextResponse.json({
        ...user,
        skillsKnown: JSON.parse(user.skillsKnown || '[]'),
        skillsToLearn: JSON.parse(user.skillsToLearn || '[]')
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
