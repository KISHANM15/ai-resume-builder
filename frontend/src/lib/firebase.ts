import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function readConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

export function isFirebaseConfigured(): boolean {
  const c = readConfig()
  return Boolean(
    c.apiKey &&
      c.authDomain &&
      c.projectId &&
      c.storageBucket &&
      c.messagingSenderId &&
      c.appId
  )
}

let app: FirebaseApp | undefined

export function getFirebaseApp(): FirebaseApp {
  if (app) return app
  const first = getApps().at(0)
  if (first) {
    app = first
    return app
  }
  const config = readConfig()
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add VITE_FIREBASE_* variables to .env'
    )
  }
  app = initializeApp(config)
  return app
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export function getDb() {
  return getFirestore(getFirebaseApp())
}
