import { describe, it, expect } from 'vitest'
import {
  toBarData,
  toHeatmapData,
  toPieData,
  toRadarData,
  toChordData,
} from '../transforms'
import type { Investor, Resolution, VoteRecord } from '../types'

// =============================================================================
// Shared fixtures
// =============================================================================

const investors: Investor[] = [
  { id: 'inv-a', label: 'Investor A' },
  { id: 'inv-b', label: 'Investor B' },
]

const resolutions: Resolution[] = [
  { id: 'res-1', label: 'Proposal 1 — Board Diversity', shortLabel: 'Board Diversity', esgCategory: 'S' },
  { id: 'res-2', label: 'Proposal 2 — CEO Pay Ratio',   shortLabel: 'CEO Pay Ratio',   esgCategory: 'G' },
]

const votes: VoteRecord[] = [
  { resolutionId: 'res-1', investorId: 'inv-a', vote: 'For' },
  { resolutionId: 'res-1', investorId: 'inv-b', vote: 'Against' },
  { resolutionId: 'res-2', investorId: 'inv-a', vote: 'For' },
  { resolutionId: 'res-2', investorId: 'inv-b', vote: 'For' },
]

// =============================================================================
// toBarData
// =============================================================================
describe('toBarData', () => {
  it('returns one entry per resolution with correct vote counts', () => {
    const { data } = toBarData(votes, resolutions, investors)
    expect(data).toHaveLength(2)
    expect(data[0].resolution).toBe('Board Diversity')
    expect(data[0].For).toBe(1)
    expect(data[0].Against).toBe(1)
    expect(data[0].Abstain).toBe(0)
  })

  it('populates votersMap for tooltip use', () => {
    const { votersMap } = toBarData(votes, resolutions, investors)
    expect(votersMap['res-1'].For).toContain('Investor A')
    expect(votersMap['res-1'].Against).toContain('Investor B')
  })

  it('returns empty data and votersMap when resolutions list is empty', () => {
    const { data, votersMap } = toBarData(votes, [], investors)
    expect(data).toEqual([])
    expect(votersMap).toEqual({})
  })

  it('defaults missing votes to Abstain', () => {
    const { data } = toBarData([], resolutions, investors)
    expect(data[0].Abstain).toBe(2)
    expect(data[0].For).toBe(0)
    expect(data[0].Against).toBe(0)
  })
})

// =============================================================================
// toHeatmapData
// =============================================================================
describe('toHeatmapData', () => {
  it('returns one row per resolution with one cell per investor', () => {
    const result = toHeatmapData(votes, resolutions, investors)
    expect(result).toHaveLength(2)
    expect(result[0].data).toHaveLength(2)
  })

  it('maps vote values to correct numeric representations', () => {
    const result = toHeatmapData(votes, resolutions, investors)
    const forCell    = result[0].data.find((d) => d.x === 'Investor A')
    const againstCell = result[0].data.find((d) => d.x === 'Investor B')
    expect(forCell?.y).toBe(1)
    expect(againstCell?.y).toBe(-1)
  })

  it('returns empty array when investors list is empty', () => {
    const result = toHeatmapData(votes, resolutions, [])
    expect(result).toEqual([])
  })

  it('defaults missing votes to Abstain (y = 0)', () => {
    const result = toHeatmapData([], resolutions, investors)
    result.forEach((row) => {
      row.data.forEach((cell) => {
        expect(cell.y).toBe(0)
        expect(cell.vote).toBe('Abstain')
      })
    })
  })
})

// =============================================================================
// toPieData
// =============================================================================
describe('toPieData', () => {
  it('returns correct counts for each vote type', () => {
    const result = toPieData(votes)
    const forSlice = result.find((d) => d.id === 'For')
    expect(forSlice?.value).toBe(3)
    const againstSlice = result.find((d) => d.id === 'Against')
    expect(againstSlice?.value).toBe(1)
  })

  it('always returns an entry for all three vote types', () => {
    const result = toPieData(votes)
    const ids = result.map((d) => d.id)
    expect(ids).toContain('For')
    expect(ids).toContain('Against')
    expect(ids).toContain('Abstain')
  })

  it('returns zero counts for all types when votes list is empty', () => {
    const result = toPieData([])
    result.forEach((d) => expect(d.value).toBe(0))
  })

  it('does not count unknown vote values', () => {
    const dirtyVotes = [
      ...votes,
      { resolutionId: 'res-1', investorId: 'inv-a', vote: 'Maybe' as never },
    ]
    const result = toPieData(dirtyVotes)
    const total = result.reduce((sum, d) => sum + d.value, 0)
    expect(total).toBe(votes.length)
  })
})

// =============================================================================
// toRadarData
// =============================================================================
describe('toRadarData', () => {
  it('returns one entry per resolution with a key per investor', () => {
    const result = toRadarData(votes, resolutions, investors)
    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('Investor A')
    expect(result[0]).toHaveProperty('Investor B')
  })

  it('maps For to 3, Against to 1, Abstain to 2', () => {
    const result = toRadarData(votes, resolutions, investors)
    expect(result[0]['Investor A']).toBe(3)    // For
    expect(result[0]['Investor B']).toBe(1)    // Against
  })

  it('returns empty array when resolutions list is empty', () => {
    const result = toRadarData(votes, [], investors)
    expect(result).toEqual([])
  })

  it('defaults missing votes to Abstain (2)', () => {
    const result = toRadarData([], resolutions, investors)
    result.forEach((datum) => {
      investors.forEach((inv) => {
        expect(datum[inv.label]).toBe(2)
      })
    })
  })
})

// =============================================================================
// toChordData
// =============================================================================
describe('toChordData', () => {
  it('returns a square matrix matching investor count', () => {
    const result = toChordData(votes, resolutions, investors)
    expect(result.matrix).toHaveLength(2)
    result.matrix.forEach((row) => expect(row).toHaveLength(2))
  })

  it('reflects higher agreement between investors who vote alike', () => {
    const result = toChordData(votes, resolutions, investors)
    // inv-a and inv-b both voted For on res-2 — agreement count should be >= 1
    expect(result.matrix[0][1]).toBeGreaterThanOrEqual(1)
  })

  it('returns empty matrix when investors list is empty', () => {
    const result = toChordData(votes, resolutions, [])
    expect(result.matrix).toEqual([])
    expect(result.keys).toEqual([])
  })

  it('returns a zero matrix when votes list is empty', () => {
    const result = toChordData([], resolutions, investors)
    result.matrix.forEach((row) => row.forEach((val) => expect(val).toBe(0)))
  })
})
