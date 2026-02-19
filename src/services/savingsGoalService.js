import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Subscribe to real-time savings goal updates for a user.
 * @param {string} uid — Firebase user ID
 * @param {function} onData — callback receiving the target value
 * @returns {function} unsubscribe function
 */
export function subscribeSavingsGoal(uid, onData) {
    const goalRef = doc(db, "users", uid, "settings", "savingsGoal");

    return onSnapshot(goalRef, (docSnap) => {
        if (docSnap.exists()) {
            onData(docSnap.data().target || 0);
        } else {
            onData(0);
        }
    });
}

/**
 * Save / update the savings goal target for a user.
 * @param {string} uid — Firebase user ID
 * @param {number} target — the new savings goal target
 */
export async function saveSavingsGoal(uid, target) {
    const goalRef = doc(db, "users", uid, "settings", "savingsGoal");
    await setDoc(goalRef, { target: parseFloat(target) }, { merge: true });
}
