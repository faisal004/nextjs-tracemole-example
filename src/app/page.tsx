"use client";

import { useState } from "react";
import { DashboardStats, BoroughBreakdown } from "@/components/DashboardStats";
import { RestaurantTable } from "@/components/RestaurantTable";
import { AddRestaurantForm } from "@/components/AddRestaurantForm";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          NYC Restaurants
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse, search, and manage restaurant listings across the city.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <RestaurantTable refreshKey={refreshKey} />
        <div className="space-y-6">
          <AddRestaurantForm onCreated={() => setRefreshKey((k) => k + 1)} />
          <BoroughBreakdown />
        </div>
      </div>
    </div>
  );
}
