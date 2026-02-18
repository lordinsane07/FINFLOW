import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
    "Food", "Transport", "Shopping", "Health",
    "Entertainment", "Salary", "Freelance", "Utilities", "Other"
];

export default function EditTransactionModal({ isOpen, onClose, transaction }) {
    const { updateTransaction } = useTransactions();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: "",
        notes: ""
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                title: transaction.title || "",
                amount: transaction.amount || "",
                type: transaction.type || "expense",
                category: transaction.category || "Food",
                date: transaction.date || "",
                notes: transaction.notes || ""
            });
        }
    }, [transaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount) return;

        try {
            setLoading(true);
            await updateTransaction(transaction.id, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            showToast("Transaction updated!", "success");
            onClose();
        } catch (err) {
            showToast("Failed to update", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-btn text-text-primary text-sm focus:outline-none focus:border-[var(--input-focus-border)] focus:ring-1 focus:ring-accent-primary/20 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[var(--modal-bg)] border border-[var(--modal-border)] rounded-2xl shadow-2xl animate-pop-in overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--modal-border)]">
                    <h2 className="text-lg font-bold text-text-primary">Edit Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-surface rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className={`${inputClass} font-mono`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Type</label>
                            <div className="flex gap-2">
                                {["expense", "income"].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`flex-1 py-2.5 rounded-btn text-sm font-semibold border transition-all capitalize ${formData.type === type
                                                ? type === "expense"
                                                    ? "bg-accent-expense/10 text-accent-expense border-accent-expense/30"
                                                    : "bg-accent-income/10 text-accent-income border-accent-income/30"
                                                : "bg-[var(--input-bg)] text-text-muted border-[var(--input-border)]"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={`${inputClass} cursor-pointer`}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Notes (optional)</label>
                        <input
                            type="text"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className={inputClass}
                            placeholder="Add a note..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-btn bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-900 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
