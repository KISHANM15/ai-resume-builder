import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PenLine, Sparkles, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/auth-hooks'
import { Button } from '@/components/ui/button'

export function LoginPage() {
  const {
    signInEmail,
    resetPassword,
    loading,
    firebaseReady,
    user,
    authBypassed,
  } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  if (authBypassed) {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResetSent(null)
    setSubmitting(true)
    try {
      await signInEmail(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function onForgotPassword() {
    setError(null)
    setResetSent(null)
    const em = email.trim()
    if (!em) {
      setError('Enter your email address first, then click Forgot password.')
      return
    }
    setResetting(true)
    try {
      await resetPassword(em)
      setResetSent(
        'If an account exists for that email, we sent a link to reset your password.'
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send reset email.'
      )
    } finally {
      setResetting(false)
    }
  }

  if (!firebaseReady) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-amber-950 shadow-lg">
        <h1 className="font-display text-xl font-bold">Configure Firebase</h1>
        <p className="mt-2 text-sm">
          Add your{' '}
          <code className="rounded-md bg-amber-200/80 px-1.5 py-0.5 font-mono text-xs">
            VITE_FIREBASE_*
          </code>{' '}
          keys to{' '}
          <code className="rounded-md bg-amber-200/80 px-1.5 py-0.5 font-mono text-xs">
            frontend/.env
          </code>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-center lg:gap-14">
      <div className="hidden space-y-8 lg:block">
        <div className="animate-studio-float inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-violet-800 shadow-md ring-1 ring-violet-200/60 backdrop-blur">
          <Sparkles className="size-4 text-fuchsia-500" />
          AI-powered, role-specific copy
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
          Welcome back to{' '}
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            your edge
          </span>
          .
        </h1>
        <p className="max-w-md text-lg text-slate-600">
          Polish summaries, skills, and bullets tuned to the job you want — not
          a generic template.
        </p>
        <ul className="flex flex-col gap-4 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-violet-100/80 backdrop-blur">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Zap className="size-5" />
            </span>
            Live preview while you edit
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-cyan-100/80 backdrop-blur">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
              <PenLine className="size-5" />
            </span>
            One-click print / PDF export
          </li>
        </ul>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-[2px] shadow-2xl shadow-violet-500/25">
        <div className="rounded-[22px] bg-white/95 p-8 shadow-inner backdrop-blur-xl sm:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Continue building tailored resumes.
          </p>
          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          {resetSent ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {resetSent}
            </p>
          ) : null}
          <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div>
              <label
                className="block text-sm font-semibold text-violet-950/90"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full rounded-xl border-2 border-violet-100 bg-violet-50/30 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-200/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  className="block text-sm font-semibold text-violet-950/90"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-violet-700 underline decoration-fuchsia-300 decoration-2 underline-offset-2 hover:text-fuchsia-600 disabled:opacity-50"
                  disabled={loading || submitting || resetting}
                  onClick={() => void onForgotPassword()}
                >
                  {resetting ? 'Sending…' : 'Forgot password?'}
                </button>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1.5 w-full rounded-xl border-2 border-violet-100 bg-violet-50/30 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-200/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full rounded-xl py-6 text-base font-semibold"
              disabled={loading || submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            No account?{' '}
            <Link
              className="font-bold text-violet-700 underline decoration-fuchsia-300 decoration-2 underline-offset-2 hover:text-fuchsia-600"
              to="/register"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
