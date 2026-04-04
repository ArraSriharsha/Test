import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import questionnaireV1 from "@/data/questionnaire.v1.json";
import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_VALUE,
} from "@/lib/demo-auth";
import { buildQuestionnaireContext, EVALUATION_SYSTEM_PROMPT } from "@/lib/evaluation-prompt";
import { groqChat } from "@/lib/groq-client";
import type { AnswerValue, QuestionnaireDocument } from "@/lib/questionnaire.types";
import { allQuestionsAnswered } from "@/lib/questionnaire-validation";

const doc = questionnaireV1 as QuestionnaireDocument;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeAnswers(raw: unknown): Record<string, AnswerValue> | null {
  if (!isRecord(raw)) return null;
  const out: Record<string, AnswerValue> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") {
      out[k] = v;
    } else if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
      out[k] = v;
    }
  }
  return out;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (jar.get(DEMO_SESSION_COOKIE)?.value !== DEMO_SESSION_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const questionnaireId = body.questionnaireId;
  if (questionnaireId !== doc.id) {
    return NextResponse.json({ error: "Unknown questionnaire" }, { status: 400 });
  }

  const answers = normalizeAnswers(body.answers);
  if (!answers) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  if (!allQuestionsAnswered(doc.questions, answers)) {
    return NextResponse.json(
      { error: "Please answer all questions before submitting." },
      { status: 400 },
    );
  }

  try {
    const userContent = buildQuestionnaireContext(doc, answers);
    const reply = await groqChat([
      { role: "system", content: EVALUATION_SYSTEM_PROMPT },
      {
        role: "user",
        content: `The dentist completed the following questionnaire. Write your mentor-style professional advice based solely on these responses:\n\n${userContent}`,
      },
    ]);

    return NextResponse.json({
      reply,
      headline: "Mentor guidance based on your responses",
      subline:
        "Tailored to your questionnaire answers. Verify critical decisions (legal, visa, licensing) with qualified professionals and official sources.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Evaluation failed";
    console.error("[evaluate]", message);
    return NextResponse.json(
      { error: message.includes("GROQ_API_KEY") ? "Groq is not configured on the server." : message },
      { status: 502 },
    );
  }
}
