import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '../../app/slices/taskSlice'
import { useDebounce } from '../../hooks/useDebounce'
import { cn } from '../../utils/helpers'

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
]
const PRIORITY_OPTIONS = [
    { value: '', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
]
const SORT_OPTIONS = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created' },
    { value: 'title', label: 'Title' },
]

export default function TaskFilters() {
    const dispatch = useDispatch()
    const { filters } = useSelector((s) => s.tasks)
    const [searchInput, setSearchInput] = useState(filters.search || '')
    const debouncedSearch = useDebounce(searchInput, 400)

    useEffect(() => {
        dispatch(setFilters({ search: debouncedSearch }))
    }, [debouncedSearch, dispatch])

    const isFiltered = filters.status || filters.priority || filters.search

    return (
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                </svg>
                <input
                    className="input pl-9"
                    placeholder="Search tasks…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                    <button
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Status filter */}
            <select
                className="input w-auto min-w-[130px]"
                value={filters.status}
                onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            >
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Priority filter */}
            <select
                className="input w-auto min-w-[130px]"
                value={filters.priority}
                onChange={(e) => dispatch(setFilters({ priority: e.target.value }))}
            >
                {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1">
                <select
                    className="input w-auto min-w-[120px]"
                    value={filters.sortBy}
                    onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
                >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button
                    onClick={() => dispatch(setFilters({ order: filters.order === 'asc' ? 'desc' : 'asc' }))}
                    className="input w-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
                >
                    {filters.order === 'asc' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Reset */}
            {isFiltered && (
                <button
                    onClick={() => { dispatch(resetFilters()); setSearchInput('') }}
                    className="btn-ghost text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                </button>
            )}
        </div>
    )
}