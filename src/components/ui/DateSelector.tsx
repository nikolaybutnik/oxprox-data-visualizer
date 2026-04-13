import { useState, useRef, useEffect } from 'react'
import { LuCalendarDays, LuChevronDown, LuX } from 'react-icons/lu'
import styles from './DateSelector.module.scss'

const PROXY_PERIODS = Array.from({ length: 10 }, (_, i) => {
  const start = 2017 + i
  return {
    label: `${start} – ${start + 1}`,
    from: `${start}-07-01`,
    to: `${start + 1}-06-30`,
  }
})

interface DateSelectorProps {
  dateFrom: string
  dateTo: string
  onChangeFrom: (v: string) => void
  onChangeTo: (v: string) => void
}

export default function DateSelector({
  dateFrom,
  dateTo,
  onChangeFrom,
  onChangeTo,
}: DateSelectorProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

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

  // Figure out which proxy period matches (if any)
  const activeProxy = PROXY_PERIODS.find(
    (p) => p.from === dateFrom && p.to === dateTo,
  )

  const hasValue = dateFrom || dateTo

  const displayText = activeProxy
    ? activeProxy.label
    : dateFrom && dateTo
      ? `${dateFrom} to ${dateTo}`
      : dateFrom
        ? `From ${dateFrom}`
        : dateTo
          ? `To ${dateTo}`
          : ''

  const clear = () => {
    onChangeFrom('')
    onChangeTo('')
  }

  return (
    <div className={styles.wrapper}>
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
          <LuCalendarDays size={15} />
        </span>
        {hasValue ? (
          <span className={styles.triggerValue}>{displayText}</span>
        ) : (
          <span className={styles.triggerPlaceholder}>
            Select date range...
          </span>
        )}
        {hasValue && (
          <button
            className={styles.triggerClear}
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            aria-label='Clear date'
          >
            <LuX size={13} />
          </button>
        )}
        <span
          className={`${styles.triggerArrow} ${open ? styles.triggerArrowOpen : ''}`}
        >
          <LuChevronDown size={16} />
        </span>
      </div>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={styles.panel}
            role='dialog'
            aria-label='Date selector'
          >
            {/* Mobile close header */}
            <div className={styles.panelMobileHeader}>
              <span className={styles.panelMobileTitle}>
                Meeting Date Range
              </span>
              <button
                className={styles.panelMobileClose}
                onClick={() => setOpen(false)}
                aria-label='Close'
              >
                <LuX size={18} />
              </button>
            </div>
            {/* Proxy periods */}
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Proxy Period</span>
              <div className={styles.periodGrid}>
                {PROXY_PERIODS.map((p) => (
                  <button
                    key={p.label}
                    className={`${styles.periodBtn} ${activeProxy?.label === p.label ? styles.periodBtnActive : ''}`}
                    onClick={() => {
                      onChangeFrom(p.from)
                      onChangeTo(p.to)
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Custom range */}
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Custom Range</span>
              <div className={styles.customRange}>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>From</label>
                  <input
                    type='date'
                    className={styles.dateInput}
                    value={dateFrom}
                    onChange={(e) => onChangeFrom(e.target.value)}
                  />
                </div>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>To</label>
                  <input
                    type='date'
                    className={styles.dateInput}
                    value={dateTo}
                    onChange={(e) => onChangeTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.panelFooter}>
              <button
                className={styles.footerBtnSecondary}
                onClick={clear}
                disabled={!hasValue}
              >
                Clear
              </button>
              <button
                className={styles.footerBtnPrimary}
                onClick={() => setOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
