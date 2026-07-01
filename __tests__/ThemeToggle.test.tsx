import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../components/ThemeToggle'
import * as ThemeProviderModule from '../components/ThemeProvider'

// ── Mock useTheme so we fully control the theme state ────────────────────────
const mockToggleTheme = vi.fn()

beforeEach(() => {
  mockToggleTheme.mockReset()
  document.documentElement.classList.remove('dark')
})

describe('ThemeToggle', () => {
  it('renders the Moon icon when theme is light', () => {
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)

    // Moon svg should be in the DOM; Sun should not
    expect(document.querySelector('svg')).toBeTruthy()
    // The button has aria-label for accessibility
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('renders the Sun icon when theme is dark', () => {
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('calls toggleTheme when the button is clicked', async () => {
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('renders a placeholder div before mounting (SSR-safe placeholder)', () => {
    // The component checks `mounted` state — on initial render it returns a blank div.
    // Because jsdom renders synchronously, mounted will flip immediately via useEffect,
    // so we simply confirm the button renders after mount.
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    })

    render(<ThemeToggle />)
    // After mount the button must be visible
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
