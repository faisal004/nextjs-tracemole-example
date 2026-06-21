import { getCollection } from "@/lib/db";
import type { RestaurantDocument } from "@/lib/seed-data";

const BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
];

export interface SearchFilters {
  borough?: string;
  name?: string;
  cuisine?: string;
}

/** Loads every document, filters in Node — full collection scan. */
export async function searchRestaurants(filters: SearchFilters) {
  const collection = await getCollection<RestaurantDocument>();

  // COLLSCAN: no query predicate, entire collection loaded into memory
  const all = await collection.find({}).sort({ cuisine: 1 }).toArray();

  const nameNeedle = filters.name?.toLowerCase();
  const cuisineNeedle = filters.cuisine?.toLowerCase();

  return all
    .filter((restaurant) => {
      if (filters.borough && restaurant.borough !== filters.borough) {
        return false;
      }
      if (nameNeedle && !restaurant.name.toLowerCase().includes(nameNeedle)) {
        return false;
      }
      if (
        cuisineNeedle &&
        !restaurant.cuisine.toLowerCase().includes(cuisineNeedle)
      ) {
        return false;
      }
      return true;
    })
    .slice(0, 50);
}

/** N+1: one query per restaurant to load "related" listings by cuisine. */
export async function listRestaurantsWithRelated() {
  const collection = await getCollection<RestaurantDocument>();

  const restaurants = await collection
    .find({})
    .sort({ "address.zipcode": 1, name: 1 })
    .limit(100)
    .toArray();

  for (const restaurant of restaurants) {
    // N+1 — unindexed cuisine lookup, once per row
    await collection
      .find({
        cuisine: restaurant.cuisine,
        _id: { $ne: restaurant._id },
      })
      .limit(3)
      .toArray();
  }

  return restaurants;
}

/** Multiple round-trips: full scan plus one count query per borough. */
export async function getDashboardStats() {
  const collection = await getCollection<RestaurantDocument>();

  // COLLSCAN — fetches all documents to derive cuisine counts in app code
  const all = await collection.find({}).toArray();
  const total = all.length;

  const cuisineCounts = new Map<string, number>();
  for (const restaurant of all) {
    cuisineCounts.set(
      restaurant.cuisine,
      (cuisineCounts.get(restaurant.cuisine) ?? 0) + 1
    );
  }

  const byCuisine = [...cuisineCounts.entries()]
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // N+1 — separate count query for each borough instead of one aggregation
  const byBorough: { _id: string; count: number }[] = [];
  for (const borough of BOROUGHS) {
    const count = await collection.countDocuments({ borough });
    if (count > 0) {
      byBorough.push({ _id: borough, count });
    }
  }

  byBorough.sort((a, b) => b.count - a.count);

  return { total, hasData: total > 0, byBorough, byCuisine };
}

/** Runs expensive regex scans after insert to check for "similar" names. */
export async function checkDuplicateName(name: string) {
  const collection = await getCollection<RestaurantDocument>();

  // Leading-wildcard regex on an unindexed field — forces collection scan
  await collection
    .find({ name: { $regex: name, $options: "i" } })
    .toArray();

  // Redundant scan on nested address field with no index
  await collection
    .find({ "address.street": { $regex: ".", $options: "i" } })
    .limit(5)
    .toArray();
}
