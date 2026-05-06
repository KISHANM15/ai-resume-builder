import { FileText, LogOut, LayoutDashboard, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-hooks'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logOut, firebaseReady, authBypassed } = useAuth()
  const loc = useLocation()

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-amber-50 via-fuchsia-50/40 to-cyan-50 text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="animate-studio-blob absolute -left-24 -top-24 size-[22rem] rounded-full bg-gradient-to-br from-fuchsia-400/35 to-violet-500/25 blur-3xl" />
        <div className="animate-studio-blob-delayed absolute -right-20 top-1/4 size-[26rem] rounded-full bg-gradient-to-bl from-cyan-400/30 to-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-amber-300/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 50%)`,
          }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 shadow-sm shadow-violet-500/5 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="group flex items-center gap-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900"
          >
            <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/30 ring-2 ring-white/60 transition-transform group-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent" />
              <FileText className="relative size-5" aria-hidden />
            </span>
            <span className="hidden sm:inline">
              <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                Resume Studio
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'font-medium',
                    loc.pathname.startsWith('/dashboard') &&
                      'bg-gradient-to-r from-violet-100/90 to-fuchsia-100/80 text-violet-950 shadow-sm'
                  )}
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-4 text-violet-600" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void logOut()}
                  className="border-slate-200/90 bg-white/80"
                >
                  <LogOut className="size-4 text-slate-600" />
                  {authBypassed ? 'Exit demo' : 'Sign out'}
                </Button>
              </>
            )}
            {authBypassed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-xs font-semibold text-amber-950 ring-1 ring-amber-200/80">
                <Sparkles className="size-3.5 text-amber-600" />
                Demo mode
              </span>
            )}
            {!firebaseReady && !authBypassed && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
                Configure Firebase
              </span>
            )}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>

      <footer className="relative mt-auto border-t border-white/50 bg-white/40 py-6 text-center text-xs text-slate-600 backdrop-blur-sm">
        <p className="mx-auto max-w-2xl px-4">
          <span className="font-medium text-violet-800">ATS-aware</span> layout
          · <span className="font-medium text-fuchsia-800">AI alignment</span>{' '}
          for roles ·{' '}
          <span className="font-medium text-cyan-800">Print-ready PDF</span>
        </p>
      </footer>
    </div>
  )
}
