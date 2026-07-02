import { cn } from "@/lib/utils";

/**
 * A country flag from the flag-icons set (npm: flag-icons). `code` is an ISO
 * 3166-1 alpha-2 code in any case (e.g. "GB", "sa"). The flag fills its parent
 * and is cropped to cover, so wrap it in a sized, rounded, overflow-hidden box.
 *
 * This replaces the hand-added SVGs in public/brand: any of the ~250 ISO
 * countries works by code alone, nothing to add per country.
 *
 * Decorative by default (aria-hidden); put any needed label on the wrapper.
 */
export function Flag({ code, className }: { code: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "fi !block !h-full !w-full !bg-cover !bg-center",
        `fi-${code.toLowerCase()}`,
        className,
      )}
    />
  );
}
