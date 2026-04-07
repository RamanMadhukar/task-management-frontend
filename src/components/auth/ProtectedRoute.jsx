import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from '../../app/slices/authSlice'
import { Spinner } from '../ui'

export function ProtectedRoute() {
    const dispatch = useDispatch()
    const { token, user, initialized } = useSelector((s) => s.auth)

    useEffect(() => {
        if (token && !user && !initialized) dispatch(fetchMe())
    }, [token, user, initialized, dispatch])

    if (token && !initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow animate-pulse-slow">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                    </div>
                    <Spinner size="md" />
                    <p className="text-sm text-[var(--text-muted)]">Loading TaskFlow…</p>
                </div>
            </div>
        )
    }

    if (!token) return <Navigate to="/login" replace />
    return <Outlet />
}

export function AdminRoute() {
    const { user } = useSelector((s) => s.auth)
    if (!user) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
    return <Outlet />
}

export function GuestRoute() {
    const { token } = useSelector((s) => s.auth)
    if (token) return <Navigate to="/dashboard" replace />
    return <Outlet />
}