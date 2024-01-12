// import firebase from "firebase"
// import "firebase/firestore"
import { initializeApp } from "firebase/app"
import "firebase/auth"

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const config = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGE_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASURE,
}

// if (firebase.apps.length){
//   firebase.initializeApp(config)
// }

// const firestore = firebase.forestore()
const firebase = initializeApp(config)
const authTest = getAuth(firebase)
const database = getFirestore(firebase)

export { firebase, authTest, database }
