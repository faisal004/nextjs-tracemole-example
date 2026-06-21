"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trash2, Upload } from "lucide-react";

interface SeedStatus {
  count: number;
  seedSize: number;
  isSeeded: boolean;
}

export function SeedPanel() {
  const [status, setStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"seed" | "clear" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/seed");
      if (!response.ok) {
        throw new Error("Could not load status");
      }
      setStatus(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleSeed() {
    setAction("seed");
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/seed", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load sample data");
      }
      setMessage(`Added ${data.inserted} sample restaurants.`);
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load sample data");
    } finally {
      setAction(null);
    }
  }

  async function handleClear() {
    if (!confirm("Remove all restaurants? This cannot be undone.")) {
      return;
    }
    setAction("clear");
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/seed", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not clear restaurants");
      }
      setMessage(`Removed ${data.deleted} restaurants.`);
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clear restaurants");
    } finally {
      setAction(null);
    }
  }

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Sample data</h2>
      </div>
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Load {status?.seedSize ?? 20} NYC restaurants to get started, or clear
          everything and start fresh.
        </p>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Currently loaded:</span>
          <span className="font-medium">
            {loading ? "…" : `${status?.count ?? 0} restaurants`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSeed}
            disabled={action !== null || status?.isSeeded}
          >
            {action === "seed" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload />
            )}
            Load sample data
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={action !== null || !status?.isSeeded}
          >
            {action === "clear" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            Clear all
          </Button>
          <Button
            variant="ghost"
            onClick={loadStatus}
            disabled={loading || action !== null}
          >
            <RefreshCw />
            Refresh
          </Button>
        </div>

        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
