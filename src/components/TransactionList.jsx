import { useTransactions } from "../hooks/useTransactions";
import TransactionCard from "./TransactionCard";
import SkeletonCard from "./SkeletonCard";
import { format, isToday, isYesterday } from "date-fns";
import { useMemo } from "react";
import { SearchX } from "lucide-react";

export default function TransactionList({ filters, onEdit }) {
    const { transactions, loading, error } = useTransactions();

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.category && t.category !== filters.category) return false;
            if (filters.type !== "all" && t.type !== filters.type) return false;
            if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) return false;
            if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo)) return false;
            return true;
        });
    }, [transactions, filters]);

    const grouped = useMemo(() => {
        const groups = {};
        filteredTransactions.forEach(t => {
            const dateKey = t.date;
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(t);
        });
        return groups;
    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
            </div>
        );
    }

    if (error) {
        return <div className="text-accent-expense text-center py-8 text-sm">{error}</div>;
    }

    if (filteredTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                <div className="w-14 h-14 bg-bg-card rounded-2xl flex items-center justify-center mb-4 border border-border-subtle">
                    <SearchX size={28} />
                </div>
                <p className="text-base font-medium text-text-secondary">No transactions found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {Object.keys(grouped).map(date => {
                let label = format(new Date(date), "MMMM d, yyyy");
                if (isToday(new Date(date))) label = "Today";
                if (isYesterday(new Date(date))) label = "Yesterday";

                return (
                    <div key={date} className="relative">
                        <div className="sticky top-[70px] z-10 py-2 mb-3 bg-bg-transactions/95 backdrop-blur-sm flex items-center gap-3">
                            <h3 className="text-xs font-semibold text-accent-primary tracking-wider uppercase">
                                {label}
                            </h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-accent-primary/20 to-transparent" />
                        </div>

                        <div className="space-y-1">
                            {grouped[date].map(t => (
                                <TransactionCard key={t.id} transaction={t} onEdit={onEdit} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
