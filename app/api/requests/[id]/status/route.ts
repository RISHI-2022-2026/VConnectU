import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await request.json();

    // ✅ FIX: await params
    const { id: requestId } = await context.params;

    const requestRecord = await prisma.exchangeRequest.update({
      where: { id: requestId },
      data: {
        status,
        completedAt: status === "completed" ? new Date() : undefined,
      },
    });

    return NextResponse.json(requestRecord);
  } catch (error) {
    console.error("Error updating request status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
