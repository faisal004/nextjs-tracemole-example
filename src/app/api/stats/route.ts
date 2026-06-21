import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/queries";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
