import { useState, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";

export function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // real-time listener for transactions
    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const collectionRef = collection(db, "transactions");
        // query transactions for current user, ordered by date descending
        const q = query(
            collectionRef,
            where("uid", "==", currentUser.uid),
            orderBy("date", "desc"),
            orderBy("createdAt", "desc") // Tie-breaker
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id });
            });
            setTransactions(results);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error(err);
            setError("Failed to fetch transactions");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;
        try {
            if (parseFloat(transaction.amount) <= 0) throw new Error("Amount must be positive");

            await addDoc(collection(db, "transactions"), {
                ...transaction,
                amount: parseFloat(transaction.amount), // ensure number
                uid: currentUser.uid,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updateTransaction = async (id, updates) => {
        try {
            const docRef = doc(db, "transactions", id);
            const safeUpdates = { ...updates };
            if (safeUpdates.amount) safeUpdates.amount = parseFloat(safeUpdates.amount);

            await updateDoc(docRef, safeUpdates);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction };
}
