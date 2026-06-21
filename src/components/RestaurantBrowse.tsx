"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface Restaurant {
  _id: string;
  name: string;
  borough: string;
  cuisine: string;
  grades?: { grade: string }[];
}

const BOROUGHS = [
  "",
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
];

export function RestaurantBrowse() {
  const [borough, setBorough] = useState("");
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (borough) params.set("borough", borough);
    if (name) params.set("name", name);
    if (cuisine) params.set("cuisine", cuisine);
    return params.toString();
  }, [borough, name, cuisine]);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/browse?${queryString}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }
      setRestaurants(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Browse</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search NYC restaurants by borough, name, or cuisine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="border border-border bg-card p-4">
          <h2 className="text-sm font-medium">Filters</h2>
          <div className="mt-4 space-y-3">
            <FilterField label="Borough">
              <select
                value={borough}
                onChange={(e) => setBorough(e.target.value)}
                className="field-input"
              >
                {BOROUGHS.map((b) => (
                  <option key={b || "all"} value={b}>
                    {b || "All boroughs"}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="Search by name"
              />
            </FilterField>
            <FilterField label="Cuisine">
              <input
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="field-input"
                placeholder="e.g. Italian, Thai"
              />
            </FilterField>
            <Button onClick={search} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              Search
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Searching…"
              : `${restaurants.length} restaurant${restaurants.length === 1 ? "" : "s"} found`}
          </p>

          {error && (
            <p className="border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {!loading && !error && restaurants.length === 0 && (
            <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No restaurants match your filters. Try broadening your search or
              load sample data from Setup.
            </div>
          )}

          {!loading && restaurants.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {restaurants.map((r) => (
                <article
                  key={r._id}
                  className="border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{r.name}</h3>
                    {r.grades?.[0]?.grade && (
                      <Badge variant="outline">Grade {r.grades[0].grade}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.cuisine} · {r.borough}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
