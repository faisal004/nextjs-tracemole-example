import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Filter, Document } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const borough = searchParams.get("borough")?.trim();
    const name = searchParams.get("name")?.trim();
    const cuisine = searchParams.get("cuisine")?.trim();

    const query: Filter<Document> = {};

    if (borough) {
      query.borough = borough;
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: "i" };
    }

    const collection = await getCollection();
    const restaurants = await collection
      .find(query)
      .sort({ name: 1 })
      .limit(50)
      .toArray();

    return NextResponse.json(restaurants);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch restaurants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
