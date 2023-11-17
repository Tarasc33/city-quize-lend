// import { initializeApp } from "firebase/app"
// import 'firebase/database'
// import firebase from 'firebase/app'
import firebase from "firebase/compat/app"
import 'firebase/compat/auth'
import {getDatabase} from "firebase/database"
// import "firebase/compat/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID
}

//initializeApp(firebaseConfig)



//export const firebaseAuth = firebase.auth()


// export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
// GoogleProvider.setCustomParameters({ prompt: "select_account" })

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = getDatabase()

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
GoogleProvider.setCustomParameters({ prompt: 'select_account' })
