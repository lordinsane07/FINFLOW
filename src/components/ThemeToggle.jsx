import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-bg-surface border border-border-subtle transition-all duration-300 hover:border-accent-primary/40 group"
            aria-label="Toggle theme"
        >
            {/* Sliding knob */}
            <div
                className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] shadow-sm ${isDark
                        ? "left-0.5 bg-zinc-700 text-amber-400"
                        : "left-[calc(100%-1.625rem)] bg-white text-amber-500 shadow-md"
                    }`}
            >
                {isDark ? <Moon size={12} /> : <Sun size={12} />}
            </div>
        </button>
    );
}
