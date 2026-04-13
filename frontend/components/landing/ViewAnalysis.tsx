import Link from "next/link";

/**
 * Shown when the user completed the questionnaire AND has paid.
 */
export function ViewAnalysis() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/75 p-px shadow-[0_10px_40px_-20px_rgba(13,28,46,0.14)] backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
      <div className="relative rounded-[15px] bg-gradient-to-br from-white via-dent-badge-bg/50 to-white px-8 py-10 sm:px-10 sm:py-12">
        <span className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-dent-deep ring-1 ring-sky-100 sm:right-10 sm:top-10">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-dent-deep">Ready to view</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-dent-ink sm:text-3xl">
          Your pathway analysis
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#64748B]">
          Everything is set. View your personalised roadmap — exams, timelines, visa options, and
          recommended next steps.
        </p>

        <Link
          href="/analysis"
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-[#E2E8F0] bg-white px-7 py-3 text-sm font-bold text-dent-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-dent-sky/40 hover:bg-dent-badge-bg/50 active:scale-[0.98]"
        >
          <span>View your analysis</span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          >
            <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
