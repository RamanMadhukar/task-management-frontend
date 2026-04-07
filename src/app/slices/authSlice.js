import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance'

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', creds)
        localStorage.setItem('tm_token', data.token)
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
})

export const registerUser = createAsyncThunk('auth/register', async (creds, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', creds)
        localStorage.setItem('tm_token', data.token)
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me')
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('tm_token'),
        loading: false,
        error: null,
        initialized: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.initialized = true
            localStorage.removeItem('tm_token')
        },
        clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
        const pending = (state) => { state.loading = true; state.error = null }
        const rejected = (state, { payload }) => { state.loading = false; state.error = payload }

        builder
            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload.user
                state.token = payload.token
                state.initialized = true
            })
            .addCase(loginUser.rejected, rejected)

            .addCase(registerUser.pending, pending)
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload.user
                state.token = payload.token
                state.initialized = true
            })
            .addCase(registerUser.rejected, rejected)

            .addCase(fetchMe.pending, pending)
            .addCase(fetchMe.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload.user
                state.initialized = true
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false
                state.token = null
                state.initialized = true
                localStorage.removeItem('tm_token')
            })
    },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer