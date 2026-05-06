import { FilePlus2, Pencil, Trash2, Lightbulb, Palette } from 'lucide-react'
import { startTransition, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-hooks'
import { Button } from '@/components/ui/button'
import {
  createResume,
  deleteResume,
  listResumes,
  type ResumeDocMeta,
} from '@/services/resumeService'

function resumeErr(e: unknown, fallback: string): string {
  const code =
    e && typeof e === 'object' && 'code' in e
      ? String((e as { code?: string }).code)
      : ''
  if (
    code === 'permission-denied' ||
    (e instanceof Error && /permission/i.test(e.message))
  ) {
    return 'Firestore permission denied. In Firebase Console go to Firestore → Rules and publish the rules from this project’s firestore.rules file (so signed-in users can read/write only users/{their user id}/resumes). Or install Firebase CLI and run: firebase deploy --only firestore:rules'
  }
  return e instanceof Error ? e.message : fallback
}

const cardTopBar = [
  'h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400',
  'h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-300',
  'h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400',
  'h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-400',
] as const

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<ResumeDocMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const uid = user?.uid

  const refresh = useCallback(async () => {
    if (!uid) return
    setError(null)
    setLoading(true)
    try {
      const list = await listResumes(uid)
      setItems(list)
    } catch (e) {
      setError(resumeErr(e, 'Failed to load resumes'))
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    startTransition(() => {
      void refresh()
    })
  }, [refresh])

  async function onCreate() {
    if (!uid) return
    setBusy(true)
    setError(null)
    try {
      const id = await createResume(uid)
      navigate(`/editor/${id}`)
    } catch (e) {
      setError(resumeErr(e, 'Could not create resume'))
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(id: string) {
    if (!uid) return
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    setError(null)
    try {
      await deleteResume(uid, id)
      await refresh()
    } catch (e) {
      setError(resumeErr(e, 'Delete failed'))
    }
  }

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-[1px] shadow-xl shadow-violet-500/20">
        <div className="relative rounded-[23px] bg-white/95 px-6 py-8 backdrop-blur sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-fuchsia-400/20 blur-2xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-800">
                <Palette className="size-3.5" />
                Your creative workspace
              </p>
              <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Your{' '}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  resumes
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Open a draft to edit with live preview, or spin up a new doc and
                let AI align copy to your target role.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-950">
                  <Lightbulb className="size-3.5 text-amber-600" />
                  Tip: paste a JD snippet before generating bullets
                </span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => void onCreate()}
              disabled={busy || !uid}
              className="shrink-0 rounded-2xl px-8 py-6 text-base font-bold shadow-lg"
            >
              <FilePlus2 className="size-5" />
              New resume
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-900">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-3 py-12 text-violet-700">
          <div
            className="size-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600"
            aria-hidden
          />
          <span className="text-sm font-medium">Loading your work…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-violet-300/80 bg-gradient-to-br from-white/90 to-violet-50/50 p-12 text-center shadow-inner">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
            <FilePlus2 className="size-8" />
          </div>
          <p className="text-lg font-medium text-slate-700">
            No resumes yet — your first masterpiece goes here.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            We will save drafts automatically as you edit.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-2xl px-8 font-bold"
            onClick={() => void onCreate()}
            disabled={busy}
          >
            <FilePlus2 className="size-5" />
            New resume
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((r, i) => (
            <li
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-violet-500/5 ring-1 ring-violet-100/50 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/10"
            >
              <div
                className={cardTopBar[i % cardTopBar.length]}
                aria-hidden
              />
              <div className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold text-slate-900">
                    {r.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-violet-600/90">
                    {r.updatedAt
                      ? `Updated ${r.updatedAt.toLocaleString()}`
                      : 'Just created'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="secondary" size="icon" asChild title="Edit">
                    <Link
                      to={`/editor/${r.id}`}
                      className="rounded-xl border-violet-200 hover:border-fuchsia-300"
                    >
                      <Pencil className="size-4 text-violet-600" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                    title="Delete"
                    onClick={() => void onDelete(r.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
