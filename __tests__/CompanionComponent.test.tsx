import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import { CompanionComponent } from '../components/CompanionComponent'

// ── Mock the Vapi singleton ───────────────────────────────────────────────────
const mockVapiOn = vi.fn()
const mockVapiOff = vi.fn()
const mockVapiStart = vi.fn()
const mockVapiStop = vi.fn()
const mockVapiIsMuted = vi.fn().mockReturnValue(false)
const mockVapiSetMuted = vi.fn()

vi.mock('@/lib/vapi.sdk', () => ({
  vapi: {
    on: (...args: any[]) => mockVapiOn(...args),
    off: (...args: any[]) => mockVapiOff(...args),
    start: (...args: any[]) => mockVapiStart(...args),
    stop: (...args: any[]) => mockVapiStop(...args),
    isMuted: () => mockVapiIsMuted(),
    setMuted: (...args: any[]) => mockVapiSetMuted(...args),
  },
}))

// ── Mock server action ────────────────────────────────────────────────────────
vi.mock('@/lib/actions/companion.actions', () => ({
  addToSessionHistory: vi.fn().mockResolvedValue(undefined),
}))

// ── Mock next/image ───────────────────────────────────────────────────────────
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

// ── Mock lottie-react with a proper play/stop API ─────────────────────────────
vi.mock('lottie-react', () => ({
  default: ({ lottieRef }: any) => {
    // Provide play/stop methods on the ref so the useEffect inside the component
    // doesn't throw when it calls lottieRef.current?.stop()
    if (lottieRef) {
      lottieRef.current = { play: vi.fn(), stop: vi.fn() }
    }
    return <div data-testid="lottie" />
  },
}))

// ── Default test props ────────────────────────────────────────────────────────
const defaultProps = {
  companionId: 'comp-1',
  subject: 'maths',
  topic: 'Derivatives',
  name: 'Math Bot',
  userName: 'Alice',
  userImage: '/images/alice.png',
  style: 'formal',
  voice: 'female',
}

beforeEach(() => {
  mockVapiOn.mockReset()
  mockVapiOff.mockReset()
  mockVapiStart.mockReset()
  mockVapiStop.mockReset()
  mockVapiIsMuted.mockReturnValue(false)
})

describe('CompanionComponent', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────
  it('renders the companion name', () => {
    render(<CompanionComponent {...defaultProps} />)
    expect(screen.getByText('Math Bot')).toBeInTheDocument()
  })

  it('renders the user name', () => {
    render(<CompanionComponent {...defaultProps} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders "Start session" button when call is inactive', () => {
    render(<CompanionComponent {...defaultProps} />)
    expect(screen.getByText('Start session')).toBeInTheDocument()
  })

  it('microphone button is disabled when call is not active', () => {
    render(<CompanionComponent {...defaultProps} />)
    expect(screen.getByRole('button', { name: /microphone/i })).toBeDisabled()
  })

  // ── Vapi event binding ────────────────────────────────────────────────────
  it('binds all 6 Vapi event listeners on mount', () => {
    render(<CompanionComponent {...defaultProps} />)
    const events = mockVapiOn.mock.calls.map((c) => c[0])
    expect(events).toContain('call-start')
    expect(events).toContain('call-end')
    expect(events).toContain('message')
    expect(events).toContain('error')
    expect(events).toContain('speech-start')
    expect(events).toContain('speech-end')
  })

  it('removes all 6 Vapi event listeners on unmount', () => {
    const { unmount } = render(<CompanionComponent {...defaultProps} />)
    unmount()
    const events = mockVapiOff.mock.calls.map((c) => c[0])
    expect(events).toContain('call-start')
    expect(events).toContain('call-end')
    expect(events).toContain('message')
    expect(events).toContain('error')
    expect(events).toContain('speech-start')
    expect(events).toContain('speech-end')
  })

  // ── Call lifecycle ─────────────────────────────────────────────────────────
  it('calls vapi.start when "Start session" button is clicked', async () => {
    render(<CompanionComponent {...defaultProps} />)
    await act(async () => {
      fireEvent.click(screen.getByText('Start session'))
    })
    expect(mockVapiStart).toHaveBeenCalledTimes(1)
  })

  it('shows "Connecting" label after clicking start', async () => {
    render(<CompanionComponent {...defaultProps} />)
    await act(async () => {
      fireEvent.click(screen.getByText('Start session'))
    })
    expect(screen.getByText('Connecting')).toBeInTheDocument()
  })

  it('calls vapi.stop when "End Session" button is clicked during active call', async () => {
    render(<CompanionComponent {...defaultProps} />)

    await act(async () => {
      const callStartHandler = mockVapiOn.mock.calls.find((c) => c[0] === 'call-start')?.[1]
      callStartHandler?.()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('End Session'))
    })

    expect(mockVapiStop).toHaveBeenCalledTimes(1)
  })

  // ── Transcript rendering ───────────────────────────────────────────────────
  it('displays an assistant transcript message when a final transcript event arrives', async () => {
    render(<CompanionComponent {...defaultProps} />)

    const messageHandler = mockVapiOn.mock.calls.find((c) => c[0] === 'message')?.[1]

    await act(async () => {
      messageHandler?.({
        type: 'transcript',
        transcriptType: 'final',
        role: 'assistant',
        transcript: 'Hello, let us start the lesson.',
      })
    })

    expect(screen.getByText(/Hello, let us start the lesson\./i)).toBeInTheDocument()
  })

  it('displays a user transcript message with the user name prefix', async () => {
    render(<CompanionComponent {...defaultProps} />)

    const messageHandler = mockVapiOn.mock.calls.find((c) => c[0] === 'message')?.[1]

    await act(async () => {
      messageHandler?.({
        type: 'transcript',
        transcriptType: 'final',
        role: 'user',
        transcript: 'Can you explain more?',
      })
    })

    expect(screen.getByText(/Alice: Can you explain more\?/i)).toBeInTheDocument()
  })

  it('does NOT display a partial transcript (only final transcripts are shown)', async () => {
    render(<CompanionComponent {...defaultProps} />)

    const messageHandler = mockVapiOn.mock.calls.find((c) => c[0] === 'message')?.[1]

    await act(async () => {
      messageHandler?.({
        type: 'transcript',
        transcriptType: 'partial',
        role: 'assistant',
        transcript: 'This should not appear',
      })
    })

    expect(screen.queryByText('This should not appear')).toBeNull()
  })

  // ── Microphone toggle ─────────────────────────────────────────────────────
  it('calls vapi.setMuted when the mic button is clicked during an active call', async () => {
    render(<CompanionComponent {...defaultProps} />)

    await act(async () => {
      const callStartHandler = mockVapiOn.mock.calls.find((c) => c[0] === 'call-start')?.[1]
      callStartHandler?.()
    })

    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    expect(mockVapiSetMuted).toHaveBeenCalledWith(true)
  })
})
