import type { ReactNode } from "react";

export type LandingPromptCardProps = {
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  description: string;
  featuresTitle?: string;
  features: string[];
  gradientClassName: string;
  iconBadgeClassName: string;
  icon: ReactNode;
  children: ReactNode;
};

export function LandingPromptCard({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  featuresTitle = "What you’ll get",
  features,
  gradientClassName,
  iconBadgeClassName,
  icon,
  children,
}: LandingPromptCardProps) {
  return (
    <div className="relative w-full overflow-visible rounded-2xl border border-[#E2E8F0] bg-white/75 p-px shadow-[0_10px_40px_-20px_rgba(13,28,46,0.14)] backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
      <div
        className={`relative grid gap-10 rounded-[15px] px-8 py-10 sm:gap-12 sm:px-12 sm:py-14 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16 xl:grid-cols-[1.1fr_minmax(0,30rem)] ${gradientClassName}`}
      >
        <div className="relative min-w-0 pt-2">
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${eyebrowClassName}`}>{eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-display text-2xl font-bold tracking-tight text-dent-ink sm:text-3xl lg:text-[2rem] lg:leading-tight">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#64748B] sm:text-base">{description}</p>
          <div className="mt-10 flex flex-wrap gap-3">{children}</div>
        </div>

        <div className="relative left-[1.5rem] min-w-0 top-[1rem] pr-[2.75rem] sm:-left-[2rem] sm:pr-16 lg:-left-[1.5rem] lg:pr-[4.25rem]">
          <aside className="relative flex flex-col justify-center rounded-2xl border border-[#E2E8F0]/80 bg-white/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm sm:p-7 lg:-translate-x-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">{featuresTitle}</p>
            <ul className="mt-5 space-y-4">
              {features.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-snug text-[#3E4850]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dent-badge-bg text-dent-deep ring-1 ring-dent-sky/15">
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5" aria-hidden>
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </aside>
          <span
            className={`absolute right-[-1rem] top-[1rem] z-10 flex h-13 w-13 items-center justify-center rounded-full ring-1 sm:top-[-2rem] ${iconBadgeClassName}`}
            aria-hidden
          >
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
