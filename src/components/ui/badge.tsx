import { cn } from "@/lib/utils";

const variants = {
  default: "border-border bg-muted text-muted-foreground",
  outline: "border-border bg-transparent text-foreground",
} as const;

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
