import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.userId as string;

    // Find all users that the current user has exchanged messages with
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    const participantIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId !== userId) participantIds.add(msg.senderId);
      if (msg.receiverId !== userId) participantIds.add(msg.receiverId);
    });

    const participants = await prisma.user.findMany({
      where: { id: { in: Array.from(participantIds) } },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
      },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
