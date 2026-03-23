import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        // Try to count users as a simple connection test
        const count = await prisma.user.count();
        return NextResponse.json({ 
            status: "healthy", 
            database: "connected", 
            userCount: count,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Health check failed:", error);
        return NextResponse.json({ 
            status: "unhealthy", 
            error: error.message,
            code: error.code,
            details: String(error),
            stack: error.stack
        }, { status: 500 });
    }
}
