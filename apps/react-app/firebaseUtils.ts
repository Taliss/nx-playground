import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseApp = initializeApp({
  // Why I even need projectId for local run ?!?
  projectId: 'initial-test-project-3931a',
  apiKey: 'AIzaSyAncDaHYXLvCWCXR1JV9E-cCwepn7g5a2U',
  // TODO DO I NEED THIS?
  // authDomain: '### FIREBASE AUTH DOMAIN ###',
});

export const functions = getFunctions(firebaseApp);
export const db = getFirestore();

if (import.meta.env.MODE !== 'production' && import.meta.env.PROD !== true) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectFirestoreEmulator(db, 'localhost', 8080);
}
