import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { doPasswordChange, doSignOut } from '../firebase/auth.js'
import { accountError, useSession } from '../session.js'

export default function AccountSettings() {
  const { user, loading } = useSession()
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading) return <p className="container page-notice" role="status">Loading account…</p>
  if (!user) return <Navigate to="/login" state={{ returnTo: '/settings' }} replace />

  async function update(action, success) {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      setMessage(success ? { text: success } : null)
    } catch (error) {
      setMessage({ text: accountError(error), error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="account-panel surface">
      <h1>Account</h1>
      <p className="muted">{user.email}</p>
      <form onSubmit={(event) => {
        event.preventDefault()
        const displayName = new FormData(event.currentTarget).get('name').trim()
        if (displayName) update(() => updateProfile(user, { displayName }), 'Display name updated.')
      }}>
        <label>Display name<input name="name" defaultValue={user.displayName} required maxLength={80} /></label>
        <button className="button button-secondary" type="submit" disabled={busy}>Save name</button>
      </form>
      {user.providerData.some((provider) => provider.providerId === 'password') && (
        <form onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const password = new FormData(form).get('password')
          update(async () => {
            await doPasswordChange(password)
            form.reset()
          }, 'Password changed.')
        }}>
          <label>New password<input name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
          <button className="button button-secondary" type="submit" disabled={busy}>Change password</button>
        </form>
      )}
      {message && <p className={message.error ? 'notice error-notice' : 'notice'} role={message.error ? 'alert' : 'status'}>{message.text}</p>}
      <button className="button button-secondary" type="button" disabled={busy}
        onClick={() => update(doSignOut)}>Sign out</button>
    </section>
  )
}
