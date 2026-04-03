import type { ReactNode } from "react";
import Link from "next/link";
import DotGrid from "./DotGrid";
import { HeroFloatShowcase } from "./HeroFloatShowcase";

function ProblemCard({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-h-[110px] min-w-[160px] flex-1 flex-col gap-3 rounded-xl border border-[#F1F5F9] bg-white p-4 shadow-[0_10px_30px_rgba(13,28,46,0.04)] transition-all hover:shadow-[0_15px_35px_rgba(13,28,46,0.08)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        {icon}
      </div>
      <p className="text-sm font-semibold leading-[20px] text-[#334155]">
        {label}
      </p>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate min-h-0 overflow-hidden bg-white pb-2.5 pt-[78px] lg:min-h-[1024px] lg:pb-2.5">
      {/* Interactive dot grid background */}
      <div className="pointer-events-auto absolute inset-0 z-0" aria-hidden>
        <DotGrid
          dotSize={4}
          gap={18}
          baseColor="#E2E8F0"
          activeColor="#0EA5E9"
          proximity={88}
          speedTrigger={320}
          maxSpeed={1800}
          cursorPushScale={0.28}
          shockRadius={180}
          shockStrength={3}
          resistance={750}
          returnDuration={1}
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(14,165,233,0.06)] blur-[80px]"
        aria-hidden
      />

      {/* Figma: hero content left:48 right:770 → 622px text; illustration left:770 → 806px */}
      <div className="relative z-[2] page-shell">
        <div className="grid w-full items-start gap-12 lg:grid-cols-[minmax(0,622px)_minmax(0,1fr)] lg:items-stretch lg:gap-x-[100px]">
          <div className="max-w-[622px] lg:pt-[67px]">
            <p className="inline-flex items-center rounded-full border border-[rgba(14,165,233,0.2)] bg-dent-badge-bg px-4 py-1.5 text-xs font-bold uppercase leading-4 tracking-[0.3px] text-dent-deep">
              Navigate U.S. dentistry with confidence
            </p>

            <div className="pt-8">
              <h1 className="max-w-[620px] font-display text-xl font-bold leading-[1.09] tracking-[-1.2px] text-dent-ink sm:text-xl lg:text-[64px] lg:leading-[70px]">
                Your Journey to Practicing{" "}
                <span className="text-dent-sky">Dentistry</span> in the United States Starts Here
              </h1>
            </div>

            <div className="max-w-[600px] pt-8">
              <p className="text-xl font-normal leading-7 text-[#475569]">
                DentNav helps foreign-trained dentists navigate the complex pathway to U.S. dental careers with clarity,strategy and confidence.
              </p>
            </div>

            <div className="w-full max-w-[622px] pt-8">
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <ProblemCard
                    label="CAAPID, PASS & other applications"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                  />
                  <ProblemCard
                    label="Expert Bench Prep & Training"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 11-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                  />
                  <ProblemCard
                    label="INBDE WORLD Coming Soon.."
                    icon={
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    }
                  />
                </div>

                <p className="flex items-center gap-2 text-sm font-medium leading-5 text-dent-deep">
                  You're not alone - and you don't have to figure it out by yourself.
                </p>
              </div>
            </div>

            <div className="max-w-[530px] pt-8">
              <div className="flex flex-col gap-[11px] pt-4">
                <Link
                  href="/questionnaire"
                  className="group relative isolate inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(98.5deg,#006591_0%,#0EA5E9_100%)] px-8 py-5 text-lg font-bold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_30px_-5px_rgba(0,0,0,0.15),0_12px_15px_-6px_rgba(0,0,0,0.1)] active:scale-[0.98]"
                >
                  Start Your Journey Today
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
                <p className="px-20 text-[13px] font-normal leading-5 text-[#94A3B8]">
                  Answer a quick questionnaire to know where you stand
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-[2] flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col self-stretch overflow-visible px-0 py-6 sm:px-0 sm:py-8 lg:min-h-[min(560px,78vh)] lg:py-6 lg:pl-2 lg:-translate-y-4">
            <HeroFloatShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
