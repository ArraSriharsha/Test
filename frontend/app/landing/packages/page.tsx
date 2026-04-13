import Link from "next/link";

export default function LandingPackagesPage() {
  return (
    <div className="w-full max-w-3xl pb-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-dent-deep">Packages</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-dent-ink sm:text-4xl">
        Choose your access
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#64748B]">
        Pricing and tier details will appear here. For now, return to your dashboard to continue the
        questionnaire or unlock your analysis when checkout is wired up.
      </p>
      <Link
        href="/landing"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-dent-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-dent-deep"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
