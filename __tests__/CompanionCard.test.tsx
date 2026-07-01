import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CompanionCard from '../components/CompanionCard'

// ── Mock server actions ───────────────────────────────────────────────────────
const mockAddBookmark = vi.fn()
const mockRemoveBookmark = vi.fn()

vi.mock('@/lib/actions/companion.actions', () => ({
  addBookmark: (...args: any[]) => mockAddBookmark(...args),
  removeBookmark: (...args: any[]) => mockRemoveBookmark(...args),
  getBookmarkedCompanions: vi.fn().mockResolvedValue([]),
}))

// ── Mock @clerk/nextjs/server (server-only import used in CompanionCard) ───────
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'user_123' }),
}))

// ── Mock next/navigation ──────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// ── Mock next/image ───────────────────────────────────────────────────────────
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

// ── Mock next/link ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// ── Default test props ────────────────────────────────────────────────────────
const defaultProps = {
  id: 'companion-1',
  name: 'Dr. Maths Bot',
  topic: 'Derivatives & Integrals',
  subject: 'maths',
  duration: 30,
  bookmarked: false,
}

beforeEach(() => {
  mockAddBookmark.mockReset()
  mockRemoveBookmark.mockReset()
})

describe('CompanionCard', () => {
  it('renders the topic title', () => {
    render(<CompanionCard {...defaultProps} />)
    expect(screen.getByText('Derivatives & Integrals')).toBeInTheDocument()
  })

  it('renders the companion name with "-by" prefix', () => {
    render(<CompanionCard {...defaultProps} />)
    expect(screen.getByText('-by Dr. Maths Bot')).toBeInTheDocument()
  })

  it('renders the correct session duration', () => {
    render(<CompanionCard {...defaultProps} />)
    expect(screen.getByText('30 min')).toBeInTheDocument()
  })

  it('renders the subject badge', () => {
    render(<CompanionCard {...defaultProps} />)
    expect(screen.getByText('maths')).toBeInTheDocument()
  })

  it('renders the "Launch lesson" button', () => {
    render(<CompanionCard {...defaultProps} />)
    expect(screen.getByText('Launch lesson')).toBeInTheDocument()
  })

  it('renders an unfilled bookmark icon when not bookmarked', () => {
    render(<CompanionCard {...defaultProps} bookmarked={false} />)
    const bookmarkImg = screen.getByAltText('bookmark')
    expect(bookmarkImg).toBeInTheDocument()
  })

  it('renders a filled bookmark icon when already bookmarked', () => {
    render(<CompanionCard {...defaultProps} bookmarked={true} />)
    const bookmarkImg = screen.getByAltText('bookmark')
    expect((bookmarkImg as HTMLImageElement).src).toContain('bookmark-filled')
  })

  it('calls addBookmark with the companion id when not bookmarked and bookmark clicked', async () => {
    render(<CompanionCard {...defaultProps} bookmarked={false} />)
    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i })
    fireEvent.click(bookmarkButton)
    // addBookmark is called asynchronously
    await vi.waitFor(() => expect(mockAddBookmark).toHaveBeenCalledWith('companion-1', '/'))
  })

  it('calls removeBookmark with the companion id when bookmarked and bookmark clicked', async () => {
    render(<CompanionCard {...defaultProps} bookmarked={true} />)
    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i })
    fireEvent.click(bookmarkButton)
    await vi.waitFor(() => expect(mockRemoveBookmark).toHaveBeenCalledWith('companion-1', '/'))
  })

  it('links to the correct companion detail page', () => {
    render(<CompanionCard {...defaultProps} />)
    const link = screen.getByRole('link', { name: /launch lesson/i })
    expect(link).toHaveAttribute('href', './companions/companion-1')
  })
})
