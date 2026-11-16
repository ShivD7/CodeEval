import { createContext, useContext } from 'react'

export const SessionContext = createContext(null)

export function useSession() {
  return useContext(SessionContext)
}

export function accountError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'The connection failed. Try again.',
    'auth/popup-blocked': 'Allow the sign-in pop-up and try again.',
    'auth/popup-closed-by-user': 'The sign-in window was closed.',
    'auth/requires-recent-login': 'Sign out and sign back in before changing your password.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/weak-password': 'Choose a stronger password.',
  }
  return messages[error.code] ?? 'The account request failed. Try again.'
}
