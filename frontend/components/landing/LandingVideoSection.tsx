import { LandingVideoAside } from "@/components/landing/LandingVideoAside";

/**
 * Placeholder for a future product walkthrough / embed.
 * Replace the inner block with your video player when the asset is ready.
 */
export function LandingVideoSection() {
  const tags = [
    "Product walkthrough",
    "Pathway overview",
    "Narrated screen tour",
    "Voice-over demo",
  ];

  return (
    <section
      className="mt-16 w-full scroll-mt-8 border-t border-[#E2E8F0]/80 pt-14 sm:mt-20 sm:pt-16"
      aria-labelledby="landing-video-heading"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,17.5rem)] lg:items-center lg:gap-8 xl:gap-10">
        <div className="max-w-3xl lg:max-w-none">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-dent-deep">Video</p>
          <h2
            id="landing-video-heading"
            className="mt-3 font-display text-2xl font-bold tracking-tight text-dent-ink sm:text-3xl"
          >
            See how DentNav fits your journey
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#64748B] sm:text-base lg:max-w-xl">
            We&apos;re preparing a short walkthrough that shows how credentials, exams, and state rules come
            together in one clear roadmap. Check back soon — or continue with your questionnaire and
            personalised analysis.
          </p>

          <ul
            className="mt-6 flex list-none flex-wrap gap-2 sm:mt-7 sm:gap-2.5"
            aria-label="Video topics"
          >
            {tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-white/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#475569] shadow-sm sm:px-3.5 sm:text-xs">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <LandingVideoAside />
      </div>

      <div
        className="relative mt-10 overflow-hidden rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] shadow-inner"
        role="img"
        aria-label="Video placeholder — content coming soon"
      >
        <div className="flex aspect-video flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-dent-deep shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)] ring-1 ring-[#E2E8F0] sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-dent-ink">Video placeholder</p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-[#64748B] sm:text-sm">
              Drop in an embed (YouTube, Vimeo, or Mux) or a native{" "}
              <code className="rounded bg-white/80 px-1 py-0.5 text-[11px] text-dent-deep">&lt;video&gt;</code>{" "}
              element when your file is ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
