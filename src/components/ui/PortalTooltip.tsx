import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

interface PortalTooltipProps {
  children: ReactNode
}

// Track mouse position globally so it's available immediately on mount
let mouseX = -9999
let mouseY = -9999

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
}

function PortalTooltip({ children }: PortalTooltipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: mouseX, y: mouseY })
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Measure once after first paint, then mark as ready
  useLayoutEffect(() => {
    if (!measured && ref.current) setMeasured(true)
  })

  const w = ref.current?.offsetWidth ?? 0
  const h = ref.current?.offsetHeight ?? 0

  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: pos.x - w / 2,
        top: pos.y - h - 12,
        zIndex: 1000,
        pointerEvents: 'none',
        visibility: measured ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

export default PortalTooltip
