import Link from "next/link";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { AboutSidebarToggle } from "@/components/landing/AboutSidebarToggle";

export default function LandingAboutPage() {
  /*
   * The sidebar is hidden on this route (see LandingSidebar.tsx).
   *
   * The landing layout's <main> still has its sidebar-offset padding applied:
   *   left:  calc(--landing-outset + --landing-sidebar-w + --landing-rail-gap)
   *   right: --landing-outset
   * Plus the inner <div> adds px-1 (4px) / sm:px-2 (8px) / lg:px-3 (12px).
   *
   * We escape all of that so the about sections span the full viewport width,
   * matching the signed-out /about page exactly.
   *
   * Hardcoded totals (derived from the CSS-var values in landing/layout.tsx):
   *   left  default: 1rem + 5rem   + 2rem + 0.25rem = 8.25rem
   *   left  sm+:     1.25rem + 6.25rem + 2rem + 0.5rem  = 10rem  (= 40 × 0.25)
   *   right default: 1rem + 0.25rem = 1.25rem (= 5 × 0.25)
   *   right sm:      1.25rem + 0.5rem = 1.75rem (= 7 × 0.25)
   *   right lg:      1.25rem + 0.75rem = 2rem   (= 8 × 0.25)
   */
  return (
    <div className="-ml-33 sm:-ml-40 -mr-5 sm:-mr-7 lg:-mr-8 -mt-4 sm:-mt-5">
      <AboutSidebarToggle />
      <AboutPageContent
        secondaryCta={
          <Link
            href="/landing/packages"
            className="inline-flex items-center justify-center rounded-full border border-[#BAE6FD] bg-white px-7 py-3 text-sm font-bold text-[#0C4A6E] transition-all hover:border-[#7DD3FC] hover:bg-[#F0F9FF]"
          >
            View packages
          </Link>
        }
      />
    </div>
  );
}
