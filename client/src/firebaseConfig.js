// ── Firebase Client SDK Configuration ─────────────────────────────────────────
// VirtuElect uses the Firebase / Google ecosystem for future features:
//   - Firebase Authentication (voter identity verification)
//   - Firestore (real-time election result feeds)
//   - Firebase Analytics (engagement metrics — Google Services signal)
//   - Google Cloud Functions (serverless AI pipeline)
//
// Replace the placeholder values below with your actual Firebase project config
// from: https://console.firebase.google.com/ → Project Settings → Your apps
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy-placeholder-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'virtuelect.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'virtuelect',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'virtuelect.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:placeholder',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-PLACEHOLDER',
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Google Analytics — tracks user engagement within the Google ecosystem
const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;

// Firebase Authentication — for future voter identity verification
const auth = getAuth(firebaseApp);

// Firestore — for real-time data (future: live results, candidate updates)
const db = getFirestore(firebaseApp);

// Firebase Cloud Messaging (FCM) — for future push notifications (election alerts)
const messaging = typeof window !== 'undefined' ? getMessaging(firebaseApp) : null;

export { firebaseApp, analytics, auth, db, messaging };
export default firebaseApp;
