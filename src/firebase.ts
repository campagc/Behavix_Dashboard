import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, OAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// The app will break without DB ID if it's enterprise, but since it's standard default we can omit if not passed
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sanitize email into a valid Firestore doc id.
const emailToId = (email: string) => email.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');

export const saveUserProfile = async (profile: {
  email: string;
  department: string;
  streak?: number;
  points?: number;
}) => {
  try {
    const id = emailToId(profile.email);
    await setDoc(
      doc(db, 'users', id),
      {
        email: profile.email,
        department: profile.department,
        streak: profile.streak ?? 0,
        points: profile.points ?? 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error('Failed to save user profile to Firestore', e);
  }
};

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
  } catch (e) {
    console.error('Failed to save feedback to Firestore', e);
  }
};

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.warn("Popup blocked by browser. Please allow popups and try again.");
    } else if (error.code === 'auth/unauthorized-domain') {
      console.warn("Domain not authorized in Firebase. Add current preview URL to Firebase console.");
    } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      console.warn("Popup closed by user.");
    } else {
      console.error("Error signing in with Google", error);
    }
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider, browserPopupRedirectResolver);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.warn("Popup blocked by browser. Please allow popups and try again.");
    } else if (error.code === 'auth/unauthorized-domain') {
      console.warn("Domain not authorized in Firebase. Add current preview URL to Firebase console.");
    } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      console.warn("Popup closed by user.");
    } else {
      console.error("Error signing in with Apple", error);
    }
    throw error;
  }
};
