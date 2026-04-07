import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
    io: vi.fn(() => ({
        connected: false,
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn(),
    })),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: () => null,
}))

// Silence console.error in tests unless explicitly testing errors
const originalError = console.error
beforeAll(() => {
    console.error = (...args) => {
        if (args[0]?.includes?.('act(') || args[0]?.includes?.('Warning:')) return
        originalError(...args)
    }
})
afterAll(() => { console.error = originalError })