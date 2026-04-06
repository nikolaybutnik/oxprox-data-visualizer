import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import styles from './ScrollFade.module.scss'

interface ScrollFadeProps {
  children: ReactNode
  enabled?: boolean
}

function ScrollFade({ children, enabled }: ScrollFadeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const update = useCallback(() => {
    // Find the first child with overflow (the scrollable .body div)
    const el = wrapperRef.current?.querySelector<HTMLElement>('[class*="body"]')
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = wrapperRef.current?.querySelector<HTMLElement>('[class*="body"]')
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled, update])

  if (!enabled) return <>{children}</>

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {canScrollLeft && <div className={`${styles.fade} ${styles.fadeLeft}`} />}
      {canScrollRight && (
        <div className={`${styles.fade} ${styles.fadeRight}`} />
      )}
      {children}
    </div>
  )
}

export default ScrollFade
