import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, setFilters } from '../app/slices/taskSlice'
import { fetchUsers } from '../app/slices/usersSlice'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskModal from '../components/tasks/TaskModal'
import Pagination from '../components/tasks/Pagination'
import { SkeletonCard, PageHeader, EmptyState } from '../components/ui'

export default function TasksPage() {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const { items, loading, filters, pagination, socketUpdates } = useSelector((s) => s.tasks)
    const [createOpen, setCreateOpen] = useState(false)
    const [page, setPage] = useState(1)

    // Fetch when filters or page changes
    useEffect(() => {
        dispatch(fetchTasks({ ...filters, page, limit: 10 }))
    }, [dispatch, filters, page, socketUpdates])

    useEffect(() => {
        if (user?.role === 'admin') dispatch(fetchUsers())
    }, [dispatch, user])

    // Reset page when filters change
    useEffect(() => { setPage(1) }, [filters])

    const handlePageChange = (p) => {
        setPage(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="space-y-5 animate-fade-in">
            <PageHeader
                title="My Tasks"
                subtitle={`${pagination.total} task${pagination.total !== 1 ? 's' : ''} total`}
                actions={
                    <button onClick={() => setCreateOpen(true)} className="btn-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                }
            />

            {/* Filters */}
            <div className="card p-4">
                <TaskFilters />
            </div>

            {/* Task grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                </div>
            ) : items.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No tasks found"
                    description="Try adjusting your filters or create a new task"
                    action={
                        <button onClick={() => setCreateOpen(true)} className="btn-primary">
                            Create task
                        </button>
                    }
                />
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {items.map((task) => (
                            <TaskCard key={task._id} task={task} />
                        ))}
                    </div>
                    <Pagination pagination={pagination} onPageChange={handlePageChange} />
                </>
            )}

            <TaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    )
}