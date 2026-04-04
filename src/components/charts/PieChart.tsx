import { memo, useCallback, useMemo } from 'react'
import { ResponsivePie, type PieTooltipProps } from '@nivo/pie'
import { nivoTheme } from '../../styles/nivoTheme'
import { voteColors } from '../../styles/colors'
import type { PieDatum } from '../../data/transforms'
import useIsMobile from '../../hooks/useIsMobile'
import VoteLegend from '../ui/VoteLegend'
import { getPieChartMargin } from './PieChart.config'
import styles from './PieChart.module.scss'

interface PieChartProps {
  data: PieDatum[]
}

function PieTooltip({
  datum,
  total,
}: PieTooltipProps<PieDatum> & { total: number }) {
  const vote = datum.id
  const percentage = Math.round((datum.value / total) * 100)
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipVote} style={{ color: voteColors[vote] }}>
        {vote}
      </p>
      <p className={styles.tooltipCount}>
        {datum.value} {datum.value === 1 ? 'vote' : 'votes'} ({percentage}%)
      </p>
    </div>
  )
}

function PieChart({ data }: PieChartProps) {
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
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Overall Vote Distribution</h2>
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
          <VoteLegend direction={isMobile ? 'row' : 'column'} />
        </div>
      </div>
    </div>
  )
}

export default memo(PieChart)
