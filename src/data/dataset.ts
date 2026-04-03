// =============================================================================
// Dataset — OxProx Investor Voting Sample Data
// =============================================================================

export type { VoteValue, EsgCategory, Investor, Resolution, VoteRecord } from './types'
import type { Investor, Resolution, VoteRecord } from './types'

export const investors: Investor[] = [
  { id: 'investor-a', label: 'Investor A' },
  { id: 'investor-b', label: 'Investor B' },
  { id: 'investor-c', label: 'Investor C' },
  { id: 'investor-d', label: 'Investor D' },
  { id: 'investor-e', label: 'Investor E' },
]

export const resolutions: Resolution[] = [
  {
    id: 'proposal-1',
    label: 'Proposal 1 — Board Diversity',
    shortLabel: 'Board Diversity',
    esgCategory: 'S',
  },
  {
    id: 'proposal-2',
    label: 'Proposal 2 — CEO Pay Ratio',
    shortLabel: 'CEO Pay Ratio',
    esgCategory: 'G',
  },
  {
    id: 'proposal-3',
    label: 'Proposal 3 — Climate Disclosure',
    shortLabel: 'Climate Disclosure',
    esgCategory: 'E',
  },
  {
    id: 'proposal-4',
    label: 'Proposal 4 — Independent Chair',
    shortLabel: 'Independent Chair',
    esgCategory: 'G',
  },
  {
    id: 'proposal-5',
    label: 'Proposal 5 — Share Buyback',
    shortLabel: 'Share Buyback',
    esgCategory: 'G',
  },
]

export const votes: VoteRecord[] = [
  // Proposal 1 — Board Diversity
  { resolutionId: 'proposal-1', investorId: 'investor-a', vote: 'For' },
  { resolutionId: 'proposal-1', investorId: 'investor-b', vote: 'For' },
  { resolutionId: 'proposal-1', investorId: 'investor-c', vote: 'Against' },
  { resolutionId: 'proposal-1', investorId: 'investor-d', vote: 'Abstain' },
  { resolutionId: 'proposal-1', investorId: 'investor-e', vote: 'For' },

  // Proposal 2 — CEO Pay Ratio
  { resolutionId: 'proposal-2', investorId: 'investor-a', vote: 'Against' },
  { resolutionId: 'proposal-2', investorId: 'investor-b', vote: 'For' },
  { resolutionId: 'proposal-2', investorId: 'investor-c', vote: 'Against' },
  { resolutionId: 'proposal-2', investorId: 'investor-d', vote: 'Against' },
  { resolutionId: 'proposal-2', investorId: 'investor-e', vote: 'For' },

  // Proposal 3 — Climate Disclosure
  { resolutionId: 'proposal-3', investorId: 'investor-a', vote: 'For' },
  { resolutionId: 'proposal-3', investorId: 'investor-b', vote: 'For' },
  { resolutionId: 'proposal-3', investorId: 'investor-c', vote: 'For' },
  { resolutionId: 'proposal-3', investorId: 'investor-d', vote: 'For' },
  { resolutionId: 'proposal-3', investorId: 'investor-e', vote: 'Against' },

  // Proposal 4 — Independent Chair
  { resolutionId: 'proposal-4', investorId: 'investor-a', vote: 'For' },
  { resolutionId: 'proposal-4', investorId: 'investor-b', vote: 'Against' },
  { resolutionId: 'proposal-4', investorId: 'investor-c', vote: 'For' },
  { resolutionId: 'proposal-4', investorId: 'investor-d', vote: 'For' },
  { resolutionId: 'proposal-4', investorId: 'investor-e', vote: 'For' },

  // Proposal 5 — Share Buyback
  { resolutionId: 'proposal-5', investorId: 'investor-a', vote: 'Against' },
  { resolutionId: 'proposal-5', investorId: 'investor-b', vote: 'Against' },
  { resolutionId: 'proposal-5', investorId: 'investor-c', vote: 'For' },
  { resolutionId: 'proposal-5', investorId: 'investor-d', vote: 'Against' },
  { resolutionId: 'proposal-5', investorId: 'investor-e', vote: 'Against' },
]
