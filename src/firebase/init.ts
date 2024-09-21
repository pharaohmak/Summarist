import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-HSkdJpGjvq-gj0dslRxFsJjGoeyasa4",
  authDomain: "makram-advanced-internship.firebaseapp.com",
  projectId: "makram-advanced-internship",
  storageBucket: "makram-advanced-internship.appspot.com",
  messagingSenderId: "388608368477",
  appId: "1:388608368477:web:1e8bbcd0185f41265752b4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export default app;