import { BrochureDownload } from "@/components/landing/BrochureDownload";
import { LandingVideoSection } from "@/components/landing/LandingVideoSection";
import { PaymentPrompt } from "@/components/landing/PaymentPrompt";
import { QuestionnairePrompt } from "@/components/landing/QuestionnairePrompt";
import { ViewAnalysis } from "@/components/landing/ViewAnalysis";

/*
 * ─── Feature flags ───────────────────────────────────────────────────
 *
 * Change these to test different dashboard states:
 *
 *   HAS_ANSWERED_QUESTIONNAIRE
 *     • false → shows the "Answer questionnaire" prompt
 *     • true  → checks HAS_PAID next
 *
 *   HAS_PAID
 *     • false → shows the "Unlock your analysis / View packages" prompt
 *     • true  → shows the "View your analysis" card
 *
 * TODO: Replace with a real API call, e.g.:
 *   const { hasAnswered, hasPaid } = await getUserStatus();
 * ─────────────────────────────────────────────────────────────────────
 */
const HAS_ANSWERED_QUESTIONNAIRE = true; // ← change to true after questionnaire
const HAS_PAID = true; // ← change to true after payment

function LandingHero() {
  return (
    <header className="mb-12 lg:mb-14">
      <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-10">
        <div className="min-w-0 max-w-3xl flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-dent-ink sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#64748B] sm:text-[17px]">
            Your DentNav workspace brings questionnaire, package access, and pathway analysis together.
            Use the main panel to take your next step — then scroll for a quick video overview when it&apos;s
            live.
          </p>
        </div>
        <BrochureDownload />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">Tailored</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-dent-ink">Guidance built on your answers</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">Focused</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-dent-ink">Exams, docs, and sequencing</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">One place</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-dent-ink">Pick up anytime, on any device</p>
        </div>
      </div>
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full max-w-6xl pb-6">
      <LandingHero />

      <div className="w-full min-h-[min(28rem,50vh)]">
        {!HAS_ANSWERED_QUESTIONNAIRE ? (
          <QuestionnairePrompt />
        ) : !HAS_PAID ? (
          <PaymentPrompt />
        ) : (
          <ViewAnalysis />
        )}
      </div>

      <LandingVideoSection />
    </div>
  );
}
