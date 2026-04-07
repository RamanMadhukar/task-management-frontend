import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { registerUser, clearError } from '../app/slices/authSlice'
import { InputField, Select } from '../components/ui'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, token } = useSelector((s) => s.auth)

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange', // This fixes your issue
    })

    useEffect(() => { dispatch(clearError()) }, [dispatch])
    useEffect(() => { if (token) navigate('/dashboard', { replace: true }) }, [token, navigate])

    const onSubmit = async (data) => {
        try {
            const { confirmPassword, ...rest } = data
            await dispatch(registerUser(rest)).unwrap()
            toast.success('Account created! Welcome 🎉')
            navigate('/dashboard')
        } catch (_) { }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-secondary)]">
            <div className="fixed inset-0 -z-10 opacity-30 dark:opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="w-full max-w-md animate-slide-in-up">
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-4 shadow-glow">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Create account</h1>
                    <p className="text-[var(--text-muted)] mt-1 text-sm">Join TaskFlow today</p>
                </div>

                <div className="card p-8 shadow-card">
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputField
                            label="Full Name"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Min 2 chars' } })}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                            })}
                        />
                        <Select label="Role" {...register('role')}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </Select>
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Min 6 characters"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Password required',
                                minLength: { value: 6, message: 'Min 6 characters' },
                            })}
                        />
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Repeat password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword', {
                                required: 'Confirm your password',
                                validate: (v) => v === watch('password') || 'Passwords do not match',
                            })}
                        />

                        <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                            {loading ? 'Creating…' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[var(--text-muted)] mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}