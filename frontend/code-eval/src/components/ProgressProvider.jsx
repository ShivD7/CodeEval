import { useEffect, useState } from 'react'
import { watchSubmissions } from '../firebase/submissions.js'
import { ProgressContext } from '../progress.js'

export default function ProgressProvider({ uid, children }) {
  const [state, setState] = useState({ submissions: [], loading: Boolean(uid), error: false })

  useEffect(() => {
    if (uid) return watchSubmissions(uid,
      (submissions) => setState({ submissions, loading: false, error: false }),
      () => setState({ submissions: [], loading: false, error: true }),
    )
  }, [uid])

  return <ProgressContext.Provider value={state}>{children}</ProgressContext.Provider>
}
