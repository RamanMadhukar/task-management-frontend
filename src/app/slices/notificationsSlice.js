import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
    },
    reducers: {
        addNotification: (state, { payload }) => {
            state.items.unshift({
                id: Date.now(),
                read: false,
                createdAt: new Date().toISOString(),
                ...payload,
            })
            state.unreadCount += 1
            // Keep max 50 notifications
            if (state.items.length > 50) state.items = state.items.slice(0, 50)
        },
        markAllRead: (state) => {
            state.items = state.items.map((n) => ({ ...n, read: true }))
            state.unreadCount = 0
        },
        markRead: (state, { payload }) => {
            const n = state.items.find((i) => i.id === payload)
            if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1) }
        },
        clearNotifications: (state) => {
            state.items = []; state.unreadCount = 0
        },
    },
})

export const { addNotification, markAllRead, markRead, clearNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer