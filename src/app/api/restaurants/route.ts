import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { RestaurantDocument } from "@/lib/seed-data";

export async function GET() {
  try {
    const collection = await getCollection();
    const restaurants = await collection
      .find({})
      .sort({ borough: 1, name: 1 })
      .limit(100)
      .toArray();

    return NextResponse.json(restaurants);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RestaurantDocument>;

    if (!body.name?.trim() || !body.borough?.trim() || !body.cuisine?.trim()) {
      return NextResponse.json(
        { error: "name, borough, and cuisine are required" },
        { status: 400 }
      );
    }

    const document: RestaurantDocument = {
      name: body.name.trim(),
      borough: body.borough.trim(),
      cuisine: body.cuisine.trim(),
      address: body.address ?? {
        building: "1",
        street: "Unknown St",
        zipcode: "10001",
      },
      grades: body.grades ?? [{ date: new Date().toISOString().slice(0, 10), grade: "A" }],
    };

    const collection = await getCollection();
    const result = await collection.insertOne(document);

    return NextResponse.json(
      { ...document, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create restaurant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
