import { SEED_RESTAURANTS, type RestaurantDocument } from "@/lib/seed-data";

const SEED_MULTIPLIER = 8;

/** Expand the base seed set so collection scans are easier to observe. */
export function buildSeedRestaurants(): RestaurantDocument[] {
  const restaurants: RestaurantDocument[] = [];

  for (let copy = 0; copy < SEED_MULTIPLIER; copy++) {
    for (const base of SEED_RESTAURANTS) {
      restaurants.push({
        ...base,
        name: copy === 0 ? base.name : `${base.name} #${copy + 1}`,
        address: {
          ...base.address,
          zipcode: String(Number(base.address.zipcode) + copy),
        },
      });
    }
  }

  return restaurants;
}

export const SEED_RESTAURANT_COUNT = buildSeedRestaurants().length;
