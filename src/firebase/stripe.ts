import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore, onSnapshot } from "firebase/firestore";

export const getCheckoutUrl = async (
  app: FirebaseApp,
  planType: "monthly" | "yearly"
): Promise<string> => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  const priceId = planType === "yearly" ? "price_1Q7fsjKsRgvrQzKsKxYPtOIe" : "price_1Q7fpvKsRgvrQzKsCI1eWScb";

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin + "/for-you",
    cancel_url: window.location.origin + "/for-you",
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data() as {
        error?: { message: string };
        url?: string;
      };
      if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        unsubscribe();
        resolve(url);
      }
    });
  });
};