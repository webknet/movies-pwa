import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_DATABASE_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: "",
    messagingSenderId: process.env.VUE_APP_MESSAGIN_SENDER_ID,
    appId: process.env.VUE_APP_ID
  };


const app = firebase.initializeApp(firebaseConfig)

export const db = app.firestore()