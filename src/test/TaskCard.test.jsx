import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, mockTask, mockUser } from './testUtils'
import TaskCard from '../components/tasks/TaskCard'

const authState = {
    auth: {
        user: mockUser, token: 'test-token',
        loading: false, error: null, initialized: true,
    },
}

describe('TaskCard', () => {
    it('renders task title and description', () => {
        renderWithProviders(<TaskCard task={mockTask} />, { preloadedState: authState })

        expect(screen.getByText('Test Task')).toBeInTheDocument()
        expect(screen.getByText('A test description')).toBeInTheDocument()
    })

    it('renders priority badge', () => {
        renderWithProviders(<TaskCard task={mockTask} />, { preloadedState: authState })
        expect(screen.getByText('Medium')).toBeInTheDocument()
    })

    it('renders status as a select element', () => {
        renderWithProviders(<TaskCard task={mockTask} />, { preloadedState: authState })
        const select = screen.getByRole('combobox')
        expect(select).toHaveValue('todo')
    })

    it('renders assignee name', () => {
        renderWithProviders(<TaskCard task={mockTask} />, { preloadedState: authState })
        expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('shows overdue styling when task is past due date', () => {
        const overdueTask = {
            ...mockTask,
            dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            status: 'todo',
        }
        const { container } = renderWithProviders(
            <TaskCard task={overdueTask} />,
            { preloadedState: authState }
        )
        expect(container.querySelector('.border-l-red-400')).toBeInTheDocument()
    })

    it('applies line-through when task is done', () => {
        const doneTask = { ...mockTask, status: 'done' }
        renderWithProviders(<TaskCard task={doneTask} />, { preloadedState: authState })

        const title = screen.getByText('Test Task')
        expect(title.className).toMatch(/line-through/)
    })

    it('renders tags', () => {
        renderWithProviders(<TaskCard task={mockTask} />, { preloadedState: authState })
        expect(screen.getByText('#test')).toBeInTheDocument()
    })

    it('renders in compact mode without description', () => {
        renderWithProviders(
            <TaskCard task={mockTask} compact />,
            { preloadedState: authState }
        )
        expect(screen.queryByText('A test description')).not.toBeInTheDocument()
    })
})