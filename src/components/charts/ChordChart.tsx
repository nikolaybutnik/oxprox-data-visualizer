import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ResponsiveChord,
  type ArcTooltipComponentProps,
  type RibbonTooltipComponentProps,
} from '@nivo/chord'
import { nivoTheme } from '../../styles/nivoTheme'
import { investorColors, esgColors, colors } from '../../styles/colors'
import type { ChordData } from '../../data/transforms'
import type { EsgCategory } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
import {
  getChordChartMargin,
  getChordLabelOffset,
  getChordInnerRadiusRatio,
  getChordLabelFontSize,
} from './ChordChart.config'
import styles from './ChordChart.module.scss'
import ScrollFade from '../ui/ScrollFade'
import PortalTooltip from '../ui/PortalTooltip'

interface ChordVariant {
  data: ChordData
  resolutionCount: number
  resolutionLabels: string[]
}

interface ChordChartProps {
  variants: {
    all: ChordVariant
    E: ChordVariant
    S: ChordVariant
    G: ChordVariant
  }
  wide?: boolean
}

type EsgFilter = 'all' | EsgCategory

const TABS: { value: EsgFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: colors.navy },
  { value: 'E', label: 'E', color: esgColors.E },
  { value: 'S', label: 'S', color: esgColors.S },
  { value: 'G', label: 'G', color: esgColors.G },
]

function ArcTooltip({ arc }: ArcTooltipComponentProps) {
  return (
    <PortalTooltip>
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel} style={{ color: arc.color }}>
          {arc.label}
        </p>
        <p className={styles.tooltipCount}>
          {arc.value} agreements with others
        </p>
      </div>
    </PortalTooltip>
  )
}

function ChordChart({ variants, wide }: ChordChartProps) {
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<EsgFilter>('all')
  const [disabled, setDisabled] = useState<Set<string>>(new Set())

  const chordTheme = useMemo(
    () => ({
      ...nivoTheme,
      labels: {
        text: { ...nivoTheme.text, fontSize: getChordLabelFontSize(isMobile) },
      },
    }),
    [isMobile],
  )

  const { data, resolutionCount } = variants[filter]
  const { matrix, keys } = data
  const investorSignature = keys.join('\0')

  // Reset investor selection when ESG tab changes or dataset switches
  useEffect(() => {
    setDisabled(new Set())
  }, [filter, investorSignature])

  // Derive filtered matrix and keys, preserving original indices for colour lookup
  const { activeKeys, activeMatrix } = useMemo(() => {
    const idx = keys
      .map((k, i) => ({ k, i }))
      .filter(({ k }) => !disabled.has(k))
    return {
      activeKeys: idx.map(({ k }) => k),
      activeMatrix: idx.map(({ i: r }) => idx.map(({ i: c }) => matrix[r][c])),
    }
  }, [keys, matrix, disabled])

  const allEnabled = disabled.size === 0
  const hasAgreements = activeMatrix.some((row) => row.some((v) => v > 0))

  const toggleInvestor = useCallback(
    (key: string) => {
      setDisabled((prev) => {
        if (!prev.has(key) && keys.filter((k) => !prev.has(k)).length <= 2)
          return prev
        const next = new Set(prev)
        next.has(key) ? next.delete(key) : next.add(key)
        return next
      })
    },
    [keys],
  )

  const selectAll = useCallback(() => setDisabled(new Set()), [])

  const ribbonTooltip = useCallback(
    ({ ribbon }: RibbonTooltipComponentProps) => {
      // source/target indices are positions in the filtered activeMatrix
      const count =
        activeMatrix[ribbon.source.index]?.[ribbon.target.index] ?? 0
      return (
        <PortalTooltip>
          <div className={styles.tooltip}>
            <p className={styles.tooltipPair}>
              {ribbon.source.id} · {ribbon.target.id}
            </p>
            <p className={styles.tooltipCount}>
              Agreed on {count} of {resolutionCount} resolution
              {resolutionCount !== 1 ? 's' : ''}
            </p>
          </div>
        </PortalTooltip>
      )
    },
    [activeMatrix, resolutionCount],
  )

  return (
    <div className={styles.wrapper} data-wide={wide}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Investor Voting Alignment
          <span className={styles.subtitle}>By ESG Category</span>
        </h2>
        <p className={styles.description}>
          Ribbons connect investors who voted the same way. The thicker the
          ribbon, the more resolutions they agreed on. This makes it easy to
          spot voting blocs and outliers. Use the E / S / G tabs to see whether
          alignment holds across categories, and toggle individual investors to
          focus on specific pairs.
        </p>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>ESG Category</span>
          <div className={styles.tabs} role='tablist'>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                role='tab'
                aria-selected={filter === tab.value}
                className={styles.tab}
                style={{ '--tab-color': tab.color } as CSSProperties}
                data-active={filter === tab.value}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
                <span className={styles.tabCount}>
                  {variants[tab.value].resolutionCount}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Investors</span>
          <div className={styles.filters}>
            <button
              className={styles.filterBtn}
              data-active={allEnabled}
              style={{ '--filter-color': colors.navy } as CSSProperties}
              onClick={selectAll}
            >
              All
            </button>
            {keys.map((key, i) => (
              <button
                key={key}
                className={styles.filterBtn}
                data-active={!disabled.has(key)}
                style={
                  {
                    '--filter-color': investorColors[i] ?? investorColors[0],
                  } as CSSProperties
                }
                onClick={() => toggleInvestor(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ScrollFade enabled={wide}>
        <div className={styles.body}>
          <div className={styles.chart}>
            {!hasAgreements ? (
              <div className={styles.empty}>
                No shared votes for these filters
              </div>
            ) : (
              <ResponsiveChord
                key={`${filter}-${activeKeys.join(',')}`}
                data={activeMatrix}
                keys={activeKeys}
                colors={({ id }) =>
                  investorColors[keys.indexOf(id as string)] ??
                  investorColors[0]
                }
                margin={getChordChartMargin(isMobile)}
                padAngle={0.02}
                innerRadiusRatio={getChordInnerRadiusRatio(isMobile)}
                innerRadiusOffset={0.02}
                arcOpacity={0.9}
                activeArcOpacity={1}
                inactiveArcOpacity={0.4}
                arcBorderWidth={1}
                arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                ribbonOpacity={0.5}
                activeRibbonOpacity={0.75}
                inactiveRibbonOpacity={0.1}
                enableLabel={true}
                label={(arc) => (arc.value > 0 ? arc.id : '')}
                labelOffset={getChordLabelOffset(isMobile)}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                theme={chordTheme}
                animate={false}
                arcTooltip={ArcTooltip}
                ribbonTooltip={ribbonTooltip}
              />
            )}
          </div>
          <div className={styles.legend}>
            <ul className={styles.resolutions}>
              {variants[filter].resolutionLabels.map((label) => (
                <li key={label} className={styles.resolutionItem}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollFade>
    </div>
  )
}

export default memo(ChordChart)
