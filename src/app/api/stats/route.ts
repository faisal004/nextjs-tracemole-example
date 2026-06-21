import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";

export async function GET() {
  try {
    const collection = await getCollection();
    const total = await collection.countDocuments();

    const byBorough = await collection
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$borough", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const byCuisine = await collection
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$cuisine", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ])
      .toArray();

    return NextResponse.json({
      total,
      hasData: total > 0,
      byBorough,
      byCuisine,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
