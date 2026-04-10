"use client";

import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useCallback, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { validateEmailFormat } from "@/lib/questionnaire-validation";

type LoginFormProps = {
  onSignUp?: () => void;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function LoginForm({ onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [googleBusy, setGoogleBusy] = useState(false);

  const onGoogleSuccess = useCallback(async (credential: string | undefined) => {
    if (!credential) return;
    setGoogleBusy(true);
    try {
      let submissionId: string | null = null;
      try {
        submissionId = sessionStorage.getItem("dentnav_submission_id");
      } catch {
        /* ignore */
      }
      const body: { id_token: string; submission_id?: string } = { id_token: credential };
      if (submissionId) {
        body.submission_id = submissionId;
      }
      const base = getApiBaseUrl().replace(/\/$/, "");
      const res = await fetch(`${base}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        window.alert(text || `Sign-in failed (${res.status})`);
        return;
      }
      const data = (await res.json()) as { access_token?: string };
      if (data.access_token) {
        localStorage.setItem("dentnav_access_token", data.access_token);
      }
      window.location.assign("/");
    } catch {
      window.alert("Could not reach the server. Is the API running?");
    } finally {
      setGoogleBusy(false);
    }
  }, []);

  return (
    <>
      {/* Social Auth */}
      {googleClientId ? (
        <div className="flex w-full flex-col items-stretch gap-2">
          <div className="flex w-full justify-center overflow-hidden [&_iframe]:max-w-full">
            <GoogleLogin
              onSuccess={(cred) => onGoogleSuccess(cred.credential)}
              onError={() => window.alert("Google sign-in was cancelled or failed.")}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="pill"
              width={384}
            />
          </div>
          {googleBusy ? (
            <p className="text-center text-xs font-medium text-[#6E7881]">Signing you in…</p>
          ) : null}
        </div>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-900">
          Add <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to{" "}
          <code className="rounded bg-white/80 px-1">.env.local</code> (same Web client ID as backend{" "}
          <code className="rounded bg-white/80 px-1">GOOGLE_CLIENT_ID</code>) and restart Next.js.
        </p>
      )}

      {/* Divider */}
      <div className="relative flex items-center py-2 lg:py-2.5">
        <div className="flex-grow border-t border-[#BEC8D2]/30" />
        <span className="mx-4 text-[12px] font-bold uppercase tracking-[1.2px] text-[#6E7881]">
          OR LOGIN WITH EMAIL
        </span>
        <div className="flex-grow border-t border-[#BEC8D2]/30" />
      </div>

      <form className="space-y-3 lg:space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#6E7881] lg:pl-4">
            <svg
              className="h-4 w-4 lg:h-5 lg:w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(validateEmailFormat(e.target.value));
            }}
            onBlur={(e) => setEmailError(validateEmailFormat(e.target.value))}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "login-email-error" : undefined}
            className={`w-full rounded-xl border bg-[#F8F9FF] py-2.5 pl-11 pr-3 text-sm font-medium text-[#3E4850] placeholder:text-[#6E7881]/60 transition-colors focus:outline-none lg:py-3 lg:pl-12 lg:pr-4 ${
              emailError ? "border-red-400 focus:border-red-500" : "border-[#BEC8D2] focus:border-[#0EA5E9]"
            }`}
          />
          {emailError ? (
            <p id="login-email-error" className="mt-1 text-xs font-medium text-red-600" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#6E7881] lg:pl-4">
            <svg
              className="h-4 w-4 lg:h-5 lg:w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full rounded-xl border border-[#BEC8D2] bg-[#F8F9FF] py-2.5 pl-11 pr-11 text-sm font-medium text-[#3E4850] placeholder:text-[#6E7881]/60 transition-colors focus:border-[#0EA5E9] focus:outline-none lg:py-3 lg:pl-12 lg:pr-12"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6E7881] lg:pr-4"
            aria-label="Toggle password visibility"
          >
            <svg
              className="h-4 w-4 lg:h-5 lg:w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-[#BEC8D2] text-[#0EA5E9] focus:ring-[#0EA5E9]"
            />
            <span className="text-[12px] font-[600] text-[#3E4850] transition-colors group-hover:text-[#0C1A3A]">
              Remember me
            </span>
          </label>
          <Link
            href="#"
            className="text-[12px] font-bold text-[#0EA5E9] transition-colors hover:text-[#0284C7]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#0EA5E9] py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,101,145,0.25)] transition-all hover:bg-[#0284C7] hover:shadow-[0_6px_20px_rgba(0,101,145,0.3)] active:scale-[0.98] lg:py-3"
        >
          Login
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-center text-sm font-medium text-[#3E4850]">
        Don&apos;t have an account?
        {onSignUp ? (
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex items-center gap-1 font-bold text-[#0EA5E9] transition-colors hover:text-[#0284C7]"
          >
            Sign up
            <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M1 1L11 6L1 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <Link
            href="#"
            className="inline-flex items-center gap-1 font-bold text-[#0EA5E9] transition-colors hover:text-[#0284C7]"
          >
            Sign up
            <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M1 1L11 6L1 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
    </>
  );
}
