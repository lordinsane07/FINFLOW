import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Subscribe to real-time transaction updates for a user.
 * @param {string} uid — Firebase user ID
 * @param {function} onData — callback receiving the transactions array
 * @param {function} onError — callback receiving any error
 * @returns {function} unsubscribe function
 */
export function subscribeTransactions(uid, onData, onError) {
    const collectionRef = collection(db, "transactions");
    const q = query(
        collectionRef,
        where("uid", "==", uid),
        orderBy("date", "desc"),
        orderBy("createdAt", "desc") // Tie-breaker
    );

    return onSnapshot(q, (snapshot) => {
        const results = [];
        snapshot.docs.forEach(d => {
            results.push({ ...d.data(), id: d.id });
        });
        onData(results);
    }, onError);
}

/**
 * Create a new transaction.
 * @param {string} uid — Firebase user ID
 * @param {object} transaction — { amount, type, category, date, description, ... }
 */
export async function createTransaction(uid, transaction) {
    if (parseFloat(transaction.amount) <= 0) {
        throw new Error("Amount must be positive");
    }

    await addDoc(collection(db, "transactions"), {
        ...transaction,
        amount: parseFloat(transaction.amount),
        uid,
        createdAt: serverTimestamp()
    });
}

/**
 * Update an existing transaction.
 * @param {string} id — Firestore document ID
 * @param {object} updates — partial fields to update
 */
export async function updateTransaction(id, updates) {
    const docRef = doc(db, "transactions", id);
    const safeUpdates = { ...updates };
    if (safeUpdates.amount) safeUpdates.amount = parseFloat(safeUpdates.amount);
    await updateDoc(docRef, safeUpdates);
}

/**
 * Delete a transaction.
 * @param {string} id — Firestore document ID
 */
export async function removeTransaction(id) {
    await deleteDoc(doc(db, "transactions", id));
}
