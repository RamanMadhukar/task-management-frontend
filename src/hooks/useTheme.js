import { useState, useEffect } from 'react'

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('tm_theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
        localStorage.setItem('tm_theme', theme)
    }, [theme])

    const toggle = () => setTheme((t) => t === 'dark' ? 'light' : 'dark')

    return { theme, toggle, isDark: theme === 'dark' }
}