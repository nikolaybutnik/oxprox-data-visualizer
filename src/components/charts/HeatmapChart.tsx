import { memo, useCallback, useRef, useMemo, useState } from 'react'
import {
  ResponsiveHeatMap,
  type LayerId,
  type CustomLayer,
} from '@nivo/heatmap'
import { useTooltip } from '@nivo/tooltip'
import { nivoTheme } from '../../styles/nivoTheme'
import {
  voteColors,
  esgColors,
  esgLabels,
  voteLegendItems,
} from '../../styles/colors'
import type { HeatmapDatum, HeatmapCell } from '../../data/transforms'
import type { EsgCategory, VoteValue } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
import Legend from '../ui/Legend'
import { getHeatmapMargin, getHeatmapAxisTop } from './HeatmapChart.config'
import styles from './HeatmapChart.module.scss'

interface HeatmapChartProps {
  data: HeatmapDatum[]
  esgMap: Record<string, EsgCategory>
}

type LayerCell = {
  x: number
  y: number
  width: number
  height: number
  serieId: string
  data: HeatmapCell & { x: string }
}

// Tooltip content — defined outside to keep reference stable
function HeatmapTooltipContent({
  serieId,
  investor,
  vote,
}: {
  serieId: string
  investor: string
  vote: VoteValue
}) {
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipResolution}>{serieId}</p>
      <p className={styles.tooltipInvestor}>{investor}</p>
      <p className={styles.tooltipVote} style={{ color: voteColors[vote] }}>
        {vote}
      </p>
    </div>
  )
}

// Cell layer — proper React component so useTooltip (a hook) is valid here.
// Rendered inside Nivo's TooltipProvider, so showTooltipFromEvent works identically
// to how ResponsiveBar uses it internally for its own tooltips.
function HeatmapCellLayer({ cells }: { cells: LayerCell[] }) {
  const { showTooltipFromEvent, hideTooltip } = useTooltip()
  return (
    <g>
      {cells.map((cell) => {
        const vote = cell.data.vote
        return (
          <rect
            key={`${cell.serieId}.${cell.data.x}`}
            x={cell.x - cell.width / 2 + 2}
            y={cell.y - cell.height / 2 + 2}
            width={Math.max(0, cell.width - 4)}
            height={Math.max(0, cell.height - 4)}
            rx={4}
            fill={voteColors[vote]}
            fillOpacity={0.9}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) =>
              showTooltipFromEvent(
                <HeatmapTooltipContent
                  serieId={cell.serieId}
                  investor={cell.data.x}
                  vote={vote}
                />,
                e,
              )
            }
            onMouseLeave={hideTooltip}
          />
        )
      })}
    </g>
  )
}

const HEATMAP_LAYERS: (LayerId | CustomLayer<HeatmapCell>)[] = [
  'grid',
  'axes',
  HeatmapCellLayer as CustomLayer<HeatmapCell>,
  'legends',
  'annotations',
]

interface EsgTooltipState {
  x: number
  y: number
  category: EsgCategory
}

function HeatmapChart({ data, esgMap }: HeatmapChartProps) {
  const isMobile = useIsMobile()
  const chartRef = useRef<HTMLDivElement>(null)
  const [esgTooltip, setEsgTooltip] = useState<EsgTooltipState | null>(null)

  const showEsgTooltip = useCallback(
    (category: EsgCategory, clientX: number, clientY: number) => {
      const container = chartRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      setEsgTooltip({
        x: clientX - rect.left,
        y: clientY - rect.top - 12,
        category,
      })
    },
    [],
  )

  const hideEsgTooltip = useCallback(() => setEsgTooltip(null), [])

  const renderYTick = useCallback(
    ({ x, y, value }: { x: number; y: number; value: string }) => {
      const category = esgMap[value]
      const words = value.split(' ')
      const hasTwoLines = isMobile && words.length > 1

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={isMobile ? -20 : -24}
            textAnchor='end'
            dominantBaseline='central'
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: isMobile ? 10 : 11,
              fill: '#66625E',
            }}
          >
            {hasTwoLines ? (
              <>
                <tspan x={-20} dy='-0.5em'>
                  {words[0]}
                </tspan>
                <tspan x={-20} dy='1.2em'>
                  {words.slice(1).join(' ')}
                </tspan>
              </>
            ) : (
              value
            )}
          </text>
          {category && (
            <g
              transform={`translate(${isMobile ? -8 : -12}, 0)`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) =>
                showEsgTooltip(category, e.clientX, e.clientY)
              }
              onMouseLeave={hideEsgTooltip}
            >
              <circle r={isMobile ? 6 : 8} fill={esgColors[category]} />
              <text
                textAnchor='middle'
                dominantBaseline='central'
                fill='white'
                fontSize={isMobile ? 7 : 9}
                fontWeight={700}
                fontFamily="'IBM Plex Sans', sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {category}
              </text>
            </g>
          )}
        </g>
      )
    },
    [isMobile, esgMap, showEsgTooltip, hideEsgTooltip],
  )

  const axisLeftConfig = useMemo(
    () => ({
      tickSize: 0,
      tickPadding: 20,
      legend: 'Resolution',
      legendPosition: 'middle' as const,
      legendOffset: isMobile ? -72 : -154,
      renderTick: renderYTick,
    }),
    [isMobile, renderYTick],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Investor Voting Heatmap</h2>
        <p className={styles.description}>
          Every investor's exact position on every resolution, in a single view. Cell colour makes it
          effortless to spot alignment clusters and outliers without requiring any interaction — built
          for rapid pattern recognition across the portfolio.
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.chart} ref={chartRef}>
          <ResponsiveHeatMap
            data={data}
            margin={getHeatmapMargin(isMobile)}
            theme={nivoTheme}
            animate={false}
            layers={HEATMAP_LAYERS}
            axisTop={getHeatmapAxisTop(isMobile)}
            axisLeft={axisLeftConfig}
            axisBottom={null}
            axisRight={null}
            enableLabels={false}
          />

          {esgTooltip && (
            <div
              className={styles.esgTooltip}
              style={{ left: esgTooltip.x, top: esgTooltip.y }}
            >
              <span
                className={styles.esgDot}
                style={{ background: esgColors[esgTooltip.category] }}
              />
              {esgLabels[esgTooltip.category]}
            </div>
          )}
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

export default memo(HeatmapChart)
