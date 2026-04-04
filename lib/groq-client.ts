const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export async function groqChat(messages: GroqMessage[], options?: { model?: string }): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const model =
    options?.model ??
    process.env.GROQ_MODEL ??
    "llama-3.3-70b-versatile";

  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.55,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Groq returned an empty response");
  }
  return content.trim();
}
