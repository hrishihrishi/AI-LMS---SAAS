import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompanionList from '../components/CompanionsList'

// ── Mock next/image ───────────────────────────────────────────────────────────
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

// ── Mock next/link ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// ── Sample companions fixture ─────────────────────────────────────────────────
const companions = [
  {
    id: 'c1',
    name: 'Neura the Brainy',
    subject: 'science',
    topic: 'Neural Networks',
    duration: 45,
    bookmarked: false,
  },
  {
    id: 'c2',
    name: 'Countsy the Wizard',
    subject: 'maths',
    topic: 'Derivatives',
    duration: 30,
    bookmarked: true,
  },
] as any[]

describe('CompanionList', () => {
  it('renders the section title', () => {
    render(<CompanionList title="Recent Sessions" companions={companions} />)
    expect(screen.getByText('Recent Sessions')).toBeInTheDocument()
  })

  it('renders correct table column headers', () => {
    render(<CompanionList title="Test" companions={companions} />)
    expect(screen.getByText('Lessons')).toBeInTheDocument()
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.getByText('Duration')).toBeInTheDocument()
  })

  it('renders a row for every companion passed', () => {
    render(<CompanionList title="Test" companions={companions} />)
    expect(screen.getByText('Neura the Brainy')).toBeInTheDocument()
    expect(screen.getByText('Countsy the Wizard')).toBeInTheDocument()
  })

  it('renders the correct duration for each companion', () => {
    render(<CompanionList title="Test" companions={companions} />)
    expect(screen.getByText('45 min')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
  })

  it('renders nothing in the table body when companions is empty', () => {
    render(<CompanionList title="Empty" companions={[]} />)
    // No companion names should be in the DOM
    expect(screen.queryByText('Neura the Brainy')).toBeNull()
  })

  it('renders nothing in the table body when companions is undefined', () => {
    render(<CompanionList title="No Data" />)
    expect(screen.queryByRole('row')).toBeTruthy() // header row still renders
  })

  it('links each companion to the correct detail page', () => {
    render(<CompanionList title="Test" companions={companions} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/companion/c1')
    expect(links[1]).toHaveAttribute('href', '/companion/c2')
  })
})
