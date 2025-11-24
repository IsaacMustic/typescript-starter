import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Simple database connectivity check
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (_error) {
    return NextResponse.json(
      { status: "error", error: "Database connection failed" },
      { status: 500 }
    );
  }
}
