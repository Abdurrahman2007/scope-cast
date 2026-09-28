import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-[0.65rem] bg-primary text-primary-foreground shadow-brand",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-[72%]" fill="none">
        <path d="M7 9h18M16 9v14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="m20 19 2.5 2.5L27 16" stroke="var(--color-background)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}