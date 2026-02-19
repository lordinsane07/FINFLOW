import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeSavingsGoal, saveSavingsGoal } from "../services/savingsGoalService";

export function useSavingsGoal() {
    const { currentUser } = useAuth();
    const [goal, setGoal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setGoal(0);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeSavingsGoal(currentUser.uid, (target) => {
            setGoal(target);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const updateGoal = async (newTarget) => {
        if (!currentUser) return;
        await saveSavingsGoal(currentUser.uid, newTarget);
    };

    return { goal, loading, updateGoal };
}
