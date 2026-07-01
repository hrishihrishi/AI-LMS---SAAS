import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../components/ThemeProvider'

// ── Helper consumer component ─────────────────────────────────────────────────
const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

// ── Utility: mock window.matchMedia (not available in jsdom) ──────────────────
function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// ── Reset DOM + localStorage before each test ─────────────────────────────────
beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  mockMatchMedia(false) // default: system prefers light
})

// ─── ThemeProvider ────────────────────────────────────────────────────────────
describe('ThemeProvider', () => {
  it('defaults to light theme when localStorage is empty and system prefers light', async () => {
    mockMatchMedia(false)

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme').textContent).toBe('light')
  })

  it('reads "dark" from localStorage and applies it on mount', async () => {
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('adds dark class to documentElement when toggled to dark', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Toggle'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class from documentElement when toggled back to light', async () => {
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Toggle'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists the new theme to localStorage after toggle', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Toggle'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})

// ─── useTheme guard ───────────────────────────────────────────────────────────
describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    const BadComponent = () => {
      useTheme()
      return null
    }

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<BadComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
    spy.mockRestore()
  })
})
