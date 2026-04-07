import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, clearError } from '../../app/slices/authSlice'
import { InputField } from '../ui'
import toast from 'react-hot-toast'

export function LoginForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector((s) => s.auth)

    const { register, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => { dispatch(clearError()) }, [dispatch])

    const onSubmit = async (data) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (e) {
            // error shown from Redux state
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <InputField
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                }
                {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
            />

            <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                leftIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                }
                {...register('password', { required: 'Password is required' })}
            />

            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in…
                    </span>
                ) : 'Sign in'}
            </button>

            <p className="text-center text-sm text-[var(--text-muted)]">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-500 hover:text-brand-600 font-medium">Sign up</Link>
            </p>
        </form>
    )
}

export function RegisterForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector((s) => s.auth)

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    useEffect(() => { dispatch(clearError()) }, [dispatch])

    const onSubmit = async (data) => {
        try {
            await dispatch(loginUser({ ...data })).unwrap()
        } catch (_) { }

        try {
            const { confirmPassword, ...rest } = data
            await dispatch(
                (await import('../../app/slices/authSlice')).registerUser(rest)
            ).unwrap()
            toast.success('Account created!')
            navigate('/dashboard')
        } catch (e) { }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <InputField
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                })}
            />

            <InputField
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
            />

            <InputField
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                error={errors.password?.message}
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                })}
            />

            <InputField
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                    required: 'Please confirm',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
            />

            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-[var(--text-muted)]">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
            </p>
        </form>
    )
}