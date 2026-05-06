import { Router, type Response } from "express";
import {
  APIError,
  AuthenticationError,
  RateLimitError,
} from "openai";
import { ZodError } from "zod";
import type { AuthedRequest } from "../middleware/requireAuth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { completeJson } from "../lib/openaiClient.js";
import {
  bulletsRequestSchema,
  bulletsResponseSchema,
  coreCompetenciesRequestSchema,
  coreCompetenciesResponseSchema,
  educationSuggestionRequestSchema,
  educationSuggestionResponseSchema,
  keywordsRequestSchema,
  keywordsResponseSchema,
  roleFocusRequestSchema,
  roleFocusResponseSchema,
  skillsRequestSchema,
  skillsResponseSchema,
  summaryRequestSchema,
  summaryResponseSchema,
} from "../schemas/suggestions.js";

const router = Router();

/** Shown when the LLM provider returns HTTP 429. */
const LLM_429_HELP =
  "The AI provider is rate-limiting your requests (not an app bug). If you use Groq (free): wait 1–2 minutes, click one button once, check limits at https://console.groq.com — If you use OpenAI: billing + limits at https://platform.openai.com/settings/organization/billing — Don’t spam clicks; one request at a time while testing.";

function handleError(res: Response, err: unknown): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid request", details: err.flatten() });
    return;
  }
  const message = err instanceof Error ? err.message : String(err);
  if (
    message.includes("No LLM API key") ||
    message.includes("OPENAI_API_KEY") ||
    message.includes("GROQ_API_KEY") ||
    message.includes("LLM_PROVIDER")
  ) {
    res.status(503).json({
      error:
        "AI service is not configured. Add GROQ_API_KEY (free: https://console.groq.com) or OPENAI_API_KEY to backend/.env and restart the API.",
    });
    return;
  }
  if (err instanceof AuthenticationError) {
    res.status(502).json({
      error:
        "LLM API key rejected. Check GROQ_API_KEY or OPENAI_API_KEY in backend/.env, restart the server, and verify the key on Groq or OpenAI.",
    });
    return;
  }
  if (
    err instanceof RateLimitError ||
    (err instanceof APIError && err.status === 429)
  ) {
    res.status(429).json({ error: LLM_429_HELP });
    return;
  }
  if (err instanceof APIError) {
    const nested =
      err.error &&
      typeof err.error === "object" &&
      "message" in err.error &&
      typeof (err.error as { message?: unknown }).message === "string"
        ? (err.error as { message: string }).message
        : "";
    const combined = `${err.message ?? ""} ${nested}`.toLowerCase();
    if (
      combined.includes("insufficient_quota") ||
      combined.includes("billing") ||
      err.code === "insufficient_quota"
    ) {
      res.status(402).json({
        error:
          "OpenAI needs billing/credits, or your quota is exhausted. Options: (1) Add billing at https://platform.openai.com/settings/organization/billing — (2) Use free Groq instead: set GROQ_API_KEY from https://console.groq.com in backend/.env (remove or leave OPENAI empty; Groq is preferred when both exist unless LLM_PROVIDER=openai).",
      });
      return;
    }
    console.error(err);
    const safe =
      nested || err.message || "Request to the AI provider failed";
    res.status(502).json({
      error: `AI provider: ${safe.slice(0, 280)}`,
    });
    return;
  }
  if (
    err instanceof SyntaxError ||
    message.includes("Unexpected token") ||
    (message.includes("JSON") && message.includes("position"))
  ) {
    res.status(500).json({
      error:
        "The model returned invalid JSON. Click the suggestion button again to retry.",
    });
    return;
  }
  if (message === "Empty model response") {
    res.status(500).json({
      error: "Empty reply from the AI model. Try again in a moment.",
    });
    return;
  }
  console.error(err);
  res.status(500).json({
    error: "Suggestion failed",
    ...(process.env.NODE_ENV !== "production"
      ? { detail: message.slice(0, 400) }
      : {}),
  });
}

router.post("/bullets", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = bulletsRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description context:\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const existing = body.existingBullets?.length
      ? `\nCurrent bullets (improve, don't copy verbatim):\n${body.existingBullets.join("\n")}`
      : "";
    const problem = body.problemContext?.trim()
      ? `\nReal-world / business context (problems, constraints, stakeholders, scale):\n${body.problemContext.trim().slice(0, 2000)}`
      : "";
    const stack = body.techStack?.trim()
      ? `\nStack & tools in this role:\n${body.techStack.trim().slice(0, 500)}`
      : "";
    const raw = await completeJson<unknown>(
      "You are an expert resume writer. Output concise, metric-driven achievement bullets that connect to business or user impact (revenue, risk, cost, quality, time, scale). JSON only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}
Position at resume: ${body.jobTitle} at ${body.company}${jd}${problem}${stack}${existing}
Produce up to 10 strong bullets tailored to the target role. Where context is thin, infer realistic impact phrasing; prefer numbers and named outcomes when plausible.`,
      '{"bullets": string[]}'
    );
    const parsed = bulletsResponseSchema.parse(raw);
    res.json({ bullets: parsed.bullets.slice(0, 10) });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/summary", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = summaryRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description:\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const cur = body.currentSummary
      ? `\nCurrent summary:\n${body.currentSummary}`
      : "";
    const hi = body.highlights?.length
      ? `\nKey highlights:\n${body.highlights.join("; ")}`
      : "";
    const raw = await completeJson<unknown>(
      "You write executive resume summaries: 3-4 sentences, third person avoided (professional first-person implied). Tie strengths to real-world outcomes (cost, risk, customers, quality, velocity). JSON only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}${cur}${hi}
Write one polished professional summary (max ~120 words). Reflect problems solved and value delivered, not generic adjectives.`,
      '{"summary": string}'
    );
    const parsed = summaryResponseSchema.parse(raw);
    res.json({
      summary: parsed.summary.slice(0, 4000),
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/skills", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = skillsRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description keywords:\n${body.jobDescriptionSnippet.slice(0, 2000)}`
      : "";
    const ex = body.existingSkills?.length
      ? `\nExisting skills to refine/merge:\n${body.existingSkills.join(", ")}`
      : "";
    const raw = await completeJson<unknown>(
      "You suggest ATS-friendly technical and soft skills for resumes as a flat list. JSON only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}${ex}
Return 12-24 distinct skills (short phrases).`,
      '{"skills": string[]}'
    );
    const parsed = skillsResponseSchema.parse(raw);
    res.json({ skills: parsed.skills.slice(0, 28) });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/keywords", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = keywordsRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description (extract keywords and hard skills from this):\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const raw = await completeJson<unknown>(
      "You extract ATS-relevant resume keywords: tools, frameworks, methodologies, and domain phrases. JSON only. No sentences — short phrases only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}
Return 14-22 distinct keywords/phrases a candidate should include for this role (overlap with common ATS parsers). Avoid generic words like "team player" unless as part of a named framework.`,
      '{"keywords": string[]}'
    );
    const parsed = keywordsResponseSchema.parse(raw);
    res.json({ keywords: parsed.keywords.slice(0, 24) });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/core-competencies", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = coreCompetenciesRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description:\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const ex = body.existingCoreCompetencies?.length
      ? `\nExisting lines (improve, dedupe):\n${body.existingCoreCompetencies.join("\n")}`
      : "";
    const raw = await completeJson<unknown>(
      "You write resume sidebar core competencies: short noun phrases (leadership, domains, delivery styles). Not skills tools — strategic strengths. JSON only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}${ex}
Return 6-12 distinct competency lines (each under ~80 chars).`,
      '{"coreCompetencies": string[]}'
    );
    const parsed = coreCompetenciesResponseSchema.parse(raw);
    res.json({ coreCompetencies: parsed.coreCompetencies.slice(0, 14) });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/role-focus", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = roleFocusRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description:\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const cur = body.currentRoleFocus?.trim()
      ? `\nCurrent value:\n${body.currentRoleFocus.trim()}`
      : "";
    const raw = await completeJson<unknown>(
      "You write one resume headline subline: value proposition — who you help and outcomes you deliver. One or two sentences max. No clichés. JSON only.",
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}${cur}
Write roleFocus: one tight professional line (~180 chars max unless clearly needed).`,
      '{"roleFocus": string}'
    );
    const parsed = roleFocusResponseSchema.parse(raw);
    res.json({ roleFocus: parsed.roleFocus.slice(0, 800) });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/education", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const body = educationSuggestionRequestSchema.parse(req.body);
    const jd = body.jobDescriptionSnippet
      ? `\nJob description (tailor coursework/relevance):\n${body.jobDescriptionSnippet.slice(0, 4000)}`
      : "";
    const edu = `
Education entry:
School: ${body.school}
Degree: ${body.degree ?? ""}
Field: ${body.field ?? ""}
Location: ${body.location ?? ""}
Dates: ${body.startYear ?? "?"} — ${body.endYear ?? "?"}
Existing honors (may refine): ${body.existingHonors ?? ""}
Existing GPA line (may refine or leave empty): ${body.existingGpa ?? ""}
Existing details (may refine): ${body.existingDetails ?? ""}`;
    const raw = await completeJson<unknown>(
      'You enhance resume education blocks for ATS and hiring managers. "honors" = short line (scholarships, Dean\'s List, cum laude) or empty string if none plausible. "gpa" = only if appropriate (e.g. "3.8/4.0") else empty string. "details" = 2-4 lines: relevant coursework, thesis, capstone, clubs/leadership tied to target role — compact. JSON only.',
      `Target role: ${body.targetRole}
Industry: ${body.industry ?? "general"}${jd}${edu}
Return honors, gpa (or ""), and details tailored to the role.`,
      '{"honors": string, "gpa": string, "details": string}'
    );
    const parsed = educationSuggestionResponseSchema.parse(raw);
    res.json({
      honors: parsed.honors.slice(0, 500),
      gpa: parsed.gpa.slice(0, 80),
      details: parsed.details.slice(0, 4000),
    });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
