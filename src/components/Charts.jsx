import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const COLORS = [
    "#34D399", "#FBBF24", "#FB7185", "#818CF8",
    "#38BDF8", "#F472B6", "#A78BFA", "#FB923C"
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--modal-bg)] border border-border-subtle p-3 rounded-xl shadow-xl">
                <p className="text-accent-primary text-xs font-semibold uppercase tracking-wider mb-1">{payload[0].name}</p>
                <p className="font-mono text-text-primary text-sm font-bold">
                    ${Number(payload[0].value).toFixed(2)}
                </p>
            </div>
        );
    }
    return null;
};

export default function Charts({ transactions }) {
    const pieData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === "expense");
        const categoryTotals = {};
        expenses.forEach(t => {
            const amount = Number(t.amount);
            if (categoryTotals[t.category]) {
                categoryTotals[t.category] += amount;
            } else {
                categoryTotals[t.category] = amount;
            }
        });
        return Object.keys(categoryTotals)
            .map(cat => ({ name: cat, value: categoryTotals[cat] }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    const barData = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            const monthLabel = format(date, "MMM");
            const income = transactions
                .filter(t => t.type === "income" && isWithinInterval(new Date(t.date), { start, end }))
                .reduce((sum, t) => sum + Number(t.amount), 0);
            const expense = transactions
                .filter(t => t.type === "expense" && isWithinInterval(new Date(t.date), { start, end }))
                .reduce((sum, t) => sum + Number(t.amount), 0);
            data.push({ name: monthLabel, Income: income, Expense: expense });
        }
        return data;
    }, [transactions]);

    if (transactions.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Pie Chart */}
            <div className="vault-card p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    Expense Breakdown
                </h3>
                <div className="h-[280px] w-full">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="var(--bg-card)"
                                    strokeWidth={2}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'var(--text-secondary)' }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-muted text-sm">
                            No expense data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Bar Chart */}
            <div className="vault-card p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                    Monthly Overview
                </h3>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.4} vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-subtle)', opacity: 0.2 }} />
                            <Bar dataKey="Income" fill="var(--color-income)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                            <Bar dataKey="Expense" fill="var(--color-expense)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
