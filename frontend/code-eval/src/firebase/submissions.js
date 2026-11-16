import { collection, onSnapshot, orderBy, query, serverTimestamp, addDoc } from 'firebase/firestore'
import { db } from './firebase.js'

function userSubmissions(uid) {
  return collection(db, 'users', uid, 'submissions')
}

export function watchSubmissions(uid, onChange, onError) {
  const newestFirst = query(userSubmissions(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(newestFirst, { includeMetadataChanges: true }, (snapshot) => {
    onChange(snapshot.docs.map((doc) => ({
      ...doc.data({ serverTimestamps: 'estimate' }),
      id: doc.id,
      pending: doc.metadata.hasPendingWrites,
    })))
  }, onError)
}

export function saveSubmission(uid, problemId, language, code, result) {
  const { verdict, passed, total, hiddenPassed, hiddenTotal } = result
  return addDoc(userSubmissions(uid), {
    problemId, language, code, verdict, passed, total, hiddenPassed, hiddenTotal,
    createdAt: serverTimestamp(),
  })
}
