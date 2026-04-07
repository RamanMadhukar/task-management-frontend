import { cn } from '../../utils/helpers'

export default function StatsCard({ title, value, subtitle, icon, color = 'brand', trend }) {
    const colors = {
        brand: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    }

    return (
        <div className="card p-5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[color])}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        trend >= 0
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div>
                <div className="text-3xl font-display font-bold text-[var(--text-primary)] mb-0.5">
                    {value ?? '—'}
                </div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">{title}</div>
                {subtitle && <div className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</div>}
            </div>
        </div>
    )
}