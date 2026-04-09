// =============================================================================
// Mock Data — OxProx Voting Records Page
// Sourced from https://webapp.oxprox.org/voting-records (Addenda Capital)
// =============================================================================

export type VoteDecision = 'for' | 'against' | 'withhold' | 'abstain' | 'split'
export type MeetingType = 'annual' | 'special'
export type ProponentType = 'management' | 'shareholder' | ''

export interface VotingRecord {
  id: number
  parentFund: string
  voteDecision: VoteDecision
  rationale: string
  company: string
  companyCountry: string
  industry: string
  meetingType: MeetingType
  meetingDate: string
  item: string
  description: string
  subject: string
  proponent: ProponentType
  proponentName: string
  managementRecommendation: VoteDecision | ''
  antiEsg: boolean
  financialMateriality: boolean
}

// Helper to reduce boilerplate for repeated company blocks
const addenda = (
  overrides: Partial<VotingRecord> &
    Pick<
      VotingRecord,
      | 'id'
      | 'voteDecision'
      | 'company'
      | 'industry'
      | 'meetingType'
      | 'item'
      | 'description'
      | 'subject'
    >,
): VotingRecord => ({
  parentFund: 'Addenda Capital',
  rationale: '',
  companyCountry: 'Canada',
  meetingDate: '',
  proponent: '',
  proponentName: '',
  managementRecommendation: 'for',
  antiEsg: false,
  financialMateriality: false,
  ...overrides,
})

// ── CAE Inc. — Annual Meeting ────────────────────────────────────────────────

const caeBase = {
  company: 'CAE Inc.',
  industry: 'Aerospace & Defense',
  meetingType: 'annual' as MeetingType,
}

// ── Alimentation Couche-Tard Inc. — Annual Meeting ───────────────────────────

const coucheTardBase = {
  company: 'Alimentation Couche-Tard Inc.',
  industry: 'Food Retailers & Distributors',
  meetingType: 'annual' as MeetingType,
}

// ── Open Text Corporation — Annual Meeting ───────────────────────────────────

const openTextBase = {
  company: 'Open Text Corporation',
  industry: 'Software & IT Services',
  meetingType: 'annual' as MeetingType,
}

// ── Brookfield Corporation — Special Meeting ─────────────────────────────────

const brookfieldBase = {
  company: 'Brookfield Corporation',
  industry: 'Asset Management & Custody Activities',
  meetingType: 'special' as MeetingType,
}

// ── Metro Inc. — Annual Meeting ──────────────────────────────────────────────

const metroBase = {
  company: 'Metro Inc.',
  industry: 'Food Retailers & Distributors',
  meetingType: 'annual' as MeetingType,
}

// ── CGI Inc. — Annual Meeting ────────────────────────────────────────────────

const cgiBase = {
  company: 'CGI Inc.',
  industry: 'Software & IT Services',
  meetingType: 'annual' as MeetingType,
}

// ── Transcontinental Inc. — Annual Meeting ───────────────────────────────────

const transBase = {
  company: 'Transcontinental Inc.',
  industry: 'Professional & Commercial Services',
  meetingType: 'annual' as MeetingType,
}

// ── Neighbourly Pharmacy Inc. — Annual Meeting ──────────────────────────────

const neighbourlyBase = {
  company: 'Neighbourly Pharmacy Inc.',
  industry: 'Drug Retailers',
  meetingType: 'annual' as MeetingType,
}

// Helper for non-Addenda funds voting on Neighbourly Pharmacy
const neighbourly = (
  overrides: Partial<VotingRecord> &
    Pick<
      VotingRecord,
      'id' | 'parentFund' | 'voteDecision' | 'item' | 'description' | 'subject'
    >,
): VotingRecord => ({
  rationale: '',
  company: neighbourlyBase.company,
  companyCountry: 'Canada',
  industry: neighbourlyBase.industry,
  meetingType: neighbourlyBase.meetingType,
  meetingDate: '',
  proponent: 'management',
  proponentName: '',
  managementRecommendation: 'for',
  antiEsg: false,
  financialMateriality: false,
  ...overrides,
})

export const votingRecords: VotingRecord[] = [
  // ── CAE Inc. — Addenda Capital (5 of 15: kept withhold + auditor + say-on-pay + 2 directors)
  addenda({
    id: 1,
    ...caeBase,
    voteDecision: 'for',
    item: '1.001',
    description: 'Elect Ayman Antoun',
    subject: 'Director Elections',
  }),
  addenda({
    id: 2,
    ...caeBase,
    voteDecision: 'for',
    item: '1.002',
    description: 'Elect Margaret S. Billson',
    subject: 'Director Elections',
  }),
  addenda({
    id: 3,
    ...caeBase,
    voteDecision: 'withhold',
    item: '1.004',
    description: 'Elect Michael M. Fortier',
    subject: 'Director Elections',
  }),
  addenda({
    id: 4,
    ...caeBase,
    voteDecision: 'for',
    item: '2',
    description: 'Appointment of Auditor and Authority to Set Fees',
    subject: 'Auditor Appointment',
  }),
  addenda({
    id: 5,
    ...caeBase,
    voteDecision: 'against',
    item: '3',
    description: 'Advisory Vote on Executive Compensation',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),

  // ── Alimentation Couche-Tard Inc. — Addenda Capital (10 of 23: 3 directors + auditor + say-on-pay + share structure + 4 shareholder proposals)
  addenda({
    id: 6,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '1',
    description: 'Appointment of Auditor and Authority to Set Fees',
    subject: 'Auditor Appointment',
  }),
  addenda({
    id: 7,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.001',
    description: 'Elect Alain Bouchard',
    subject: 'Director Elections',
  }),
  addenda({
    id: 8,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.007',
    description: 'Elect Janice L. Fields',
    subject: 'Director Elections',
  }),
  addenda({
    id: 9,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.016',
    description: 'Elect Louis Têtu',
    subject: 'Director Elections',
  }),
  addenda({
    id: 10,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '3',
    description: 'Advisory Vote on Executive Compensation',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),
  addenda({
    id: 11,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '4',
    description:
      'Approval of Amendment to the Articles Regarding Share Structure',
    subject: 'Board Structure & Terms',
  }),
  addenda({
    id: 12,
    ...coucheTardBase,
    voteDecision: 'against',
    item: '5',
    description:
      'Shareholder Proposal Regarding French as Official Company Language',
    subject: 'Financing',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 13,
    ...coucheTardBase,
    voteDecision: 'against',
    item: '6',
    description:
      'Shareholder Proposal Regarding Report on Non-Management Employee Representation on the Board',
    subject: 'Financing',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 14,
    ...coucheTardBase,
    voteDecision: 'against',
    item: '7',
    description:
      'Shareholder Proposal Regarding Report on Women in Leadership Roles',
    subject: 'Financing',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 15,
    ...coucheTardBase,
    voteDecision: 'against',
    item: '8',
    description: 'Shareholder Proposal Regarding Takeover Prevention',
    subject: 'Financing',
    managementRecommendation: 'against',
  }),

  // ── Open Text Corporation — Addenda Capital (5 of 14: 2 directors + auditor + say-on-pay + rights plan)
  addenda({
    id: 16,
    ...openTextBase,
    voteDecision: 'for',
    item: '1',
    description: 'Elect P. Thomas Jenkins',
    subject: 'Director Elections',
  }),
  addenda({
    id: 17,
    ...openTextBase,
    voteDecision: 'for',
    item: '2',
    description: 'Elect Mark J. Barrenechea',
    subject: 'Director Elections',
  }),
  addenda({
    id: 18,
    ...openTextBase,
    voteDecision: 'for',
    item: '12',
    description: 'Appointment of Auditor',
    subject: 'Auditor Appointment',
  }),
  addenda({
    id: 19,
    ...openTextBase,
    voteDecision: 'for',
    item: '13',
    description: 'Advisory Vote on Executive Compensation',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),
  addenda({
    id: 20,
    ...openTextBase,
    voteDecision: 'for',
    item: '14',
    description: 'Shareholder Rights Plan Renewal',
    subject: 'Financing',
  }),

  // ── Brookfield Corporation — Addenda Capital (4 items, all kept — special meeting)
  addenda({
    id: 21,
    ...brookfieldBase,
    voteDecision: 'for',
    item: '1',
    description: 'Spin-off',
    subject: 'Mergers & Acquisitions',
  }),
  addenda({
    id: 22,
    ...brookfieldBase,
    voteDecision: 'for',
    item: '2',
    description: 'Manager Management Share Option Plan',
    subject: 'Financing',
  }),
  addenda({
    id: 23,
    ...brookfieldBase,
    voteDecision: 'for',
    item: '3',
    description: 'Manager Non-Qualified Management Share Option Plan',
    subject: 'Financing',
  }),
  addenda({
    id: 24,
    ...brookfieldBase,
    voteDecision: 'for',
    item: '4',
    description: 'Manager Escrowed Stock Plan',
    subject: 'Financing',
  }),

  // ── Metro Inc. — Addenda Capital (8 of 17: 3 directors + auditor + say-on-pay + stock option + 2 shareholder proposals)
  addenda({
    id: 25,
    ...metroBase,
    voteDecision: 'for',
    item: '1.1',
    description: 'Elect Director Lori-Ann Beausoleil',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 26,
    ...metroBase,
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Pierre Boivin',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 27,
    ...metroBase,
    voteDecision: 'for',
    item: '1.10',
    description: 'Elect Director Eric R. La Fleche',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 28,
    ...metroBase,
    voteDecision: 'for',
    item: '2',
    description: 'Ratify Ernst & Young LLP as Auditors',
    subject: 'Auditor Appointment',
    proponent: 'management',
  }),
  addenda({
    id: 29,
    ...metroBase,
    voteDecision: 'for',
    item: '3',
    description: 'Advisory Vote on Executive Compensation Approach',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
    proponent: 'management',
  }),
  addenda({
    id: 30,
    ...metroBase,
    voteDecision: 'for',
    item: '4',
    description: 'Amend Stock Option Plan',
    subject: 'Financing',
    proponent: 'management',
  }),
  addenda({
    id: 31,
    ...metroBase,
    voteDecision: 'for',
    item: '5',
    description:
      'SP 1: Adopt Near and Long-Term Science-Based Greenhouse Gas Emissions Reduction Targets',
    subject: 'GHG Emissions',
    proponent: 'shareholder',
    managementRecommendation: 'against',
    financialMateriality: true,
  }),
  addenda({
    id: 32,
    ...metroBase,
    voteDecision: 'for',
    item: '6',
    description:
      'SP 2: Report on Actual and Potential Human Rights Impacts on Migrant Workers',
    subject: '',
    proponent: 'shareholder',
    managementRecommendation: 'against',
  }),

  // ── CGI Inc. — Addenda Capital (8 of 20: 2 directors + auditor + 4 shareholder proposals + 1 director)
  addenda({
    id: 33,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.1',
    description: 'Elect Director George A. Cope',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 34,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Julie Godin',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 35,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Serge Godin',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 36,
    ...cgiBase,
    voteDecision: 'for',
    item: '2',
    description:
      'Approve PricewaterhouseCoopers LLP as Auditors and Authorize the Audit and Risk Management Committee to Fix Their Remuneration',
    subject: 'Auditor Appointment',
    proponent: 'management',
  }),
  addenda({
    id: 37,
    ...cgiBase,
    voteDecision: 'against',
    item: '3',
    description: 'SP 1: Disclose Languages in Which Directors Are Fluent',
    subject: '',
    proponent: 'shareholder',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 38,
    ...cgiBase,
    voteDecision: 'against',
    item: '4',
    description:
      'SP 2: Review Mandate to Include Ethical Component Concerning Artificial Intelligence',
    subject: '',
    proponent: 'shareholder',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 39,
    ...cgiBase,
    voteDecision: 'for',
    item: '5',
    description:
      'SP 3: Update the Role of the Human Resources Committee to Include Responsibilities Related to Employee Health and Well-being',
    subject: 'Employee Health & Safety',
    proponent: 'shareholder',
    managementRecommendation: 'against',
  }),
  addenda({
    id: 40,
    ...cgiBase,
    voteDecision: 'for',
    item: '6',
    description: 'SP 4: Report on Racial Disparities and Equity Issues',
    subject: 'Financing',
    proponent: 'shareholder',
    managementRecommendation: 'against',
  }),

  // ── Transcontinental Inc. — Addenda Capital (5 of 7: kept a spread of directors)
  addenda({
    id: 41,
    ...transBase,
    voteDecision: 'for',
    item: '1.1',
    description: 'Elect Director Peter Brues',
    subject: 'Director Elections',
  }),
  addenda({
    id: 42,
    ...transBase,
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Jacynthe Cote',
    subject: 'Director Elections',
  }),
  addenda({
    id: 43,
    ...transBase,
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Nelson Gentiletti',
    subject: 'Director Elections',
  }),
  addenda({
    id: 44,
    ...transBase,
    voteDecision: 'for',
    item: '1.11',
    description: 'Elect Director Jean Raymond',
    subject: 'Director Elections',
  }),
  addenda({
    id: 45,
    ...transBase,
    voteDecision: 'for',
    item: '1.12',
    description: 'Elect Director Annie Thabet',
    subject: 'Director Elections',
  }),

  // ── AGF Investments Inc. → Neighbourly Pharmacy Inc. (8 items) ─────────
  neighbourly({
    id: 46,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Skip Bourdo',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 47,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Stuart M. Elman',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 48,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Lisa Greatrix',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 49,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Dean McCann',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 50,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.6',
    description: "Elect Director Robert (Bob) O'Meara",
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 51,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '1.7',
    description: 'Elect Director Valerie (Val) Sorbie',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 52,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'for',
    item: '2',
    description:
      'Approve Ernst & Young LLP as Auditors and Authorize Board to Fix Their Remuneration',
    subject: 'Auditor Appointment',
  }),
  neighbourly({
    id: 53,
    parentFund: 'AGF Investments Inc.',
    voteDecision: 'against',
    item: '3',
    description: 'Re-approve Omnibus Long-Term Incentive Plan',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),

  // ── BCI (British Columbia Investment Management Corp.) → Neighbourly Pharmacy Inc. (9 items)
  neighbourly({
    id: 54,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'against',
    item: '1.1',
    description: 'Elect Director Josh Blair',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 55,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Skip Bourdo',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 56,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'against',
    item: '1.3',
    description: 'Elect Director Stuart M. Elman',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 57,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Lisa Greatrix',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 58,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Dean McCann',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 59,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'for',
    item: '1.6',
    description: "Elect Director Robert (Bob) O'Meara",
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 60,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'for',
    item: '1.7',
    description: 'Elect Director Valerie (Val) Sorbie',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 61,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'withhold',
    item: '2',
    description:
      'Approve Ernst & Young LLP as Auditors and Authorize Board to Fix Their Remuneration',
    subject: 'Auditor Appointment',
  }),
  neighbourly({
    id: 62,
    parentFund: 'BCI (British Columbia Investment Management Corp.)',
    voteDecision: 'against',
    item: '3',
    description: 'Re-approve Omnibus Long-Term Incentive Plan',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),

  // ── BMO Global Asset Management → Neighbourly Pharmacy Inc. (9 items) ──
  neighbourly({
    id: 63,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'against',
    item: '1.1',
    description: 'Elect Director Josh Blair',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 64,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Skip Bourdo',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 65,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Stuart M. Elman',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 66,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Lisa Greatrix',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 67,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Dean McCann',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 68,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '1.6',
    description: "Elect Director Robert (Bob) O'Meara",
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 69,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'against',
    item: '1.7',
    description: 'Elect Director Valerie (Val) Sorbie',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 70,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'for',
    item: '2',
    description:
      'Approve Ernst & Young LLP as Auditors and Authorize Board to Fix Their Remuneration',
    subject: 'Auditor Appointment',
  }),
  neighbourly({
    id: 71,
    parentFund: 'BMO Global Asset Management',
    voteDecision: 'against',
    item: '3',
    description: 'Re-approve Omnibus Long-Term Incentive Plan',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
  }),

  // ── CIBC Asset Management → Neighbourly Pharmacy Inc. (4 items) ────────
  neighbourly({
    id: 72,
    parentFund: 'CIBC Asset Management',
    voteDecision: 'split',
    item: '1.1',
    description: 'Elect Director Josh Blair',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 73,
    parentFund: 'CIBC Asset Management',
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Skip Bourdo',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 74,
    parentFund: 'CIBC Asset Management',
    voteDecision: 'split',
    item: '1.3',
    description: 'Elect Director Stuart M. Elman',
    subject: 'Director Elections',
  }),
  neighbourly({
    id: 75,
    parentFund: 'CIBC Asset Management',
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Lisa Greatrix',
    subject: 'Director Elections',
  }),

  // ── Addenda Capital → Neighbourly Pharmacy Inc. (25 items — same proposals, different fund perspective)
  addenda({
    id: 76,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.1',
    description: 'Elect Director Josh Blair',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 77,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.2',
    description: 'Elect Director Skip Bourdo',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 78,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.3',
    description: 'Elect Director Stuart M. Elman',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 79,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Lisa Greatrix',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 80,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Dean McCann',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 81,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.6',
    description: "Elect Director Robert (Bob) O'Meara",
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 82,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '1.7',
    description: 'Elect Director Valerie (Val) Sorbie',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 83,
    ...neighbourlyBase,
    voteDecision: 'for',
    item: '2',
    description:
      'Approve Ernst & Young LLP as Auditors and Authorize Board to Fix Their Remuneration',
    subject: 'Auditor Appointment',
    proponent: 'management',
  }),
  addenda({
    id: 84,
    ...neighbourlyBase,
    voteDecision: 'against',
    item: '3',
    description: 'Re-approve Omnibus Long-Term Incentive Plan',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
    proponent: 'management',
  }),

  // ── Extra Addenda Capital variety — CAE directors (fill to 100) ────────
  addenda({
    id: 85,
    ...caeBase,
    voteDecision: 'for',
    item: '1.003',
    description: 'Elect Elise R. Eberwein',
    subject: 'Director Elections',
  }),
  addenda({
    id: 86,
    ...caeBase,
    voteDecision: 'for',
    item: '1.005',
    description: 'Elect Marianne Harrison',
    subject: 'Director Elections',
  }),
  addenda({
    id: 87,
    ...caeBase,
    voteDecision: 'for',
    item: '1.006',
    description: 'Elect Alan N. MacGibbon',
    subject: 'Director Elections',
  }),
  addenda({
    id: 88,
    ...caeBase,
    voteDecision: 'for',
    item: '1.007',
    description: 'Elect Mary Lou Maher',
    subject: 'Director Elections',
  }),
  addenda({
    id: 89,
    ...caeBase,
    voteDecision: 'for',
    item: '1.008',
    description: 'Elect François Olivier',
    subject: 'Director Elections',
  }),
  addenda({
    id: 90,
    ...caeBase,
    voteDecision: 'for',
    item: '1.009',
    description: 'Elect Marc Parent',
    subject: 'Director Elections',
  }),

  // ── Extra Couche-Tard directors ────────────────────────────────────────
  addenda({
    id: 91,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.002',
    description: 'Elect Louis Vachon',
    subject: 'Director Elections',
  }),
  addenda({
    id: 92,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.003',
    description: 'Elect Jean Bernier',
    subject: 'Director Elections',
  }),
  addenda({
    id: 93,
    ...coucheTardBase,
    voteDecision: 'for',
    item: '2.004',
    description: 'Elect Karinne Bouchard',
    subject: 'Director Elections',
  }),

  // ── Extra Metro directors ──────────────────────────────────────────────
  addenda({
    id: 94,
    ...metroBase,
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Michel Coutu',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 95,
    ...metroBase,
    voteDecision: 'for',
    item: '1.6',
    description: 'Elect Director Stephanie Coyles',
    subject: 'Director Elections',
    proponent: 'management',
  }),

  // ── Extra CGI directors ────────────────────────────────────────────────
  addenda({
    id: 96,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.5',
    description: 'Elect Director Andre Imbeau',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 97,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.7',
    description: 'Elect Director Michael B. Pedersen',
    subject: 'Director Elections',
    proponent: 'management',
  }),
  addenda({
    id: 98,
    ...cgiBase,
    voteDecision: 'for',
    item: '1.8',
    description: 'Elect Director Stephen S. Poloz',
    subject: 'Director Elections',
    proponent: 'management',
  }),

  // ── Extra Transcontinental ─────────────────────────────────────────────
  addenda({
    id: 99,
    ...transBase,
    voteDecision: 'for',
    item: '1.4',
    description: 'Elect Director Yves Leduc',
    subject: 'Director Elections',
  }),
  addenda({
    id: 100,
    ...transBase,
    voteDecision: 'for',
    item: '1.10',
    description: 'Elect Director Mario Plourde',
    subject: 'Director Elections',
  }),
]
