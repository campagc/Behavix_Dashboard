import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, OAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// The app will break without DB ID if it's enterprise, but since it's standard default we can omit if not passed
export const db = getFirestore(app);
export const auth = getAuth(app);

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
