import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/format";

function AnimatedCounter({ value }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime;
        const duration = 1200;
        const initialValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = initialValue + (value - initialValue) * ease;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <>{formatCurrency(displayValue, true)}</>;
}

export default function SummaryCards({ transactions }) {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    return (
        <>
            {/* Total Balance — Amber Tinted */}
            <div className="vault-card vault-card--balance p-6 animate-fade-in-up stagger-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-semibold text-accent-secondary tracking-widest uppercase mb-2">Total Balance</p>
                        <h3
                            className="text-3xl font-mono font-bold text-text-primary tracking-tight"
                            title={formatCurrency(balance)}
                        >
                            <AnimatedCounter value={balance} />
                        </h3>
                    </div>
                    <div className="p-2.5 bg-accent-secondary-dim rounded-xl text-accent-secondary">
                        <Wallet size={20} />
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Net Worth</span>
                    <div className="flex-1 h-[1px] bg-border-subtle" />
                </div>
            </div>

            {/* Income — Emerald Tinted */}
            <div className="vault-card vault-card--income p-6 animate-fade-in-up stagger-2">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-2">Income</p>
                        <h3 className="text-2xl font-mono font-bold text-accent-income tracking-tight">
                            +<AnimatedCounter value={income} />
                        </h3>
                    </div>
                    <div className="p-2.5 bg-[var(--color-income-dim)] rounded-xl text-accent-income">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-accent-income/60 uppercase tracking-wider">Total Credits</span>
                    <div className="flex-1 h-[1px] bg-accent-income/10" />
                </div>
            </div>

            {/* Expense — Rose Tinted */}
            <div className="vault-card vault-card--expense p-6 animate-fade-in-up stagger-3">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-2">Expense</p>
                        <h3 className="text-2xl font-mono font-bold text-accent-expense tracking-tight">
                            -<AnimatedCounter value={expense} />
                        </h3>
                    </div>
                    <div className="p-2.5 bg-[var(--color-expense-dim)] rounded-xl text-accent-expense">
                        <TrendingDown size={20} />
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-accent-expense/60 uppercase tracking-wider">Total Debits</span>
                    <div className="flex-1 h-[1px] bg-accent-expense/10" />
                </div>
            </div>
        </>
    );
}
