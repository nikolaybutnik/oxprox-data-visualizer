import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import {
  ResponsiveRadar,
  type RadarSliceTooltipProps,
  type RadarCustomLayerProps,
} from '@nivo/radar'
import { nivoTheme } from '../../styles/nivoTheme'
import { voteColors, investorColors, colors } from '../../styles/colors'
import type { RadarDatum } from '../../data/transforms'
import type { VoteValue } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
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

  // Tracks which investors are hidden. Empty set = all visible (default).
  const [disabled, setDisabled] = useState<Set<string>>(new Set())

  // Reset to all-visible whenever the dataset changes (keys reference changes)
  useEffect(() => {
    setDisabled(new Set())
  }, [keys])

  const activeKeys = useMemo(
    () => keys.filter((k) => !disabled.has(k)),
    [keys, disabled],
  )

  const allEnabled = disabled.size === 0

  const toggleInvestor = useCallback(
    (key: string) => {
      setDisabled((prev) => {
        // Prevent deselecting the last visible investor
        if (!prev.has(key) && keys.filter((k) => !prev.has(k)).length === 1)
          return prev
        const next = new Set(prev)
        next.has(key) ? next.delete(key) : next.add(key)
        return next
      })
    },
    [keys],
  )

  const selectAll = useCallback(() => setDisabled(new Set()), [])

  const renderTooltip = useCallback(
    (props: RadarSliceTooltipProps) => <RadarTooltip {...props} />,
    [],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Voting Profile by Investor</h2>
        <p className={styles.description}>
          Each investor's polygon encodes their overall voting personality. A
          large, regular shape signals consistent ESG alignment; a compact or
          irregular shape reveals a more selective approach. Designed for peer
          comparison and manager profiling.
        </p>
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
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveRadar
            key={activeKeys.join(',')}
            data={data}
            keys={activeKeys}
            indexBy='resolution'
            maxValue={3}
            colors={({ key }) =>
              investorColors[keys.indexOf(key as string)] ?? investorColors[0]
            }
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
      </div>
    </div>
  )
}

export default memo(RadarChart)
