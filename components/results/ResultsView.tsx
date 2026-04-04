"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/landing/BrandLogo";
import { EVAL_RESULT_STORAGE_KEY } from "@/lib/results-storage";

export type StoredEvalResult = {
  headline?: string;
  subline?: string;
  reply: string;
  at: number;
};

export function ResultsView() {
  const router = useRouter();
  const [data, setData] = useState<StoredEvalResult | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(EVAL_RESULT_STORAGE_KEY);
      if (!raw) {
        setData(null);
        return;
      }
      const parsed = JSON.parse(raw) as StoredEvalResult;
      if (parsed && typeof parsed.reply === "string") {
        setData(parsed);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    }
  }, []);

  async function logout() {
    await fetch("/api/demo-logout", { method: "POST", credentials: "include" });
    sessionStorage.removeItem(EVAL_RESULT_STORAGE_KEY);
    router.push("/");
    router.refresh();
  }

  if (data === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 font-display text-slate-600">
        Loading…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 bg-slate-50 px-6 font-display">
        <p className="text-center text-slate-600">No results found. Complete the questionnaire first.</p>
        <Link
          href="/questionnaire"
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-600"
        >
          Go to questionnaire
        </Link>
      </div>
    );
  }

  return (
    <div className="relative isolate z-0 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col bg-[radial-gradient(129.64%_129.64%_at_-4116.67%_-4116.67%,rgba(125,211,252,0.15)_1.61%,rgba(125,211,252,0)_1.61%)] font-display">
      <nav
        className="sticky top-0 z-[100] flex w-full flex-col border-b border-slate-100 bg-white/95 backdrop-blur-[6px]"
        aria-label="Results"
      >
        <div className="flex h-[50px] w-full items-center justify-between px-7 py-2.5">
          <BrandLogo compact className="min-w-0 shrink-0" textClassName="font-bold text-[#1B3A5C]" />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              Log out
            </button>
            <Link
              href="/"
              className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center px-5 pb-16 pt-10">
        <div className="w-full max-w-3xl rounded-3xl border border-sky-500/15 bg-white/95 p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Demo preview — powered by Groq
          </p>
          <h1 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-[#0C1A3A]">
            {data.headline ?? "Your results"}
          </h1>
          {data.subline ? (
            <p className="mt-3 text-center text-sm font-medium leading-relaxed text-slate-600">{data.subline}</p>
          ) : null}

          <div className="mt-8 border-t border-slate-100 pt-8">
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-slate-800">{data.reply}</pre>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 border-t border-slate-100 pt-8">
            <p className="text-center text-xs font-medium text-slate-500">
              Your results are ready — unlock seamless onboarding when DentNav launches full evaluation and tracking.
            </p>
            <Link
              href="/questionnaire"
              className="text-sm font-bold text-sky-600 hover:text-sky-700"
            >
              Edit responses and run again
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
