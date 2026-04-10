/** Client-side hints aligned with backend expectations for Q1 (degree + country). */

const DEGREE_TOKEN =
  /\b(BDS|DDS|DMD|BCHD|BSCD|MDS|BChD|BScD|B\.?D\.?S\.?|D\.?D\.?S\.?|D\.?M\.?D\.?)\b/i;

/** Country name or region hint (not exhaustive — guides the user). */
const COUNTRY_OR_SEPARATOR =
  /\b(india|usa|u\.s\.|united states|uk|britain|england|canada|philippines|spain|mexico|china|pakistan|nigeria|egypt|australia|nepal|bangladesh|sri lanka|uae|ireland|germany|france)\b/i;

function hasDegreeCountrySeparator(s: string): boolean {
  return /[/,;|]/.test(s);
}

/**
 * Returns an error message if the value looks incomplete, else undefined.
 * Empty string is treated as no error (field "incomplete" is handled elsewhere).
 */
export function validateQ1DegreeBackground(raw: string): string | undefined {
  const s = raw.trim();
  if (s.length === 0) return undefined;
  if (s.length < 6) {
    return "Add a bit more detail (e.g. BDS / India).";
  }
  if (!DEGREE_TOKEN.test(s)) {
    return "Include your dental degree (e.g. BDS, DDS, DMD).";
  }
  if (!COUNTRY_OR_SEPARATOR.test(s) && !hasDegreeCountrySeparator(s)) {
    return "Include where you studied (country) or use a separator like BDS / India.";
  }
  return undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmailFormat(email: string): string | undefined {
  const s = email.trim();
  if (s.length === 0) return undefined;
  if (!EMAIL_RE.test(s)) return "Enter a valid email address.";
  return undefined;
}
