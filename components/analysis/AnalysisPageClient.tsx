"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import analysisMock from "@/data/analysis-mock.json";
import { AnalysisView } from "@/components/analysis/AnalysisView";
import { getApiBaseUrl } from "@/lib/api";
import type { AnalysisResultPayload } from "@/lib/analysis.types";

export function AnalysisPageClient() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submission");
  const [data, setData] = useState<AnalysisResultPayload | null>(null);

  useEffect(() => {
    const cached =
      typeof window !== "undefined" ? sessionStorage.getItem("dentnav_analysis") : null;
    if (cached) {
      try {
        setData(JSON.parse(cached) as AnalysisResultPayload);
        return;
      } catch {
        /* fall through */
      }
    }

    if (!submissionId) {
      setData(analysisMock as AnalysisResultPayload);
      return;
    }

    const base = getApiBaseUrl().replace(/\/$/, "");
    fetch(`${base}/api/v1/submissions/${submissionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { analysis?: AnalysisResultPayload } | null) => {
        if (j?.analysis) {
          setData(j.analysis);
          sessionStorage.setItem("dentnav_analysis", JSON.stringify(j.analysis));
        } else {
          setData(analysisMock as AnalysisResultPayload);
        }
      })
      .catch(() => setData(analysisMock as AnalysisResultPayload));
  }, [submissionId]);

  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white font-display text-slate-600">
        Loading your analysis…
      </div>
    );
  }

  return <AnalysisView data={data} />;
}
