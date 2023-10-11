import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseApp = initializeApp({
  // Why I even need projectId for local run ?!?
  projectId: 'initial-test-project-3931a',
  apiKey: 'AIzaSyAncDaHYXLvCWCXR1JV9E-cCwepn7g5a2U',
  // TODO DO I NEED THIS?
  // authDomain: '### FIREBASE AUTH DOMAIN ###',
});

const functions = getFunctions(firebaseApp);
if (import.meta.env.MODE !== 'production' && import.meta.env.PROD !== true) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export default functions;
