import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/users')
        return data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const updateUserRole = createAsyncThunk('users/updateRole', async ({ id, role }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/users/${id}/role`, { role })
        return data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/users/${id}`)
        return id
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true })
            .addCase(fetchUsers.fulfilled, (state, { payload }) => {
                state.loading = false; state.items = payload
            })
            .addCase(fetchUsers.rejected, (state, { payload }) => {
                state.loading = false; state.error = payload
            })
            .addCase(updateUserRole.fulfilled, (state, { payload }) => {
                const idx = state.items.findIndex((u) => u._id === payload._id)
                if (idx !== -1) state.items[idx] = payload
            })
            .addCase(deleteUser.fulfilled, (state, { payload }) => {
                state.items = state.items.filter((u) => u._id !== payload)
            })
    },
})

export default usersSlice.reducer