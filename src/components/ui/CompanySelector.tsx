import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LuSearch, LuX, LuChevronDown, LuCheck } from 'react-icons/lu'
import {
  companies,
  COMPANY_COUNTRIES,
  INDUSTRY_SECTORS,
} from '../../data/companies'
import styles from './CompanySelector.module.scss'

interface CompanySelectorProps {
  selected: string[]
  onChange: (ids: string[]) => void
}

const ROW_HEIGHT = 44

export default function CompanySelector({
  selected,
  onChange,
}: CompanySelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isinSearch, setIsinSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState<string[]>([])
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false)
  const [industrySearch, setIndustrySearch] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const filtered = useMemo(() => {
    if (
      search.length > 0 &&
      search.length < 3 &&
      !isinSearch &&
      countryFilter.length === 0 &&
      selectedIndustries.length === 0
    )
      return []

    return companies.filter((c) => {
      if (countryFilter.length > 0 && !countryFilter.includes(c.country))
        return false
      if (
        selectedIndustries.length > 0 &&
        !selectedIndustries.includes(c.industry)
      )
        return false
      if (isinSearch.length >= 3) {
        const q = isinSearch.toUpperCase()
        if (!c.isin?.toUpperCase().includes(q)) return false
      }
      if (search.length >= 3) {
        const q = search.toLowerCase()
        if (!c.name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, isinSearch, countryFilter, selectedIndustries])

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const toggleCompany = useCallback(
    (id: string) => {
      onChange(
        selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id],
      )
    },
    [selected, onChange],
  )

  const removeCompany = useCallback(
    (id: string) => {
      onChange(selected.filter((s) => s !== id))
    },
    [selected, onChange],
  )

  const clearAll = useCallback(() => {
    onChange([])
    setSearch('')
    setIsinSearch('')
    setCountryFilter([])
    setSelectedIndustries([])
  }, [onChange])

  const toggleCountry = useCallback((country: string) => {
    setCountryFilter((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    )
  }, [])

  const toggleIndustry = useCallback((industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    )
  }, [])

  const toggleSector = useCallback((sectorIndustries: string[]) => {
    setSelectedIndustries((prev) => {
      const allSelected = sectorIndustries.every((i) => prev.includes(i))
      if (allSelected) {
        return prev.filter((i) => !sectorIndustries.includes(i))
      }
      return [...new Set([...prev, ...sectorIndustries])]
    })
  }, [])

  const selectedCompanies = useMemo(
    () => companies.filter((c) => selected.includes(c.id)),
    [selected],
  )

  // Filter industry sectors by search
  const filteredSectors = useMemo(() => {
    if (!industrySearch) return INDUSTRY_SECTORS
    const q = industrySearch.toLowerCase()
    return INDUSTRY_SECTORS.map((s) => ({
      ...s,
      industries: s.industries.filter((i) => i.toLowerCase().includes(q)),
    })).filter((s) => s.industries.length > 0)
  }, [industrySearch])

  const showHint =
    search.length > 0 &&
    search.length < 3 &&
    !isinSearch &&
    countryFilter.length === 0 &&
    selectedIndustries.length === 0

  return (
    <div className={styles.wrapper}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(!open)}
        role='combobox'
        aria-expanded={open}
        aria-haspopup='dialog'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(!open)
          }
        }}
      >
        <span className={styles.triggerIcon}>
          <LuSearch size={15} />
        </span>
        {selectedCompanies.length === 0 ? (
          <span className={styles.triggerPlaceholder}>Search companies...</span>
        ) : (
          <span className={styles.triggerChips}>
            {selectedCompanies.slice(0, 2).map((c) => (
              <span key={c.id} className={styles.triggerChip}>
                <span className={styles.triggerChipLabel}>{c.name}</span>
                <button
                  className={styles.triggerChipRemove}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCompany(c.id)
                  }}
                  aria-label={`Remove ${c.name}`}
                >
                  <LuX size={12} />
                </button>
              </span>
            ))}
            {selectedCompanies.length > 2 && (
              <span className={styles.triggerMore}>
                +{selectedCompanies.length - 2}
              </span>
            )}
          </span>
        )}
        <span
          className={`${styles.triggerArrow} ${open ? styles.triggerArrowOpen : ''}`}
        >
          <LuChevronDown size={16} />
        </span>
      </div>

      {/* Panel */}
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={styles.panel}
            role='dialog'
            aria-label='Company selector'
          >
            {/* Mobile close header */}
            <div className={styles.panelMobileHeader}>
              <span className={styles.panelMobileTitle}>Select Companies</span>
              <button
                className={styles.panelMobileClose}
                onClick={() => setOpen(false)}
                aria-label='Close'
              >
                <LuX size={18} />
              </button>
            </div>
            {/* Search */}
            <div className={styles.panelSearch}>
              <LuSearch size={14} className={styles.panelSearchIcon} />
              <input
                type='text'
                className={styles.panelSearchInput}
                placeholder='Search companies...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  className={styles.panelSearchClear}
                  onClick={() => setSearch('')}
                  aria-label='Clear search'
                >
                  <LuX size={14} />
                </button>
              )}
            </div>
            {showHint && (
              <p className={styles.hint}>
                Type at least 3 characters or choose a filter
              </p>
            )}

            {/* Pre-filters */}
            <div className={styles.preFilters}>
              {/* ISIN */}
              <input
                type='text'
                className={styles.preFilterInput}
                placeholder='ISIN...'
                value={isinSearch}
                onChange={(e) => setIsinSearch(e.target.value)}
                maxLength={32}
              />

              {/* Country multi-select */}
              <div className={styles.preFilterField}>
                <button
                  className={styles.preFilterBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCountryDropdownOpen(!countryDropdownOpen)
                  }}
                >
                  <span className={styles.preFilterBtnLabel}>
                    {countryFilter.length === 0
                      ? 'Country'
                      : `${countryFilter.length} countr${countryFilter.length === 1 ? 'y' : 'ies'}`}
                  </span>
                  <LuChevronDown size={13} />
                </button>
                {countryDropdownOpen && (
                  <>
                    <div
                      className={styles.industryBackdrop}
                      onClick={() => setCountryDropdownOpen(false)}
                    />
                    <div className={styles.countryDropdown}>
                      {COMPANY_COUNTRIES.map((c) => (
                        <label key={c} className={styles.countryOption}>
                          <input
                            type='checkbox'
                            checked={countryFilter.includes(c)}
                            onChange={() => toggleCountry(c)}
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Industry grouped multi-select */}
              <div className={styles.preFilterField}>
                <button
                  className={styles.preFilterBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndustryDropdownOpen(!industryDropdownOpen)
                  }}
                >
                  <span className={styles.preFilterBtnLabel}>
                    {selectedIndustries.length === 0
                      ? 'Industry'
                      : `${selectedIndustries.length} selected`}
                  </span>
                  <LuChevronDown size={13} />
                </button>
                {industryDropdownOpen && (
                  <>
                    <div
                      className={styles.industryBackdrop}
                      onClick={() => setIndustryDropdownOpen(false)}
                    />
                    <div className={styles.industryDropdown}>
                      {/* Industry search */}
                      <div className={styles.industrySearchWrap}>
                        <input
                          type='text'
                          className={styles.industrySearchInput}
                          placeholder='Search industry...'
                          value={industrySearch}
                          onChange={(e) => setIndustrySearch(e.target.value)}
                        />
                      </div>
                      {selectedIndustries.length > 0 && (
                        <button
                          className={styles.industryClearBtn}
                          onClick={() => setSelectedIndustries([])}
                        >
                          Clear all
                        </button>
                      )}
                      <div className={styles.industryList}>
                        {filteredSectors.map((sector) => {
                          const allChecked = sector.industries.every((i) =>
                            selectedIndustries.includes(i),
                          )
                          const someChecked =
                            !allChecked &&
                            sector.industries.some((i) =>
                              selectedIndustries.includes(i),
                            )
                          return (
                            <div
                              key={sector.sector}
                              className={styles.sectorGroup}
                            >
                              <div className={styles.sectorHeader}>
                                <label className={styles.sectorLabel}>
                                  <input
                                    type='checkbox'
                                    checked={allChecked}
                                    ref={(el) => {
                                      if (el) el.indeterminate = someChecked
                                    }}
                                    onChange={() =>
                                      toggleSector(sector.industries)
                                    }
                                  />
                                  <span className={styles.sectorName}>
                                    {sector.sector}
                                  </span>
                                </label>
                                <button
                                  className={styles.selectAllBtn}
                                  onClick={() =>
                                    toggleSector(sector.industries)
                                  }
                                >
                                  {allChecked ? 'Deselect' : 'Select all'}
                                </button>
                              </div>
                              {sector.industries.map((ind) => (
                                <label
                                  key={ind}
                                  className={styles.industryOption}
                                >
                                  <input
                                    type='checkbox'
                                    checked={selectedIndustries.includes(ind)}
                                    onChange={() => toggleIndustry(ind)}
                                  />
                                  <span>{ind}</span>
                                </label>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Virtualized results */}
            <div className={styles.resultsList} ref={listRef}>
              {filtered.length === 0 ? (
                <p className={styles.noResults}>
                  {showHint
                    ? 'Start typing or choose a filter'
                    : 'No companies match your filters'}
                </p>
              ) : (
                <div
                  style={{
                    height: virtualizer.getTotalSize(),
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const company = filtered[virtualRow.index]
                    const isSelected = selected.includes(company.id)
                    return (
                      <button
                        key={company.id}
                        className={`${styles.resultItem} ${isSelected ? styles.resultItemSelected : ''}`}
                        onClick={() => toggleCompany(company.id)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: virtualRow.size,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <span
                          className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}
                        >
                          {isSelected && <LuCheck size={12} />}
                        </span>
                        <span className={styles.resultInfo}>
                          <span className={styles.resultName}>
                            {company.name}
                          </span>
                          <span className={styles.resultMeta}>
                            {company.country} · {company.industry}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected summary */}
            {selectedCompanies.length > 0 && (
              <div className={styles.selectedSummary}>
                <span className={styles.selectedCount}>
                  {selectedCompanies.length} selected
                </span>
                <div className={styles.selectedChips}>
                  {selectedCompanies.map((c) => (
                    <span key={c.id} className={styles.selectedChip}>
                      {c.name}
                      <button
                        className={styles.selectedChipRemove}
                        onClick={() => removeCompany(c.id)}
                        aria-label={`Remove ${c.name}`}
                      >
                        <LuX size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={styles.panelFooter}>
              <button
                className={styles.footerBtnSecondary}
                onClick={clearAll}
                disabled={selected.length === 0}
              >
                Clear All
              </button>
              <button
                className={styles.footerBtnPrimary}
                onClick={() => setOpen(false)}
              >
                Apply Selection
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
