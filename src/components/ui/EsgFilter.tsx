import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'
import { LuChevronDown, LuSearch } from 'react-icons/lu'
import { ESG_GROUPS } from '../../data/esgIssues'
import styles from './EsgFilter.module.scss'

interface EsgFilterProps {
  selected: string[]
  onChange: (issues: string[]) => void
}

export default function EsgFilter({ selected, onChange }: EsgFilterProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [pos, setPos] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Position the portal dropdown synchronously to avoid flash
  useLayoutEffect(() => {
    if (!open || isMobile || !triggerRef.current) {
      setPos(null)
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 280),
    })
  }, [open, isMobile])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
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

  const filteredGroups = useMemo(() => {
    if (!search) return ESG_GROUPS
    const q = search.toLowerCase()
    return ESG_GROUPS.map((g) => ({
      ...g,
      issues: g.issues.filter((i) => i.toLowerCase().includes(q)),
    })).filter((g) => g.issues.length > 0)
  }, [search])

  const toggleIssue = useCallback(
    (issue: string) => {
      onChange(
        selected.includes(issue)
          ? selected.filter((s) => s !== issue)
          : [...selected, issue],
      )
    },
    [selected, onChange],
  )

  const toggleGroup = useCallback(
    (issues: string[]) => {
      const allSelected = issues.every((i) => selected.includes(i))
      if (allSelected) {
        onChange(selected.filter((s) => !issues.includes(s)))
      } else {
        onChange([...new Set([...selected, ...issues])])
      }
    },
    [selected, onChange],
  )

  const label = selected.length === 0 ? 'All' : `${selected.length} selected`

  const dropdownContent = (
    <>
      <div className={styles.searchWrap}>
        <LuSearch size={12} className={styles.searchIcon} />
        <input
          type='text'
          className={styles.searchInput}
          placeholder='Search issues...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {selected.length > 0 && (
        <button className={styles.clearBtn} onClick={() => onChange([])}>
          Clear all
        </button>
      )}
      <div className={styles.list}>
        {filteredGroups.map((group) => {
          const allChecked = group.issues.every((i) => selected.includes(i))
          const someChecked =
            !allChecked && group.issues.some((i) => selected.includes(i))
          return (
            <div key={group.group} className={styles.group}>
              <div className={styles.groupHeader}>
                <label className={styles.groupLabel}>
                  <input
                    type='checkbox'
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked
                    }}
                    onChange={() => toggleGroup(group.issues)}
                  />
                  <span className={styles.groupName}>{group.group}</span>
                </label>
              </div>
              {group.issues.map((issue) => (
                <label key={issue} className={styles.issueOption}>
                  <input
                    type='checkbox'
                    checked={selected.includes(issue)}
                    onChange={() => toggleIssue(issue)}
                  />
                  <span>{issue}</span>
                </label>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        type='button'
      >
        <span className={styles.triggerLabel}>{label}</span>
        <span
          className={`${styles.triggerArrow} ${open ? styles.triggerArrowOpen : ''}`}
        >
          <LuChevronDown size={14} />
        </span>
      </button>

      {/* Mobile: render inline (sidebar drawer handles overflow) */}
      {open && isMobile && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {dropdownContent}
        </div>
      )}

      {/* Desktop: portal to body to escape sidebar overflow clipping */}
      {open &&
        !isMobile &&
        pos &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdown}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {dropdownContent}
          </div>,
          document.body,
        )}
    </div>
  )
}
