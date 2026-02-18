import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Sun, Moon, Sunrise, Sunset, TrendingUp, Calendar, Zap } from "lucide-react";
import { format, subDays, isToday } from "date-fns";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return { text: "Good night", icon: Moon, emoji: "🌙" };
    if (hour < 12) return { text: "Good morning", icon: Sunrise, emoji: "☀️" };
    if (hour < 17) return { text: "Good afternoon", icon: Sun, emoji: "🌤️" };
    if (hour < 21) return { text: "Good evening", icon: Sunset, emoji: "🌅" };
    return { text: "Good night", icon: Moon, emoji: "🌙" };
}

const TIPS = [
    "Track every transaction to stay aware of your spending habits.",
    "Small daily savings compound into significant annual growth.",
    "Review your budget weekly to stay on top of your finances.",
    "Automate your savings — pay yourself first.",
    "The best time to start investing was yesterday. The second best is today.",
    "A budget isn't a restriction — it's a plan for your money.",
    "Every dollar tracked is a step toward financial freedom.",
];

export default function GreetingBar({ transactions }) {
    const { currentUser } = useAuth();
    const greeting = getGreeting();
    const GreetingIcon = greeting.icon;

    // Get user's display name or email prefix
    const userName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "there";

    // Tip of the day (deterministic per day)
    const tipOfDay = TIPS[new Date().getDate() % TIPS.length];

    // Today's transaction count
    const todayCount = useMemo(() =>
        transactions.filter(t => isToday(new Date(t.date))).length,
        [transactions]
    );

    // Last 7 days sparkline data
    const sparklineData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const day = subDays(new Date(), i);
            const dayStr = format(day, "yyyy-MM-dd");
            const spent = transactions
                .filter(t => t.type === "expense" && t.date === dayStr)
                .reduce((sum, t) => sum + Number(t.amount), 0);
            data.push({ day: format(day, "EEE"), value: spent });
        }
        return data;
    }, [transactions]);

    const hasSparkData = sparklineData.some(d => d.value > 0);

    return (
        <div className="vault-card p-6 mb-2 relative overflow-hidden animate-fade-in-up">
            {/* Ambient gradient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative">
                {/* Left: Greeting */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-accent-primary-dim flex items-center justify-center text-accent-primary">
                            <GreetingIcon size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                {greeting.text}, <span className="text-accent-primary capitalize">{userName}</span> {greeting.emoji}
                            </h1>
                            <p className="text-xs text-text-muted">
                                {format(new Date(), "EEEE, MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>

                    {/* Tip of the day */}
                    <div className="flex items-start gap-2 mt-3 pl-[52px]">
                        <Zap size={12} className="text-accent-secondary mt-0.5 shrink-0" />
                        <p className="text-xs text-text-secondary italic leading-relaxed">{tipOfDay}</p>
                    </div>
                </div>

                {/* Right: Quick stats + Sparkline */}
                <div className="flex items-center gap-6">
                    {/* Quick stats badges */}
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <Calendar size={12} className="text-accent-primary" />
                                <span className="text-xs text-text-muted">Today</span>
                            </div>
                            <span className="text-lg font-bold font-mono text-text-primary">{todayCount}</span>
                        </div>
                        <div className="w-[1px] h-10 bg-border-subtle self-center" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <TrendingUp size={12} className="text-accent-secondary" />
                                <span className="text-xs text-text-muted">Total</span>
                            </div>
                            <span className="text-lg font-bold font-mono text-text-primary">{transactions.length}</span>
                        </div>
                    </div>

                    {/* Sparkline */}
                    {hasSparkData && (
                        <div className="hidden md:block">
                            <p className="text-[9px] font-semibold text-text-muted uppercase tracking-widest mb-1">7-Day Spending</p>
                            <div className="w-[120px] h-[40px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparklineData}>
                                        <defs>
                                            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--accent-primary)"
                                            strokeWidth={1.5}
                                            fill="url(#sparkGrad)"
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
