import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { LogIn, Eye, EyeOff, ArrowRight, TrendingUp, Shield, Zap, PieChart } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);
            const name = result?.user?.displayName || result?.user?.email?.split("@")[0] || "there";
            showToast(`Welcome back, ${name}! 👋`, "success");
            navigate("/");
        } catch (err) {
            showToast(err.message || "Login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-btn text-text-primary text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all";

    return (
        <div className="min-h-screen bg-bg-primary flex relative overflow-hidden">

            {/* Ambient glow blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-amber-500/8 rounded-full blur-[120px]" />
            </div>

            {/* ═══ LEFT SIDE: Description Panel ═══ */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-bg-primary to-bg-primary" />

                {/* Decorative grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12 w-full">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <span className="text-zinc-900 font-bold text-xl">F</span>
                            </div>
                            <span className="text-2xl font-bold text-text-primary">
                                Fin<span className="text-accent-primary">Flow</span>
                            </span>
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-4">
                            Your finances,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                                simplified.
                            </span>
                        </h2>
                        <p className="text-text-secondary text-base leading-relaxed max-w-md">
                            Track expenses, set budgets, and achieve your savings goals — all in one beautiful dashboard.
                        </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                <TrendingUp size={18} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-0.5">Real-time Analytics</h3>
                                <p className="text-xs text-text-muted leading-relaxed">Interactive charts and insights that update as you add transactions.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                                <PieChart size={18} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-0.5">Smart Budgeting</h3>
                                <p className="text-xs text-text-muted leading-relaxed">Set monthly budgets and get visual progress tracking.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                                <Zap size={18} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-0.5">Savings Goals</h3>
                                <p className="text-xs text-text-muted leading-relaxed">Set targets and track your progress towards financial freedom.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/20 transition-colors">
                                <Shield size={18} className="text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary mb-0.5">Secure & Private</h3>
                                <p className="text-xs text-text-muted leading-relaxed">Your data is encrypted and stored securely with Firebase.</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative bottom stats */}
                    <div className="mt-12 pt-8 border-t border-border-subtle">
                        <div className="flex gap-8">
                            <div>
                                <div className="text-2xl font-bold text-accent-primary">100%</div>
                                <div className="text-xs text-text-muted">Free to use</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-accent-primary">Real-time</div>
                                <div className="text-xs text-text-muted">Data sync</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-accent-primary">Dark/Light</div>
                                <div className="text-xs text-text-muted">Theme support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ RIGHT SIDE: Login Form ═══ */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-sm relative animate-fade-in-up">
                    {/* Logo — visible only on mobile */}
                    <div className="text-center mb-10">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 lg:hidden">
                            <span className="text-zinc-900 font-bold text-2xl">F</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary mb-1">Welcome back</h1>
                        <p className="text-sm text-text-muted">Sign in to your vault</p>
                    </div>

                    {/* Form Card */}
                    <div className="vault-card p-7 space-y-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${inputClass} pr-10`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-btn bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-900 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn size={16} />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-text-muted mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-accent-primary hover:underline font-semibold inline-flex items-center gap-1">
                            Create one <ArrowRight size={13} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
