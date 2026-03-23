import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverId, content } = await request.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing receiverId or content" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.userId as string,
        receiverId,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
