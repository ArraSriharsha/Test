export const DEMO_SESSION_COOKIE = "dentnav_demo";
export const DEMO_SESSION_VALUE = "1";

/** Same-origin path only; avoids open redirects. */
export function safeNextPath(next: string | undefined): string {
  if (!next || typeof next !== "string") return "/questionnaire";
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/questionnaire";
  return trimmed;
}
