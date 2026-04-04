import { memo, useCallback } from 'react'
import {
  ResponsiveRadar,
  type RadarSliceTooltipProps,
  type RadarCustomLayerProps,
} from '@nivo/radar'
import { nivoTheme } from '../../styles/nivoTheme'
import { voteColors, investorColors } from '../../styles/colors'
import type { RadarDatum } from '../../data/transforms'
import type { VoteValue } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
import Legend from '../ui/Legend'
import { getRadarChartMargin } from './RadarChart.config'
import styles from './RadarChart.module.scss'

interface RadarChartProps {
  data: RadarDatum[]
  keys: string[]
}

const VALUE_TO_VOTE: Record<number, VoteValue> = {
  1: 'Against',
  2: 'Abstain',
  3: 'For',
}

const RING_LABELS = [
  { value: 1, label: 'Against', color: voteColors.Against },
  { value: 2, label: 'Abstain', color: voteColors.Abstain },
  { value: 3, label: 'For', color: voteColors.For },
]

// Custom layer that annotates each grid ring with its vote label
function GridRingLabels({
  centerX,
  centerY,
  radiusScale,
}: RadarCustomLayerProps<RadarDatum>) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      {RING_LABELS.map(({ value, label, color }) => (
        <text
          key={label}
          x={centerX + 5}
          y={centerY - radiusScale(value) + 4}
          fontSize={10}
          fontWeight={600}
          fontFamily="'IBM Plex Sans', sans-serif"
          fill={color}
          textAnchor='start'
        >
          {label}
        </text>
      ))}
    </g>
  )
}

const RADAR_LAYERS = [
  'grid',
  GridRingLabels,
  'layers',
  'slices',
  'dots',
  'legends',
] as const

function RadarTooltip({ index, data }: RadarSliceTooltipProps) {
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipResolution}>{index}</p>
      {data.map(({ id, color, value }) => {
        const vote = VALUE_TO_VOTE[value]
        return (
          <p key={id} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: color }} />
            <span className={styles.tooltipInvestor}>{id}</span>
            <span
              className={styles.tooltipVote}
              style={{ color: voteColors[vote] }}
            >
              {vote}
            </span>
          </p>
        )
      })}
    </div>
  )
}

function RadarChart({ data, keys }: RadarChartProps) {
  const isMobile = useIsMobile()

  const investorItems = keys.map((label, i) => ({
    label,
    color: investorColors[i] ?? investorColors[0],
  }))

  const renderTooltip = useCallback(
    (props: RadarSliceTooltipProps) => <RadarTooltip {...props} />,
    [],
  )

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Voting Profile by Investor</h2>
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveRadar
            data={data}
            keys={keys}
            indexBy='resolution'
            maxValue={3}
            colors={({ index }) => investorColors[index] ?? investorColors[0]}
            fillOpacity={0.25}
            borderWidth={3}
            gridLevels={3}
            gridShape='circular'
            dotSize={8}
            dotBorderWidth={2}
            dotBorderColor={{ theme: 'background' }}
            margin={getRadarChartMargin(isMobile)}
            theme={nivoTheme}
            animate={false}
            layers={RADAR_LAYERS}
            sliceTooltip={renderTooltip}
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

export default memo(RadarChart)

// claude --resume 992ea265-a7c2-4a0f-9eb0-2c21792d096a
