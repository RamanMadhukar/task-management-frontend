import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, updateTask } from '../app/slices/taskSlice'
import { fetchUsers } from '../app/slices/usersSlice'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'
import { PageHeader, EmptyState, SkeletonCard } from '../components/ui'
import { cn } from '../utils/helpers'
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: 'todo', label: 'To Do', color: 'text-slate-500', dot: 'bg-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/20' },
    { key: 'in-progress', label: 'In Progress', color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { key: 'review', label: 'Review', color: 'text-purple-600', dot: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { key: 'done', label: 'Done', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
]

export default function BoardPage() {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const { items, loading, socketUpdates } = useSelector((s) => s.tasks)
    const [createOpen, setCreateOpen] = useState(false)
    const [dragTask, setDragTask] = useState(null)
    const [dragOver, setDragOver] = useState(null)

    useEffect(() => {
        dispatch(fetchTasks({ limit: 100 }))
        if (user?.role === 'admin') dispatch(fetchUsers())
    }, [dispatch, user, socketUpdates])

    const getColumnTasks = (status) => items.filter((t) => t.status === status)

    // Drag handlers
    const onDragStart = (e, task) => {
        setDragTask(task)
        e.dataTransfer.effectAllowed = 'move'
    }

    const onDragOver = (e, colKey) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOver(colKey)
    }

    const onDrop = async (e, colKey) => {
        e.preventDefault()
        setDragOver(null)
        if (!dragTask || dragTask.status === colKey) return
        try {
            await dispatch(updateTask({ id: dragTask._id, status: colKey })).unwrap()
            toast.success(`Moved to ${COLUMNS.find((c) => c.key === colKey)?.label}`)
        } catch (err) {
            toast.error('Failed to move task')
        }
        setDragTask(null)
    }

    return (
        <div className="space-y-5 animate-fade-in">
            <PageHeader
                title="Board"
                subtitle="Drag tasks between columns to update their status"
                actions={
                    <button onClick={() => setCreateOpen(true)} className="btn-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                {COLUMNS.map((col) => {
                    const colTasks = getColumnTasks(col.key)
                    const isOver = dragOver === col.key

                    return (
                        <div
                            key={col.key}
                            onDragOver={(e) => onDragOver(e, col.key)}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={(e) => onDrop(e, col.key)}
                            className={cn(
                                'rounded-2xl border-2 transition-all duration-150',
                                isOver
                                    ? 'border-brand-400 bg-brand-50/50 dark:bg-brand-900/10 scale-[1.01] shadow-glow-sm'
                                    : 'border-transparent bg-[var(--bg-tertiary)]'
                            )}
                        >
                            {/* Column header */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className={cn('w-2 h-2 rounded-full', col.dot)} />
                                    <span className={cn('text-sm font-semibold', col.color)}>{col.label}</span>
                                </div>
                                <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="px-3 pb-3 space-y-3 min-h-[120px]">
                                {loading ? (
                                    <SkeletonCard />
                                ) : colTasks.length === 0 ? (
                                    <div className={cn(
                                        'rounded-xl border-2 border-dashed border-[var(--border)] p-6 text-center transition-colors',
                                        isOver && 'border-brand-300 bg-brand-50 dark:bg-brand-900/10'
                                    )}>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {isOver ? 'Drop here' : 'No tasks'}
                                        </p>
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, task)}
                                            className="cursor-grab active:cursor-grabbing"
                                        >
                                            <TaskCard task={task} compact />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <TaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    )
}