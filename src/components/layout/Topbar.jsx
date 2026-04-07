import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { markAllRead, markRead } from '../../app/slices/notificationsSlice'
import { formatRelative, cn } from '../../utils/helpers'

export default function Topbar({ onMenuToggle }) {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const { items, unreadCount } = useSelector((s) => s.notifications)
    const [notifOpen, setNotifOpen] = useState(false)
    const notifRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-6
      bg-[var(--bg-primary)] border-b border-[var(--border)] sticky top-0 z-30">

            {/* Mobile hamburger */}
            <button
                onClick={onMenuToggle}
                className="lg:hidden btn-ghost p-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <div className="hidden lg:block" />

            {/* Right side */}
            <div className="flex items-center gap-2">

                {/* Notifications bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen((o) => !o)}
                        className="relative btn-ghost p-2 rounded-xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-ping-once">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 card shadow-card-hover z-50 animate-slide-in-up overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                                <span className="font-semibold text-sm text-[var(--text-primary)]">Notifications</span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => dispatch(markAllRead())}
                                        className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                                {items.length === 0 ? (
                                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">
                                        No notifications yet
                                    </div>
                                ) : (
                                    items.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => dispatch(markRead(n.id))}
                                            className={cn(
                                                'flex gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors',
                                                !n.read && 'bg-brand-50/50 dark:bg-brand-900/10'
                                            )}
                                        >
                                            <div className={cn(
                                                'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                                                n.type === 'task_assigned' ? 'bg-brand-500' : 'bg-emerald-500',
                                                n.read && 'opacity-0'
                                            )} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[var(--text-primary)] leading-snug">{n.message}</p>
                                                <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatRelative(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User chip */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</span>
                    <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide',
                        user?.role === 'admin'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                        {user?.role}
                    </span>
                </div>
            </div>
        </header>
    )
}