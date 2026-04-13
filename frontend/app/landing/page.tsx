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
const HAS_ANSWERED_QUESTIONNAIRE = false; // ← change to true after questionnaire
const HAS_PAID = false; // ← change to true after payment

function LandingHero() {
  return (
    <div className="mb-10">
      <h1 className="font-display text-2xl font-bold tracking-tight text-dent-ink sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#64748B]">
        Pick up right where you left off — your pathway to practicing dentistry in the United
        States.
      </p>
    </div>
  );
}

function StatusIndicator() {
  const steps = [
    { label: "Questionnaire", done: HAS_ANSWERED_QUESTIONNAIRE },
    { label: "Package", done: HAS_PAID },
    { label: "Analysis", done: HAS_ANSWERED_QUESTIONNAIRE && HAS_PAID },
  ];

  return (
    <div className="mb-10 flex flex-wrap items-center gap-y-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                step.done
                  ? "bg-dent-sky text-white shadow-[0_2px_8px_-2px_rgba(14,165,233,0.5)]"
                  : "border border-[#E2E8F0] bg-white text-[#94A3B8]"
              }`}
            >
              {step.done ? (
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`text-sm font-medium transition-colors duration-300 ${step.done ? "text-dent-ink" : "text-[#94A3B8]"}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`mx-4 hidden h-px w-10 sm:block ${steps[i]?.done ? "bg-dent-sky/35" : "bg-[#E2E8F0]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingHero />
``      <StatusIndicator />

      <div className="max-w-2xl">
        {!HAS_ANSWERED_QUESTIONNAIRE ? (
          <QuestionnairePrompt />
        ) : !HAS_PAID ? (
          <PaymentPrompt />
        ) : (
          <ViewAnalysis />
        )}
      </div>
    </>
  );
}
