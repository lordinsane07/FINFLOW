import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "./useTransactions";
import { subscribeBudget, saveBudget } from "../services/budgetService";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function useBudget() {
    const { currentUser } = useAuth();
    const { transactions } = useTransactions();
    const [budgetLimit, setBudgetLimit] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch Budget Limit (via service layer)
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeBudget(currentUser.uid, (limit) => {
            setBudgetLimit(limit);
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
        await saveBudget(currentUser.uid, newLimit);
    };

    return { budgetLimit, spent, percentage, loading, updateBudget };
}
