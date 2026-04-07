import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/AuthForms'

export default function LoginPage() {
    const navigate = useNavigate()
    const { token } = useSelector((s) => s.auth)

    useEffect(() => {
        if (token) navigate('/dashboard', { replace: true })
    }, [token, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            {/* Background grid */}
            <div className="fixed inset-0 -z-10 opacity-30 dark:opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="w-full max-w-md animate-slide-in-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-4 shadow-glow">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">TaskFlow</h1>
                    <p className="text-[var(--text-muted)] mt-1 text-sm">Sign in to your workspace</p>
                </div>

                <div className="card p-8 shadow-card">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}