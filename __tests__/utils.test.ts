import { describe, it, expect } from 'vitest'
import { getSubjectColor, cn, configureAssistant } from '../lib/utils'

// ─── getSubjectColor ──────────────────────────────────────────────────────────
describe('getSubjectColor', () => {
  it('returns correct hex for maths', () => {
    expect(getSubjectColor('maths')).toBe('#FFDA6E')
  })

  it('returns correct hex for science', () => {
    expect(getSubjectColor('science')).toBe('#E5D0FF')
  })

  it('returns correct hex for coding', () => {
    expect(getSubjectColor('coding')).toBe('#FFC8E4')
  })

  it('returns correct hex for history', () => {
    expect(getSubjectColor('history')).toBe('#FFECC8')
  })

  it('returns correct hex for economics', () => {
    expect(getSubjectColor('economics')).toBe('#C8FFDF')
  })

  it('returns correct hex for language', () => {
    expect(getSubjectColor('language')).toBe('#BDE7FF')
  })

  it('returns undefined for an unrecognized subject', () => {
    expect(getSubjectColor('unknown-subject')).toBeUndefined()
  })

  it('returns undefined for an empty string', () => {
    expect(getSubjectColor('')).toBeUndefined()
  })
})

// ─── cn (class merger) ────────────────────────────────────────────────────────
describe('cn', () => {
  it('merges two class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates conflicting tailwind classes (last wins)', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'excluded', 'included')).toBe('base included')
  })

  it('returns empty string when no args provided', () => {
    expect(cn()).toBe('')
  })
})

// ─── configureAssistant ───────────────────────────────────────────────────────
describe('configureAssistant', () => {
  it('returns an object with the correct assistant name', () => {
    const config = configureAssistant('male', 'formal')
    expect(config.name).toBe('Companion')
  })

  it('uses the correct ElevenLabs voice ID for male + formal', () => {
    const config = configureAssistant('male', 'formal')
    expect((config.voice as any).voiceId).toBe('c6SfcYrb2t09NHXiT80T')
  })

  it('uses the correct ElevenLabs voice ID for male + casual', () => {
    const config = configureAssistant('male', 'casual')
    expect((config.voice as any).voiceId).toBe('2BJW5coyhAzSr8STdHbE')
  })

  it('uses the correct ElevenLabs voice ID for female + formal', () => {
    const config = configureAssistant('female', 'formal')
    expect((config.voice as any).voiceId).toBe('sarah')
  })

  it('uses the correct ElevenLabs voice ID for female + casual', () => {
    const config = configureAssistant('female', 'casual')
    expect((config.voice as any).voiceId).toBe('ZIlrSGI4jZqobxRKprJz')
  })

  it('falls back to "sarah" when style key is missing for a valid voice', () => {
    // voices['female']['unknown-style'] is undefined => falls back to 'sarah'
    const config = configureAssistant('female', 'unknown-style')
    expect((config.voice as any).voiceId).toBe('sarah')
  })

  it('uses deepgram as the transcriber provider', () => {
    const config = configureAssistant('female', 'casual')
    expect((config.transcriber as any).provider).toBe('deepgram')
  })

  it('uses OpenAI gpt-4 as the LLM model', () => {
    const config = configureAssistant('female', 'casual')
    expect((config.model as any).model).toBe('gpt-4')
  })

  it('includes topic/subject/style template placeholders in the system prompt', () => {
    const config = configureAssistant('female', 'casual')
    const systemContent = (config.model as any).messages[0].content
    expect(systemContent).toContain('{{ topic }}')
    expect(systemContent).toContain('{{ subject }}')
    expect(systemContent).toContain('{{ style }}')
  })

  it('has the correct first message template', () => {
    const config = configureAssistant('male', 'casual')
    expect(config.firstMessage).toContain('{{topic}}')
  })
})
