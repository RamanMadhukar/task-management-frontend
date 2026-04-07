import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../app/slices/authSlice'
import tasksReducer from '../app/slices/tasksSlice'
import usersReducer from '../app/slices/usersSlice'
import notificationsReducer from '../app/slices/notificationsSlice'

export function makeStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            auth: authReducer,
            tasks: tasksReducer,
            users: usersReducer,
            notifications: notificationsReducer,
        },
        preloadedState,
        middleware: (g) => g({ serializableCheck: false }),
    })
}

export function renderWithProviders(
    ui,
    { preloadedState = {}, store = makeStore(preloadedState), route = '/', ...options } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>
                    {children}
                </MemoryRouter>
            </Provider>
        )
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...options }) }
}

// Common mock data
export const mockUser = {
    _id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
}

export const mockAdmin = {
    _id: 'admin-123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
}

export const mockTask = {
    _id: 'task-123',
    title: 'Test Task',
    description: 'A test description',
    status: 'todo',
    priority: 'medium',
    assignee: { _id: 'user-123', name: 'Test User' },
    createdBy: { _id: 'user-123', name: 'Test User' },
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    tags: ['test'],
    createdAt: new Date().toISOString(),
}

export const mockTasks = [
    mockTask,
    { ...mockTask, _id: 'task-456', title: 'Second Task', status: 'in-progress', priority: 'high' },
    { ...mockTask, _id: 'task-789', title: 'Done Task', status: 'done', priority: 'low' },
]