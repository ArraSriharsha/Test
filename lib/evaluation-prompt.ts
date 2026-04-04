import type { AnswerValue, QuestionnaireDocument } from "./questionnaire.types";

export function buildQuestionnaireContext(
  doc: QuestionnaireDocument,
  answers: Record<string, AnswerValue>,
): string {
  const lines: string[] = [`Assessment: ${doc.title}`, `Version: ${doc.id}`, ""];
  for (const q of [...doc.questions].sort((a, b) => a.order - b.order)) {
    const raw = answers[q.id];
    const text =
      raw === undefined
        ? "(not answered)"
        : Array.isArray(raw)
          ? raw.join(", ")
          : String(raw).trim() || "(empty)";
    lines.push(`Q: ${q.label}`);
    if (q.description) lines.push(`   Context: ${q.description}`);
    lines.push(`A: ${text}`);
    lines.push("");
  }
  return lines.join("\n");
}

export const EVALUATION_SYSTEM_PROMPT = `You are DentNav's clinical pathway assistant. The user is a dentist (often foreign-trained) exploring how to practice dentistry in the United States.

Based ONLY on the questionnaire answers provided, give a clear, encouraging, and practical overview. Structure your reply with short sections and bullet points where helpful. Cover:
- A brief summary of what their answers suggest about their situation
- Likely next steps or pathways to research (programs, exams, applications) at a high level
- 2–4 concrete action items for the next few weeks

Important constraints:
- Do NOT invent specific legal, visa, or immigration advice; if relevant, say they should verify with a qualified attorney or official sources.
- Do NOT claim certainty about eligibility or outcomes.
- Keep the tone professional, supportive, and realistic.`;
