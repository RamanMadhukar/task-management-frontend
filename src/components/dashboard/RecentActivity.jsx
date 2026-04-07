import { useSelector } from 'react-redux'
import { formatRelative, STATUS_CONFIG, PRIORITY_CONFIG, cn } from '../../utils/helpers'
import { Avatar } from '../ui'

export default function RecentActivity() {
    const notifications = useSelector((s) => s.notifications.items)

    const icons = {
        task_created: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: '✓' },
        task_assigned: { bg: 'bg-brand-100 dark:bg-brand-900/30', text: 'text-brand-600 dark:text-brand-400', label: '→' },
        task_updated: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: '✎' },
    }

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Live Activity</h3>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full socket-pulse" />
                    Real-time
                </span>
            </div>

            {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                    No activity yet — updates will appear here live
                </div>
            ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                    {notifications.slice(0, 15).map((n) => {
                        const icon = icons[n.type] || icons.task_updated
                        return (
                            <div key={n.id} className="flex items-start gap-3 animate-fade-in">
                                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5', icon.bg, icon.text)}>
                                    {icon.label}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--text-primary)] leading-snug">{n.message}</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatRelative(n.createdAt)}</p>
                                </div>
                                {!n.read && (
                                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0 mt-2" />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}