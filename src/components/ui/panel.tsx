import { cn } from "@/lib/utils";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Panel({ children, className, title }: PanelProps) {
  return (
    <section
      className={cn(
        "border border-border bg-card text-card-foreground",
        className
      )}
    >
      {title && (
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">{title}</h2>
        </header>
      )}
      {children}
    </section>
  );
}

interface PanelBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelBody({ children, className }: PanelBodyProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
