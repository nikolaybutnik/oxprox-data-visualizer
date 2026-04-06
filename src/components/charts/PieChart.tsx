import { memo, useCallback, useMemo } from 'react'
import { ResponsivePie, type PieTooltipProps } from '@nivo/pie'
import { nivoTheme } from '../../styles/nivoTheme'
import { voteColors, voteLegendItems } from '../../styles/colors'
import PortalTooltip from '../ui/PortalTooltip'
import type { PieDatum } from '../../data/transforms'
import useIsMobile from '../../hooks/useIsMobile'
import Legend from '../ui/Legend'
import { getPieChartMargin } from './PieChart.config'
import styles from './PieChart.module.scss'

interface PieChartProps {
  data: PieDatum[]
  wide?: boolean
}

function PieTooltip({
  datum,
  total,
}: PieTooltipProps<PieDatum> & { total: number }) {
  const vote = datum.id
  const percentage = Math.round((datum.value / total) * 100)
  return (
    <PortalTooltip>
      <div className={styles.tooltip}>
        <p className={styles.tooltipVote} style={{ color: voteColors[vote] }}>
          {vote}
        </p>
        <p className={styles.tooltipCount}>
          {datum.value} {datum.value === 1 ? 'vote' : 'votes'} ({percentage}%)
        </p>
      </div>
    </PortalTooltip>
  )
}

function PieChart({ data, wide }: PieChartProps) {
  const isMobile = useIsMobile()

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])

  const renderTooltip = useCallback(
    (props: PieTooltipProps<PieDatum>) => (
      <PieTooltip {...props} total={total} />
    ),
    [total],
  )

  const arcLabel = useCallback(
    (d: { value: number }) => `${Math.round((d.value / total) * 100)}%`,
    [total],
  )

  return (
    <div className={styles.wrapper} data-wide={wide}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Aggregate Voting Sentiment
          <span className={styles.subtitle}>Across All Resolutions</span>
        </h2>
        <p className={styles.description}>
          A top-level view of the overall For / Against / Abstain balance across
          every proposal. If one slice dominates, sentiment is clear. If the
          ring is fairly even, there's genuine disagreement in the portfolio.
          Hover over a slice to see the exact count and percentage.
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsivePie
            data={data}
            colors={({ id }) => voteColors[id]}
            innerRadius={0.55}
            padAngle={2}
            cornerRadius={3}
            margin={getPieChartMargin(isMobile)}
            theme={nivoTheme}
            animate={false}
            enableArcLinkLabels={false}
            arcLabel={arcLabel}
            arcLabelsSkipAngle={15}
            arcLabelsTextColor='white'
            tooltip={renderTooltip}
          />
        </div>
        <div className={styles.legend}>
          <Legend
            items={voteLegendItems}
            direction={isMobile ? 'row' : 'column'}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(PieChart)
