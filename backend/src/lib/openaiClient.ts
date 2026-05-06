import OpenAI, { APIError, RateLimitError } from "openai";

const GROQ_BASE = "https://api.groq.com/openai/v1";

let groqClient: OpenAI | null = null;
let openaiClient: OpenAI | null = null;

/**
 * Which LLM backend to use. Groq has a generous free tier (console.groq.com).
 * If both GROQ_API_KEY and OPENAI_API_KEY are set and LLM_PROVIDER is unset, Groq is preferred.
 */
function activeProvider(): "groq" | "openai" {
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (explicit === "groq") {
    if (!process.env.GROQ_API_KEY?.trim()) {
      throw new Error("LLM_PROVIDER=groq requires GROQ_API_KEY in backend/.env");
    }
    return "groq";
  }
  if (explicit === "openai") {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      throw new Error("LLM_PROVIDER=openai requires OPENAI_API_KEY in backend/.env");
    }
    return "openai";
  }
  if (process.env.GROQ_API_KEY?.trim()) return "groq";
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  throw new Error(
    "No LLM API key: set GROQ_API_KEY (free tier: https://console.groq.com) or OPENAI_API_KEY in backend/.env"
  );
}

export function getChatClient(): OpenAI {
  const provider = activeProvider();
  if (provider === "groq") {
    const key = process.env.GROQ_API_KEY!.trim();
    if (!groqClient) {
      groqClient = new OpenAI({
        apiKey: key,
        baseURL: GROQ_BASE,
      });
    }
    return groqClient;
  }
  const key = process.env.OPENAI_API_KEY!.trim();
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

export function getLlmModel(): string {
  const provider = activeProvider();
  if (provider === "groq") {
    return process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  }
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(err: unknown): boolean {
  if (err instanceof RateLimitError) return true;
  return err instanceof APIError && err.status === 429;
}

function waitMsFor429(err: unknown, attempt: number): number {
  if (err instanceof APIError && err.headers) {
    const raw =
      typeof err.headers.get === "function"
        ? err.headers.get("retry-after")
        : undefined;
    if (raw) {
      const sec = Number(raw);
      if (!Number.isNaN(sec) && sec >= 0) {
        return Math.min(60_000, Math.max(500, sec * 1000));
      }
    }
  }
  return Math.min(15_000, 800 * 2 ** attempt);
}

export async function completeJson<T>(
  system: string,
  user: string,
  schemaHint: string
): Promise<T> {
  const model = getLlmModel();
  const maxAttempts = Math.max(
    1,
    Number(process.env.OPENAI_RATE_LIMIT_RETRIES ?? 5) || 5
  );

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const client = getChatClient();
      const completion = await client.chat.completions.create({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `${user}\n\nReturn ONLY valid JSON matching: ${schemaHint}`,
          },
        ],
        temperature: 0.4,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) {
        throw new Error("Empty model response");
      }
      return JSON.parse(text) as T;
    } catch (err) {
      if (!isRateLimitError(err) || attempt === maxAttempts - 1) {
        throw err;
      }
      const wait = waitMsFor429(err, attempt);
      console.warn(
        `[llm] rate limited (attempt ${String(attempt + 1)}/${String(maxAttempts)}), waiting ${String(wait)}ms`
      );
      await sleep(wait);
    }
  }
  throw new Error("LLM request exhausted retries");
}
