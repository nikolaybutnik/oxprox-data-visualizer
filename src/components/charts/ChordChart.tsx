import { memo, useCallback } from 'react'
import {
  ResponsiveChord,
  type ArcTooltipComponentProps,
  type RibbonTooltipComponentProps,
} from '@nivo/chord'
import { nivoTheme } from '../../styles/nivoTheme'
import { investorColors } from '../../styles/colors'
import type { ChordData } from '../../data/transforms'
import useIsMobile from '../../hooks/useIsMobile'
import Legend from '../ui/Legend'
import { getChordChartMargin } from './ChordChart.config'
import styles from './ChordChart.module.scss'

interface ChordChartProps {
  data: ChordData
  resolutionCount: number
}

// Arc tooltip — shown when hovering an investor's arc segment
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

function ChordChart({ data, resolutionCount }: ChordChartProps) {
  const { matrix, keys } = data
  const isMobile = useIsMobile()

  const investorItems = keys.map((label, i) => ({
    label,
    color: investorColors[i] ?? investorColors[0],
  }))

  // Ribbon tooltip — captures matrix for pairwise count lookup
  const ribbonTooltip = useCallback(
    ({ ribbon }: RibbonTooltipComponentProps) => {
      const count = matrix[ribbon.source.index][ribbon.target.index]
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipPair}>
            {ribbon.source.id} · {ribbon.target.id}
          </p>
          <p className={styles.tooltipCount}>
            Agreed on {count} of {resolutionCount} resolutions
          </p>
        </div>
      )
    },
    [matrix, resolutionCount],
  )

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Investor Agreement</h2>
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveChord
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
            labelOffset={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            theme={nivoTheme}
            animate={false}
            arcTooltip={ArcTooltip}
            ribbonTooltip={ribbonTooltip}
          />
        </div>
        <div className={styles.legend}>
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
