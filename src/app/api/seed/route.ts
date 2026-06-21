import { NextResponse } from "next/server";
import { getCollection, getCollectionCount } from "@/lib/db";
import {
  buildSeedRestaurants,
  SEED_RESTAURANT_COUNT,
} from "@/lib/seed-build";
import { COLLECTION_NAME, DB_NAME } from "@/lib/constants";

export async function POST() {
  try {
    const collection = await getCollection();
    const existing = await collection.countDocuments();

    if (existing > 0) {
      return NextResponse.json(
        {
          error: "Collection already has data. Clear it first.",
          count: existing,
        },
        { status: 409 }
      );
    }

    const result = await collection.insertMany(buildSeedRestaurants());

    return NextResponse.json({
      message: "Database seeded successfully",
      inserted: result.insertedCount,
      database: DB_NAME,
      collection: COLLECTION_NAME,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const collection = await getCollection();
    const result = await collection.deleteMany({});
    const remaining = await getCollectionCount();

    return NextResponse.json({
      message: "Collection cleared",
      deleted: result.deletedCount,
      remaining,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to clear database";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await getCollectionCount();

    return NextResponse.json({
      database: DB_NAME,
      collection: COLLECTION_NAME,
      count,
      seedSize: SEED_RESTAURANT_COUNT,
      isSeeded: count > 0,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read seed status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
