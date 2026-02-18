/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: 'var(--bg-primary)',
                    surface: 'var(--bg-surface)',
                    card: 'var(--bg-card)',
                    summary: 'var(--bg-summary)',
                    charts: 'var(--bg-charts)',
                    transactions: 'var(--bg-transactions)',
                },
                accent: {
                    primary: 'var(--accent-primary)',
                    'primary-dim': 'var(--accent-primary-dim)',
                    secondary: 'var(--accent-secondary)',
                    'secondary-dim': 'var(--accent-secondary-dim)',
                    income: 'var(--color-income)',
                    expense: 'var(--color-expense)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                border: {
                    subtle: 'var(--border-subtle)',
                    accent: 'var(--border-accent)',
                },
            },
            borderRadius: {
                card: 'var(--radius-card)',
                btn: 'var(--radius-btn)',
                pill: 'var(--radius-pill)',
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                glow: 'var(--shadow-glow)',
                hover: 'var(--shadow-hover)',
            },
            fontFamily: {
                sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'pulse-glow': 'pulseGlow 2s infinite',
                'float': 'float 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
