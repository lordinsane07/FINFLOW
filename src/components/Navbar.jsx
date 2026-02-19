import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resetAllData } from "../services/resetService";
import ThemeToggle from "./ThemeToggle";
import ConfirmDialog from "./ConfirmDialog";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetting, setResetting] = useState(false);
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleResetData = async () => {
        if (!currentUser) return;
        try {
            setResetting(true);
            await resetAllData(currentUser.uid);
            showToast("All data has been reset successfully", "success");
        } catch (error) {
            console.error("Failed to reset data", error);
            showToast("Failed to reset data", "error");
        } finally {
            setResetting(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Floating Navbar Pill */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
                <div className="glass rounded-full px-6 py-3 shadow-glow flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                            <span className="text-zinc-900 font-bold text-xl">F</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-text-primary hidden sm:block">
                            Fin<span className="text-accent-primary">Flow</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-5">
                        {currentUser && (
                            <Link
                                to="/"
                                className={`text-sm font-medium transition-colors hover:text-accent-primary relative group ${isActive("/") ? "text-accent-primary" : "text-text-secondary"
                                    }`}
                            >
                                Dashboard
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent-primary transform scale-x-0 group-hover:scale-x-100 transition-transform ${isActive("/") ? "scale-x-100" : ""}`} />
                            </Link>
                        )}

                        <div className="w-[1px] h-5 bg-border-subtle" />

                        <ThemeToggle />

                        {currentUser ? (
                            <div className="flex items-center gap-3 pl-2">
                                <div className="hidden lg:flex flex-col items-end mr-1">
                                    <span className="text-xs font-semibold text-text-primary">Welcome,</span>
                                    <span className="text-[10px] text-text-muted">{currentUser.email}</span>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-bg-card border border-border-accent flex items-center justify-center">
                                    <UserIcon size={16} className="text-accent-primary" />
                                </div>
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    className="p-2 text-text-muted hover:text-amber-400 transition-colors rounded-full hover:bg-amber-500/10"
                                    title="Reset All Data"
                                >
                                    <RotateCcw size={17} />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-text-muted hover:text-rose-400 transition-colors rounded-full hover:bg-rose-500/10"
                                    title="Logout"
                                >
                                    <LogOut size={17} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-900 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-text-primary rounded-full hover:bg-bg-card transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden flex flex-col pt-24 px-6 animate-fade-in-up">
                    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-2xl space-y-6">
                        {currentUser && (
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-medium flex items-center justify-between ${isActive("/") ? "text-accent-primary" : "text-text-secondary"
                                    }`}
                            >
                                Dashboard
                                {isActive("/") && <div className="w-2 h-2 rounded-full bg-accent-primary" />}
                            </Link>
                        )}

                        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                            <span className="text-base text-text-secondary">Appearance</span>
                            <ThemeToggle />
                        </div>

                        {currentUser ? (
                            <div className="space-y-4 border-t border-border-subtle pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center border border-border-accent">
                                        <UserIcon size={20} className="text-accent-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-text-primary">Signed in as</span>
                                        <span className="text-xs text-text-muted truncate max-w-[200px]">{currentUser.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowResetConfirm(true); setIsOpen(false); }}
                                    className="w-full py-3 rounded-xl bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-colors"
                                >
                                    <RotateCcw size={18} /> Reset All Data
                                </button>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 rounded-xl bg-accent-primary text-zinc-900 font-bold text-center shadow-lg"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Reset Data Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleResetData}
                title="Reset All Data?"
                message="This will permanently delete all your transactions and reset your budget & savings goal to zero. This action cannot be undone."
                confirmText={resetting ? "Resetting..." : "Reset Everything"}
            />
        </>
    );
}
