/** Backend base URL (FastAPI). Override in `.env.local` for dev. */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
}
