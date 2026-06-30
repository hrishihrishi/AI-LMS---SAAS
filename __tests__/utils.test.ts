import { describe, it, expect } from 'vitest'
import { getSubjectColor } from '../lib/utils'

describe('getSubjectColor Helper Utility', () => {
  it('should return the correct background color for the maths subject', () => {
    const color = getSubjectColor('maths')
    expect(color).toBe('#FFDA6E')
  })

  it('should return the correct background color for the science subject', () => {
    const color = getSubjectColor('science')
    expect(color).toBe('#E5D0FF')
  })
})
