import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTask, updateTask } from '../../app/slices/taskSlice'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, isOverdue, cn } from '../../utils/helpers'
import { Avatar, Badge, ConfirmDialog, Tooltip } from '../ui'
import TaskModal from './TaskModal'
import toast from 'react-hot-toast'

export default function TaskCard({ task, compact = false }) {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
    const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
    const overdue = isOverdue(task.dueDate)
    const canEdit = user?.role === 'admin' || task.createdBy?._id === (user?._id || user?.id)

    const handleDelete = async () => {
        try {
            await dispatch(deleteTask(task._id)).unwrap()
            toast.success('Task deleted')
        } catch (e) { toast.error(e || 'Delete failed') }
        setDeleteOpen(false)
    }

    const handleStatusChange = async (newStatus) => {
        try {
            await dispatch(updateTask({ id: task._id, status: newStatus })).unwrap()
            toast.success('Status updated')
        } catch (e) { toast.error(e || 'Update failed') }
    }

    return (
        <>
            <div className={cn(
                'card p-4 group hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5',
                overdue && 'border-l-4 border-l-red-400',
                compact && 'p-3'
            )}>
                <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className={cn(
                            'font-semibold text-[var(--text-primary)] leading-snug mb-0.5',
                            compact ? 'text-sm' : 'text-[15px]',
                            task.status === 'done' && 'line-through opacity-60'
                        )}>
                            {task.title}
                        </h3>
                        {task.description && !compact && (
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                {task.description}
                            </p>
                        )}
                    </div>
                    {canEdit && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip content="Edit">
                                <button onClick={() => setEditOpen(true)}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete">
                                <button onClick={() => setDeleteOpen(true)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>

                {task.tags?.length > 0 && !compact && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={priority.color}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', priority.dot)} />
                        {priority.label}
                    </Badge>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={cn('badge border-0 cursor-pointer appearance-none', status.color)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val}>{cfg.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        {task.assignee ? (
                            <>
                                <Avatar name={task.assignee.name} size="sm" />
                                <span className="text-xs text-[var(--text-muted)] truncate">{task.assignee.name}</span>
                            </>
                        ) : (
                            <span className="text-xs text-[var(--text-muted)]">Unassigned</span>
                        )}
                    </div>
                    {task.dueDate && (
                        <span className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            overdue
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : 'text-[var(--text-muted)]'
                        )}>
                            {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            <TaskModal isOpen={editOpen} onClose={() => setEditOpen(false)} task={task} />
            <ConfirmDialog
                isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete task"
                message={`Delete "${task.title}"? This cannot be undone.`}
                danger
            />
        </>
    )
}