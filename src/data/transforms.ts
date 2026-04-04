// =============================================================================
// Data Transforms — Shape raw dataset into per-chart Nivo-compatible formats
// =============================================================================

import type {
  EsgCategory,
  Investor,
  Resolution,
  VoteRecord,
  VoteValue,
} from './types'

/** O(1) vote lookup keyed by "resolutionId:investorId" */
function buildVoteLookup(votes: VoteRecord[]): Map<string, VoteValue> {
  return new Map(
    votes.map((v) => [`${v.resolutionId}:${v.investorId}`, v.vote]),
  )
}

// -----------------------------------------------------------------------------
// Stacked Bar Chart
// One bar group per resolution, stacked by vote count (For / Against / Abstain)
// Nivo requires BarDatum to satisfy Record<string, string | number>, so voter
// name lists are returned separately and keyed by resolutionId.
// -----------------------------------------------------------------------------
export interface BarDatum extends Record<string, string | number> {
  resolution: string
  resolutionId: string
  For: number
  Against: number
  Abstain: number
}

export interface BarVotersMap {
  [resolutionId: string]: Record<VoteValue, string[]>
}

export interface BarData {
  data: BarDatum[]
  votersMap: BarVotersMap
}

export function toBarData(
  votes: VoteRecord[],
  resolutions: Resolution[],
  investors: Investor[],
): BarData {
  if (!resolutions.length || !investors.length)
    return { data: [], votersMap: {} }

  const lookup = buildVoteLookup(votes)
  const votersMap: BarVotersMap = {}

  const data = resolutions.map((resolution) => {
    const voteGroups: Record<VoteValue, string[]> = {
      For: [],
      Against: [],
      Abstain: [],
    }

    investors.forEach((investor) => {
      const vote = lookup.get(`${resolution.id}:${investor.id}`) ?? 'Abstain'
      voteGroups[vote].push(investor.label)
    })

    votersMap[resolution.id] = voteGroups

    return {
      resolution: resolution.shortLabel,
      resolutionId: resolution.id,
      For: voteGroups.For.length,
      Against: voteGroups.Against.length,
      Abstain: voteGroups.Abstain.length,
    }
  })

  return { data, votersMap }
}

// -----------------------------------------------------------------------------
// Heatmap
// Rows = resolutions, columns = investors, cell value = vote as numeric
// -----------------------------------------------------------------------------
const VOTE_TO_NUMERIC: Record<VoteValue, number> = {
  For: 1,
  Against: -1,
  Abstain: 0,
}

export interface HeatmapCell {
  x: string
  y: number
  vote: VoteValue
}

export interface HeatmapDatum {
  id: string
  data: HeatmapCell[]
}

export function toHeatmapData(
  votes: VoteRecord[],
  resolutions: Resolution[],
  investors: Investor[],
): HeatmapDatum[] {
  if (!resolutions.length || !investors.length) return []

  const lookup = buildVoteLookup(votes)

  return resolutions.map((resolution) => ({
    id: resolution.shortLabel,
    data: investors.map((investor) => {
      const vote = lookup.get(`${resolution.id}:${investor.id}`) ?? 'Abstain'
      return { x: investor.label, y: VOTE_TO_NUMERIC[vote], vote }
    }),
  }))
}

// -----------------------------------------------------------------------------
// Pie / Donut Chart
// Overall vote distribution across all resolutions and investors
// -----------------------------------------------------------------------------
export interface PieDatum {
  id: VoteValue
  label: VoteValue
  value: number
}

export function toPieData(votes: VoteRecord[]): PieDatum[] {
  const counts: Record<VoteValue, number> = { For: 0, Against: 0, Abstain: 0 }
  votes.forEach((v) => {
    if (v.vote in counts) counts[v.vote]++
  })

  return (Object.keys(counts) as VoteValue[]).map((vote) => ({
    id: vote,
    label: vote,
    value: counts[vote],
  }))
}

// -----------------------------------------------------------------------------
// Radar Chart
// One shape per investor, each axis = a resolution
// Values: 0 (Against), 0.5 (Abstain), 1 (For)
// -----------------------------------------------------------------------------
const VOTE_TO_RADAR_SCORE: Record<VoteValue, number> = {
  For: 3,
  Abstain: 2,
  Against: 1,
}

export interface RadarDatum {
  resolution: string
  [investorLabel: string]: string | number
}

export function toRadarData(
  votes: VoteRecord[],
  resolutions: Resolution[],
  investors: Investor[],
): RadarDatum[] {
  if (!resolutions.length || !investors.length) return []

  const lookup = buildVoteLookup(votes)

  return resolutions.map((resolution) => {
    const datum: RadarDatum = { resolution: resolution.shortLabel }
    investors.forEach((investor) => {
      datum[investor.label] =
        VOTE_TO_RADAR_SCORE[
          lookup.get(`${resolution.id}:${investor.id}`) ?? 'Abstain'
        ]
    })
    return datum
  })
}

// -----------------------------------------------------------------------------
// Chord Diagram
// Pairwise agreement count between investors across all resolutions
// -----------------------------------------------------------------------------
export interface ChordData {
  matrix: number[][]
  keys: string[]
}

export function toChordData(
  votes: VoteRecord[],
  resolutions: Resolution[],
  investors: Investor[],
): ChordData {
  const keys = investors.map((i) => i.label)
  const investorCount = investors.length

  if (!investorCount || !resolutions.length) return { matrix: [], keys }

  const matrix: number[][] = Array.from({ length: investorCount }, () =>
    Array(investorCount).fill(0),
  )

  resolutions.forEach((resolution) => {
    const voteByInvestor: Map<string, VoteValue> = new Map(
      votes
        .filter((v) => v.resolutionId === resolution.id)
        .map((v) => [v.investorId, v.vote]),
    )

    for (let i = 0; i < investorCount; i++) {
      const voteI = voteByInvestor.get(investors[i].id)
      if (!voteI) continue

      for (let j = i + 1; j < investorCount; j++) {
        const voteJ = voteByInvestor.get(investors[j].id)

        if (voteJ === voteI && voteI !== 'Abstain') {
          matrix[i][j]++
          matrix[j][i]++
        }
      }
    }
  })

  return { matrix, keys }
}

// -----------------------------------------------------------------------------
// ESG Map
// Lookup map from resolution shortLabel to ESG category, used by chart layers
// -----------------------------------------------------------------------------
export function toEsgMap(
  resolutions: Resolution[],
): Record<string, EsgCategory> {
  return Object.fromEntries(
    resolutions.map((r) => [r.shortLabel, r.esgCategory]),
  )
}
