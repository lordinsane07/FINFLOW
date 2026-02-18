import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "./useTransactions";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function useBudget() {
    const { currentUser } = useAuth();
    const { transactions } = useTransactions();
    const [budgetLimit, setBudgetLimit] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch Budget Limit
    useEffect(() => {
        if (!currentUser) return;

        // settings/budget is a document inside the user's collection
        const budgetRef = doc(db, "users", currentUser.uid, "settings", "budget");

        const unsubscribe = onSnapshot(budgetRef, (doc) => {
            if (doc.exists()) {
                setBudgetLimit(doc.data().limit || 0);
            } else {
                setBudgetLimit(0);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Calculate Monthly Spending
    const spent = transactions.reduce((acc, t) => {
        if (t.type === "expense") {
            const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
            const isCurrentMonth = isWithinInterval(date, {
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date())
            });

            if (isCurrentMonth) {
                return acc + (parseFloat(t.amount) || 0);
            }
        }
        return acc;
    }, 0);

    const percentage = budgetLimit > 0 ? Math.min((spent / budgetLimit) * 100, 100) : 0;

    const updateBudget = async (newLimit) => {
        if (!currentUser) return;
        const budgetRef = doc(db, "users", currentUser.uid, "settings", "budget");
        await setDoc(budgetRef, { limit: parseFloat(newLimit) }, { merge: true });
    };

    return { budgetLimit, spent, percentage, loading, updateBudget };
}
