"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface AddRestaurantFormProps {
  onCreated?: () => void;
}

const BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
];

export function AddRestaurantForm({ onCreated }: AddRestaurantFormProps) {
  const [name, setName] = useState("");
  const [borough, setBorough] = useState("Manhattan");
  const [cuisine, setCuisine] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, borough, cuisine }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to add restaurant");
      }
      setMessage(`${data.name} was added.`);
      setName("");
      setCuisine("");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add restaurant");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Add a restaurant</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="field-input"
            placeholder="Joe's Pizza"
          />
        </Field>
        <Field label="Borough">
          <select
            value={borough}
            onChange={(e) => setBorough(e.target.value)}
            className="field-input"
          >
            {BOROUGHS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cuisine">
          <input
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            required
            className="field-input"
            placeholder="Italian"
          />
        </Field>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="animate-spin" /> : <Plus />}
          Add restaurant
        </Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  );
}

function Field({
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
