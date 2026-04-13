// =============================================================================
// ESG Issues — grouped categories matching OxProx's structure
// =============================================================================

export interface EsgGroup {
  group: string
  issues: string[]
}

export const ESG_GROUPS: EsgGroup[] = [
  {
    group: 'Business Model & Innovation',
    issues: [
      'Business Model Resilience',
      'Supply Chain Management',
      'Product Design & Lifecycle Management',
    ],
  },
  {
    group: 'Compensation',
    issues: [
      'Director Remuneration',
      'Say-on-Pay and CEO/Executive Compensation',
    ],
  },
  {
    group: 'Corporate Actions/Finance',
    issues: [
      'Financing',
      'Mergers & Acquisitions',
      'Shareholder Payouts',
      'Related party transactions',
      'Corporate Organization',
    ],
  },
  {
    group: 'Environment',
    issues: [
      'GHG Emissions',
      'Energy Management',
      'Other E',
      'Say on Climate',
      'Ecological Impacts',
      'Water & Wastewater Management',
      'Waste & Hazardous Materials Management',
    ],
  },
  {
    group: 'Human Capital',
    issues: [
      'Employee Engagement, Diversity & Inclusion',
      'Labor Practices',
      'Employee Health & Safety',
    ],
  },
  {
    group: 'Leadership & Governance',
    issues: [
      'Other G',
      'Management of the Legal & Regulatory Environment',
      'Competitive Behavior',
      'Business Ethics',
    ],
  },
  {
    group: 'Meeting Procedures',
    issues: [
      'Approve/accept Financial Statements/Reports',
      'Other approvals',
      'Open or Close meeting, Adopt Agenda, Meeting Costs',
      'Non-voted meeting notes',
      'Approve List of Shareholders',
      'Other Auditor',
    ],
  },
  {
    group: 'Social Capital',
    issues: [
      'Selling Practices & Product Labeling',
      'Customer Privacy',
      'Human Rights & Community Relations',
      'Other S',
      'Customer Welfare',
      'Product Quality & Safety',
      'Access & Affordability',
    ],
  },
]
