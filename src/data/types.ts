// =============================================================================
// Domain Types — Core data model for OxProx investor voting data
// =============================================================================

export type VoteValue = 'For' | 'Against' | 'Abstain'
export type EsgCategory = 'E' | 'S' | 'G'

export interface Investor {
  id: string
  label: string
}

export interface Resolution {
  id: string
  label: string
  shortLabel: string
  esgCategory: EsgCategory
}

export interface VoteRecord {
  resolutionId: string
  investorId: string
  vote: VoteValue
}
