import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase.js'
import { SessionContext } from '../session.js'

export default function SessionProvider({ children }) {
  const [account, setAccount] = useState(undefined)

  useEffect(() => onAuthStateChanged(auth, setAccount), [])

  const user = account?.emailVerified ? account : null
  return (
    <SessionContext.Provider value={{ user, loading: account === undefined }}>
      {children}
    </SessionContext.Provider>
  )
}
