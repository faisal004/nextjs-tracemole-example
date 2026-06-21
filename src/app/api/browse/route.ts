import { NextResponse } from "next/server";
import { searchRestaurants } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const borough = searchParams.get("borough")?.trim();
    const name = searchParams.get("name")?.trim();
    const cuisine = searchParams.get("cuisine")?.trim();

    const restaurants = await searchRestaurants({ borough, name, cuisine });

    return NextResponse.json(restaurants);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch restaurants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
