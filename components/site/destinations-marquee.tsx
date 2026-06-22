// Infinite, edge-masked marquee of departure cities. Pauses on hover and under
// reduced-motion. Images are TEMPORARY placeholders — swap `src` for real
// destination photos (see PLACEHOLDERS.md).

type Destination = { city: string; country: string; src: string };

const DESTINATIONS: Destination[] = [
  {
    city: "London",
    country: "United Kingdom",
    src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Istanbul",
    country: "Türkiye",
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Cairo",
    country: "Egypt",
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    src: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    src: "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    src: "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Lagos",
    country: "Nigeria",
    src: "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1200&auto=format&fit=crop",
  },
  {
    city: "Karachi",
    country: "Pakistan",
    src: "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1200&auto=format&fit=crop",
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.src}
                alt={isClone ? "" : `${d.city}, ${d.country}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-semibold leading-tight text-cream">
                  {d.city}
                </p>
                <p className="mt-0.5 text-xs text-cream/70">{d.country}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
