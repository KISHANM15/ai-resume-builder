/** Fixed uid for local demo storage when `VITE_SKIP_AUTH=true`. */
export const DEV_BYPASS_UID = 'local-dev-user'

export function isAuthBypassed(): boolean {
  return import.meta.env.VITE_SKIP_AUTH === 'true'
}
