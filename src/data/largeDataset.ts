// =============================================================================
// Large Dataset — 12 institutional investors × 10 resolutions
//
// Investors represent distinct real-world archetypes:
//   ESG Champions  — Vanguard ESG, Norges Bank, CalPERS, Amundi, L&G, Hermes, Schroders, AP Pension
//   Active Steward — State Street (progressive but pragmatic)
//   Strategic      — Wellington (selective, engagement-led)
//   Mainstream     — BlackRock, Fidelity (management-friendly, cost-sensitive)
//
// Resolutions span 3E / 3S / 4G to give the chord ESG filter meaningful splits.
// =============================================================================

import type { Investor, Resolution, VoteRecord } from './types'

export const largeInvestors: Investor[] = [
  { id: 'l-inv-01', label: 'BlackRock' },
  { id: 'l-inv-02', label: 'Vanguard ESG' },
  { id: 'l-inv-03', label: 'State Street' },
  { id: 'l-inv-04', label: 'Fidelity' },
  { id: 'l-inv-05', label: 'Norges Bank' },
  { id: 'l-inv-06', label: 'CalPERS' },
  { id: 'l-inv-07', label: 'Amundi ESG' },
  { id: 'l-inv-08', label: 'Wellington' },
  { id: 'l-inv-09', label: 'L&G' },
  { id: 'l-inv-10', label: 'Hermes EOS' },
  { id: 'l-inv-11', label: 'Schroders' },
  { id: 'l-inv-12', label: 'AP Pension' },
]

export const largeResolutions: Resolution[] = [
  {
    id: 'l-res-01',
    label: 'Climate Disclosure',
    shortLabel: 'Climate Disclosure',
    esgCategory: 'E',
  },
  {
    id: 'l-res-02',
    label: 'Supply Chain Emissions',
    shortLabel: 'Supply Chain',
    esgCategory: 'E',
  },
  {
    id: 'l-res-03',
    label: 'Renewable Energy Transition',
    shortLabel: 'Renewable Energy',
    esgCategory: 'E',
  },
  {
    id: 'l-res-04',
    label: 'Board Diversity',
    shortLabel: 'Board Diversity',
    esgCategory: 'S',
  },
  {
    id: 'l-res-05',
    label: 'CEO Pay Ratio',
    shortLabel: 'CEO Pay Ratio',
    esgCategory: 'S',
  },
  {
    id: 'l-res-06',
    label: 'Living Wage Commitment',
    shortLabel: 'Living Wage',
    esgCategory: 'S',
  },
  {
    id: 'l-res-07',
    label: 'Independent Chair',
    shortLabel: 'Independent Chair',
    esgCategory: 'G',
  },
  {
    id: 'l-res-08',
    label: 'Executive Compensation',
    shortLabel: 'Exec Compensation',
    esgCategory: 'G',
  },
  {
    id: 'l-res-09',
    label: 'Auditor Independence',
    shortLabel: 'Auditor Independence',
    esgCategory: 'G',
  },
  {
    id: 'l-res-10',
    label: 'Shareholder Rights',
    shortLabel: 'Shareholder Rights',
    esgCategory: 'G',
  },
]

export const largeVotes: VoteRecord[] = [
  // ── BlackRock: management-friendly, cautious on ESG mandates ──────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-01', vote: 'Abstain' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-01', vote: 'Against' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-01', vote: 'Abstain' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-01', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-01', vote: 'For' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-01', vote: 'Against' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-01', vote: 'Against' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-01', vote: 'For' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-01', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-01', vote: 'Abstain' },

  // ── Vanguard ESG: consistent ESG champion ─────────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-02', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-02', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-02', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-02', vote: 'For' },

  // ── State Street: active steward, progressive ─────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-03', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-03', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-03', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-03', vote: 'For' },

  // ── Fidelity: growth-focused, cost-sensitive ───────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-04', vote: 'Against' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-04', vote: 'Abstain' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-04', vote: 'Abstain' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-04', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-04', vote: 'For' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-04', vote: 'Against' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-04', vote: 'Against' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-04', vote: 'For' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-04', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-04', vote: 'Against' },

  // ── Norges Bank: sovereign wealth, strong ESG principles ─────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-05', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-05', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-05', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-05', vote: 'For' },

  // ── CalPERS: activist pension, frequently opposes management ──────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-06', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-06', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-06', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-06', vote: 'For' },

  // ── Amundi ESG: European ESG leader ───────────────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-07', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-07', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-07', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-07', vote: 'For' },

  // ── Wellington: active manager, selective engagement ──────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-08', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-08', vote: 'Abstain' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-08', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-08', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-08', vote: 'Abstain' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-08', vote: 'Abstain' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-08', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-08', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-08', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-08', vote: 'For' },

  // ── L&G: UK stewardship leader ────────────────────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-09', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-09', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-09', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-09', vote: 'For' },

  // ── Hermes EOS: specialist engagement overlay ─────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-10', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-10', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-10', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-10', vote: 'For' },

  // ── Schroders: UK sustainability-focused ─────────────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-11', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-11', vote: 'Abstain' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-11', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-11', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-11', vote: 'For' },

  // ── AP Pension: Nordic pension, ESG frontrunner ───────────────────────────
  { resolutionId: 'l-res-01', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-02', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-03', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-04', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-05', investorId: 'l-inv-12', vote: 'Against' },
  { resolutionId: 'l-res-06', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-07', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-08', investorId: 'l-inv-12', vote: 'Against' },
  { resolutionId: 'l-res-09', investorId: 'l-inv-12', vote: 'For' },
  { resolutionId: 'l-res-10', investorId: 'l-inv-12', vote: 'For' },
]
