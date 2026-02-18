import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import GreetingBar from "../components/GreetingBar";
import SummaryCards from "../components/SummaryCards";
import BudgetCard from "../components/BudgetCard";
import SavingsGoal from "../components/SavingsGoal";
import SpendingInsights from "../components/SpendingInsights";
import FilterBar from "../components/FilterBar";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { useTransactions } from "../hooks/useTransactions";
import { Plus, Download, BarChart3, Receipt, Wallet, Keyboard } from "lucide-react";

export default function Dashboard() {
    const { transactions } = useTransactions();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        type: "all",
        dateFrom: "",
        dateTo: ""
    });

    // ⌨️ Keyboard shortcut: N → open Add Transaction
    const handleKeyDown = useCallback((e) => {
        // Don't trigger when typing in inputs/textareas
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
        if (e.key === "n" || e.key === "N") {
            e.preventDefault();
            setIsAddModalOpen(true);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleExport = () => {
        if (!transactions.length) return;

        const headers = ["Date", "Type", "Category", "Amount", "Description"];
        const csvContent = [
            headers.join(","),
            ...transactions.map(t => {
                const date = t.date?.toDate ? t.date.toDate().toLocaleDateString() : new Date(t.date).toLocaleDateString();
                return [date, t.type, t.category, t.amount, `"${t.description || ''}"`].join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "finflow_transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-bg-primary pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">

                {/* 🌅 Smart Greeting Bar with Sparkline */}
                <GreetingBar transactions={transactions} />

                {/* ═══ SECTION 1: Portfolio Overview ═══ */}
                <div className="section-zone section-zone--summary animate-fade-in-up">
                    <div className="section-title">
                        <div className="section-title__icon bg-accent-primary-dim text-accent-primary">
                            <Wallet size={16} />
                        </div>
                        <span className="section-title__text">Portfolio Overview</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <SummaryCards transactions={transactions} />
                    </div>
                    {/* Budget + Savings Goal row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                        <BudgetCard />
                        <SavingsGoal transactions={transactions} />
                    </div>
                </div>

                <hr className="section-divider" />

                {/* 🧠 Spending Insights */}
                <SpendingInsights transactions={transactions} />

                <hr className="section-divider" />

                {/* ═══ SECTION 2: Analytics ═══ */}
                <div className="section-zone section-zone--charts animate-fade-in-up stagger-2">
                    <div className="section-title">
                        <div className="section-title__icon bg-accent-secondary-dim text-accent-secondary">
                            <BarChart3 size={16} />
                        </div>
                        <span className="section-title__text">Analytics</span>
                    </div>
                    <Charts transactions={transactions} />
                </div>

                <hr className="section-divider" />

                {/* ═══ SECTION 3: Transaction Ledger ═══ */}
                <div className="section-zone section-zone--transactions animate-fade-in-up stagger-3">
                    <div className="section-title">
                        <div className="section-title__icon bg-[rgba(99,102,241,0.12)] text-indigo-400">
                            <Receipt size={16} />
                        </div>
                        <span className="section-title__text">Transaction Ledger</span>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-text-primary">Recent Transactions</h2>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2.5 bg-bg-card hover:bg-bg-surface text-text-secondary rounded-btn transition-all border border-border-subtle hover:border-accent-primary/30 text-sm font-medium"
                            >
                                <Download size={15} />
                                Export CSV
                            </button>
                        </div>

                        <FilterBar filters={filters} setFilters={setFilters} />

                        <TransactionList filters={filters} onEdit={setEditingTransaction} />
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center">
                            <span className="text-zinc-900 font-bold text-xs">F</span>
                        </div>
                        <span className="text-sm text-text-muted">FinFlow © {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="px-2 py-1 rounded-md bg-bg-card border border-border-subtle">React</span>
                        <span className="px-2 py-1 rounded-md bg-bg-card border border-border-subtle">Firebase</span>
                        <span className="px-2 py-1 rounded-md bg-bg-card border border-border-subtle">Tailwind</span>
                    </div>
                </div>
            </footer>

            {/* Floating Action Button with keyboard hint */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-8 right-8 group flex items-center gap-3 z-40"
                aria-label="Add Transaction"
            >
                {/* Keyboard hint —shows on hover */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-bg-card border border-border-subtle text-text-muted text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg">
                    <Keyboard size={12} />
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 bg-bg-surface rounded text-text-secondary font-mono text-[10px] font-bold border border-border-subtle">N</kbd>
                </div>
                {/* FAB */}
                <div className="p-4 rounded-full bg-accent-primary text-zinc-900 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300 animate-pulse-glow">
                    <Plus size={28} strokeWidth={2.5} />
                </div>
            </button>

            {/* Modals */}
            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {editingTransaction && (
                <EditTransactionModal
                    isOpen={!!editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    transaction={editingTransaction}
                />
            )}
        </div>
    );
}
