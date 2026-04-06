import { memo, useCallback, useRef, useMemo, useState } from 'react'
import {
  ResponsiveHeatMap,
  type LayerId,
  type CustomLayer,
} from '@nivo/heatmap'
import { nivoTheme } from '../../styles/nivoTheme'
import {
  colors,
  voteColors,
  esgColors,
  esgLabels,
  voteLegendItems,
} from '../../styles/colors'
import type { HeatmapDatum, HeatmapCell } from '../../data/transforms'
import type { EsgCategory, VoteValue } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
import Legend from '../ui/Legend'
import ScrollFade from '../ui/ScrollFade'
import PortalTooltip from '../ui/PortalTooltip'
import { getHeatmapMargin, getHeatmapAxisTop } from './HeatmapChart.config'
import styles from './HeatmapChart.module.scss'

interface HeatmapChartProps {
  data: HeatmapDatum[]
  esgMap: Record<string, EsgCategory>
  wide?: boolean
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
    <PortalTooltip>
      <div className={styles.tooltip}>
        <p className={styles.tooltipResolution}>{serieId}</p>
        <p className={styles.tooltipInvestor}>{investor}</p>
        <p className={styles.tooltipVote} style={{ color: voteColors[vote] }}>
          {vote}
        </p>
      </div>
    </PortalTooltip>
  )
}

// Cell layer — renders cells as plain SVG with portal tooltips.
function HeatmapCellLayer({ cells }: { cells: LayerCell[] }) {
  const [active, setActive] = useState<{
    serieId: string
    investor: string
    vote: VoteValue
  } | null>(null)

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
            onMouseEnter={() =>
              setActive({
                serieId: cell.serieId,
                investor: cell.data.x,
                vote,
              })
            }
            onMouseLeave={() => setActive(null)}
          />
        )
      })}
      {active && (
        <foreignObject width={0} height={0} overflow='visible'>
          <HeatmapTooltipContent
            serieId={active.serieId}
            investor={active.investor}
            vote={active.vote}
          />
        </foreignObject>
      )}
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

function HeatmapChart({ data, esgMap, wide }: HeatmapChartProps) {
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
              fontFamily: nivoTheme.text.fontFamily,
              fontSize: isMobile ? 10 : 11,
              fill: colors.stone,
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
              onMouseEnter={() => setEsgTooltip({ x: 0, y: 0, category })}
              onMouseLeave={hideEsgTooltip}
            >
              <circle r={isMobile ? 6 : 8} fill={esgColors[category]} />
              <text
                textAnchor='middle'
                dominantBaseline='central'
                fill='white'
                fontSize={isMobile ? 7 : 9}
                fontWeight={700}
                fontFamily={nivoTheme.text.fontFamily}
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

  const investorCount = data[0]?.data.length ?? 0

  const axisLeftConfig = useMemo(
    () => ({
      tickSize: 0,
      tickPadding: 20,
      legend: 'Resolution',
      legendPosition: 'middle' as const,
      legendOffset: isMobile ? (wide ? -100 : -72) : -154,
      renderTick: renderYTick,
    }),
    [isMobile, wide, renderYTick],
  )

  return (
    <div className={styles.wrapper} data-wide={wide}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Investor Voting Positions
          <span className={styles.subtitle}>By Resolution</span>
        </h2>
        <p className={styles.description}>
          A full grid of every investor's vote on every resolution. The colour
          of each cell shows the vote direction, so you can quickly scan for
          patterns: who tends to agree, and who's the outlier. Hover over any
          cell for full details.
        </p>
      </div>
      <ScrollFade enabled={wide}>
        <div className={styles.body}>
          <div className={styles.chart} ref={chartRef}>
            <ResponsiveHeatMap
              data={data}
              margin={getHeatmapMargin(isMobile, investorCount)}
              theme={nivoTheme}
              animate={false}
              layers={HEATMAP_LAYERS}
              axisTop={getHeatmapAxisTop(isMobile, investorCount)}
              axisLeft={axisLeftConfig}
              axisBottom={null}
              axisRight={null}
              enableLabels={false}
            />

            {esgTooltip && (
              <PortalTooltip>
                <div className={styles.esgTooltip}>
                  <span
                    className={styles.esgDot}
                    style={{ background: esgColors[esgTooltip.category] }}
                  />
                  {esgLabels[esgTooltip.category]}
                </div>
              </PortalTooltip>
            )}
          </div>
          <div className={styles.legend}>
            <Legend
              items={voteLegendItems}
              direction={isMobile ? 'row' : 'column'}
            />
          </div>
        </div>
      </ScrollFade>
    </div>
  )
}

export default memo(HeatmapChart)
