import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'
import { getInitials } from '../../utils/helpers'

// ─── Spinner ────────────────────────────────────────────
export const Spinner = ({ size = 'md', className }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
    return (
        <div className={cn('animate-spin rounded-full border-2 border-[var(--border)] border-t-brand-500', sizes[size], className)} />
    )
}

// ─── Avatar ─────────────────────────────────────────────
export const Avatar = ({ name, size = 'md', className }) => {
    const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
    const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500']
    const color = colors[(name?.charCodeAt(0) || 0) % colors.length]
    return (
        <div className={cn('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizes[size], color, className)}>
            {getInitials(name)}
        </div>
    )
}

// ─── Badge ──────────────────────────────────────────────
export const Badge = ({ children, className }) => (
    <span className={cn('badge', className)}>{children}</span>
)

// ─── Modal ──────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
            <div
                className={cn('relative w-full card p-6 animate-slide-in-up', sizes[size])}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">{title}</h2>
                    <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

// ─── Confirm Dialog ──────────────────────────────────────
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, danger = false }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <p className="text-sm text-[var(--text-secondary)] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>Confirm</button>
        </div>
    </Modal>
)

// ─── Empty State ─────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">{icon || '📭'}</div>
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-xs mb-6">{description}</p>
        {action}
    </div>
)

// ─── Skeleton ────────────────────────────────────────────
export const SkeletonCard = () => (
    <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
        <div className="flex gap-2 mt-4">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
        </div>
    </div>
)

// ─── Select (Updated with forwardRef) ───────────────────
export const Select = forwardRef(({ label, error, className, children, ...props }, ref) => (
    <div className={className}>
        {label && <label className="label">{label}</label>}
        <select
            ref={ref}
            className={cn('input appearance-none', error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')}
            {...props}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
))

Select.displayName = 'Select'

// ─── Input Field (Updated with forwardRef) ──────────────
export const InputField = forwardRef(({ label, error, className, leftIcon, ...props }, ref) => (
    <div className={className}>
        {label && <label className="label">{label}</label>}
        <div className="relative">
            {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{leftIcon}</div>
            )}
            <input
                ref={ref}
                className={cn('input', leftIcon && 'pl-9', error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
))

InputField.displayName = 'InputField'

// ─── Textarea (Updated with forwardRef) ─────────────────
export const Textarea = forwardRef(({ label, error, className, ...props }, ref) => (
    <div className={className}>
        {label && <label className="label">{label}</label>}
        <textarea
            ref={ref}
            className={cn('input resize-none', error && 'border-red-400')}
            rows={3}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
))

Textarea.displayName = 'Textarea'

// ─── Toggle / Switch ─────────────────────────────────────
export const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <div className={cn(
                'w-10 h-6 rounded-full transition-colors duration-200',
                checked ? 'bg-brand-500' : 'bg-[var(--bg-tertiary)] border border-[var(--border)]'
            )} />
            <div className={cn(
                'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
                checked ? 'translate-x-4' : ''
            )} />
        </div>
        {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
    </label>
)

// ─── Tooltip ─────────────────────────────────────────────
export const Tooltip = ({ children, content }) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
        </div>
    </div>
)

// ─── Page Header ─────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }) => (
    <div className="flex items-start justify-between mb-6">
        <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
)