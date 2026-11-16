import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
} from '../firebase/auth.js'
import { accountError, useSession } from '../session.js'

export default function AccountAccess({ signUp = false }) {
  const { user, loading } = useSession()
  const { state } = useLocation()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const returnTo = typeof state?.returnTo === 'string' && state.returnTo.startsWith('/')
    && !state.returnTo.startsWith('//') ? state.returnTo : '/home'

  if (!loading && user) {
    return <Navigate to={returnTo} replace state={state?.continueGuestDraft ? { resumeGuestDraft: true } : null} />
  }

  async function authenticate(google, form) {
    setBusy(true)
    setMessage(null)
    try {
      if (google) {
        await doSignInWithGoogle()
        return
      }

      const email = form.get('email')
      const password = form.get('password')
      if (signUp) {
        const { user } = await doCreateUserWithEmailAndPassword(email, password)
        await updateProfile(user, { displayName: form.get('name').trim() })
        await sendEmailVerification(user)
        await doSignOut()
        setMessage({ text: 'Check your email for a verification link, then sign in.' })
      } else {
        const { user } = await doSignInWithEmailAndPassword(email, password)
        if (!user.emailVerified) {
          try {
            await sendEmailVerification(user)
          } finally {
            await doSignOut()
          }
          setMessage({ text: 'Check your email for a verification link before signing in.' })
        }
      }
    } catch (error) {
      setMessage({ text: accountError(error), error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="account-panel surface">
      <h1>{signUp ? 'Create an account' : 'Sign in'}</h1>
      <form onSubmit={(event) => {
        event.preventDefault()
        authenticate(false, new FormData(event.currentTarget))
      }}>
        {signUp && <label>Display name<input name="name" autoComplete="name" required maxLength={80} /></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password
          <input name="password" type="password" required minLength={signUp ? 8 : undefined}
            autoComplete={signUp ? 'new-password' : 'current-password'} />
        </label>
        <button className="button button-primary" type="submit" disabled={busy || loading}>
          {signUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <button className="button button-secondary" type="button" disabled={busy || loading}
        onClick={() => authenticate(true)}>Continue with Google</button>
      {message && <p className={message.error ? 'notice error-notice' : 'notice'} role={message.error ? 'alert' : 'status'}>{message.text}</p>}
      <p className="account-switch">
        {signUp ? 'Already have an account?' : 'New to CodeEval?'}{' '}
        <Link to={signUp ? '/login' : '/signup'} state={state}>{signUp ? 'Sign in' : 'Create an account'}</Link>
      </p>
    </section>
  )
}
