import { useState, useMemo } from "react";
import { useSavingsGoal } from "../hooks/useSavingsGoal";
import { formatCurrency } from "../utils/format";
import { Pencil, Check, X, Target, Sparkles } from "lucide-react";

// SVG Donut Ring component
function DonutRing({ percentage, size = 100, strokeWidth = 8 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    // Color gradient based on progress
    let strokeColor = "var(--accent-primary)";
    if (percentage >= 100) strokeColor = "#FBBF24";
    else if (percentage >= 75) strokeColor = "#34D399";

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="var(--border-subtle)"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* Progress ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease",
                    filter: percentage >= 100 ? "drop-shadow(0 0 6px rgba(251,191,36,0.5))" : "none"
                }}
            />
        </svg>
    );
}

export default function SavingsGoal({ transactions }) {
    const { goal, updateGoal } = useSavingsGoal();
    const [isEditing, setIsEditing] = useState(false);
    const [newGoal, setNewGoal] = useState(goal);

    // Calculate actual savings (income - expense) all time
    const totalSaved = useMemo(() => {
        const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
        return Math.max(0, income - expense);
    }, [transactions]);

    const percentage = goal > 0 ? (totalSaved / goal) * 100 : 0;
    const goalReached = percentage >= 100;

    const handleSave = async () => {
        await updateGoal(newGoal);
        setIsEditing(false);
    };

    return (
        <div className="vault-card vault-card--budget p-6 animate-fade-in-up relative overflow-hidden">
            {/* Confetti-like sparkles when goal reached */}
            {goalReached && (
                <div className="absolute inset-0 pointer-events-none">
                    <Sparkles size={16} className="absolute top-3 right-4 text-amber-400 animate-float" />
                    <Sparkles size={10} className="absolute top-6 right-12 text-emerald-400 animate-float" style={{ animationDelay: "0.5s" }} />
                    <Sparkles size={12} className="absolute bottom-4 right-6 text-amber-300 animate-float" style={{ animationDelay: "1s" }} />
                </div>
            )}

            <div className="flex items-center gap-5 relative">
                {/* Donut Ring */}
                <div className="relative shrink-0">
                    <DonutRing percentage={percentage} size={90} strokeWidth={7} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold font-mono text-text-primary">
                            {Math.min(percentage, 100).toFixed(0)}%
                        </span>
                        <span className="text-[8px] text-text-muted uppercase tracking-wider">saved</span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={14} className="text-accent-primary" />
                        <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase">Savings Goal</h3>
                    </div>

                    {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-text-muted text-sm">$</span>
                            <input
                                type="number"
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                className="w-full min-w-0 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-btn font-mono text-text-primary px-3 py-1.5 focus:outline-none focus:border-accent-primary text-sm"
                                autoFocus
                            />
                            <button onClick={handleSave} className="p-1.5 hover:text-accent-income rounded-lg hover:bg-[var(--color-income-dim)] transition-all shrink-0">
                                <Check size={16} />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="p-1.5 hover:text-accent-expense rounded-lg hover:bg-[var(--color-expense-dim)] transition-all shrink-0">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setNewGoal(goal); setIsEditing(true); }}>
                                <p className="text-xl font-bold font-mono text-text-primary truncate" title={`Goal: ${formatCurrency(goal)}`}>
                                    {goal > 0 ? formatCurrency(goal, true) : "Set a goal"}
                                </p>
                                <Pencil size={11} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                                {goal > 0
                                    ? goalReached
                                        ? `🎉 Goal reached! Saved ${formatCurrency(totalSaved, true)}`
                                        : `${formatCurrency(totalSaved, true)} of ${formatCurrency(goal, true)} saved`
                                    : "Tap to set your savings target"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
