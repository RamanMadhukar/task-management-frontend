import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export const cn = (...args) => twMerge(clsx(args))

export const formatDate = (date) => {
    if (!date) return '—'
    const d = new Date(date)
    if (isToday(d)) return 'Today'
    if (isTomorrow(d)) return 'Tomorrow'
    return format(d, 'MMM d, yyyy')
}

export const formatRelative = (date) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const isOverdue = (date) => date && isPast(new Date(date)) && !isToday(new Date(date))

export const PRIORITY_CONFIG = {
    critical: { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500', order: 4 },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500', order: 3 },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500', order: 2 },
    low: { label: 'Low', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500', order: 1 },
}

export const STATUS_CONFIG = {
    todo: { label: 'To Do', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: '○' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '◑' },
    review: { label: 'Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '◕' },
    done: { label: 'Done', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '●' },
}

export const truncate = (str, n = 60) =>
    str?.length > n ? str.slice(0, n) + '…' : str

export const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export const buildQueryString = (params) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') q.set(k, v)
    })
    return q.toString()
}