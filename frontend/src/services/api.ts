const defaultBase = 'http://localhost:8787'

/** In dev, prefer same-origin `/api` so Vite can proxy to the backend (see vite.config.ts). */
function apiBase(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined
  if (url && url.length > 0) return url
  if (import.meta.env.DEV) return ''
  return defaultBase
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null }
): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (init.token) {
    headers.set('Authorization', `Bearer ${init.token}`)
  }
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers,
  })
  const text = await res.text()
  if (!res.ok) {
    let message = res.statusText
    try {
      const j = JSON.parse(text) as { error?: string; detail?: string }
      if (j.error) {
        message =
          j.detail && import.meta.env.DEV
            ? `${j.error} — ${j.detail}`
            : j.error
      }
    } catch {
      if (text) message = text
    }
    throw new Error(message)
  }
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
