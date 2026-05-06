import { z } from "zod";

export const suggestionsBaseSchema = z.object({
  targetRole: z.string().min(1).max(200),
  industry: z.string().max(200).optional(),
  jobDescriptionSnippet: z.string().max(8000).optional(),
});

export const bulletsRequestSchema = suggestionsBaseSchema.extend({
  jobTitle: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  existingBullets: z.array(z.string().max(500)).max(20).optional(),
  /** Business / user problem, constraints, or scale — steers impact bullets */
  problemContext: z.string().max(2000).optional(),
  /** Tools, stack, or environment */
  techStack: z.string().max(500).optional(),
});

export const summaryRequestSchema = suggestionsBaseSchema.extend({
  currentSummary: z.string().max(4000).optional(),
  highlights: z.array(z.string().max(300)).max(30).optional(),
});

export const skillsRequestSchema = suggestionsBaseSchema.extend({
  existingSkills: z.array(z.string().max(100)).max(50).optional(),
});

export const bulletsResponseSchema = z.object({
  bullets: z.array(z.string().max(500)).min(1).max(24),
});

export const summaryResponseSchema = z.object({
  summary: z.string().min(1).max(4000),
});

export const skillsResponseSchema = z.object({
  skills: z.array(z.string().max(100)).min(1).max(50),
});

export const keywordsRequestSchema = suggestionsBaseSchema;

export const keywordsResponseSchema = z.object({
  keywords: z.array(z.string().max(120)).min(4).max(36),
});

export const coreCompetenciesRequestSchema = suggestionsBaseSchema.extend({
  existingCoreCompetencies: z.array(z.string().max(200)).max(30).optional(),
});

export const coreCompetenciesResponseSchema = z.object({
  coreCompetencies: z.array(z.string().max(200)).min(1).max(16),
});

export const roleFocusRequestSchema = suggestionsBaseSchema.extend({
  currentRoleFocus: z.string().max(2000).optional(),
});

export const roleFocusResponseSchema = z.object({
  roleFocus: z.string().min(1).max(800),
});

export const educationSuggestionRequestSchema = suggestionsBaseSchema.extend({
  school: z.string().min(1).max(300),
  degree: z.string().max(300).optional(),
  field: z.string().max(300).optional(),
  location: z.string().max(200).optional(),
  startYear: z.string().max(80).optional(),
  endYear: z.string().max(80).optional(),
  existingHonors: z.string().max(500).optional(),
  existingGpa: z.string().max(80).optional(),
  existingDetails: z.string().max(4000).optional(),
});

export const educationSuggestionResponseSchema = z.object({
  honors: z.string().max(500),
  gpa: z.string().max(80),
  details: z.string().max(4000),
});
