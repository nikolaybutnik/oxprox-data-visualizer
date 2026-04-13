import { useState, useMemo, useCallback } from 'react'
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

  return (
    <div className={styles.wrapper}>
      <button
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

      {open && (
        <div className={styles.dropdown}>
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
        </div>
      )}
    </div>
  )
}
