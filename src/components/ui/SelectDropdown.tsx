import { useState, useRef, useEffect } from 'react'
import { LuChevronDown, LuCheck } from 'react-icons/lu'
import styles from './SelectDropdown.module.scss'

interface Option {
  label: string
  value: string
}

interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export default function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = 'All',
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const allOptions: Option[] = [{ label: placeholder, value: '' }, ...options]
  const selected = allOptions.find((o) => o.value === value)

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(!open)}
        type='button'
      >
        <span className={styles.triggerLabel}>
          {selected?.label || placeholder}
        </span>
        <span
          className={`${styles.triggerArrow} ${open ? styles.triggerArrowOpen : ''}`}
        >
          <LuChevronDown size={14} />
        </span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {allOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.option} ${value === opt.value ? styles.optionActive : ''}`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              <span className={styles.optionLabel}>{opt.label}</span>
              {value === opt.value && (
                <LuCheck size={13} className={styles.optionCheck} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
