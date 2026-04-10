import { Suspense } from "react";
import { AnalysisPageClient } from "@/components/analysis/AnalysisPageClient";

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-white font-display text-slate-600">
          Loading…
        </div>
      }
    >
      <AnalysisPageClient />
    </Suspense>
  );
}
