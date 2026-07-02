import Link from "next/link";

import { Flag } from "@/components/ui/flag";

// Infinite, edge-masked marquee of destinations we connect. Pauses on hover
// and under reduced-motion. Each card links to its plans (Saudi cities go to
// the Saudi section, everywhere else to the international section) and wears
// its country's flag in the corner.

type Destination = {
  city: string;
  country: string;
  code: string; // ISO 3166-1 alpha-2 for flag-icons
  href: string;
  src: string;
  objectPosition?: string;
};

const DESTINATIONS: Destination[] = [
  {
    city: "London",
    country: "United Kingdom",
    code: "gb",
    href: "/plans#international",
    src: "/destinations/london.jpg",
    objectPosition: "72% center",
  },
  {
    city: "Istanbul",
    country: "Türkiye",
    code: "tr",
    href: "/plans#international",
    src: "/destinations/istanbul.jpg",
  },
  {
    city: "Islamabad",
    country: "Pakistan",
    code: "pk",
    href: "/plans#international",
    src: "/destinations/islamabad.jpg",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    code: "ae",
    href: "/plans",
    src: "/destinations/dubai.jpg",
  },
  {
    city: "Makkah",
    country: "Saudi Arabia",
    code: "sa",
    href: "/plans",
    src: "/destinations/makkah.jpg",
  },
  {
    city: "Raja Ampat",
    country: "Indonesia",
    code: "id",
    href: "/plans#international",
    src: "/destinations/raja-ampat.jpg",
  },
  {
    city: "Madinah",
    country: "Saudi Arabia",
    code: "sa",
    href: "/plans",
    src: "/destinations/madinah.jpg",
  },
  {
    city: "Sylhet",
    country: "Bangladesh",
    code: "bd",
    href: "/plans#international",
    src: "/destinations/sylhet.jpg",
  },
];

export function DestinationsMarquee() {
  // Duplicate the set so the -50% translate loops seamlessly.
  const items = [...DESTINATIONS, ...DESTINATIONS];

  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
      <ul className="flex w-max items-stretch gap-5 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((d, i) => {
          const isClone = i >= DESTINATIONS.length;
          return (
            <li
              key={i}
              aria-hidden={isClone || undefined}
              className="group/card relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line shadow-lg shadow-navy/10 sm:h-72 sm:w-56 lg:h-80 lg:w-64"
            >
              <Link
                href={d.href}
                tabIndex={isClone ? -1 : undefined}
                aria-label={
                  isClone ? undefined : `See eSIM plans for ${d.country}`
                }
                className="block h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.src}
                  alt={isClone ? "" : `${d.city}, ${d.country}`}
                  loading="lazy"
                  style={{ objectPosition: d.objectPosition }}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />

                {/* Country flag, top corner. */}
                <span className="absolute right-3 top-3 block h-[18px] w-[26px] overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/25">
                  <Flag code={d.code} />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-semibold leading-tight text-cream">
                    {d.city}
                  </p>
                  <p className="mt-0.5 text-xs text-cream">{d.country}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
