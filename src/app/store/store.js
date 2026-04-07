import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import tasksReducer from '../slices/taskSlice'
import usersReducer from '../slices/usersSlice'
import notificationsReducer from '../slices/notificationsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        users: usersReducer,
        notifications: notificationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export default store