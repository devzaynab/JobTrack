import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, ensureFirebaseReady } from '../firebase'

const SESSION_KEY = 'jobtracker.session.v1'

const loginErrorMessages = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password. Please check your details and try again.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
}

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function mapLoginError(error) {
  const code = error?.code || ''
  const message = loginErrorMessages[code] || 'Incorrect email or password. Please check your details and try again.'
  console.error('Firebase auth login error:', error)
  return new Error(message)
}

export function getSession() {
  return safeRead(SESSION_KEY, null)
}

export function saveSession(user) {
  return safeWrite(SESSION_KEY, user)
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY)
    return true
  } catch {
    return false
  }
}

export async function signupUser({ name, email, password, confirmPassword }) {
  const trimmedName = (name || '').trim()
  const trimmedEmail = (email || '').trim().toLowerCase()
  const trimmedPassword = (password || '').trim()

  if (!trimmedName) throw new Error('Please enter your full name.')
  if (!trimmedEmail) throw new Error('Please enter your email address.')
  if (!trimmedPassword) throw new Error('Please enter a password.')
  if (trimmedPassword.length < 6) throw new Error('Password must be at least 6 characters long.')
  if (trimmedPassword !== (confirmPassword || '').trim()) throw new Error('Passwords do not match.')

  ensureFirebaseReady()

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
    if (trimmedName) {
      await updateProfile(userCredential.user, { displayName: trimmedName })
    }

    const nextUser = {
      id: userCredential.user.uid,
      name: userCredential.user.displayName || trimmedName,
      email: userCredential.user.email,
    }

    saveSession(nextUser)
    return nextUser
  } catch (error) {
    console.error('Firebase auth signup error:', error)
    if (error?.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists.')
    }
    throw new Error('Unable to create your account. Please try again.')
  }
}

export async function loginUser({ email, password }) {
  const trimmedEmail = (email || '').trim().toLowerCase()
  const trimmedPassword = (password || '').trim()

  if (!trimmedEmail) throw new Error('Please enter your email address.')
  if (!trimmedPassword) throw new Error('Please enter your password.')

  ensureFirebaseReady()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
    const nextUser = {
      id: userCredential.user.uid,
      name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
      email: userCredential.user.email,
    }

    saveSession(nextUser)
    return nextUser
  } catch (error) {
    throw mapLoginError(error)
  }
}

export function logoutUser() {
  if (!auth) {
    clearSession()
    return Promise.resolve()
  }

  return signOut(auth).then(() => clearSession())
}

export function subscribeToAuth(onUser) {
  if (!auth) {
    onUser(null)
    return () => {}
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      clearSession()
      onUser(null)
      return
    }

    const nextUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email,
    }

    saveSession(nextUser)
    onUser(nextUser)
  })
}
