import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from '../src/pages/LoginPage'
import RegisterPage from '../src/pages/RegisterPage'
import DashboardPage from '../src/pages/DashboardPage'
import TasksPage from '../src/pages/TasksPage'
import BoardPage from '../src/pages/BoardPage'
import AdminUsersPage from '../src/pages/AdminUsersPage'
import ProfilePage from '../src/pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes — require auth */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}