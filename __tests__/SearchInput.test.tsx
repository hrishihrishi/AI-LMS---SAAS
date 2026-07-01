import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SearchInput from '../components/SearchInput'

// ── Mock Next.js navigation hooks ─────────────────────────────────────────────
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/companions',
}))

// ── Mock @jsmastery/utils URL helpers ─────────────────────────────────────────
const mockFormUrlQuery = vi.fn(({ key, value }: any) => `/?${key}=${value}`)
const mockRemoveKeys = vi.fn(() => '/')

vi.mock('@jsmastery/utils', () => ({
  formUrlQuery: (...args: any[]) => mockFormUrlQuery(...args),
  removeKeysFromUrlQuery: (...args: any[]) => mockRemoveKeys(...args),
}))

// ── Mock next/image ────────────────────────────────────────────────────────────
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

beforeEach(() => {
  mockPush.mockReset()
  mockFormUrlQuery.mockReset().mockImplementation(({ key, value }: any) => `/?${key}=${value}`)
  mockRemoveKeys.mockReset().mockReturnValue('/')
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('SearchInput', () => {
  it('renders the search input with correct placeholder', () => {
    render(<SearchInput />)
    expect(screen.getByPlaceholderText('Search companions...')).toBeInTheDocument()
  })

  it('reflects typed value in the input field', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search companions...')
    fireEvent.change(input, { target: { value: 'maths' } })
    expect(input).toHaveValue('maths')
  })

  it('does NOT call router.push immediately (respects debounce)', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search companions...')
    fireEvent.change(input, { target: { value: 'algebra' } })
    // Still within the 500ms debounce window — push should not have been called
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('calls router.push with topic param after 500ms debounce', async () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search companions...')
    fireEvent.change(input, { target: { value: 'algebra' } })

    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockFormUrlQuery).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'topic', value: 'algebra' })
    )
  })

  it('calls removeKeysFromUrlQuery when input is cleared', async () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search companions...')

    // Type something first
    fireEvent.change(input, { target: { value: 'algebra' } })
    await act(async () => { vi.advanceTimersByTime(500) })

    // Clear the input
    fireEvent.change(input, { target: { value: '' } })
    await act(async () => { vi.advanceTimersByTime(500) })

    expect(mockRemoveKeys).toHaveBeenCalledWith(
      expect.objectContaining({ keysToRemove: ['topic'] })
    )
  })
})
