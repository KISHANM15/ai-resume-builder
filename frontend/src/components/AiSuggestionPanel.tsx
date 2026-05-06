import {
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
  Sparkles,
  Tag,
  Target,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-hooks'
import { apiFetch } from '@/services/api'
import type { EducationItem, ExperienceItem, ResumeData } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AiSuggestionPanelProps {
  data: ResumeData
  selectedExperience: ExperienceItem | null
  selectedEducation: EducationItem | null
  onApplySummary: (summary: string) => void
  onApplySkills: (skills: string[]) => void
  onApplyBullets: (bullets: string[]) => void
  onMergeKeywords: (keywords: string[]) => void
  onApplyCoreCompetencies: (items: string[]) => void
  onApplyRoleFocus: (text: string) => void
  onApplyEducationFields: (
    patch: Pick<EducationItem, 'honors' | 'gpa' | 'details'>
  ) => void
}

type BusyKind =
  | 'summary'
  | 'skills'
  | 'bullets'
  | 'keywords'
  | 'coreCompetencies'
  | 'roleFocus'
  | 'education'
  | null

type SuggestionDraft =
  | { kind: 'summary'; text: string }
  | { kind: 'skills'; items: string[] }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'keywords'; items: string[] }
  | { kind: 'coreCompetencies'; items: string[] }
  | { kind: 'roleFocus'; text: string }
  | {
      kind: 'education'
      honors: string
      gpa: string
      details: string
    }

export function AiSuggestionPanel({
  data,
  selectedExperience,
  selectedEducation,
  onApplySummary,
  onApplySkills,
  onApplyBullets,
  onMergeKeywords,
  onApplyCoreCompetencies,
  onApplyRoleFocus,
  onApplyEducationFields,
}: AiSuggestionPanelProps) {
  const { getIdToken, authBypassed } = useAuth()
  const [busy, setBusy] = useState<BusyKind>(null)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<SuggestionDraft | null>(null)

  const targetRoleTrimmed = data.targetRole?.trim() ?? ''
  const hasRoleSpec = Boolean(targetRoleTrimmed)

  async function run<T>(
    kind: BusyKind,
    path: string,
    body: Record<string, unknown>,
    buildDraft: (r: T) => SuggestionDraft
  ) {
    setError(null)
    if (authBypassed) return
    const token = await getIdToken()
    if (!token) {
      setError(
        'Sign in with Firebase to use suggestions. Turn off VITE_SKIP_AUTH in frontend/.env.development and configure Firebase.'
      )
      return
    }
    setBusy(kind)
    try {
      const res = await apiFetch<T>(path, {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      })
      setDraft(buildDraft(res))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Request failed'
      if (msg === 'Invalid or expired token') {
        setError(
          `${msg}. For AI features the backend must verify your login: add the Firebase service account to backend/.env (same project as the web app), restart the API, and ensure it is running on port 8787.`
        )
      } else if (
        msg.includes('AI service is not configured') ||
        msg.includes('GROQ_API_KEY') ||
        msg.includes('OPENAI_API_KEY')
      ) {
        setError(
          'AI needs a server-side key (separate from Firebase). Free option: create a key at https://console.groq.com and set GROQ_API_KEY in backend/.env — or use OPENAI_API_KEY from platform.openai.com (paid). Restart the backend after saving.'
        )
      } else {
        setError(msg)
      }
    } finally {
      setBusy(null)
    }
  }

  const baseCtx = {
    targetRole: targetRoleTrimmed || 'General professional',
    industry: data.industry?.trim() || undefined,
    jobDescriptionSnippet: data.jobDescriptionSnippet?.trim() || undefined,
  }

  function applyDraft() {
    if (!draft) return
    switch (draft.kind) {
      case 'summary':
        onApplySummary(draft.text)
        break
      case 'skills':
        onApplySkills(draft.items)
        break
      case 'bullets':
        onApplyBullets(draft.items)
        break
      case 'keywords':
        onMergeKeywords(draft.items)
        break
      case 'coreCompetencies':
        onApplyCoreCompetencies(draft.items)
        break
      case 'roleFocus':
        onApplyRoleFocus(draft.text)
        break
      case 'education':
        onApplyEducationFields({
          honors: draft.honors,
          gpa: draft.gpa,
          details: draft.details,
        })
        break
    }
    setDraft(null)
  }

  const educationSchoolOk = Boolean(selectedEducation?.school?.trim())

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-violet-200/60 bg-gradient-to-br from-violet-100/90 via-fuchsia-50/80 to-cyan-50/70 p-6 shadow-lg shadow-violet-500/10 ring-1 ring-white/60 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-fuchsia-400/25 blur-2xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute bottom-0 left-0 size-24 rounded-full bg-cyan-400/20 blur-2xl" />
      <div className="relative flex items-center gap-3 text-violet-950">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            Role-specific content suggestions
          </h3>
          <p className="text-xs font-medium text-violet-700/90">
            Server-side AI — Groq or OpenAI key stays on the server only
          </p>
        </div>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-violet-950/85">
        Use <strong className="font-semibold">Role specification</strong> above
        (target role, industry, job description) so each suggestion matches the
        job. Results appear in the preview box — apply when you are happy.
      </p>

      {!hasRoleSpec ? (
        <p className="relative mt-3 rounded-xl border border-amber-200/90 bg-amber-50/90 px-3 py-2 text-xs font-medium text-amber-950">
          Add a <strong className="font-semibold">target role</strong> for
          sharper output. Without it we still run, using a generic profile.
        </p>
      ) : null}

      {authBypassed ? (
        <p className="relative mt-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 text-xs font-medium text-amber-950">
          Demo mode skips Firebase, so AI is disabled. Set{' '}
          <code className="rounded bg-amber-100/90 px-1 font-mono text-[10px]">
            VITE_SKIP_AUTH=false
          </code>
          , add Firebase keys, run the backend with{' '}
          <code className="rounded bg-amber-100/90 px-1 font-mono text-[10px]">
            GROQ_API_KEY
          </code>{' '}
          or{' '}
          <code className="rounded bg-amber-100/90 px-1 font-mono text-[10px]">
            OPENAI_API_KEY
          </code>
          , then sign in.
        </p>
      ) : null}

      {error ? (
        <p className="relative mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-900">
          {error}
        </p>
      ) : null}

      <div className="relative mt-5 flex flex-col gap-2.5">
        <Button
          type="button"
          variant="secondary"
          className={cn(
            'w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-violet-50/90'
          )}
          disabled={busy !== null || authBypassed}
          onClick={() =>
            void run(
              'summary',
              '/api/suggestions/summary',
              {
                ...baseCtx,
                currentSummary: data.profile.summary || undefined,
                highlights: [
                  ...data.coreCompetencies.filter(Boolean).slice(0, 8),
                  ...data.projects
                    .map((p) => p.impact?.trim())
                    .filter(Boolean)
                    .slice(0, 4),
                  ...data.skills.filter(Boolean).slice(0, 14),
                ].slice(0, 24),
              },
              (r: { summary: string }) => ({ kind: 'summary', text: r.summary })
            )
          }
        >
          {busy === 'summary' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="size-4 text-violet-600" />
          )}
          Suggest professional summary
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-violet-50/90"
          disabled={busy !== null || authBypassed}
          onClick={() =>
            void run(
              'roleFocus',
              '/api/suggestions/role-focus',
              {
                ...baseCtx,
                currentRoleFocus: data.roleFocus?.trim() || undefined,
              },
              (r: { roleFocus: string }) => ({
                kind: 'roleFocus',
                text: r.roleFocus,
              })
            )
          }
        >
          {busy === 'roleFocus' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Target className="size-4 text-violet-600" />
          )}
          Suggest value proposition (headline line)
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-indigo-50/90"
          disabled={busy !== null || authBypassed}
          onClick={() =>
            void run(
              'coreCompetencies',
              '/api/suggestions/core-competencies',
              {
                ...baseCtx,
                existingCoreCompetencies: data.coreCompetencies.filter(Boolean),
              },
              (r: { coreCompetencies: string[] }) => ({
                kind: 'coreCompetencies',
                items: r.coreCompetencies,
              })
            )
          }
        >
          {busy === 'coreCompetencies' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <BookOpen className="size-4 text-indigo-600" />
          )}
          Suggest core competencies (sidebar)
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-fuchsia-50/90"
          disabled={busy !== null || authBypassed}
          onClick={() =>
            void run(
              'skills',
              '/api/suggestions/skills',
              {
                ...baseCtx,
                existingSkills: data.skills.filter(Boolean),
              },
              (r: { skills: string[] }) => ({ kind: 'skills', items: r.skills })
            )
          }
        >
          {busy === 'skills' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="size-4 text-violet-600" />
          )}
          Suggest skills for this role
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-cyan-50/90"
          disabled={busy !== null || authBypassed || !selectedExperience}
          onClick={() => {
            if (!selectedExperience) return
            void run(
              'bullets',
              '/api/suggestions/bullets',
              {
                ...baseCtx,
                jobTitle: selectedExperience.title || 'Role',
                company: selectedExperience.company || 'Company',
                existingBullets: selectedExperience.bullets.filter(Boolean),
                problemContext:
                  selectedExperience.problemContext?.trim() || undefined,
                techStack: selectedExperience.techStack?.trim() || undefined,
              },
              (r: { bullets: string[] }) => ({
                kind: 'bullets',
                items: r.bullets,
              })
            )
          }}
        >
          {busy === 'bullets' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="size-4 text-violet-600" />
          )}
          Suggest bullets for selected job
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-teal-50/90"
          disabled={
            busy !== null ||
            authBypassed ||
            !selectedEducation ||
            !educationSchoolOk
          }
          onClick={() => {
            if (!selectedEducation?.school?.trim()) return
            void run(
              'education',
              '/api/suggestions/education',
              {
                ...baseCtx,
                school: selectedEducation.school.trim(),
                degree: selectedEducation.degree?.trim() || undefined,
                field: selectedEducation.field?.trim() || undefined,
                location: selectedEducation.location?.trim() || undefined,
                startYear: selectedEducation.startYear?.trim() || undefined,
                endYear: selectedEducation.endYear?.trim() || undefined,
                existingHonors: selectedEducation.honors?.trim() || undefined,
                existingGpa: selectedEducation.gpa?.trim() || undefined,
                existingDetails: selectedEducation.details?.trim() || undefined,
              },
              (r: { honors: string; gpa: string; details: string }) => ({
                kind: 'education',
                honors: r.honors,
                gpa: r.gpa,
                details: r.details,
              })
            )
          }}
        >
          {busy === 'education' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <GraduationCap className="size-4 text-teal-600" />
          )}
          Suggest honors, GPA line & coursework (selected school)
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start rounded-xl border-violet-200/80 bg-white/90 font-medium shadow-sm hover:bg-emerald-50/90"
          disabled={busy !== null || authBypassed}
          onClick={() =>
            void run(
              'keywords',
              '/api/suggestions/keywords',
              { ...baseCtx },
              (r: { keywords: string[] }) => ({
                kind: 'keywords',
                items: r.keywords,
              })
            )
          }
        >
          {busy === 'keywords' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Tag className="size-4 text-emerald-600" />
          )}
          Suggest ATS keywords (merge into skills)
        </Button>
      </div>

      {!selectedExperience ? (
        <p className="relative mt-3 text-xs font-medium text-violet-700/80">
          Select an <strong>experience</strong> card to enable bullet
          suggestions.
        </p>
      ) : null}

      {!selectedEducation || !educationSchoolOk ? (
        <p className="relative mt-2 text-xs font-medium text-violet-700/80">
          Select an <strong>education</strong> card and enter a school name for
          education suggestions.
        </p>
      ) : null}

      {draft ? (
        <div className="relative mt-6 rounded-2xl border-2 border-violet-300/70 bg-white/95 p-4 shadow-inner ring-1 ring-white/80">
          <div className="flex items-start justify-between gap-2 border-b border-violet-100 pb-2">
            <p className="text-sm font-bold text-violet-950">
              {draft.kind === 'summary' && 'Summary preview'}
              {draft.kind === 'skills' && 'Skills preview (replaces list)'}
              {draft.kind === 'bullets' && 'Bullets preview (replaces bullets)'}
              {draft.kind === 'keywords' &&
                'Keywords preview (merge into skills)'}
              {draft.kind === 'coreCompetencies' &&
                'Core competencies preview (replaces list)'}
              {draft.kind === 'roleFocus' && 'Value proposition preview'}
              {draft.kind === 'education' && 'Education preview'}
            </p>
            <button
              type="button"
              className="rounded-lg p-1 text-slate-500 hover:bg-violet-100 hover:text-violet-900"
              onClick={() => setDraft(null)}
              aria-label="Discard preview"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 max-h-64 overflow-y-auto text-sm">
            {draft.kind === 'summary' || draft.kind === 'roleFocus' ? (
              <p className="whitespace-pre-wrap leading-relaxed text-slate-800">
                {draft.text}
              </p>
            ) : draft.kind === 'skills' ||
              draft.kind === 'keywords' ||
              draft.kind === 'coreCompetencies' ? (
              <ul className="flex flex-wrap gap-2">
                {draft.items.map((s, i) => (
                  <li
                    key={`${i}-${s}`}
                    className="rounded-lg bg-violet-100/80 px-2.5 py-1 text-xs font-medium text-violet-950"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : draft.kind === 'education' ? (
              <div className="space-y-3 text-slate-800">
                {draft.honors.trim() ? (
                  <p>
                    <span className="font-semibold text-slate-600">Honors: </span>
                    {draft.honors}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-500">Honors: (none)</p>
                )}
                {draft.gpa.trim() ? (
                  <p>
                    <span className="font-semibold text-slate-600">GPA: </span>
                    {draft.gpa}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-500">GPA: (none)</p>
                )}
                {draft.details.trim() ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    <span className="font-semibold text-slate-600">Details: </span>
                    {draft.details}
                  </p>
                ) : null}
              </div>
            ) : (
              <ul className="list-disc space-y-1.5 pl-5 text-slate-800">
                {draft.items.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-violet-100 pt-3">
            <Button
              type="button"
              className="rounded-xl font-semibold"
              onClick={() => applyDraft()}
            >
              <Check className="size-4" />
              {draft.kind === 'keywords'
                ? 'Add to skills'
                : 'Apply to resume'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              onClick={() => setDraft(null)}
            >
              Discard
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
