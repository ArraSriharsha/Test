import type { QuestionnaireDocument } from "./questionnaire.types";
import { getApiBaseUrl } from "./api";
import questionnaireV1 from "@/data/questionnaire.v1.json";

const QUESTIONNAIRE_PATH = "/api/v1/questionnaires/dentnav-assessment-v1";

/**
 * Loads questionnaire from the API when available; falls back to bundled JSON.
 */
export async function fetchQuestionnaire(): Promise<QuestionnaireDocument> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  try {
    const res = await fetch(`${base}${QUESTIONNAIRE_PATH}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Questionnaire HTTP ${res.status}`);
    }
    return (await res.json()) as QuestionnaireDocument;
  } catch {
    return questionnaireV1 as QuestionnaireDocument;
  }
}
