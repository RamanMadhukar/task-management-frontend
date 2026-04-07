import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../app/slices/authSlice'
import { disconnectSocket } from '../../utils/socket'
import { useTheme } from '../../hooks/useTheme'
import { useSocketStatus } from '../../hooks/useSocket'
import { Avatar, Tooltip } from '../ui'
import { cn } from '../../utils/helpers'

const NAV_LINKS = [
    {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        to: '/tasks',
        label: 'My Tasks',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        to: '/board',
        label: 'Board',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
        ),
    },
]

const ADMIN_LINKS = [
    {
        to: '/admin/users',
        label: 'Users',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
]

export default function Sidebar({ mobile = false, onClose }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((s) => s.auth)
    const { unreadCount } = useSelector((s) => s.notifications)
    const { toggle, isDark } = useTheme()
    const isConnected = useSocketStatus()

    const handleLogout = () => {
        disconnectSocket()
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div className={cn(
            'flex flex-col h-full bg-[var(--bg-primary)] border-r border-[var(--border)]',
            mobile ? 'w-full' : 'w-64'
        )}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)]">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                </div>
                <span className="font-display font-bold text-lg text-[var(--text-primary)]">TaskFlow</span>

                {/* Socket status */}
                <Tooltip content={isConnected ? 'Live' : 'Offline'}>
                    <div className={cn(
                        'ml-auto w-2 h-2 rounded-full',
                        isConnected ? 'bg-emerald-500 socket-pulse' : 'bg-slate-400'
                    )} />
                </Tooltip>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">
                    Main
                </p>
                {NAV_LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
                    >
                        {link.icon}
                        {link.label}
                        {link.to === '/tasks' && unreadCount > 0 && (
                            <span className="ml-auto bg-brand-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </NavLink>
                ))}

                {user?.role === 'admin' && (
                    <>
                        <p className="px-3 mt-5 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">
                            Admin
                        </p>
                        {ADMIN_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={onClose}
                                className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* Bottom section */}
            <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
                {/* Theme toggle */}
                <button onClick={toggle} className="sidebar-link w-full">
                    {isDark ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                    {isDark ? 'Light mode' : 'Dark mode'}
                </button>

                {/* User profile */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    onClick={() => { navigate('/profile'); onClose?.() }}>
                    <Avatar name={user?.name} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
                        <p className="text-xs text-[var(--text-muted)] capitalize">{user?.role}</p>
                    </div>
                </div>

                {/* Logout */}
                <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                </button>
            </div>
        </div>
    )
}