import { useState } from "react";
import { useBudget } from "../hooks/useBudget";
import { Pencil, Check, X, Target } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function BudgetCard() {
    const { budgetLimit, spent, percentage, updateBudget } = useBudget();
    const [isEditing, setIsEditing] = useState(false);
    const [newLimit, setNewLimit] = useState(budgetLimit);

    const handleSave = async () => {
        await updateBudget(newLimit);
        setIsEditing(false);
    };

    const remaining = Math.max(0, budgetLimit - spent);

    // Progress fill class
    let fillClass = "progress-bar__fill";
    if (percentage > 80) fillClass = "progress-bar__fill progress-bar__fill--danger";
    else if (percentage > 50) fillClass = "progress-bar__fill progress-bar__fill--warning";

    return (
        <div className="vault-card vault-card--budget p-6 animate-fade-in-up stagger-4">
            <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={14} className="text-accent-primary" />
                        <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase">Monthly Budget</h3>
                    </div>

                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={newLimit}
                                onChange={(e) => setNewLimit(e.target.value)}
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
                        <div
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => { setNewLimit(budgetLimit); setIsEditing(true); }}
                            title={`Budget: ${formatCurrency(budgetLimit)}`}
                        >
                            <span className="text-2xl font-mono font-bold text-text-primary tracking-tight truncate">
                                {formatCurrency(budgetLimit, true)}
                            </span>
                            <Pencil size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                    )}
                </div>

                <div className="text-right flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-2">Spent</p>
                    <p
                        className={`text-2xl font-mono font-bold tracking-tight truncate ${percentage > 100 ? 'text-accent-expense' : 'text-text-primary'}`}
                        title={`Spent: ${formatCurrency(spent)}`}
                    >
                        {formatCurrency(spent, true)}
                    </p>
                </div>
            </div>

            {/* Progress Bar — Gradient */}
            <div className="progress-bar mb-2">
                <div
                    className={fillClass}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            <div className="flex justify-between text-[10px] font-medium text-text-muted uppercase tracking-wider">
                <span>{percentage.toFixed(0)}% used</span>
                <span className="truncate ml-2" title={`${formatCurrency(remaining)} Remaining`}>
                    {formatCurrency(remaining, true)} left
                </span>
            </div>
        </div>
    );
}
