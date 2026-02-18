import { useMemo } from "react";
import { formatCurrency } from "../utils/format";
import { TrendingUp, TrendingDown, AlertTriangle, Trophy, PiggyBank, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

function generateInsights(transactions) {
    if (transactions.length < 2) return [];

    const insights = [];
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // This month's transactions
    const thisMonthTxns = transactions.filter(t => {
        const d = new Date(t.date);
        return isWithinInterval(d, { start: thisMonthStart, end: thisMonthEnd });
    });

    const lastMonthTxns = transactions.filter(t => {
        const d = new Date(t.date);
        return isWithinInterval(d, { start: lastMonthStart, end: lastMonthEnd });
    });

    // This month income/expense
    const thisIncome = thisMonthTxns.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const thisExpense = thisMonthTxns.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const lastExpense = lastMonthTxns.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

    // 1. Monthly savings
    const savings = thisIncome - thisExpense;
    if (savings > 0) {
        insights.push({
            icon: PiggyBank,
            color: "emerald",
            title: "Monthly Savings",
            text: `You've saved ${formatCurrency(savings)} this month — keep it up!`,
            type: "positive"
        });
    }

    // 2. Top expense category
    const catMap = {};
    thisMonthTxns.filter(t => t.type === "expense").forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
        insights.push({
            icon: ShoppingBag,
            color: "amber",
            title: "Top Category",
            text: `Biggest spend this month: ${topCat[0]} at ${formatCurrency(topCat[1])}`,
            type: "info"
        });
    }

    // 3. Month-over-month comparison
    if (lastExpense > 0 && thisExpense > 0) {
        const changePercent = ((thisExpense - lastExpense) / lastExpense * 100).toFixed(0);
        if (thisExpense > lastExpense) {
            insights.push({
                icon: ArrowUpRight,
                color: "rose",
                title: "Spending Up",
                text: `You're spending ${Math.abs(changePercent)}% more than last month`,
                type: "warning"
            });
        } else {
            insights.push({
                icon: ArrowDownRight,
                color: "emerald",
                title: "Spending Down",
                text: `You're spending ${Math.abs(changePercent)}% less than last month!`,
                type: "positive"
            });
        }
    }

    // 4. Big transaction alert
    const biggest = thisMonthTxns
        .filter(t => t.type === "expense")
        .sort((a, b) => Number(b.amount) - Number(a.amount))[0];
    if (biggest && Number(biggest.amount) > thisExpense * 0.3) {
        insights.push({
            icon: AlertTriangle,
            color: "amber",
            title: "Large Transaction",
            text: `"${biggest.title}" was ${formatCurrency(biggest.amount)} — ${((Number(biggest.amount) / thisExpense) * 100).toFixed(0)}% of this month's spending`,
            type: "warning"
        });
    }

    // 5. This month's activity count (always shows)
    const expenseCount = thisMonthTxns.filter(t => t.type === "expense").length;
    const incomeCount = thisMonthTxns.length - expenseCount;
    insights.push({
        icon: Trophy,
        color: "emerald",
        title: "This Month",
        text: `${thisMonthTxns.length} transaction${thisMonthTxns.length !== 1 ? 's' : ''} logged — ${expenseCount} expense${expenseCount !== 1 ? 's' : ''}, ${incomeCount} income`,
        type: "info"
    });

    return insights.slice(0, 4); // Max 4 insights
}

const COLOR_MAP = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/15" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/15" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/15" },
};

export default function SpendingInsights({ transactions }) {
    const insights = useMemo(() => generateInsights(transactions), [transactions]);

    if (insights.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up">
            {insights.map((insight, i) => {
                const colors = COLOR_MAP[insight.color] || COLOR_MAP.emerald;
                const Icon = insight.icon;
                return (
                    <div
                        key={i}
                        className={`group relative p-4 rounded-2xl border ${colors.border} bg-bg-card hover:bg-bg-surface transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                    >
                        {/* Ambient glow */}
                        <div className={`absolute -top-6 -right-6 w-20 h-20 ${colors.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                                    <Icon size={14} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${colors.text}`}>
                                    {insight.title}
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
