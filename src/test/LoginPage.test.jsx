import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './testUtils'
import LoginPage from '../pages/LoginPage'
import * as authSlice from '../app/slices/authSlice'

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders login form with all fields', () => {
        renderWithProviders(<LoginPage />)

        expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('shows validation error when submitting empty form', async () => {
        const user = userEvent.setup()
        renderWithProviders(<LoginPage />)

        await user.click(screen.getByRole('button', { name: /sign in/i }))

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        })
    })

    it('shows link to register page', () => {
        renderWithProviders(<LoginPage />)
        expect(screen.getByText(/sign up/i)).toBeInTheDocument()
    })

    it('shows error alert when login fails', async () => {
        const preloadedState = {
            auth: {
                user: null, token: null, loading: false,
                error: 'Invalid credentials', initialized: false,
            },
        }
        renderWithProviders(<LoginPage />, { preloadedState })

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('disables submit button while loading', () => {
        const preloadedState = {
            auth: {
                user: null, token: null, loading: true,
                error: null, initialized: false,
            },
        }
        renderWithProviders(<LoginPage />, { preloadedState })

        const button = screen.getByRole('button', { name: /signing in/i })
        expect(button).toBeDisabled()
    })

    it('shows password field as type password', () => {
        renderWithProviders(<LoginPage />)
        const passwordInput = screen.getByPlaceholderText(/••••••••/i)
        expect(passwordInput).toHaveAttribute('type', 'password')
    })
})