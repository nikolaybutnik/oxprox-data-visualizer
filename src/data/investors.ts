// =============================================================================
// Investor Data for the Investor Selector
// =============================================================================

export type InvestorType = 'pension' | 'investment'
export type InvestorNetwork =
  | 'Climate Action 100+'
  | 'UN PRI Signatory'
  | 'NZAOW'

export interface Investor {
  id: string
  name: string
  country: string
  type: InvestorType
  networks: InvestorNetwork[]
}

export const INVESTOR_COUNTRIES = [
  'Australia',
  'Brazil',
  'Canada',
  'China',
  'Denmark',
  'France',
  'Germany',
  'India',
  'Ireland',
  'Japan',
  'Luxembourg',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
  'United States',
] as const

export const INVESTOR_NETWORKS: InvestorNetwork[] = [
  'Climate Action 100+',
  'UN PRI Signatory',
  'NZAOW',
]

export const investors: Investor[] = [
  {
    id: 'addenda',
    name: 'Addenda Capital',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'agf',
    name: 'AGF Investments Inc.',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'bci',
    name: 'BCI (British Columbia Investment Management Corp.)',
    country: 'Canada',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'bmo',
    name: 'BMO Global Asset Management',
    country: 'Canada',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory'],
  },
  {
    id: 'cibc',
    name: 'CIBC Asset Management',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'cpp',
    name: 'Canada Pension Plan Investment Board',
    country: 'Canada',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'cdpq',
    name: 'Caisse de dépôt et placement du Québec',
    country: 'Canada',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'otpp',
    name: "Ontario Teachers' Pension Plan",
    country: 'Canada',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory'],
  },
  {
    id: 'aimco',
    name: 'Alberta Investment Management Corp. (AIMCo)',
    country: 'Canada',
    type: 'pension',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'manulife',
    name: 'Manulife Investment Management',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'td',
    name: 'TD Asset Management',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'rbc',
    name: 'RBC Global Asset Management',
    country: 'Canada',
    type: 'investment',
    networks: ['UN PRI Signatory'],
  },
  // International investors for variety
  {
    id: 'blackrock',
    name: 'BlackRock',
    country: 'United States',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory'],
  },
  {
    id: 'vanguard',
    name: 'Vanguard Group',
    country: 'United States',
    type: 'investment',
    networks: [],
  },
  {
    id: 'ssga',
    name: 'State Street Global Advisors',
    country: 'United States',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory'],
  },
  {
    id: 'calpers',
    name: "California Public Employees' Retirement System (CalPERS)",
    country: 'United States',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'lgim',
    name: 'Legal & General Investment Management',
    country: 'United Kingdom',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'uss',
    name: 'Universities Superannuation Scheme (USS)',
    country: 'United Kingdom',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'apg',
    name: 'APG Asset Management',
    country: 'Netherlands',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'nbim',
    name: 'Norges Bank Investment Management',
    country: 'Norway',
    type: 'pension',
    networks: ['UN PRI Signatory'],
  },
  {
    id: 'ap7',
    name: 'AP7 (Sjunde AP-fonden)',
    country: 'Sweden',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'axa',
    name: 'AXA Investment Managers',
    country: 'France',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
  {
    id: 'allianz',
    name: 'Allianz Global Investors',
    country: 'Germany',
    type: 'investment',
    networks: ['Climate Action 100+', 'UN PRI Signatory'],
  },
  {
    id: 'nzsuper',
    name: 'NZ Super Fund',
    country: 'New Zealand',
    type: 'pension',
    networks: ['Climate Action 100+', 'UN PRI Signatory', 'NZAOW'],
  },
]
