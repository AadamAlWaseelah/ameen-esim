import Image from "next/image";

import { cn } from "@/lib/utils";

type HaramainGalleryImageProps = {
  src: string;
  alt: string;
  /** Caption title revealed on hover, e.g. "Masjid al-Nabawi". */
  title: string;
  /** Small caption subtitle, e.g. "Madinah". */
  subtitle: string;
  className?: string;
  /** Resting tilt as a Tailwind rotate class, e.g. "-rotate-3". */
  tiltClassName?: string;
};

/**
 * Floating holy-site photo. Matches the provided interactive-gallery style
 * (resting tilt, scale-on-hover, gradient caption reveal) in pure CSS so it
 * stays off the critical JS path. Caption also shows on touch devices.
 */
export function HaramainGalleryImage({
  src,
  alt,
  title,
  subtitle,
  className,
  tiltClassName,
}: HaramainGalleryImageProps) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl ring-1 ring-cream/15 shadow-2xl shadow-navy/50",
        "transition-transform duration-300 ease-out-strong will-change-transform",
        "hover:z-30 hover:rotate-0 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100",
        tiltClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 38vw, 180px"
        className="object-cover"
      />

      {/* Caption overlay — gradient + reveal on hover; always shown on touch. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />
      <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
        <p className="text-sm font-semibold leading-tight text-white">{title}</p>
        <p className="mt-0.5 text-xs text-white/75">{subtitle}</p>
      </figcaption>
    </figure>
  );
}
