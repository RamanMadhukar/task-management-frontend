import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout, clearError } from '../app/slices/authSlice'
import tasksReducer, {
    setFilters,
    resetFilters,
    socketTaskCreated,
    socketTaskUpdated,
    socketTaskDeleted,
} from '../app/slices/tasksSlice'
import notificationsReducer, {
    addNotification,
    markAllRead,
    markRead,
    clearNotifications,
} from '../app/slices/notificationsSlice'
import { mockTask } from './testUtils'

// ─── Auth slice ──────────────────────────────────────────
describe('authSlice', () => {
    const initialState = {
        user: { _id: 'u1', name: 'Alice', role: 'user' },
        token: 'abc123',
        loading: false,
        error: 'some error',
        initialized: true,
    }

    it('logout clears user, token and localStorage', () => {
        localStorage.setItem('tm_token', 'abc123')
        const state = authReducer(initialState, logout())

        expect(state.user).toBeNull()
        expect(state.token).toBeNull()
        expect(localStorage.getItem('tm_token')).toBeNull()
    })

    it('clearError sets error to null', () => {
        const state = authReducer(initialState, clearError())
        expect(state.error).toBeNull()
    })
})

// ─── Tasks slice ─────────────────────────────────────────
describe('tasksSlice', () => {
    const initialState = {
        items: [mockTask],
        stats: [],
        pagination: { page: 1, limit: 10, total: 1 },
        filters: { search: '', status: '', priority: '', sortBy: 'dueDate', order: 'asc' },
        loading: false,
        error: null,
        socketUpdates: 0,
    }

    it('setFilters merges partial filter updates', () => {
        const state = tasksReducer(initialState, setFilters({ status: 'done', priority: 'high' }))
        expect(state.filters.status).toBe('done')
        expect(state.filters.priority).toBe('high')
        expect(state.filters.search).toBe('') // unchanged
    })

    it('resetFilters clears all filters', () => {
        const modified = { ...initialState, filters: { search: 'test', status: 'done', priority: 'high', sortBy: 'title', order: 'desc' } }
        const state = tasksReducer(modified, resetFilters())
        expect(state.filters).toEqual({ search: '', status: '', priority: '', sortBy: 'dueDate', order: 'asc' })
    })

    it('socketTaskCreated adds new task and increments total', () => {
        const newTask = { ...mockTask, _id: 'new-task-99', title: 'Socket Task' }
        const state = tasksReducer(initialState, socketTaskCreated(newTask))
        expect(state.items).toHaveLength(2)
        expect(state.items[0].title).toBe('Socket Task')
        expect(state.pagination.total).toBe(2)
        expect(state.socketUpdates).toBe(1)
    })

    it('socketTaskCreated does not duplicate if task already exists', () => {
        const state = tasksReducer(initialState, socketTaskCreated(mockTask))
        expect(state.items).toHaveLength(1)
    })

    it('socketTaskUpdated updates existing task in-place', () => {
        const updated = { ...mockTask, status: 'done', title: 'Updated Title' }
        const state = tasksReducer(initialState, socketTaskUpdated(updated))
        expect(state.items[0].status).toBe('done')
        expect(state.items[0].title).toBe('Updated Title')
        expect(state.socketUpdates).toBe(1)
    })

    it('socketTaskDeleted removes task and decrements total', () => {
        const state = tasksReducer(initialState, socketTaskDeleted(mockTask._id))
        expect(state.items).toHaveLength(0)
        expect(state.pagination.total).toBe(0)
        expect(state.socketUpdates).toBe(1)
    })

    it('pagination total never goes below 0', () => {
        const emptyState = { ...initialState, items: [], pagination: { ...initialState.pagination, total: 0 } }
        const state = tasksReducer(emptyState, socketTaskDeleted('non-existent-id'))
        expect(state.pagination.total).toBe(0)
    })
})

// ─── Notifications slice ─────────────────────────────────
describe('notificationsSlice', () => {
    const makeStore = () => configureStore({
        reducer: { notifications: notificationsReducer },
    })

    it('addNotification prepends item and increments unread', () => {
        const store = makeStore()
        store.dispatch(addNotification({ type: 'task_created', message: 'New task added' }))

        const { items, unreadCount } = store.getState().notifications
        expect(items).toHaveLength(1)
        expect(items[0].message).toBe('New task added')
        expect(items[0].read).toBe(false)
        expect(unreadCount).toBe(1)
    })

    it('markAllRead sets all items to read and resets count', () => {
        const store = makeStore()
        store.dispatch(addNotification({ type: 'task_assigned', message: 'Task assigned' }))
        store.dispatch(addNotification({ type: 'task_created', message: 'Task created' }))
        store.dispatch(markAllRead())

        const { items, unreadCount } = store.getState().notifications
        expect(items.every((n) => n.read)).toBe(true)
        expect(unreadCount).toBe(0)
    })

    it('markRead marks single notification and decrements count', () => {
        const store = makeStore()
        store.dispatch(addNotification({ type: 'task_created', message: 'A' }))
        store.dispatch(addNotification({ type: 'task_created', message: 'B' }))
        const id = store.getState().notifications.items[0].id
        store.dispatch(markRead(id))

        const { items, unreadCount } = store.getState().notifications
        expect(items[0].read).toBe(true)
        expect(items[1].read).toBe(false)
        expect(unreadCount).toBe(1)
    })

    it('clearNotifications empties items and resets count', () => {
        const store = makeStore()
        store.dispatch(addNotification({ type: 'task_created', message: 'A' }))
        store.dispatch(clearNotifications())

        const { items, unreadCount } = store.getState().notifications
        expect(items).toHaveLength(0)
        expect(unreadCount).toBe(0)
    })

    it('caps notifications at 50 items', () => {
        const store = makeStore()
        for (let i = 0; i < 55; i++) {
            store.dispatch(addNotification({ type: 'test', message: `Notification ${i}` }))
        }
        expect(store.getState().notifications.items).toHaveLength(50)
    })
})