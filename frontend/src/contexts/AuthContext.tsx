import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/contexts/auth-context'
import { isAuthBypassed } from '@/lib/devAuth'
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase'
import { createMockUser } from '@/lib/mockUser'

export function AuthProvider({ children }: { children: ReactNode }) {
  const bypass = isAuthBypassed()
  const firebaseConfigured = isFirebaseConfigured()
  const firebaseReady = bypass || firebaseConfigured

  const [user, setUser] = useState<User | null>(() =>
    bypass ? createMockUser() : null
  )
  const [loading, setLoading] = useState(() =>
    bypass ? false : firebaseConfigured
  )

  useEffect(() => {
    if (bypass || !firebaseConfigured) return
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [bypass, firebaseConfigured])

  const getIdToken = useCallback(async () => {
    if (bypass) return null
    if (!user) return null
    return user.getIdToken()
  }, [bypass, user])

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      if (bypass) return
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    },
    [bypass]
  )

  const signUpEmail = useCallback(
    async (email: string, password: string) => {
      if (bypass) return
      await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
    },
    [bypass]
  )

  const signInGoogle = useCallback(async () => {
    if (bypass) return
    const provider = new GoogleAuthProvider()
    await signInWithPopup(getFirebaseAuth(), provider)
  }, [bypass])

  const resetPassword = useCallback(async (email: string) => {
    if (bypass) return
    await sendPasswordResetEmail(getFirebaseAuth(), email.trim())
  }, [bypass])

  const logOut = useCallback(async () => {
    if (bypass) {
      window.location.reload()
      return
    }
    await signOut(getFirebaseAuth())
  }, [bypass])

  const value = useMemo(
    () => ({
      user,
      loading,
      firebaseReady,
      authBypassed: bypass,
      getIdToken,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      logOut,
    }),
    [
      user,
      loading,
      firebaseReady,
      bypass,
      getIdToken,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      logOut,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
