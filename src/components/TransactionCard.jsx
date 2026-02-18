import {
    Utensils, Car, ShoppingBag, HeartPulse, Clapperboard,
    Briefcase, Monitor, Zap, HelpCircle, Edit2, Trash2
} from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { formatCurrency } from "../utils/format";

const ICONS = {
    Food: Utensils,
    Transport: Car,
    Shopping: ShoppingBag,
    Health: HeartPulse,
    Entertainment: Clapperboard,
    Salary: Briefcase,
    Freelance: Monitor,
    Utilities: Zap,
    Other: HelpCircle,
};

export default function TransactionCard({ transaction, onEdit }) {
    const { deleteTransaction } = useTransactions();
    const { showToast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);

    const Icon = ICONS[transaction.category] || HelpCircle;
    const isIncome = transaction.type === "income";

    const handleDelete = async () => {
        try {
            await deleteTransaction(transaction.id);
            showToast("Transaction deleted", "success");
        } catch (err) {
            showToast("Failed to delete", "error");
        }
    };

    return (
        <>
            <div className="group relative w-full bg-bg-card hover:bg-bg-surface border border-transparent hover:border-border-subtle rounded-card py-3.5 px-4 flex items-center gap-4 transition-all duration-200">

                {/* Status Dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isIncome ? "bg-accent-income shadow-[0_0_6px] shadow-accent-income/50" : "bg-accent-expense shadow-[0_0_6px] shadow-accent-expense/50"}`} />

                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${isIncome ? "bg-[var(--color-income-dim)] text-accent-income" : "bg-[var(--color-expense-dim)] text-accent-expense"} group-hover:scale-110`}>
                    <Icon size={16} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-0.5">
                        <h4 className="font-medium text-text-primary text-sm truncate group-hover:text-accent-primary transition-colors">
                            {transaction.title}
                        </h4>
                        <span className="text-[10px] font-medium text-text-muted bg-bg-surface px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            {transaction.category}
                        </span>
                    </div>
                    {transaction.notes && (
                        <p className="text-xs text-text-muted truncate max-w-[260px] italic">
                            {transaction.notes}
                        </p>
                    )}
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-mono font-bold text-base tracking-tight ${isIncome ? "text-accent-income" : "text-accent-expense"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </span>

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(transaction)}
                                className="p-1 text-text-muted hover:text-accent-primary hover:bg-accent-primary-dim rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={13} />
                            </button>
                        )}
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-1 text-text-muted hover:text-accent-expense hover:bg-[var(--color-expense-dim)] rounded-lg transition-all"
                            title="Delete"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Transaction?"
                message={`Are you sure you want to permanently remove "${transaction.title}"?`}
            />
        </>
    );
}
