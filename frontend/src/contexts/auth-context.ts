import { createContext } from 'react'
import type { User } from 'firebase/auth'

export interface AuthState {
  user: User | null
  loading: boolean
  /** True when Firebase web config is present or when auth bypass is on. */
  firebaseReady: boolean
  /** `VITE_SKIP_AUTH=true`: skip login; resumes use localStorage, not Firestore. */
  authBypassed: boolean
  getIdToken: () => Promise<string | null>
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  /** Sends Firebase password-reset email to the address. */
  resetPassword: (email: string) => Promise<void>
  logOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
