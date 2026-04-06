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
import ScrollFade from '../ui/ScrollFade'
import PortalTooltip from '../ui/PortalTooltip'
import styles from './RadarChart.module.scss'

interface RadarChartProps {
  data: RadarDatum[]
  keys: string[]
  wide?: boolean
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
          fontFamily={nivoTheme.text.fontFamily}
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
    <PortalTooltip>
      <div className={styles.tooltip}>
        <p className={styles.tooltipResolution}>{index}</p>
        {data.map(({ id, color, value }) => {
          const vote = VALUE_TO_VOTE[value]
          return (
            <p key={id} className={styles.tooltipRow}>
              <span
                className={styles.tooltipDot}
                style={{ background: color }}
              />
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
    </PortalTooltip>
  )
}

function RadarChart({ data, keys, wide }: RadarChartProps) {
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
    <div className={styles.wrapper} data-wide={wide}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Investor Voting Profiles
          <span className={styles.subtitle}>Across All Resolutions</span>
        </h2>
        <p className={styles.description}>
          Each polygon represents one investor's voting behaviour across all
          resolutions. A regular shape suggests consistent voting behaviour,
          while an uneven shape means they were more selective. Hover over a
          resolution spoke to see how each investor voted. Use the pills below
          to compare specific investors side by side.
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
      <ScrollFade enabled={wide}>
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
      </ScrollFade>
    </div>
  )
}

export default memo(RadarChart)
