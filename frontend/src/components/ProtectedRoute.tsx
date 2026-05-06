import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-hooks'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, firebaseReady, authBypassed } = useAuth()
  const loc = useLocation()

  if (authBypassed) {
    return <>{children}</>
  }

  if (!firebaseReady) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
          Firebase not configured
        </h2>
        <p className="mt-2 text-sm text-amber-900/90">
          Copy <code className="rounded bg-amber-100 px-1">frontend/.env.example</code> to{' '}
          <code className="rounded bg-amber-100 px-1">frontend/.env</code> and add your
          Firebase web app keys.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  return <>{children}</>
}
