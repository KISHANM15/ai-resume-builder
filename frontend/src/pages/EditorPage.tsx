import { ArrowLeft, Loader2, Printer, Save } from 'lucide-react'
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AiSuggestionPanel } from '@/components/AiSuggestionPanel'
import { ResumeEditorForm } from '@/components/ResumeEditorForm'
import { ResumePreview } from '@/components/ResumePreview'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-hooks'
import { getResume, saveResume } from '@/services/resumeService'
import {
  createEmptyResume,
  normalizeResumeData,
  type ResumeData,
} from '@/types/resume'

export function EditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const { user } = useAuth()
  const uid = user?.uid

  const [data, setData] = useState<ResumeData>(createEmptyResume())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedOk, setSavedOk] = useState(false)
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null)
  const [selectedEducationId, setSelectedEducationId] = useState<
    string | null
  >(null)

  const selectedExperience = useMemo(() => {
    if (!selectedExperienceId) return null
    return (
      data.experience.find((e) => e.id === selectedExperienceId) ?? null
    )
  }, [data.experience, selectedExperienceId])

  const selectedEducation = useMemo(() => {
    if (!selectedEducationId) return null
    return data.education.find((e) => e.id === selectedEducationId) ?? null
  }, [data.education, selectedEducationId])

  const load = useCallback(async () => {
    if (!uid || !resumeId) return
    setError(null)
    setLoading(true)
    try {
      const doc = await getResume(uid, resumeId)
      if (!doc) {
        setError('Resume not found')
        return
      }
      setData(
        normalizeResumeData({
          ...doc.data,
          title: doc.title || doc.data.title,
        })
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [uid, resumeId])

  useEffect(() => {
    startTransition(() => {
      void load()
    })
  }, [load])

  async function onSave() {
    if (!uid || !resumeId) return
    setSaving(true)
    setSavedOk(false)
    setError(null)
    try {
      await saveResume(uid, resumeId, data.title, data)
      setSavedOk(true)
      window.setTimeout(() => setSavedOk(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function onApplySummary(summary: string) {
    setData((d) => ({ ...d, profile: { ...d.profile, summary } }))
  }

  function onApplySkills(skills: string[]) {
    setData((d) => ({ ...d, skills }))
  }

  function onApplyBullets(bullets: string[]) {
    if (!selectedExperienceId) return
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) =>
        e.id === selectedExperienceId ? { ...e, bullets } : e
      ),
    }))
  }

  function onMergeKeywords(keywords: string[]) {
    setData((d) => {
      const seen = new Set(d.skills.map((s) => s.toLowerCase().trim()))
      const merged = [...d.skills]
      for (const raw of keywords) {
        const t = raw.trim()
        if (!t) continue
        const k = t.toLowerCase()
        if (seen.has(k)) continue
        seen.add(k)
        merged.push(t)
      }
      return { ...d, skills: merged }
    })
  }

  function onApplyCoreCompetencies(items: string[]) {
    setData((d) => ({ ...d, coreCompetencies: items }))
  }

  function onApplyRoleFocus(text: string) {
    setData((d) => ({ ...d, roleFocus: text }))
  }

  function onApplyEducationFields(patch: {
    honors: string
    gpa: string
    details: string
  }) {
    if (!selectedEducationId) return
    setData((d) => ({
      ...d,
      education: d.education.map((e) =>
        e.id === selectedEducationId ? { ...e, ...patch } : e
      ),
    }))
  }

  if (!resumeId) {
    return <p className="text-sm text-red-600">Missing resume id.</p>
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-violet-600" />
        <p className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-sm font-semibold text-transparent">
          Loading resume…
        </p>
      </div>
    )
  }

  if (error && error === 'Resume not found') {
    return (
      <div className="rounded-2xl border-2 border-violet-200 bg-white/90 p-10 text-center shadow-lg backdrop-blur">
        <p className="font-medium text-slate-800">{error}</p>
        <Button className="mt-6 rounded-xl" asChild variant="secondary">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-md shadow-violet-500/5 backdrop-blur-md sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Dashboard
            </Link>
          </Button>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
              Edit
            </span>{' '}
            resume
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {savedOk ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
              Saved
            </span>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl font-semibold"
            onClick={() => window.print()}
          >
            <Printer className="size-4 text-cyan-600" />
            Print / PDF
          </Button>
          <Button
            type="button"
            className="rounded-xl px-6 font-bold"
            onClick={() => void onSave()}
            disabled={saving || !uid}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
        <div className="min-w-0 space-y-8">
          <AiSuggestionPanel
            data={data}
            selectedExperience={selectedExperience}
            selectedEducation={selectedEducation}
            onApplySummary={onApplySummary}
            onApplySkills={onApplySkills}
            onApplyBullets={onApplyBullets}
            onMergeKeywords={onMergeKeywords}
            onApplyCoreCompetencies={onApplyCoreCompetencies}
            onApplyRoleFocus={onApplyRoleFocus}
            onApplyEducationFields={onApplyEducationFields}
          />
          <ResumeEditorForm
            data={data}
            setData={setData}
            selectedExperienceId={selectedExperienceId}
            setSelectedExperienceId={setSelectedExperienceId}
            selectedEducationId={selectedEducationId}
            setSelectedEducationId={setSelectedEducationId}
          />
        </div>
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-900 ring-1 ring-violet-200/60">
            <span className="size-1.5 animate-pulse rounded-full bg-fuchsia-500" />
            Live preview
          </p>
          <p className="mb-2 text-[11px] leading-snug text-slate-500">
            Preview matches a narrow page column; PDF/print uses full A4 width.
          </p>
          <div className="flex justify-center rounded-xl border border-slate-200/80 bg-slate-50 p-2 shadow-inner sm:p-3">
            <ResumePreview data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
