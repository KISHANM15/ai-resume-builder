import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { isAuthBypassed } from '@/lib/devAuth'
import { getDb } from '@/lib/firebase'
import {
  createEmptyResume,
  normalizeResumeData,
  type ResumeData,
} from '@/types/resume'

export interface ResumeDocMeta {
  id: string
  title: string
  updatedAt: Date | null
}

export interface ResumeDocument extends ResumeDocMeta {
  data: ResumeData
}

const LS_KEY = 'resume-studio-demo-resumes'

interface StoredResume {
  id: string
  title: string
  data: ResumeData
  updatedAt: string
}

function readLocalStore(): StoredResume[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as StoredResume[]
  } catch {
    return []
  }
}

function writeLocalStore(rows: StoredResume[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows))
}

function resumesCol(uid: string) {
  return collection(getDb(), 'users', uid, 'resumes')
}

export async function listResumes(uid: string): Promise<ResumeDocMeta[]> {
  if (isAuthBypassed()) {
    void uid
    return readLocalStore()
      .map((r) => ({
        id: r.id,
        title: r.title,
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
      }))
      .sort((a, b) => {
        const ta = a.updatedAt?.getTime() ?? 0
        const tb = b.updatedAt?.getTime() ?? 0
        return tb - ta
      })
  }
  const q = query(resumesCol(uid), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const x = d.data() as { title?: string; updatedAt?: { toDate: () => Date } }
    return {
      id: d.id,
      title: typeof x.title === 'string' ? x.title : 'Untitled',
      updatedAt: x.updatedAt?.toDate?.() ?? null,
    }
  })
}

export async function getResume(
  uid: string,
  resumeId: string
): Promise<ResumeDocument | null> {
  if (isAuthBypassed()) {
    void uid
    const row = readLocalStore().find((r) => r.id === resumeId)
    if (!row) return null
    return {
      id: row.id,
      title: row.title,
      data: normalizeResumeData(row.data),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    }
  }
  const ref = doc(getDb(), 'users', uid, 'resumes', resumeId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const x = snap.data() as {
    title?: string
    data?: ResumeData
    updatedAt?: { toDate: () => Date }
  }
  const data = normalizeResumeData(x.data ?? createEmptyResume())
  return {
    id: snap.id,
    title: typeof x.title === 'string' ? x.title : data.title,
    data,
    updatedAt: x.updatedAt?.toDate?.() ?? null,
  }
}

export async function createResume(uid: string): Promise<string> {
  if (isAuthBypassed()) {
    void uid
    const empty = createEmptyResume()
    const id = crypto.randomUUID()
    const rows = readLocalStore()
    rows.push({
      id,
      title: empty.title,
      data: empty,
      updatedAt: new Date().toISOString(),
    })
    writeLocalStore(rows)
    return id
  }
  const empty = createEmptyResume()
  const ref = await addDoc(resumesCol(uid), {
    title: empty.title,
    data: empty,
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function saveResume(
  uid: string,
  resumeId: string,
  title: string,
  data: ResumeData
): Promise<void> {
  if (isAuthBypassed()) {
    void uid
    const rows = readLocalStore()
    const i = rows.findIndex((r) => r.id === resumeId)
    if (i === -1) return
    rows[i] = {
      ...rows[i],
      title,
      data,
      updatedAt: new Date().toISOString(),
    }
    writeLocalStore(rows)
    return
  }
  const ref = doc(getDb(), 'users', uid, 'resumes', resumeId)
  await updateDoc(ref, {
    title,
    data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteResume(uid: string, resumeId: string): Promise<void> {
  if (isAuthBypassed()) {
    void uid
    writeLocalStore(readLocalStore().filter((r) => r.id !== resumeId))
    return
  }
  await deleteDoc(doc(getDb(), 'users', uid, 'resumes', resumeId))
}
