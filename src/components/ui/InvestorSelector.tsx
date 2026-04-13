import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LuSearch, LuX, LuChevronDown, LuCheck } from 'react-icons/lu'
import {
  investors,
  INVESTOR_COUNTRIES,
  INVESTOR_NETWORKS,
  type InvestorType,
  type InvestorNetwork,
} from '../../data/investors'
import styles from './InvestorSelector.module.scss'

interface InvestorSelectorProps {
  selected: string[] // investor ids
  onChange: (ids: string[]) => void
}

// Build a lookup: country → investor ids (once, at module level)
const investorsByCountry = new Map<string, string[]>()
for (const inv of investors) {
  const list = investorsByCountry.get(inv.country) ?? []
  list.push(inv.id)
  investorsByCountry.set(inv.country, list)
}

const ROW_HEIGHT = 44

export default function InvestorSelector({
  selected,
  onChange,
}: InvestorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<InvestorType | ''>('')
  const [networkFilter, setNetworkFilter] = useState<InvestorNetwork | ''>('')
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)

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

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Require 3+ chars to show search results (matching OxProx behavior).
  // Pre-filters still narrow the pool, but we only show the list when
  // either a search query is long enough OR no search text is entered
  // (so the user can browse by country/type/network alone).
  const filtered = useMemo(() => {
    if (search.length > 0 && search.length < 3) return []

    return investors.filter((inv) => {
      if (countryFilter.length > 0 && !countryFilter.includes(inv.country))
        return false
      if (typeFilter && inv.type !== typeFilter) return false
      if (networkFilter && !inv.networks.includes(networkFilter)) return false
      if (search.length >= 3) {
        const q = search.toLowerCase()
        if (!inv.name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, countryFilter, typeFilter, networkFilter])

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const toggleInvestor = useCallback(
    (id: string) => {
      onChange(
        selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id],
      )
    },
    [selected, onChange],
  )

  const removeInvestor = useCallback(
    (id: string) => {
      onChange(selected.filter((s) => s !== id))
    },
    [selected, onChange],
  )

  const clearAll = useCallback(() => {
    onChange([])
    setSearch('')
    setCountryFilter([])
    setTypeFilter('')
    setNetworkFilter('')
  }, [onChange])

  // Country toggle: selecting a country auto-selects all its investors,
  // deselecting removes them.
  const toggleCountry = useCallback(
    (country: string) => {
      const ids = investorsByCountry.get(country) ?? []
      setCountryFilter((prev) => {
        const wasChecked = prev.includes(country)
        if (wasChecked) {
          // Deselect country → remove its investors from selection
          onChange(selected.filter((s) => !ids.includes(s)))
          return prev.filter((c) => c !== country)
        } else {
          // Select country → add its investors to selection (deduplicated)
          const merged = new Set([...selected, ...ids])
          onChange(Array.from(merged))
          return [...prev, country]
        }
      })
    },
    [selected, onChange],
  )

  const selectedInvestors = useMemo(
    () => investors.filter((inv) => selected.includes(inv.id)),
    [selected],
  )

  const showHint = search.length > 0 && search.length < 3

  return (
    <div className={styles.wrapper}>
      {/* Trigger field */}
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
        {selectedInvestors.length === 0 ? (
          <span className={styles.triggerPlaceholder}>Search investors...</span>
        ) : (
          <span className={styles.triggerChips}>
            {selectedInvestors.slice(0, 2).map((inv) => (
              <span key={inv.id} className={styles.triggerChip}>
                <span className={styles.triggerChipLabel}>{inv.name}</span>
                <button
                  className={styles.triggerChipRemove}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeInvestor(inv.id)
                  }}
                  aria-label={`Remove ${inv.name}`}
                >
                  <LuX size={12} />
                </button>
              </span>
            ))}
            {selectedInvestors.length > 2 && (
              <span className={styles.triggerMore}>
                +{selectedInvestors.length - 2}
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

      {/* Dropdown panel */}
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={styles.panel}
            role='dialog'
            aria-label='Investor selector'
          >
            {/* Search */}
            <div className={styles.panelSearch}>
              <LuSearch size={14} className={styles.panelSearchIcon} />
              <input
                type='text'
                className={styles.panelSearchInput}
                placeholder='Search investors...'
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
                Type at least 3 characters to search
              </p>
            )}

            {/* Pre-filters */}
            <div className={styles.preFilters}>
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
                      className={styles.preFilterBackdrop}
                      onClick={() => setCountryDropdownOpen(false)}
                    />
                    <div className={styles.countryDropdown}>
                      {INVESTOR_COUNTRIES.map((c) => (
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

              {/* Type select */}
              <select
                className={styles.preFilterSelect}
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as InvestorType | '')
                }
              >
                <option value=''>Type</option>
                <option value='pension'>Asset Owner</option>
                <option value='investment'>Asset Manager</option>
              </select>

              {/* Network select */}
              <select
                className={styles.preFilterSelect}
                value={networkFilter}
                onChange={(e) =>
                  setNetworkFilter(e.target.value as InvestorNetwork | '')
                }
              >
                <option value=''>Network</option>
                {INVESTOR_NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Virtualized results list */}
            <div className={styles.resultsList} ref={listRef}>
              {filtered.length === 0 ? (
                <p className={styles.noResults}>
                  {showHint
                    ? 'Start typing to search investors'
                    : 'No investors match your filters'}
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
                    const inv = filtered[virtualRow.index]
                    const isSelected = selected.includes(inv.id)
                    return (
                      <button
                        key={inv.id}
                        className={`${styles.resultItem} ${isSelected ? styles.resultItemSelected : ''}`}
                        onClick={() => toggleInvestor(inv.id)}
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
                          <span className={styles.resultName}>{inv.name}</span>
                          <span className={styles.resultMeta}>
                            {inv.country} ·{' '}
                            {inv.type === 'pension'
                              ? 'Asset Owner'
                              : 'Asset Manager'}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Selected summary */}
            {selectedInvestors.length > 0 && (
              <div className={styles.selectedSummary}>
                <span className={styles.selectedCount}>
                  {selectedInvestors.length} selected
                </span>
                <div className={styles.selectedChips}>
                  {selectedInvestors.map((inv) => (
                    <span key={inv.id} className={styles.selectedChip}>
                      {inv.name}
                      <button
                        className={styles.selectedChipRemove}
                        onClick={() => removeInvestor(inv.id)}
                        aria-label={`Remove ${inv.name}`}
                      >
                        <LuX size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer actions */}
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
