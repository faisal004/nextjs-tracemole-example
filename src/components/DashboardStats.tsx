"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Stats {
  total: number;
  hasData: boolean;
  byBorough: { _id: string; count: number }[];
  byCuisine: { _id: string; count: number }[];
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        setStats(await response.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!stats?.hasData) {
    return (
      <div className="border border-border bg-card p-4 text-sm text-muted-foreground">
        No restaurants yet. Go to Setup to load sample data or add one below.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Restaurants" value={stats.total} />
      <StatCard label="Boroughs" value={stats.byBorough.length} />
      <StatCard label="Cuisines" value={stats.byCuisine.length} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function BoroughBreakdown() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats?.hasData) return null;

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">By borough</h2>
      </div>
      <div className="divide-y divide-border">
        {stats.byBorough.map((row) => (
          <div
            key={row._id}
            className="flex items-center justify-between px-4 py-2.5 text-sm"
          >
            <span>{row._id}</span>
            <span className="text-muted-foreground">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
