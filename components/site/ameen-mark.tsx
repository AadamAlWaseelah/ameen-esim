import { cn } from "@/lib/utils";

/**
 * The standalone Ameen "A" brand mark (calligraphic swoosh + star), inlined
 * from `Ameen eSim stand-alone A.svg` so it can be recoloured via CSS.
 * The A takes `currentColor`; the star colour comes from `starClassName`.
 * Decorative by default, so pass aria labelling only where it informs.
 */
export function AmeenMark({
  className,
  starClassName = "fill-gold-pale",
}: {
  className?: string;
  starClassName?: string;
}) {
  return (
    <svg
      viewBox="70 995 2340 1145"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("block", className)}
    >
      <path
        fill="currentColor"
        d="M1828.533,1007.925l365.253,751.945l127.839,242.973c0,0 13.525,27.151 31.918,42.01c18.754,15.151 43.515,27.864 43.515,27.864c-49.492,36.805 -108.827,50.925 -173.28,52.172c-124.58,2.409 -246.223,-59.467 -364.277,-115.694c-118.136,-52.601 -240.899,-67.161 -366.841,-55.582c-42.664,5.329 -83.263,19.948 -121.486,45.26c71.808,-72.8 170.766,-121.401 322.376,-123.074c102.2,6.965 195.584,29.158 278.704,69.08c52.039,26.108 106.102,48.844 165.952,61.934l-365.253,-729.712c-58.297,129.29 -122.689,246.391 -194.537,348.578c-105.79,148.46 -222.011,265.626 -350.961,344.608c-204.53,140.019 -427.119,173.692 -661.426,138.359c-139.394,-30.996 -256.695,-94.128 -359.695,-178.06l-123.074,-126.251c219.573,205.427 406.987,239.344 586.787,232.65c280.733,-15.034 526.663,-156.998 751.151,-377.164c130.067,-133.91 241.168,-303.758 339.05,-498.65l68.286,-153.247"
      />
      <path
        className={starClassName}
        d="M1763.698,1591.963l-89.406,91.761l93.065,84.655l86.984,-84.655l-90.644,-91.761Z"
      />
    </svg>
  );
}
