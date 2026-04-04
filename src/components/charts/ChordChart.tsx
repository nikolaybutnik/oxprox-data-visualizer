import { memo, useCallback, useState } from 'react'
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
import Legend from '../ui/Legend'
import { getChordChartMargin } from './ChordChart.config'
import styles from './ChordChart.module.scss'

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
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel} style={{ color: arc.color }}>
        {arc.label}
      </p>
      <p className={styles.tooltipCount}>{arc.value} agreements with others</p>
    </div>
  )
}

function ChordChart({ variants }: ChordChartProps) {
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<EsgFilter>('all')

  const { data, resolutionCount } = variants[filter]
  const { matrix, keys } = data

  const investorItems = keys.map((label, i) => ({
    label,
    color: investorColors[i] ?? investorColors[0],
  }))

  const ribbonTooltip = useCallback(
    ({ ribbon }: RibbonTooltipComponentProps) => {
      const count = matrix[ribbon.source.index][ribbon.target.index]
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipPair}>
            {ribbon.source.id} · {ribbon.target.id}
          </p>
          <p className={styles.tooltipCount}>
            Agreed on {count} of {resolutionCount} resolution
            {resolutionCount !== 1 ? 's' : ''}
          </p>
        </div>
      )
    },
    [matrix, resolutionCount],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Investor Agreement</h2>
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
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveChord
            key={filter}
            data={matrix}
            keys={keys}
            colors={({ index }) => investorColors[index] ?? investorColors[0]}
            margin={getChordChartMargin(isMobile)}
            padAngle={0.02}
            innerRadiusRatio={0.82}
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
            labelOffset={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            theme={nivoTheme}
            animate={false}
            arcTooltip={ArcTooltip}
            ribbonTooltip={ribbonTooltip}
          />
        </div>
        <div className={styles.legend}>
          <ul className={styles.resolutions}>
            {variants[filter].resolutionLabels.map((label) => (
              <li key={label} className={styles.resolutionItem}>
                {label}
              </li>
            ))}
          </ul>
          <Legend
            items={investorItems}
            direction={isMobile ? 'row' : 'column'}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(ChordChart)
