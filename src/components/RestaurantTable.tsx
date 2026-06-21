"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Restaurant {
  _id: string;
  name: string;
  borough: string;
  cuisine: string;
  grades?: { grade: string }[];
}

interface RestaurantTableProps {
  limit?: number;
  refreshKey?: number;
}

export function RestaurantTable({ limit, refreshKey = 0 }: RestaurantTableProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/restaurants");
      if (!response.ok) {
        throw new Error("Failed to load restaurants");
      }
      const data = await response.json();
      setRestaurants(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">All restaurants</h2>
      </div>

      {loading && (
        <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading restaurants…
        </div>
      )}

      {error && (
        <p className="border-b border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <p className="p-6 text-sm text-muted-foreground">
          No restaurants yet. Load sample data from Setup or add one on the right.
        </p>
      )}

      {!loading && restaurants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Borough
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Cuisine
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-border/80 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.borough}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.cuisine}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {r.grades?.[0]?.grade ?? "—"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
