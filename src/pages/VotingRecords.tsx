import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import oxproxLogo from '../assets/oxprox-logo-white.svg'
import styles from './VotingRecords.module.scss'

// ── Types ────────────────────────────────────────────────────────────────────

type VoteDecision = 'for' | 'against' | 'withhold' | 'abstain'
type MeetingType = 'annual' | 'special'
type ProponentType = 'management' | 'shareholder' | ''

interface VotingRecord {
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

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: VotingRecord[] = [
  {
    id: 1,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'CAE Inc.',
    companyCountry: 'Canada',
    industry: 'Aerospace & Defense',
    meetingType: 'annual',
    meetingDate: '2024-08-14',
    item: '1.001',
    description: 'Elect Ayman Antoun',
    subject: 'Director Elections',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 2,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'CAE Inc.',
    companyCountry: 'Canada',
    industry: 'Aerospace & Defense',
    meetingType: 'annual',
    meetingDate: '2024-08-14',
    item: '1.002',
    description: 'Elect Margaret S. Billson',
    subject: 'Director Elections',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 3,
    parentFund: 'Addenda Capital',
    voteDecision: 'withhold',
    rationale: '',
    company: 'CAE Inc.',
    companyCountry: 'Canada',
    industry: 'Aerospace & Defense',
    meetingType: 'annual',
    meetingDate: '2024-08-14',
    item: '1.004',
    description: 'Elect Michael M. Fortier',
    subject: 'Director Elections',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 4,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'CAE Inc.',
    companyCountry: 'Canada',
    industry: 'Aerospace & Defense',
    meetingType: 'annual',
    meetingDate: '2024-08-14',
    item: '2',
    description: 'Appointment of Auditor and Authority to Set Fees',
    subject: 'Auditor Appointment',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 5,
    parentFund: 'Addenda Capital',
    voteDecision: 'against',
    rationale: '',
    company: 'CAE Inc.',
    companyCountry: 'Canada',
    industry: 'Aerospace & Defense',
    meetingType: 'annual',
    meetingDate: '2024-08-14',
    item: '3',
    description: 'Advisory Vote on Executive Compensation',
    subject: 'Say-on-Pay and CEO/Executive Compensation',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 6,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Alimentation Couche-Tard Inc.',
    companyCountry: 'Canada',
    industry: 'Food Retailers & Distributors',
    meetingType: 'annual',
    meetingDate: '2024-09-18',
    item: '1',
    description: 'Appointment of Auditor and Authority to Set Fees',
    subject: 'Auditor Appointment',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 7,
    parentFund: 'Addenda Capital',
    voteDecision: 'against',
    rationale: '',
    company: 'Alimentation Couche-Tard Inc.',
    companyCountry: 'Canada',
    industry: 'Food Retailers & Distributors',
    meetingType: 'annual',
    meetingDate: '2024-09-18',
    item: '5',
    description:
      'Shareholder Proposal Regarding French as Official Company Language',
    subject: 'Financing',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'against',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 8,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Metro Inc.',
    companyCountry: 'Canada',
    industry: 'Food Retailers & Distributors',
    meetingType: 'annual',
    meetingDate: '2024-01-30',
    item: '1.1',
    description: 'Elect Director Lori-Ann Beausoleil',
    subject: 'Director Elections',
    proponent: 'management',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 9,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Metro Inc.',
    companyCountry: 'Canada',
    industry: 'Food Retailers & Distributors',
    meetingType: 'annual',
    meetingDate: '2024-01-30',
    item: '5',
    description:
      'SP 1: Adopt Near and Long-Term Science-Based Greenhouse Gas Emissions Reduction Targets',
    subject: 'GHG Emissions',
    proponent: 'shareholder',
    proponentName: '',
    managementRecommendation: 'against',
    antiEsg: false,
    financialMateriality: true,
  },
  {
    id: 10,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Brookfield Corporation',
    companyCountry: 'Canada',
    industry: 'Asset Management & Custody Activities',
    meetingType: 'special',
    meetingDate: '2024-11-05',
    item: '1',
    description: 'Spin-off',
    subject: 'Mergers & Acquisitions',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 11,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Open Text Corporation',
    companyCountry: 'Canada',
    industry: 'Software & IT Services',
    meetingType: 'annual',
    meetingDate: '2024-12-12',
    item: '1',
    description: 'Elect P. Thomas Jenkins',
    subject: 'Director Elections',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 12,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'CGI Inc.',
    companyCountry: 'Canada',
    industry: 'Software & IT Services',
    meetingType: 'annual',
    meetingDate: '2024-01-17',
    item: '1.1',
    description: 'Elect Director George A. Cope',
    subject: 'Director Elections',
    proponent: 'management',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 13,
    parentFund: 'Addenda Capital',
    voteDecision: 'against',
    rationale: '',
    company: 'CGI Inc.',
    companyCountry: 'Canada',
    industry: 'Software & IT Services',
    meetingType: 'annual',
    meetingDate: '2024-01-17',
    item: '3',
    description: 'SP 1: Disclose Languages in Which Directors Are Fluent',
    subject: '',
    proponent: 'shareholder',
    proponentName: '',
    managementRecommendation: 'against',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 14,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'CGI Inc.',
    companyCountry: 'Canada',
    industry: 'Software & IT Services',
    meetingType: 'annual',
    meetingDate: '2024-01-17',
    item: '5',
    description:
      'SP 3: Update the Role of the Human Resources Committee to Include Responsibilities Related to Employee Health and Well-being',
    subject: 'Employee Health & Safety',
    proponent: 'shareholder',
    proponentName: '',
    managementRecommendation: 'against',
    antiEsg: false,
    financialMateriality: false,
  },
  {
    id: 15,
    parentFund: 'Addenda Capital',
    voteDecision: 'for',
    rationale: '',
    company: 'Transcontinental Inc.',
    companyCountry: 'Canada',
    industry: 'Professional & Commercial Services',
    meetingType: 'annual',
    meetingDate: '2024-02-22',
    item: '1.1',
    description: 'Elect Director Peter Brues',
    subject: 'Director Elections',
    proponent: '',
    proponentName: '',
    managementRecommendation: 'for',
    antiEsg: false,
    financialMateriality: false,
  },
]

// ── SVG Icons ────────────────────────────────────────────────────────────────

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    grid: 'M3 3h8v8H3zm10 0h8v8h-8zm0 10h8v8h-8zM3 13h8v8H3z',
    chart: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    list: 'M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z',
    calendar:
      'M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14z',
    search:
      'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    filter: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    save: 'M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z',
    bookmark: 'M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z',
    clear:
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    chevron: 'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z',
    prev: 'M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z',
    next: 'M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d={paths[name] || ''} />
    </svg>
  )
}

// ── Chip Component ───────────────────────────────────────────────────────────

type ChipColor =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'secondary'
  | 'default'

function Chip({ label, color }: { label: string; color: ChipColor }) {
  return (
    <span className={`${styles.chip} ${styles[`chip--${color}`]}`}>
      {label}
    </span>
  )
}

function VoteChip({ value }: { value: VoteDecision | '' }) {
  if (!value) return <span className={styles.cellEmpty}>—</span>
  const map: Record<string, ChipColor> = {
    for: 'success',
    against: 'error',
    withhold: 'default',
    abstain: 'default',
  }
  return <Chip label={value} color={map[value] || 'default'} />
}

function MeetingTypeChip({ value }: { value: MeetingType }) {
  return (
    <Chip label={value} color={value === 'annual' ? 'success' : 'warning'} />
  )
}

function ProponentChip({ value }: { value: ProponentType }) {
  if (!value) return <span className={styles.cellEmpty}>—</span>
  return (
    <Chip label={value} color={value === 'management' ? 'info' : 'secondary'} />
  )
}

function BoolChip({ value }: { value: boolean }) {
  return (
    <Chip label={value ? 'Yes' : 'No'} color={value ? 'success' : 'default'} />
  )
}

// ── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'grid' },
  { path: '/', label: 'Graphs', icon: 'chart' },
  { path: '/voting-records', label: 'Voting Records', icon: 'list' },
  { path: '/voting-records', label: 'Meeting Summaries', icon: 'calendar' },
]

function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const location = useLocation()
  return (
    <>
      {!collapsed && (
        <div className={styles.sidebarOverlay} onClick={onToggle} />
      )}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <Link to='/' className={styles.sidebarLogo}>
            <img
              src={oxproxLogo}
              alt='OxProx'
              className={styles.sidebarLogoImg}
            />
          </Link>
          <button
            className={styles.sidebarClose}
            onClick={onToggle}
            aria-label='Close menu'
          >
            <Icon name='clear' size={20} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={styles.sidebarLink}
              data-active={
                item.label === 'Voting Records' &&
                location.pathname === '/voting-records'
              }
            >
              <span className={styles.sidebarIconWrap}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

// ── Info Tooltip ─────────────────────────────────────────────────────────────

function InfoTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span
      className={styles.infoTip}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className={styles.infoIcon}>
        <Icon name='info' size={18} />
      </span>
      {open && (
        <div className={styles.infoPopover}>
          <strong>Help Information</strong>
          <p>Search for institutional investors' voting records in 3 steps:</p>
          <ol>
            <li>
              Select your investors, companies, and meeting date at the top of
              the tool.
            </li>
            <li>
              Select additional filters, as needed, on the left side of the
              tool.
            </li>
            <li>
              Click "Search" to run your search. Pro users can click "Save As"
              to save your query for easy access later.
            </li>
          </ol>
        </div>
      )}
    </span>
  )
}

// ── Main Page Component ──────────────────────────────────────────────────────

type TabId = 'votes' | 'proposals'

function VotingRecords() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('votes')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const [investorFilter, setInvestorFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [showAdditionalFilters, setShowAdditionalFilters] = useState(true)
  const [esgFilter, setEsgFilter] = useState('')
  const [antiEsgFilter, setAntiEsgFilter] = useState('')
  const [mgmtRecFilter, setMgmtRecFilter] = useState('')
  const [proponentFilter, setProponentFilter] = useState('')
  const [materialityFilter, setMaterialityFilter] = useState('')

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalRecords = MOCK_DATA.length
  const paginatedData = MOCK_DATA.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  )

  const clearAllFilters = () => {
    setInvestorFilter('')
    setCompanyFilter('')
    setDateFrom('')
    setDateTo('')
    setEsgFilter('')
    setAntiEsgFilter('')
    setMgmtRecFilter('')
    setProponentFilter('')
    setMaterialityFilter('')
  }

  return (
    <div className={styles.pageLayout}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className={styles.pageContent}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarCollapsed(false)}
            aria-label='Open menu'
          >
            <span />
            <span />
            <span />
          </button>
          <div className={styles.topBarRight}>
            <button className={styles.topBarBtn}>Log In</button>
            <Link
              to='/'
              className={`${styles.topBarBtn} ${styles.topBarBtnOutline}`}
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* Sub-header */}
        <div className={styles.subHeader}>
          <div className={styles.subHeaderLeft}>
            <h1 className={styles.subHeaderTitle}>VOTING RECORDS</h1>
            <InfoTooltip />
          </div>
          <div className={styles.tabGroup} role='tablist'>
            {(['votes', 'proposals'] as const).map((tab) => (
              <button
                key={tab}
                role='tab'
                aria-selected={activeTab === tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Primary filters */}
        <div className={styles.primaryFilters}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Investors</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <Icon name='search' size={16} />
              </span>
              <input
                type='text'
                className={styles.filterInput}
                placeholder='Search investors...'
                value={investorFilter}
                onChange={(e) => setInvestorFilter(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Companies</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <Icon name='search' size={16} />
              </span>
              <input
                type='text'
                className={styles.filterInput}
                placeholder='Search companies...'
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Meeting Date Range</label>
            <div className={styles.dateRange}>
              <input
                type='date'
                className={styles.filterInput}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className={styles.dateSep}>to</span>
              <input
                type='date'
                className={styles.filterInput}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content: filter sidebar + table */}
        <div className={styles.contentArea}>
          <aside className={styles.filterSidebar}>
            <button
              className={styles.filterSidebarToggle}
              onClick={() => setShowAdditionalFilters((v) => !v)}
            >
              <div className={styles.filterSidebarTitleRow}>
                <Icon name='filter' size={16} />
                <h2 className={styles.filterSidebarTitle}>
                  Additional Filters
                </h2>
              </div>
              <span
                className={`${styles.chevron} ${showAdditionalFilters ? styles.chevronOpen : ''}`}
              >
                <Icon name='chevron' size={18} />
              </span>
            </button>

            {showAdditionalFilters && (
              <div className={styles.additionalFilters}>
                {[
                  {
                    label: 'ESG Issues',
                    value: esgFilter,
                    setter: setEsgFilter,
                    options: [
                      'GHG Emissions',
                      'Director Elections',
                      'Employee Health & Safety',
                    ],
                  },
                  {
                    label: 'Anti-ESG',
                    value: antiEsgFilter,
                    setter: setAntiEsgFilter,
                    options: ['Yes', 'No'],
                  },
                  {
                    label: 'Management Recommendation',
                    value: mgmtRecFilter,
                    setter: setMgmtRecFilter,
                    options: ['For', 'Against'],
                  },
                  {
                    label: 'Proponent',
                    value: proponentFilter,
                    setter: setProponentFilter,
                    options: ['Management', 'Shareholder'],
                  },
                  {
                    label: 'Materiality',
                    value: materialityFilter,
                    setter: setMaterialityFilter,
                    options: ['Yes', 'No'],
                  },
                ].map((f) => (
                  <div key={f.label} className={styles.sideFilterField}>
                    <label>{f.label}</label>
                    <select
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                    >
                      <option value=''>All</option>
                      {f.options.map((o) => (
                        <option key={o} value={o.toLowerCase()}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.filterActions}>
              <button
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              >
                <Icon name='search' size={14} /> Search
              </button>
              <button className={styles.actionBtn} onClick={clearAllFilters}>
                <Icon name='clear' size={14} /> Clear All
              </button>
              <div className={styles.actionDivider} />
              <button className={styles.actionBtn}>
                <Icon name='save' size={14} /> Save As…
              </button>
              <button className={styles.actionBtn}>
                <Icon name='bookmark' size={14} /> Saved Queries
              </button>
              <button className={styles.actionBtn}>
                <Icon name='download' size={14} /> Download
              </button>
            </div>
          </aside>

          {/* Table */}
          <div className={styles.tableArea}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <colgroup>
                  <col style={{ width: 42 }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '5.5%' }} />
                  <col style={{ width: '5.5%' }} />
                  <col style={{ width: '2.5%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '6%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '3.5%' }} />
                  <col style={{ width: '5%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th aria-label='Expand'></th>
                    <th>Parent Fund</th>
                    <th>Vote</th>
                    <th>Rationale</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>Industry</th>
                    <th>Meeting</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Subject</th>
                    <th>Proponent</th>
                    <th>Prop. Name</th>
                    <th>Mgmt Rec.</th>
                    <th>Anti-ESG</th>
                    <th>Material</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, i) => (
                    <TableRow
                      key={row.id}
                      row={row}
                      index={i}
                      expanded={expandedRows.has(row.id)}
                      onToggle={() => toggleRow(row.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.paginationBar}>
              <span className={styles.paginationLabel}>Rows per page:</span>
              <select
                className={styles.paginationSelect}
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setPage(0)
                }}
              >
                {[25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className={styles.paginationInfo}>
                {page * rowsPerPage + 1}–
                {Math.min((page + 1) * rowsPerPage, totalRecords)} of{' '}
                {totalRecords}
              </span>
              <button
                className={styles.paginationBtn}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                aria-label='Previous page'
              >
                <Icon name='prev' size={20} />
              </button>
              <button
                className={styles.paginationBtn}
                disabled={(page + 1) * rowsPerPage >= totalRecords}
                onClick={() => setPage((p) => p + 1)}
                aria-label='Next page'
              >
                <Icon name='next' size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Table Row ────────────────────────────────────────────────────────────────

function TableRow({
  row,
  index,
  expanded,
  onToggle,
}: {
  row: VotingRecord
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        className={`${styles.dataRow} ${index % 2 === 1 ? styles.dataRowAlt : ''}`}
      >
        <td className={styles.expandCell}>
          <button
            className={styles.expandBtn}
            onClick={onToggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <span
              className={`${styles.expandIcon} ${expanded ? styles.expandIconOpen : ''}`}
            >
              <Icon name='chevron' size={18} />
            </span>
          </button>
        </td>
        <td title={row.parentFund}>
          <span className={styles.cellTruncate}>{row.parentFund}</span>
        </td>
        <td>
          <VoteChip value={row.voteDecision} />
        </td>
        <td title={row.rationale}>
          <span className={styles.cellTruncate}>
            {row.rationale || <span className={styles.cellEmpty}>—</span>}
          </span>
        </td>
        <td title={row.company}>
          <span className={styles.cellTruncate}>{row.company}</span>
        </td>
        <td title={row.companyCountry}>
          <span className={styles.cellTruncate}>{row.companyCountry}</span>
        </td>
        <td title={row.industry}>
          <span className={styles.cellTruncate}>{row.industry}</span>
        </td>
        <td>
          <MeetingTypeChip value={row.meetingType} />
        </td>
        <td className={styles.cellMono}>{row.meetingDate}</td>
        <td className={styles.cellMono}>{row.item}</td>
        <td title={row.description}>
          <span className={styles.cellTruncate}>{row.description}</span>
        </td>
        <td title={row.subject}>
          <span className={styles.cellTruncate}>
            {row.subject || <span className={styles.cellEmpty}>—</span>}
          </span>
        </td>
        <td>
          <ProponentChip value={row.proponent} />
        </td>
        <td title={row.proponentName}>
          <span className={styles.cellTruncate}>
            {row.proponentName || <span className={styles.cellEmpty}>—</span>}
          </span>
        </td>
        <td>
          <VoteChip value={row.managementRecommendation} />
        </td>
        <td>
          <BoolChip value={row.antiEsg} />
        </td>
        <td>
          <BoolChip value={row.financialMateriality} />
        </td>
      </tr>
      {expanded && (
        <tr className={styles.expandedRow}>
          <td colSpan={17}>
            <div className={styles.expandedContent}>
              <div className={styles.expandedGrid}>
                <div>
                  <span className={styles.expandedLabel}>Description</span>
                  <span>{row.description}</span>
                </div>
                <div>
                  <span className={styles.expandedLabel}>Company</span>
                  <span>
                    {row.company} · {row.companyCountry}
                  </span>
                </div>
                <div>
                  <span className={styles.expandedLabel}>Industry</span>
                  <span>{row.industry}</span>
                </div>
                <div>
                  <span className={styles.expandedLabel}>Meeting</span>
                  <span>
                    {row.meetingType} · {row.meetingDate}
                  </span>
                </div>
                {row.rationale && (
                  <div>
                    <span className={styles.expandedLabel}>Rationale</span>
                    <span>{row.rationale}</span>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default VotingRecords
