import { useSelector } from 'react-redux'
import { Avatar, PageHeader } from '../components/ui'
import { formatRelative } from '../utils/helpers'

export default function ProfilePage() {
    const { user } = useSelector((s) => s.auth)

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <PageHeader title="Profile" subtitle="Your account information" />

            <div className="card p-6">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[var(--border)]">
                    <Avatar name={user?.name} size="lg" />
                    <div>
                        <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">{user?.name}</h2>
                        <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
                        <span className={`mt-1.5 inline-block text-xs font-semibold px-2.5 py-1 rounded-full
              ${user?.role === 'admin'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                            {user?.role?.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', value: user?.name },
                        { label: 'Email', value: user?.email },
                        { label: 'Role', value: user?.role },
                        { label: 'Member since', value: formatRelative(user?.createdAt) },
                    ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                            <p className="text-xs text-[var(--text-muted)] mb-1">{item.label}</p>
                            <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{item.value || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}