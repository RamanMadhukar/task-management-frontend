/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                display: ['Syne', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c7d6fe',
                    300: '#a5b8fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    secondary: '#f8fafc',
                    tertiary: '#f1f5f9',
                    dark: '#0f172a',
                    'dark-secondary': '#1e293b',
                    'dark-tertiary': '#334155',
                },
            },
            animation: {
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-in-up': 'slideInUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                'bounce-subtle': 'bounceSubtle 0.5s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'ping-once': 'ping 0.6s ease-out 1',
            },
            keyframes: {
                slideInRight: {
                    from: { transform: 'translateX(100%)', opacity: 0 },
                    to: { transform: 'translateX(0)', opacity: 1 },
                },
                slideInUp: {
                    from: { transform: 'translateY(20px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                bounceSubtle: {
                    '0%,100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(99,102,241,0.3)',
                'glow-sm': '0 0 10px rgba(99,102,241,0.2)',
                'card': '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05)',
                'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.08)',
            },
        },
    },
    plugins: [],
}