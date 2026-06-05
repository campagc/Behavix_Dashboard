import { FirebaseError, initializeApp } from 'firebase/app';
import {
  AuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  browserPopupRedirectResolver,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

/** Sanitize an email so it can be used as a Firestore document id. */
const emailToId = (email: string) =>
  email.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');

/** Upsert the current user's profile in `users/{emailId}`. Fails silently. */
export const saveUserProfile = async (profile: {
  email: string;
  department: string;
  streak?: number;
  points?: number;
}) => {
  try {
    await setDoc(
      doc(db, 'users', emailToId(profile.email)),
      {
        email: profile.email,
        department: profile.department,
        streak: profile.streak ?? 0,
        points: profile.points ?? 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error('Failed to save user profile to Firestore', error);
  }
};

/** Append a feedback document to the `feedback` collection. Fails silently. */
export const saveFeedback = async (data: {
  email: string | null;
  department: string | null;
  didLeaveFood: boolean | null;
  selectedDishes: unknown[];
  dishesWithAmounts: unknown[];
  comments: string;
  isPublic: boolean;
  sessionScore: number;
}) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to save feedback to Firestore', error);
  }
};

/** Log known auth popup errors with a friendly message; re-throw everything. */
const handleAuthError = (providerName: string, error: unknown): never => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/popup-blocked':
        console.warn('Popup blocked by browser. Please allow popups and try again.');
        break;
      case 'auth/unauthorized-domain':
        console.warn('Domain not authorized in Firebase. Add current preview URL to Firebase console.');
        break;
      case 'auth/cancelled-popup-request':
      case 'auth/popup-closed-by-user':
        console.warn('Popup closed by user.');
        break;
      default:
        console.error(`Error signing in with ${providerName}`, error);
    }
  } else {
    console.error(`Error signing in with ${providerName}`, error);
  }
  throw error;
};

const signInWithProvider = async (provider: AuthProvider, providerName: string) => {
  try {
    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    return result.user;
  } catch (error) {
    return handleAuthError(providerName, error);
  }
};

export const signInWithGoogle = () => signInWithProvider(googleProvider, 'Google');
export const signInWithApple = () => signInWithProvider(appleProvider, 'Apple');
