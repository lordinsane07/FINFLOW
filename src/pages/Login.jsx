import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";

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
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">

            {/* Ambient glow blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-amber-500/8 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-sm relative animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
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
    );
}
