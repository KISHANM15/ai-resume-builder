import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'

const DashboardPage = lazy(async () => {
  const m = await import('@/pages/DashboardPage')
  return { default: m.DashboardPage }
})
const EditorPage = lazy(async () => {
  const m = await import('@/pages/EditorPage')
  return { default: m.EditorPage }
})
const LoginPage = lazy(async () => {
  const m = await import('@/pages/LoginPage')
  return { default: m.LoginPage }
})
const RegisterPage = lazy(async () => {
  const m = await import('@/pages/RegisterPage')
  return { default: m.RegisterPage }
})

function PageFallback() {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
      <div
        className="size-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600"
        aria-hidden
      />
      <p className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-sm font-medium text-transparent">
        Loading your studio…
      </p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor/:resumeId"
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
}
