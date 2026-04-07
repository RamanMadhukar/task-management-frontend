import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance'
import { buildQueryString } from '../../utils/helpers'

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const qs = buildQueryString(params)
        const { data } = await api.get(`/tasks?${qs}`)
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks')
    }
})

export const fetchTaskStats = createAsyncThunk('tasks/stats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/tasks/stats/summary')
        return data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/tasks', payload)
        return data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create task')
    }
})

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/tasks/${id}`, payload)
        return data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update task')
    }
})

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/tasks/${id}`)
        return id
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete task')
    }
})

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        stats: [],
        pagination: { page: 1, limit: 10, total: 0 },
        filters: { search: '', status: '', priority: '', sortBy: 'dueDate', order: 'asc' },
        loading: false,
        error: null,
        // For optimistic UI
        socketUpdates: 0,
    },
    reducers: {
        setFilters: (state, { payload }) => {
            state.filters = { ...state.filters, ...payload }
        },
        resetFilters: (state) => {
            state.filters = { search: '', status: '', priority: '', sortBy: 'dueDate', order: 'asc' }
        },
        // Socket real-time handlers
        socketTaskCreated: (state, { payload }) => {
            const exists = state.items.find((t) => t._id === payload._id)
            if (!exists) {
                state.items.unshift(payload)
                state.pagination.total += 1
            }
            state.socketUpdates += 1
        },
        socketTaskUpdated: (state, { payload }) => {
            const idx = state.items.findIndex((t) => t._id === payload._id)
            if (idx !== -1) state.items[idx] = { ...state.items[idx], ...payload }
            state.socketUpdates += 1
        },
        socketTaskDeleted: (state, { payload }) => {
            state.items = state.items.filter((t) => t._id !== payload)
            state.pagination.total = Math.max(0, state.pagination.total - 1)
            state.socketUpdates += 1
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchTasks.fulfilled, (state, { payload }) => {
                state.loading = false
                state.items = payload.data
                state.pagination = payload.pagination
            })
            .addCase(fetchTasks.rejected, (state, { payload }) => {
                state.loading = false; state.error = payload
            })

            .addCase(fetchTaskStats.fulfilled, (state, { payload }) => {
                state.stats = payload
            })

            .addCase(createTask.fulfilled, (state, { payload }) => {
                state.items.unshift(payload)
                state.pagination.total += 1
            })

            .addCase(updateTask.fulfilled, (state, { payload }) => {
                const idx = state.items.findIndex((t) => t._id === payload._id)
                if (idx !== -1) state.items[idx] = payload
            })

            .addCase(deleteTask.fulfilled, (state, { payload }) => {
                state.items = state.items.filter((t) => t._id !== payload)
                state.pagination.total = Math.max(0, state.pagination.total - 1)
            })
    },
})

export const { setFilters, resetFilters, socketTaskCreated, socketTaskUpdated, socketTaskDeleted } = taskSlice.actions
export default taskSlice.reducer