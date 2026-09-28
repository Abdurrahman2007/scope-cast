import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-brand",
        className,
      )}
      aria-hidden="true"
    >
      T
    </span>
  );
}