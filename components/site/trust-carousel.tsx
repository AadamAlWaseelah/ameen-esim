"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
  "Why Ameen" carousel — the cream chapter between the navy hero and the navy
  globe band. Honest trust signals only (brand rule: every claim true today).
  Add a slide by adding an entry to SLIDES; the track, arrows and auto-advance
  adapt. Icons are bespoke gold line art, each on a raised white tile that
  separates it from the cream background.

  Motion: native scroll-snap (swipe on touch), arrow buttons, and a gentle
  auto-advance that pauses on hover/focus/touch and under reduced motion.
*/

type Slide = { icon: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    icon: "/icons/trust/kaaba.webp",
    title: "By a UK Umrah operator",
    body: "A trading name of Al-Waseelah Tours Ltd, registered in England & Wales.",
  },
  {
    icon: "/icons/trust/envelope.webp",
    title: "Delivered by email",
    body: "Your eSIM QR arrives in minutes. No SIM card in the post, no waiting.",
  },
  {
    icon: "/icons/trust/scales.webp",
    title: "Honest, data-only",
    body: "We state coverage and throttling plainly before you buy. No dark patterns.",
  },
  {
    icon: "/icons/trust/pound.webp",
    title: "Pay in GBP",
    body: "Clear one-off pricing. No account to create, no subscription, no surprises.",
  },
  {
    icon: "/icons/trust/mast.webp",
    title: "Know your network",
    body: "We tell you whose network your eSIM runs on before you buy. Most resellers don't.",
  },
  {
    icon: "/icons/trust/headset.webp",
    title: "A real person answers",
    body: "Support comes from the same UK team that runs the tours, not a bot.",
  },
];

const AUTO_ADVANCE_MS = 4500;

export function TrustCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // One card = first slide's width + the track's column gap.
  const cardStep = useCallback(() => {
    const el = trackRef.current;
    const first = el?.querySelector("li");
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const scrollByCards = useCallback(
    (direction: -1 | 1) => {
      trackRef.current?.scrollBy({
        left: direction * cardStep(),
        behavior: "smooth",
      });
    },
    [cardStep],
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  // Auto-advance, one card at a time, wrapping back to the start.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || pausedRef.current || document.hidden) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: cardStep(), behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [cardStep]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Why buy from Ameen eSIM"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-base">
          Why Ameen eSIM
        </h2>
        <div className="flex gap-2">
          <ArrowButton
            direction="previous"
            disabled={!canPrev}
            onClick={() => scrollByCards(-1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </ArrowButton>
          <ArrowButton
            direction="next"
            disabled={!canNext}
            onClick={() => scrollByCards(1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </ArrowButton>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="scrollbar-none -mx-1 mt-7 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-1 [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]"
      >
        {SLIDES.map((slide, i) => (
          <li
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[28%] xl:w-[22%]"
          >
            {/* Icon on a raised white tile so it reads as its own object
                against the cream, not artwork floating on the background. */}
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-paper shadow-[0_14px_28px_-14px_rgba(25,32,46,0.35),0_2px_6px_-2px_rgba(25,32,46,0.12)] ring-1 ring-line/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.icon}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="size-14"
              />
            </span>
            <p className="mt-3 font-medium text-navy">{slide.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate">
              {slide.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  children,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={`${direction === "previous" ? "Previous" : "Next"} slides`}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-paper text-navy transition-[transform,border-color,opacity] duration-150 ease-out-strong hover:border-gold/50 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
