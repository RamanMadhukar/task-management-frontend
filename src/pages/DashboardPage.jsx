import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchTasks, fetchTaskStats } from '../app/slices/taskSlice'
import { fetchUsers } from '../app/slices/usersSlice'
import StatsCard from '../components/dashboard/StatsCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'
import { SkeletonCard, PageHeader, EmptyState } from '../components/ui'
import { useState } from 'react'

const STATUS_COLORS = {
    todo: 'bg-slate-400',
    'in-progress': 'bg-blue-500',
    review: 'bg-purple-500',
    done: 'bg-emerald-500',
}
const STATUS_LABELS = {
    todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done',
}

export default function DashboardPage() {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const { items: tasks, stats, loading } = useSelector((s) => s.tasks)
    const [createOpen, setCreateOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchTasks({ limit: 6 }))
        dispatch(fetchTaskStats())
        if (user?.role === 'admin') dispatch(fetchUsers())
    }, [dispatch, user])

    const total = stats.reduce((acc, s) => acc + s.count, 0)
    const done = stats.find((s) => s.status === 'done')?.count || 0
    const inProg = stats.find((s) => s.status === 'in-progress')?.count || 0
    const overdue = tasks.filter((t) => {
        return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    }).length

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
                subtitle="Here's what's happening with your tasks today."
                actions={
                    <button onClick={() => setCreateOpen(true)} className="btn-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                }
            />

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Tasks" value={total} color="brand"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatsCard
                    title="In Progress" value={inProg} color="amber"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatsCard
                    title="Completed" value={done} color="green"
                    subtitle={total ? `${Math.round((done / total) * 100)}% completion` : ''}
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatsCard
                    title="Overdue" value={overdue} color="red"
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
            </div>

            {/* Progress bar breakdown */}
            {total > 0 && (
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display font-semibold text-[var(--text-primary)]">Progress Overview</h3>
                        <span className="text-sm text-[var(--text-muted)]">{done} / {total} done</span>
                    </div>
                    {/* Stacked bar */}
                    <div className="flex rounded-full overflow-hidden h-3 bg-[var(--bg-tertiary)] mb-4">
                        {stats.map((s) => (
                            s.count > 0 && (
                                <div
                                    key={s.status}
                                    className={`${STATUS_COLORS[s.status] || 'bg-slate-400'} transition-all duration-500`}
                                    style={{ width: `${(s.count / total) * 100}%` }}
                                    title={`${STATUS_LABELS[s.status]}: ${s.count}`}
                                />
                            )
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4">
                        {stats.map((s) => (
                            <div key={s.status} className="flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[s.status]}`} />
                                <span className="text-xs text-[var(--text-secondary)]">{STATUS_LABELS[s.status]} ({s.count})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent tasks + activity */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent tasks */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-[var(--text-primary)]">Recent Tasks</h3>
                        <Link to="/tasks" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : tasks.length === 0 ? (
                        <EmptyState
                            icon="📋"
                            title="No tasks yet"
                            description="Create your first task to get started"
                            action={
                                <button onClick={() => setCreateOpen(true)} className="btn-primary">
                                    Create task
                                </button>
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            {tasks.slice(0, 6).map((task) => (
                                <TaskCard key={task._id} task={task} compact />
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity feed */}
                <div>
                    <RecentActivity />
                </div>
            </div>

            <TaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    )
}

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 17) return 'afternoon'
    return 'evening'
}