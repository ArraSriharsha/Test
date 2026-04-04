import type { AnswerValue, Question } from "./questionnaire.types";

export function isAnswerComplete(q: Question, val: AnswerValue | undefined): boolean {
  if (val === undefined) return false;
  if (q.type === "multiSelect") {
    if (!Array.isArray(val)) return false;
    const min = q.minSelections ?? 1;
    const max = q.maxSelections ?? Infinity;
    return val.length >= min && val.length <= max;
  }
  if (typeof val === "string") return val.trim().length > 0;
  return false;
}

export function allQuestionsAnswered(
  questions: Question[],
  answers: Record<string, AnswerValue>,
): boolean {
  return questions.every((q) => isAnswerComplete(q, answers[q.id]));
}
