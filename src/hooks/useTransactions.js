import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    subscribeTransactions,
    createTransaction,
    updateTransaction as serviceUpdateTransaction,
    removeTransaction
} from "../services/transactionService";

export function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // real-time listener for transactions (via service layer)
    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = subscribeTransactions(
            currentUser.uid,
            (results) => {
                setTransactions(results);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error(err);
                setError("Failed to fetch transactions");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;
        try {
            await createTransaction(currentUser.uid, transaction);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await removeTransaction(id);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updateTransaction = async (id, updates) => {
        try {
            await serviceUpdateTransaction(id, updates);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction };
}
