import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Subscribe to real-time budget updates for a user.
 * @param {string} uid — Firebase user ID
 * @param {function} onData — callback receiving { limit }
 * @returns {function} unsubscribe function
 */
export function subscribeBudget(uid, onData) {
    const budgetRef = doc(db, "users", uid, "settings", "budget");

    return onSnapshot(budgetRef, (docSnap) => {
        if (docSnap.exists()) {
            onData(docSnap.data().limit || 0);
        } else {
            onData(0);
        }
    });
}

/**
 * Save / update the monthly budget limit for a user.
 * @param {string} uid — Firebase user ID
 * @param {number} limit — the new budget limit
 */
export async function saveBudget(uid, limit) {
    const budgetRef = doc(db, "users", uid, "settings", "budget");
    await setDoc(budgetRef, { limit: parseFloat(limit) }, { merge: true });
}
