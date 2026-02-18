import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

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

        const goalRef = doc(db, "users", currentUser.uid, "settings", "savingsGoal");

        const unsubscribe = onSnapshot(goalRef, (docSnap) => {
            if (docSnap.exists()) {
                setGoal(docSnap.data().target || 0);
            } else {
                setGoal(0);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const updateGoal = async (newTarget) => {
        if (!currentUser) return;
        const goalRef = doc(db, "users", currentUser.uid, "settings", "savingsGoal");
        await setDoc(goalRef, { target: parseFloat(newTarget) }, { merge: true });
    };

    return { goal, loading, updateGoal };
}
