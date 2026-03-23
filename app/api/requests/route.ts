import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const requestRecord = await prisma.exchangeRequest.create({
      data: {
        fromUserId: session.userId as string,
        toUserId: data.toUserId,
        offeredSkill: data.offeredSkill,
        requestedSkill: data.requestedSkill,
        message: data.message,
        status: "pending",
      },
    });

    return NextResponse.json(requestRecord);
  } catch (error) {
    console.error("Error creating exchange request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.userId as string;
    const requests = await prisma.exchangeRequest.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
