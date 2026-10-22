import { useState } from 'react'
import BrandLockup from '../components/BrandLockup'

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function AuthPage({ mode, onSubmit, onToggleMode, error }) {
  const [values, setValues] = useState(initialState)
  const [localError, setLocalError] = useState('')

  function change(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setLocalError('')
  }

  function submit(event) {
    event.preventDefault()

    if (mode === 'signup' && !values.name.trim()) {
      setLocalError('Please enter your full name.')
      return
    }

    if (!values.email.trim()) {
      setLocalError('Please enter your email address.')
      return
    }

    if (!values.password.trim()) {
      setLocalError('Please enter your password.')
      return
    }

    if (mode === 'signup' && values.password.trim().length < 6) {
      setLocalError('Password must be at least 6 characters long.')
      return
    }

    if (
      mode === 'signup' &&
      values.password.trim() !== values.confirmPassword.trim()
    ) {
      setLocalError('Passwords do not match.')
      return
    }

    onSubmit(values)
  }

  const isSignup = mode === 'signup'

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand auth-brand" aria-label="JobTrack">
            <BrandLockup />
          </div>
          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p>
            {isSignup
              ? 'Track your next opportunity with clarity and confidence.'
              : 'Sign in to continue managing your applications.'}
          </p>
        </div>

        <form onSubmit={submit} className="auth-form">
          {isSignup && (
            <label className="field">
              <span>Full name</span>
              <input
                name="name"
                value={values.name}
                onChange={change}
                placeholder="Jane Doe"
              />
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={change}
              placeholder="you@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={change}
              placeholder="••••••••"
            />
          </label>

          {isSignup && (
            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={change}
                placeholder="••••••••"
              />
            </label>
          )}

          {(localError || error) && (
            <p className="auth-error">{localError || error}</p>
          )}

          <button
            type="submit"
            className="button button-primary auth-submit"
          >
            {isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isSignup ? 'Already have an account?' : 'Need an account?'}
          </span>
          <button
            type="button"
            className="text-link"
            onClick={() => onToggleMode(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  )
}