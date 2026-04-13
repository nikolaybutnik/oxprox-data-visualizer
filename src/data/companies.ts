// =============================================================================
// Company Data for the Company Selector
// Industries grouped by SASB sector (matching OxProx's structure)
// =============================================================================

export interface IndustrySector {
  sector: string
  industries: string[]
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    sector: 'Consumer Goods',
    industries: [
      'E-commerce',
      'Multiline and Specialty Retailers & Distributors',
      'Toys & Sporting Goods',
      'Household & Personal Products',
      'Building Products & Furnishings',
      'Appliance Manufacturing',
      'Apparel, Accessories & Footwear',
    ],
  },
  {
    sector: 'Extractives & Minerals Processing',
    industries: [
      'Metals & Mining',
      'Oil & Gas - Exploration & Production',
      'Oil & Gas - Refining & Marketing',
      'Construction Materials',
      'Oil & Gas - Services',
      'Oil & Gas - Midstream',
      'Iron & Steel Producers',
      'Coal Operations',
    ],
  },
  {
    sector: 'Financials',
    industries: [
      'Commercial Banks',
      'Insurance',
      'Mortgage Finance',
      'Asset Management & Custody Activities',
      'Security & Commodity Exchanges',
      'Consumer Finance',
      'Investment Banking & Brokerage',
    ],
  },
  {
    sector: 'Food & Beverage',
    industries: [
      'Processed Foods',
      'Non-Alcoholic Beverages',
      'Food Retailers & Distributors',
      'Restaurants',
      'Agricultural Products',
      'Alcoholic Beverages',
      'Tobacco',
      'Meat, Poultry & Dairy',
    ],
  },
  {
    sector: 'Health Care',
    industries: [
      'Medical Equipment & Supplies',
      'Biotechnology & Pharmaceuticals',
      'Health Care Delivery',
      'Managed Care',
      'Health Care Distributors',
      'Drug Retailers',
    ],
  },
  {
    sector: 'Infrastructure',
    industries: [
      'Real Estate',
      'Engineering & Construction Services',
      'Real Estate Services',
      'Electric Utilities & Power Generators',
      'Gas Utilities & Distributors',
      'Home Builders',
      'Water Utilities & Services',
      'Waste Management',
    ],
  },
  {
    sector: 'Renewable Resources & Alternative Energy',
    industries: [
      'Pulp & Paper Products',
      'Fuel Cells & Industrial Batteries',
      'Biofuels',
      'Wind Technology & Project Developers',
      'Solar Technology & Project Developers',
      'Forestry Management',
    ],
  },
  {
    sector: 'Resource Transformation',
    industries: [
      'Industrial Machinery & Goods',
      'Electrical & Electronic Equipment',
      'Chemicals',
      'Aerospace & Defense',
      'Containers & Packaging',
    ],
  },
  {
    sector: 'Services',
    industries: [
      'Professional & Commercial Services',
      'Advertising & Marketing',
      'Leisure Facilities',
      'Media & Entertainment',
      'Hotels & Lodging',
      'Casinos & Gaming',
      'Education',
    ],
  },
  {
    sector: 'Technology & Communications',
    industries: [
      'Telecommunication Services',
      'Semiconductors',
      'Internet Media & Services',
      'Hardware',
      'Software & IT Services',
      'Electronic Manufacturing Services & Original Design Manufacturing',
    ],
  },
  {
    sector: 'Transportation',
    industries: [
      'Air Freight & Logistics',
      'Automobiles',
      'Rail Transportation',
      'Auto Parts',
      'Cruise Lines',
      'Marine Transportation',
      'Airlines',
      'Road Transportation',
      'Car Rental & Leasing',
    ],
  },
]

// Flat list of all industries for quick lookup
export const ALL_INDUSTRIES = INDUSTRY_SECTORS.flatMap((s) => s.industries)

// Countries where companies are headquartered
export const COMPANY_COUNTRIES = [
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

export interface Company {
  id: string
  name: string
  country: string
  industry: string
  isin?: string
}

export const companies: Company[] = [
  // From voting records
  {
    id: 'cae',
    name: 'CAE Inc.',
    country: 'Canada',
    industry: 'Aerospace & Defense',
    isin: 'CA1247651088',
  },
  {
    id: 'couche-tard',
    name: 'Alimentation Couche-Tard Inc.',
    country: 'Canada',
    industry: 'Food Retailers & Distributors',
    isin: 'CA01626P4033',
  },
  {
    id: 'opentext',
    name: 'Open Text Corporation',
    country: 'Canada',
    industry: 'Software & IT Services',
    isin: 'CA6837151068',
  },
  {
    id: 'brookfield',
    name: 'Brookfield Corporation',
    country: 'Canada',
    industry: 'Asset Management & Custody Activities',
    isin: 'CA1130041058',
  },
  {
    id: 'metro',
    name: 'Metro Inc.',
    country: 'Canada',
    industry: 'Food Retailers & Distributors',
    isin: 'CA59162N1096',
  },
  {
    id: 'cgi',
    name: 'CGI Inc.',
    country: 'Canada',
    industry: 'Software & IT Services',
    isin: 'CA12532H1047',
  },
  {
    id: 'transcontinental',
    name: 'Transcontinental Inc.',
    country: 'Canada',
    industry: 'Professional & Commercial Services',
    isin: 'CA8936411066',
  },
  {
    id: 'neighbourly',
    name: 'Neighbourly Pharmacy Inc.',
    country: 'Canada',
    industry: 'Drug Retailers',
    isin: 'CA64015G1063',
  },
  // Additional Canadian
  {
    id: 'shopify',
    name: 'Shopify Inc.',
    country: 'Canada',
    industry: 'E-commerce',
    isin: 'CA82509L1076',
  },
  {
    id: 'rbc-bank',
    name: 'Royal Bank of Canada',
    country: 'Canada',
    industry: 'Commercial Banks',
    isin: 'CA7800871021',
  },
  {
    id: 'td-bank',
    name: 'Toronto-Dominion Bank',
    country: 'Canada',
    industry: 'Commercial Banks',
    isin: 'CA8911605092',
  },
  {
    id: 'enbridge',
    name: 'Enbridge Inc.',
    country: 'Canada',
    industry: 'Oil & Gas - Midstream',
    isin: 'CA29250N1050',
  },
  {
    id: 'cn-rail',
    name: 'Canadian National Railway',
    country: 'Canada',
    industry: 'Rail Transportation',
    isin: 'CA1363751027',
  },
  {
    id: 'barrick',
    name: 'Barrick Gold Corporation',
    country: 'Canada',
    industry: 'Metals & Mining',
    isin: 'CA0679011084',
  },
  {
    id: 'manulife-co',
    name: 'Manulife Financial Corp.',
    country: 'Canada',
    industry: 'Insurance',
    isin: 'CA56501R1064',
  },
  {
    id: 'telus',
    name: 'TELUS Corporation',
    country: 'Canada',
    industry: 'Telecommunication Services',
    isin: 'CA87971M1032',
  },
  // US companies
  {
    id: 'apple',
    name: 'Apple Inc.',
    country: 'United States',
    industry: 'Hardware',
    isin: 'US0378331005',
  },
  {
    id: 'microsoft',
    name: 'Microsoft Corporation',
    country: 'United States',
    industry: 'Software & IT Services',
    isin: 'US5949181045',
  },
  {
    id: 'jpmorgan',
    name: 'JPMorgan Chase & Co.',
    country: 'United States',
    industry: 'Commercial Banks',
    isin: 'US46625H1005',
  },
  {
    id: 'exxon',
    name: 'Exxon Mobil Corporation',
    country: 'United States',
    industry: 'Oil & Gas - Exploration & Production',
    isin: 'US30231G1022',
  },
  {
    id: 'amazon',
    name: 'Amazon.com Inc.',
    country: 'United States',
    industry: 'E-commerce',
    isin: 'US0231351067',
  },
  {
    id: 'tesla',
    name: 'Tesla Inc.',
    country: 'United States',
    industry: 'Automobiles',
    isin: 'US88160R1014',
  },
  {
    id: 'pfizer',
    name: 'Pfizer Inc.',
    country: 'United States',
    industry: 'Biotechnology & Pharmaceuticals',
    isin: 'US7170811035',
  },
  {
    id: 'chevron',
    name: 'Chevron Corporation',
    country: 'United States',
    industry: 'Oil & Gas - Exploration & Production',
    isin: 'US1667641005',
  },
  {
    id: 'walmart',
    name: 'Walmart Inc.',
    country: 'United States',
    industry: 'Food Retailers & Distributors',
    isin: 'US9311421039',
  },
  {
    id: 'nextera',
    name: 'NextEra Energy Inc.',
    country: 'United States',
    industry: 'Electric Utilities & Power Generators',
    isin: 'US65339F1012',
  },
  // UK companies
  {
    id: 'shell',
    name: 'Shell plc',
    country: 'United Kingdom',
    industry: 'Oil & Gas - Exploration & Production',
    isin: 'GB00BP6MXD84',
  },
  {
    id: 'hsbc',
    name: 'HSBC Holdings plc',
    country: 'United Kingdom',
    industry: 'Commercial Banks',
    isin: 'GB0005405286',
  },
  {
    id: 'astrazeneca',
    name: 'AstraZeneca plc',
    country: 'United Kingdom',
    industry: 'Biotechnology & Pharmaceuticals',
    isin: 'GB0009895292',
  },
  {
    id: 'unilever',
    name: 'Unilever plc',
    country: 'United Kingdom',
    industry: 'Household & Personal Products',
    isin: 'GB00B10RZP78',
  },
  // European
  {
    id: 'nestle',
    name: 'Nestlé S.A.',
    country: 'Switzerland',
    industry: 'Processed Foods',
    isin: 'CH0038863350',
  },
  {
    id: 'totalenergies',
    name: 'TotalEnergies SE',
    country: 'France',
    industry: 'Oil & Gas - Exploration & Production',
    isin: 'FR0000120271',
  },
  {
    id: 'siemens',
    name: 'Siemens AG',
    country: 'Germany',
    industry: 'Industrial Machinery & Goods',
    isin: 'DE0007236101',
  },
  {
    id: 'asml',
    name: 'ASML Holding N.V.',
    country: 'Netherlands',
    industry: 'Semiconductors',
    isin: 'NL0010273215',
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics Co.',
    country: 'South Korea',
    industry: 'Hardware',
    isin: 'KR7005930003',
  },
  {
    id: 'toyota',
    name: 'Toyota Motor Corporation',
    country: 'Japan',
    industry: 'Automobiles',
    isin: 'JP3633400001',
  },
  {
    id: 'bhp',
    name: 'BHP Group Limited',
    country: 'Australia',
    industry: 'Metals & Mining',
    isin: 'AU000000BHP4',
  },
  {
    id: 'vale',
    name: 'Vale S.A.',
    country: 'Brazil',
    industry: 'Metals & Mining',
    isin: 'BRVALEACNOR0',
  },
]
