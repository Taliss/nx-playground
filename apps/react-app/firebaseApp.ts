import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp({
  // Why I even need projectId for local run ?!?
  projectId: 'initial-test-project-3931a',
  apiKey: 'AIzaSyAncDaHYXLvCWCXR1JV9E-cCwepn7g5a2U',
  // TODO DO I NEED THIS?
  // authDomain: '### FIREBASE AUTH DOMAIN ###',
});

export default firebaseApp;
