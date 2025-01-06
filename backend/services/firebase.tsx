import { initializeApp } from '@firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence } from '@firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebaseConfig from '../config/firebase-config'
import '@firebase/auth'
import { getApps, getApp } from '@firebase/app'

let app: any
let auth: any

if (getApps().length === 0) {
   app = initializeApp(firebaseConfig)
} else {
   app = getApp()
}

try {
   auth = getAuth(app)
} catch (error) {
   auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
   })
}

export { auth }
