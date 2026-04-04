import { lazy, Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type {
  BarDatum,
  BarVotersMap,
  HeatmapDatum,
  PieDatum,
  RadarDatum,
  ChordData,
} from '../../data/transforms'
import type { EsgCategory } from '../../data/types'
import BarChart from '../charts/BarChart'
import styles from './ChartToggle.module.scss'

// Lazy-loaded chart components — only rendered on demand via Suspense.
const HeatmapChart = lazy(() => import('../charts/HeatmapChart'))
const PieChart = lazy(() => import('../charts/PieChart'))
const RadarChart = lazy(() => import('../charts/RadarChart'))
const ChordChart = lazy(() => import('../charts/ChordChart'))

// Eagerly prefetch every chart chunk so they're already cached (or in-flight)
// by the time the user switches tabs. `void` discards the promise — nothing blocks.
void import('../charts/HeatmapChart')
void import('../charts/PieChart')
void import('../charts/RadarChart')
void import('../charts/ChordChart')

const CHARTS = [
  { id: 'bar', label: 'Votes by Resolution' },
  { id: 'heatmap', label: 'Voting Grid' },
  { id: 'pie', label: 'Distribution' },
  { id: 'radar', label: 'Profiles' },
  { id: 'chord', label: 'Agreements' },
] as const

type ChartId = (typeof CHARTS)[number]['id']

interface ChordVariant {
  data: ChordData
  resolutionCount: number
  resolutionLabels: string[]
}

interface ChartToggleProps {
  barData: BarDatum[]
  votersMap: BarVotersMap
  esgMap: Record<string, EsgCategory>
  heatmapData: HeatmapDatum[]
  pieData: PieDatum[]
  radarData: RadarDatum[]
  radarKeys: string[]
  chordVariants: Record<'all' | EsgCategory, ChordVariant>
}

function ChevronLeft() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
      <path
        d='M10 4L6 8L10 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
      <path
        d='M6 4L10 8L6 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function ChartToggle({
  barData,
  votersMap,
  esgMap,
  heatmapData,
  pieData,
  radarData,
  radarKeys,
  chordVariants,
}: ChartToggleProps) {
  const [activeTab, setActiveTab] = useState<ChartId>('bar')

  const navRef = useRef<HTMLElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    setCanScrollLeft(nav.scrollLeft > 1)
    setCanScrollRight(nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 1)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    updateScrollState()
    nav.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState, { passive: true })
    return () => {
      nav.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollNav = useCallback((dir: 'left' | 'right') => {
    navRef.current?.scrollBy({
      left: dir === 'left' ? -140 : 140,
      behavior: 'smooth',
    })
  }, [])

  const handleTabClick = useCallback(
    (id: ChartId) => {
      if (id === activeTab) return
      setActiveTab(id)
    },
    [activeTab],
  )

  return (
    <div>
      <div className={styles.navWrapper}>
        {canScrollLeft && (
          <button
            className={styles.navArrow}
            data-dir='left'
            onClick={() => scrollNav('left')}
            aria-label='Scroll tabs left'
          >
            <ChevronLeft />
          </button>
        )}
        <nav ref={navRef} className={styles.nav} role='tablist'>
          {CHARTS.map((chart) => (
            <button
              key={chart.id}
              role='tab'
              aria-selected={activeTab === chart.id}
              className={styles.tab}
              data-active={activeTab === chart.id}
              onClick={() => handleTabClick(chart.id)}
            >
              {chart.label}
            </button>
          ))}
        </nav>
        {canScrollRight && (
          <button
            className={styles.navArrow}
            data-dir='right'
            onClick={() => scrollNav('right')}
            aria-label='Scroll tabs right'
          >
            <ChevronRight />
          </button>
        )}
      </div>

      <div className={styles.content}>
        <Suspense fallback={<div className={styles.loading} />}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'bar' && (
                <BarChart
                  data={barData}
                  votersMap={votersMap}
                  esgMap={esgMap}
                />
              )}
              {activeTab === 'heatmap' && (
                <HeatmapChart data={heatmapData} esgMap={esgMap} />
              )}
              {activeTab === 'pie' && <PieChart data={pieData} />}
              {activeTab === 'radar' && (
                <RadarChart data={radarData} keys={radarKeys} />
              )}
              {activeTab === 'chord' && <ChordChart variants={chordVariants} />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  )
}

export default ChartToggle
