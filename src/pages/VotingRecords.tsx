import { useState, useMemo, Fragment, useRef, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ExpandedState,
  type Row,
} from '@tanstack/react-table'
import {
  LuLayoutGrid,
  LuChartColumnIncreasing,
  LuListChecks,
  LuCalendarDays,
  LuSearch,
  LuSlidersHorizontal,
  LuDownload,
  LuSave,
  LuBookmark,
  LuEllipsisVertical,
  LuX,
  LuLogIn,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuInfo,
  LuArrowUp,
  LuArrowDown,
  LuArrowUpDown,
} from 'react-icons/lu'
import oxproxLogo from '../assets/oxprox-logo-white.svg'
import {
  votingRecords,
  type VotingRecord,
  type VoteDecision,
  type MeetingType,
  type ProponentType,
} from '../data/votingRecords'
import InvestorSelector from '../components/ui/InvestorSelector'
import CompanySelector from '../components/ui/CompanySelector'
import styles from './VotingRecords.module.scss'

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

const Empty = () => <span className={styles.cellEmpty}>—</span>

function VoteChip({ value }: { value: VoteDecision | '' }) {
  if (!value) return <Empty />
  const map: Record<string, ChipColor> = {
    for: 'success',
    against: 'error',
    withhold: 'default',
    abstain: 'default',
    split: 'warning',
  }
  return <Chip label={value} color={map[value] || 'default'} />
}

function MeetingTypeChip({ value }: { value: MeetingType }) {
  return (
    <Chip label={value} color={value === 'annual' ? 'success' : 'warning'} />
  )
}

function ProponentChip({ value }: { value: ProponentType }) {
  if (!value) return <Empty />
  return (
    <Chip label={value} color={value === 'management' ? 'info' : 'secondary'} />
  )
}

function BoolChip({ value }: { value: boolean }) {
  return (
    <Chip label={value ? 'Yes' : 'No'} color={value ? 'success' : 'default'} />
  )
}

function Truncate({ value }: { value: string }) {
  return value ? (
    <span className={styles.cellTruncate} title={value}>
      {value}
    </span>
  ) : (
    <Empty />
  )
}

const columnHelper = createColumnHelper<VotingRecord>()

const columns = [
  columnHelper.display({
    id: 'expander',
    size: 42,
    enableResizing: false,
    header: () => null,
    cell: ({ row }) => (
      <button
        className={styles.expandBtn}
        onClick={row.getToggleExpandedHandler()}
        aria-label={row.getIsExpanded() ? 'Collapse' : 'Expand'}
      >
        <span
          className={`${styles.expandIcon} ${row.getIsExpanded() ? styles.expandIconOpen : ''}`}
        >
          <LuChevronDown size={16} />
        </span>
      </button>
    ),
  }),
  columnHelper.accessor('parentFund', {
    header: 'Parent Fund',
    size: 140,
    minSize: 80,
    maxSize: 300,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('voteDecision', {
    header: 'Vote',
    size: 80,
    minSize: 60,
    maxSize: 140,
    cell: (info) => <VoteChip value={info.getValue()} />,
  }),
  columnHelper.accessor('rationale', {
    header: 'Rationale',
    size: 120,
    minSize: 60,
    maxSize: 300,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('company', {
    header: 'Company',
    size: 150,
    minSize: 80,
    maxSize: 350,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('companyCountry', {
    header: 'Country',
    size: 90,
    minSize: 60,
    maxSize: 160,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('industry', {
    header: 'Industry',
    size: 120,
    minSize: 60,
    maxSize: 280,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('meetingType', {
    header: 'Meeting',
    size: 85,
    minSize: 60,
    maxSize: 140,
    cell: (info) => <MeetingTypeChip value={info.getValue()} />,
  }),
  columnHelper.accessor('meetingDate', {
    header: 'Date',
    size: 95,
    minSize: 70,
    maxSize: 140,
    cell: (info) => <span className={styles.cellMono}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    size: 65,
    minSize: 40,
    maxSize: 100,
    cell: (info) => <span className={styles.cellMono}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    size: 180,
    minSize: 80,
    maxSize: 500,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('subject', {
    header: 'Subject',
    size: 130,
    minSize: 60,
    maxSize: 300,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('proponent', {
    header: 'Proponent',
    size: 100,
    minSize: 60,
    maxSize: 180,
    cell: (info) => <ProponentChip value={info.getValue()} />,
  }),
  columnHelper.accessor('proponentName', {
    header: 'Prop. Name',
    size: 100,
    minSize: 60,
    maxSize: 200,
    cell: (info) => <Truncate value={info.getValue()} />,
  }),
  columnHelper.accessor('managementRecommendation', {
    header: 'Mgmt Rec.',
    size: 95,
    minSize: 60,
    maxSize: 160,
    cell: (info) => <VoteChip value={info.getValue()} />,
  }),
  columnHelper.accessor('antiEsg', {
    header: 'Anti-ESG',
    size: 85,
    minSize: 50,
    maxSize: 120,
    cell: (info) => <BoolChip value={info.getValue()} />,
    sortingFn: 'basic',
  }),
  columnHelper.accessor('financialMateriality', {
    header: 'Material',
    size: 90,
    minSize: 50,
    maxSize: 120,
    cell: (info) => <BoolChip value={info.getValue()} />,
    sortingFn: 'basic',
  }),
]

function SortIndicator({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc')
    return (
      <span className={styles.sortIconActive}>
        <LuArrowUp size={13} />
      </span>
    )
  if (direction === 'desc')
    return (
      <span className={styles.sortIconActive}>
        <LuArrowDown size={13} />
      </span>
    )
  return (
    <span className={styles.sortIcon}>
      <LuArrowUpDown size={13} />
    </span>
  )
}

const MemoRow = memo(
  function MemoRow({
    row,
    index,
    isExpanded,
  }: {
    row: Row<VotingRecord>
    index: number
    isExpanded: boolean
  }) {
    return (
      <Fragment>
        <tr
          className={`${styles.dataRow} ${index % 2 === 1 ? styles.dataRowAlt : ''}`}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
        <tr className={styles.expandedRow}>
          <td
            colSpan={row.getVisibleCells().length}
            className={styles.expandedCell}
          >
            <div
              className={`${styles.expandedWrapper} ${isExpanded ? styles.expandedWrapperOpen : ''}`}
            >
              <div className={styles.expandedInner}>
                <ExpandedRowContent row={row.original} />
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    )
  },
  (prev, next) =>
    prev.row.id === next.row.id &&
    prev.index === next.index &&
    prev.isExpanded === next.isExpanded,
)

function ExpandedRowContent({ row }: { row: VotingRecord }) {
  return (
    <div className={styles.expandedContent}>
      <div className={styles.expandedHeader}>
        <span className={styles.expandedTitle}>{row.description}</span>
        <div className={styles.expandedChips}>
          <VoteChip value={row.voteDecision} />
          <MeetingTypeChip value={row.meetingType} />
          {row.proponent && <ProponentChip value={row.proponent} />}
        </div>
      </div>
      <div className={styles.expandedGrid}>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Company</span>
          <span className={styles.expandedValue}>{row.company}</span>
        </div>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Country</span>
          <span className={styles.expandedValue}>{row.companyCountry}</span>
        </div>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Industry</span>
          <span className={styles.expandedValue}>{row.industry}</span>
        </div>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Meeting Date</span>
          <span className={styles.expandedValue}>{row.meetingDate || '—'}</span>
        </div>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Item</span>
          <span className={styles.expandedValue}>{row.item}</span>
        </div>
        <div className={styles.expandedField}>
          <span className={styles.expandedLabel}>Subject</span>
          <span className={styles.expandedValue}>{row.subject || '—'}</span>
        </div>
        {row.rationale && (
          <div
            className={`${styles.expandedField} ${styles.expandedFieldWide}`}
          >
            <span className={styles.expandedLabel}>Rationale</span>
            <span className={styles.expandedValue}>{row.rationale}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LuLayoutGrid },
  { path: '/', label: 'Graphs', icon: LuChartColumnIncreasing },
  { path: '/voting-records', label: 'Voting Records', icon: LuListChecks },
  { path: '/voting-records', label: 'Meeting Summaries', icon: LuCalendarDays },
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
            <LuX size={18} />
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
                <item.icon size={18} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.sidebarLoginBtn}>
            <LuLogIn size={16} />
            <span>Log In</span>
          </button>
        </div>
      </aside>
    </>
  )
}

function InfoTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span
      className={styles.infoTip}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className={styles.infoIcon}>
        <LuInfo size={16} />
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

const DataTable = memo(function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const data = useMemo(() => votingRecords, [])

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onEnd',
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    initialState: { pagination: { pageSize: 100 } },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length

  const tableRef = useRef<HTMLTableElement>(null)

  const handleResizeStart = useCallback(
    (headerId: string, startSize: number) =>
      (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const col = tableRef.current?.querySelector<HTMLElement>(
          `[data-col-id="${headerId}"]`,
        )
        if (!col) return

        const onMove = (ev: MouseEvent | TouchEvent) => {
          const clientX = 'touches' in ev ? ev.touches[0].clientX : ev.clientX
          const delta = clientX - startX
          const header = table.getFlatHeaders().find((h) => h.id === headerId)
          if (!header) return
          const min = header.column.columnDef.minSize ?? 30
          const max = header.column.columnDef.maxSize ?? 1000
          const newWidth = Math.min(max, Math.max(min, startSize + delta))
          col.style.width = `${newWidth}px`
        }

        const onEnd = (ev: MouseEvent | TouchEvent) => {
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseup', onEnd)
          document.removeEventListener('touchmove', onMove)
          document.removeEventListener('touchend', onEnd)
          document.body.style.cursor = ''
          document.body.style.userSelect = ''

          const clientX =
            'changedTouches' in ev ? ev.changedTouches[0].clientX : ev.clientX
          const delta = clientX - startX
          const header = table.getFlatHeaders().find((h) => h.id === headerId)
          if (header) {
            const min = header.column.columnDef.minSize ?? 30
            const max = header.column.columnDef.maxSize ?? 1000
            const newWidth = Math.min(max, Math.max(min, startSize + delta))
            table.setColumnSizing((prev) => ({
              ...prev,
              [header.column.id]: newWidth,
            }))
          }
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)
        document.addEventListener('touchmove', onMove)
        document.addEventListener('touchend', onEnd)
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
      },
    [table],
  )

  return (
    <div className={styles.tableArea}>
      <div className={styles.tableContainer}>
        <table
          className={styles.table}
          ref={tableRef}
          style={{ width: table.getTotalSize() }}
        >
          <colgroup>
            {table.getFlatHeaders().map((header) => (
              <col
                key={header.id}
                data-col-id={header.id}
                style={{ width: header.getSize() }}
              />
            ))}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const canResize = header.column.getCanResize()
                  return (
                    <th
                      key={header.id}
                      className={canSort ? styles.sortableHeader : undefined}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : undefined
                      }
                    >
                      <span className={styles.headerContent}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <SortIndicator
                            direction={header.column.getIsSorted()}
                          />
                        )}
                      </span>
                      {canResize && (
                        <div
                          className={styles.resizeHandle}
                          onMouseDown={handleResizeStart(
                            header.id,
                            header.getSize(),
                          )}
                          onTouchStart={handleResizeStart(
                            header.id,
                            header.getSize(),
                          )}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <MemoRow
                key={row.id}
                row={row}
                index={i}
                isExpanded={row.getIsExpanded()}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationBar}>
        <span className={styles.paginationLabel}>Rows per page:</span>
        <select
          className={styles.paginationSelect}
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className={styles.paginationInfo}>
          {pageIndex * pageSize + 1}–
          {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
        </span>
        <button
          className={styles.paginationBtn}
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          aria-label='Previous page'
        >
          <LuChevronLeft size={18} />
        </button>
        <button
          className={styles.paginationBtn}
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          aria-label='Next page'
        >
          <LuChevronRight size={18} />
        </button>
      </div>
    </div>
  )
})

// ── Main Page Component ──────────────────────────────────────────────────────

type TabId = 'votes' | 'proposals'

function VotingRecords() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('votes')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false)

  // Filters
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])
  const [companyFilter, setCompanyFilter] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(true)
  const [esgFilter, setEsgFilter] = useState('')
  const [antiEsgFilter, setAntiEsgFilter] = useState('')
  const [mgmtRecFilter, setMgmtRecFilter] = useState('')
  const [proponentFilter, setProponentFilter] = useState('')
  const [materialityFilter, setMaterialityFilter] = useState('')

  const clearAllFilters = () => {
    setSelectedInvestors([])
    setCompanyFilter([])
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
        {/* Page header — single bar with title, info, and tabs */}
        <header className={styles.pageHeader}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarCollapsed(false)}
            aria-label='Open menu'
          >
            <span />
            <span />
            <span />
          </button>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageHeaderTitle}>VOTING RECORDS</h1>
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
        </header>

        {/* Primary filters */}
        <div className={styles.primaryFilters}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Investors</label>
            <InvestorSelector
              selected={selectedInvestors}
              onChange={setSelectedInvestors}
            />
          </div>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Companies</label>
            <CompanySelector
              selected={companyFilter}
              onChange={setCompanyFilter}
            />
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
          <div className={styles.mobileActions}>
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setFilterDrawerOpen(true)}
            >
              <LuSlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
            <div className={styles.actionsMenuWrap}>
              <button
                className={styles.mobileFilterBtn}
                onClick={() => setActionsMenuOpen((v) => !v)}
              >
                <LuEllipsisVertical size={15} />
                <span>Actions</span>
              </button>
              {actionsMenuOpen && (
                <>
                  <div
                    className={styles.actionsMenuBackdrop}
                    onClick={() => setActionsMenuOpen(false)}
                  />
                  <div className={styles.actionsMenu}>
                    <button
                      className={styles.actionsMenuItem}
                      onClick={() => setActionsMenuOpen(false)}
                    >
                      <LuSave size={14} /> Save As…
                    </button>
                    <button
                      className={styles.actionsMenuItem}
                      onClick={() => setActionsMenuOpen(false)}
                    >
                      <LuBookmark size={14} /> Saved Queries
                    </button>
                    <button
                      className={styles.actionsMenuItem}
                      onClick={() => setActionsMenuOpen(false)}
                    >
                      <LuDownload size={14} /> Download
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content: filter sidebar + table */}
        <div className={styles.contentArea}>
          {/* Mobile filter drawer overlay */}
          {filterDrawerOpen && (
            <div
              className={styles.filterDrawerOverlay}
              onClick={() => setFilterDrawerOpen(false)}
            />
          )}
          <aside
            className={`${styles.filterSidebar} ${filterDrawerOpen ? styles.filterSidebarOpen : ''}`}
          >
            <div className={styles.filterSidebarHeader}>
              <button
                className={styles.filterSidebarToggle}
                onClick={() => setShowAdditionalFilters((v) => !v)}
              >
                <div className={styles.filterSidebarTitleRow}>
                  <LuSlidersHorizontal size={15} />
                  <h2 className={styles.filterSidebarTitle}>
                    Additional Filters
                  </h2>
                </div>
                <span
                  className={`${styles.chevron} ${showAdditionalFilters ? styles.chevronOpen : ''}`}
                >
                  <LuChevronDown size={16} />
                </span>
              </button>
              <button
                className={styles.filterDrawerClose}
                onClick={() => setFilterDrawerOpen(false)}
                aria-label='Close filters'
              >
                <LuX size={18} />
              </button>
            </div>

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
                <LuSearch size={14} /> Search
              </button>
              <button className={styles.actionBtn} onClick={clearAllFilters}>
                <LuX size={14} /> Clear All
              </button>
              <button className={styles.actionBtn}>
                <LuSave size={14} /> Save As…
              </button>
              <button className={styles.actionBtn}>
                <LuBookmark size={14} /> Saved Queries
              </button>
              <button className={styles.actionBtn}>
                <LuDownload size={14} /> Download
              </button>
            </div>
          </aside>

          <DataTable />
        </div>
      </div>
    </div>
  )
}

export default VotingRecords
