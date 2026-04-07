import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useSocket } from '../../hooks/useSocket'

export default function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)
    useSocket()

    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-secondary)]">
            <div className="hidden lg:flex flex-shrink-0">
                <Sidebar />
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-72 h-full animate-slide-in-right">
                        <Sidebar mobile onClose={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuToggle={() => setMobileOpen((o) => !o)} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}