import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Rocket, Target, Wand2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-hooks'
import { Button } from '@/components/ui/button'

export function RegisterPage() {
  const {
    signUpEmail,
    signInGoogle,
    loading,
    firebaseReady,
    user,
    authBypassed,
  } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  if (authBypassed) {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signUpEmail(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setSubmitting(true)
    try {
      await signInGoogle()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-up failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!firebaseReady) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-amber-950 shadow-lg">
        <h1 className="font-display text-xl font-bold">Configure Firebase</h1>
        <p className="mt-2 text-sm">
          Add your Firebase keys to{' '}
          <code className="rounded-md bg-amber-200/80 px-1.5 py-0.5 font-mono text-xs">frontend/.env</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-center lg:gap-14">
      <div className="hidden space-y-8 lg:block">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-100 to-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-200/80">
          <Rocket className="size-4 text-emerald-600" />
          Join in under a minute
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
          Resumes that{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
            match the brief
          </span>
          .
        </h1>
        <p className="max-w-md text-lg text-slate-600">
          Drop a job description snippet and let AI sharpen your story — you
          stay in control of every line.
        </p>
        <ul className="flex flex-col gap-4 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-emerald-100/80 backdrop-blur">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <Target className="size-5" />
            </span>
            Role + industry fields for smarter suggestions
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-violet-100/80 backdrop-blur">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Wand2 className="size-5" />
            </span>
            Summary, skills, and bullet generators
          </li>
        </ul>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-violet-600 p-[2px] shadow-2xl shadow-cyan-500/20">
        <div className="rounded-[22px] bg-white/95 p-8 shadow-inner backdrop-blur-xl sm:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Create account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            ATS-friendly structure with AI alignment for your next role.
          </p>
          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div>
              <label
                className="block text-sm font-semibold text-emerald-950/90"
                htmlFor="reg-email"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full rounded-xl border-2 border-cyan-100 bg-cyan-50/30 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-200/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-emerald-950/90"
                htmlFor="reg-password"
              >
                Password (min 6 characters)
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="mt-1.5 w-full rounded-xl border-2 border-cyan-100 bg-cyan-50/30 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-200/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full rounded-xl py-6 text-base font-semibold"
              disabled={loading || submitting}
            >
              {submitting ? 'Creating…' : 'Create account'}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase tracking-widest text-cyan-500">
              <span className="bg-white px-3">or</span>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-xl border-2 py-6 font-semibold"
            disabled={loading || submitting}
            onClick={() => void onGoogle()}
          >
            Continue with Google
          </Button>
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              className="font-bold text-cyan-700 underline decoration-violet-300 decoration-2 underline-offset-2 hover:text-violet-700"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
