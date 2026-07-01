import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DeleteCompanionButton from '../components/ui/DeleteCompanionButton'

// ── Mock deleteCompanion server action ────────────────────────────────────────
const mockDeleteCompanion = vi.fn()

vi.mock('@/lib/actions/companion.actions', () => ({
  deleteCompanion: (...args: any[]) => mockDeleteCompanion(...args),
}))

// ── Mock next/navigation ──────────────────────────────────────────────────────
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  redirect: vi.fn(),
}))

beforeEach(() => {
  mockDeleteCompanion.mockReset()
  mockPush.mockReset()
})

describe('DeleteCompanionButton', () => {
  it('renders the delete button with correct label', () => {
    render(<DeleteCompanionButton id="companion-1" />)
    expect(screen.getByRole('button', { name: /delete this companion/i })).toBeInTheDocument()
  })

  it('button is enabled by default (not deleting state)', () => {
    render(<DeleteCompanionButton id="companion-1" />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('shows "Deleting..." label while deletion is in progress', async () => {
    // Simulate a slow async deletion
    mockDeleteCompanion.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 500))
    )

    render(<DeleteCompanionButton id="companion-1" />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })
  })

  it('button is disabled while deleting', async () => {
    mockDeleteCompanion.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 500))
    )

    render(<DeleteCompanionButton id="companion-1" />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  it('calls deleteCompanion with the correct companion id', async () => {
    mockDeleteCompanion.mockResolvedValue({})
    render(<DeleteCompanionButton id="companion-abc" />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockDeleteCompanion).toHaveBeenCalledWith('companion-abc')
    })
  })
})
