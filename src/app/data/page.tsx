import { SeedPanel } from "@/components/SeedPanel";

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Setup</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Load sample restaurants or reset the list to start over.
        </p>
      </div>

      <SeedPanel />
    </div>
  );
}
