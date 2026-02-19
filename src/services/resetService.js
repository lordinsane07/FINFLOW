import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Reset all user data — deletes all transactions, resets budget & savings goal.
 * @param {string} uid — Firebase user ID
 */
export async function resetAllData(uid) {
    // 1. Delete all transactions for this user
    const txnQuery = query(
        collection(db, "transactions"),
        where("uid", "==", uid)
    );
    const snapshot = await getDocs(txnQuery);
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "transactions", d.id)));
    await Promise.all(deletePromises);

    // 2. Reset budget limit to 0
    const budgetRef = doc(db, "users", uid, "settings", "budget");
    await setDoc(budgetRef, { limit: 0 }, { merge: true });

    // 3. Reset savings goal to 0
    const goalRef = doc(db, "users", uid, "settings", "savingsGoal");
    await setDoc(goalRef, { target: 0 }, { merge: true });
}
