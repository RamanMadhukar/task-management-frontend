import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosInstance';

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', creds);
        localStorage.setItem('token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (creds, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', creds);
        localStorage.setItem('token', data.token);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null; state.token = null;
            localStorage.removeItem('token');
        },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
                state.loading = true; state.error = null;
            })
            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state, action) => {
                state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
            })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
                state.loading = false; state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;