import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

function initializeFirebase() {
  try {
    return {
      firebaseApp: getApp(),
      auth: getAuth(),
      firestore: getFirestore(),
    };
  } catch (e) {
    const firebaseApp = initializeApp(firebaseConfig);
    return {
      firebaseApp: firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
    };
  }
}

export { initializeFirebase };
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
