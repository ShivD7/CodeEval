import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const useEmulators = import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATORS === '1'
const firebaseConfig = useEmulators
  ? { projectId: 'demo-codeeval', apiKey: 'demo-codeeval' }
  : {
      apiKey: 'AIzaSyCPr1Y_-KZK_rZR14GoPu2rSkKn0BtdYDs',
      authDomain: 'codeeval-de0cf.firebaseapp.com',
      projectId: 'codeeval-de0cf',
      storageBucket: 'codeeval-de0cf.firebasestorage.app',
      messagingSenderId: '577046306019',
      appId: '1:577046306019:web:0ee2817395668a1217b9d6',
      measurementId: 'G-W3VR4C0RWE',
    }

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

if (useEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
