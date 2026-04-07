import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, updateUserRole, deleteUser } from '../app/slices/usersSlice'
import { PageHeader, Avatar, ConfirmDialog, EmptyState } from '../components/ui'
import { formatRelative, cn } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const dispatch = useDispatch()
    const { items: users, loading } = useSelector((s) => s.users)
    const { user: me } = useSelector((s) => s.auth)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

    const filtered = users.filter(
        (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleRoleChange = async (id, role) => {
        try {
            await dispatch(updateUserRole({ id, role })).unwrap()
            toast.success('Role updated')
        } catch (e) { toast.error(e || 'Failed') }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteUser(deleteTarget._id)).unwrap()
            toast.success(`${deleteTarget.name} deleted`)
        } catch (e) { toast.error(e || 'Failed') }
        setDeleteTarget(null)
    }

    return (
        <div className="space-y-5 animate-fade-in">
            <PageHeader
                title="User Management"
                subtitle={`${users.length} registered users`}
            />

            {/* Search */}
            <div className="card p-4">
                <div className="relative max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                    </svg>
                    <input
                        className="input pl-9"
                        placeholder="Search users…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">Loading…</div>
                ) : filtered.length === 0 ? (
                    <EmptyState icon="👥" title="No users found" description="Try a different search" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">User</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Role</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Joined</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filtered.map((u) => (
                                    <tr key={u._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={u.name} size="sm" />
                                                <span className="font-medium text-[var(--text-primary)]">{u.name}</span>
                                                {u._id === me?._id && (
                                                    <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full font-semibold">You</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-[var(--text-secondary)]">{u.email}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                disabled={u._id === me?._id}
                                                className={cn(
                                                    'text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none',
                                                    u.role === 'admin'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                                                    u._id === me?._id && 'cursor-not-allowed opacity-60'
                                                )}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-[var(--text-muted)] text-xs">
                                            {formatRelative(u.createdAt)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {u._id !== me?._id && (
                                                <button
                                                    onClick={() => setDeleteTarget(u)}
                                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete user"
                message={`Delete ${deleteTarget?.name}? Their tasks will be unassigned.`}
                danger
            />
        </div>
    )
}