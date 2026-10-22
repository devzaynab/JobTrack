import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { sampleApplications } from '../data/sampleApplications'
import { auth, db, ensureFirebaseReady } from '../firebase'

const STORAGE_KEY = 'jobtrack.applications.v1'

const isApplication = (item) => item && typeof item === 'object'
  && typeof item.id === 'string'
  && typeof item.company === 'string'
  && typeof item.title === 'string'
  && typeof item.dateApplied === 'string'
  && typeof item.status === 'string'

function getLocalStorageKey(userId) {
  return userId ? `jobtrack.applications.${userId}` : STORAGE_KEY
}

function requireAuthenticatedUid(userId) {
  ensureFirebaseReady()
  const authenticatedUid = auth.currentUser?.uid
  if (!authenticatedUid || authenticatedUid !== userId) {
    throw new Error('You must be signed in as this user to access applications.')
  }
  return authenticatedUid
}

function readLocalApplications(storageKey) {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (saved === null) return storageKey === STORAGE_KEY ? sampleApplications : []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter(isApplication) : (storageKey === STORAGE_KEY ? sampleApplications : [])
  } catch {
    return storageKey === STORAGE_KEY ? sampleApplications : []
  }
}

export function loadApplications(userId = null) {
  const storageKey = getLocalStorageKey(userId)
  return readLocalApplications(storageKey)
}

export async function fetchApplicationsFromFirestore(userId) {
  const authenticatedUid = requireAuthenticatedUid(userId)
  const snapshot = await getDocs(collection(db, 'users', authenticatedUid, 'applications'))
  const items = snapshot.docs.map((docSnapshot) => ({ ...docSnapshot.data(), id: docSnapshot.id }))
  const valid = items.filter(isApplication)
  saveApplications(valid, authenticatedUid)
  return valid
}

export async function addUserApplication(userId, application) {
  const authenticatedUid = requireAuthenticatedUid(userId)
  if (!application?.id) throw new Error('An application ID is required.')

  await setDoc(doc(db, 'users', authenticatedUid, 'applications', application.id), application)
  const next = [application, ...loadApplications(authenticatedUid).filter((item) => item.id !== application.id)]
  saveApplications(next, authenticatedUid)
  return application
}

export async function updateUserApplication(userId, applicationId, updates) {
  const authenticatedUid = requireAuthenticatedUid(userId)
  if (!applicationId) throw new Error('An application ID is required.')

  const applicationRef = doc(db, 'users', authenticatedUid, 'applications', applicationId)
  await updateDoc(applicationRef, updates)
  const current = loadApplications(authenticatedUid)
  const existing = current.find((item) => item.id === applicationId)
  const nextApplication = existing ? { ...existing, ...updates, id: applicationId } : { ...updates, id: applicationId }
  const next = current.map((item) => item.id === applicationId ? nextApplication : item)
  saveApplications(next, authenticatedUid)
  return nextApplication
}

export async function deleteUserApplication(userId, applicationId) {
  const authenticatedUid = requireAuthenticatedUid(userId)
  if (!applicationId) throw new Error('An application ID is required.')

  await deleteDoc(doc(db, 'users', authenticatedUid, 'applications', applicationId))
  const next = loadApplications(authenticatedUid).filter((item) => item.id !== applicationId)
  saveApplications(next, authenticatedUid)
  return true
}

export function saveApplications(applications, userId = null) {
  const storageKey = getLocalStorageKey(userId)
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(applications))
    return true
  } catch {
    return false
  }
}

