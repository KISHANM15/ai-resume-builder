import type { User } from 'firebase/auth'
import { DEV_BYPASS_UID } from '@/lib/devAuth'

/** Minimal `User` stand-in for dev bypass (no Firebase). */
export function createMockUser(): User {
  return {
    uid: DEV_BYPASS_UID,
    email: 'demo@local.dev',
    displayName: 'Demo user',
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as User['metadata'],
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: 'demo',
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'dev-bypass-no-firebase-token',
    getIdTokenResult: async () => {
      throw new Error('Not available in demo mode')
    },
    reload: async () => {},
    toJSON: () => ({ uid: DEV_BYPASS_UID }),
  } as User
}
