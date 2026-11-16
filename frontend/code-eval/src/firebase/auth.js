import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from 'firebase/auth'
import { auth } from './firebase.js'

export function doCreateUserWithEmailAndPassword(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function doSignInWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function doSignInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider())
}

export function doSignOut() {
  return auth.signOut()
}

export function doPasswordChange(password) {
  return updatePassword(auth.currentUser, password)
}
