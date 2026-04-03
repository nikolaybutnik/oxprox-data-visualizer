import { useRef, useState, useCallback, useMemo } from 'react'
import { ResponsiveBar, type BarTooltipProps, type BarCustomLayerProps } from '@nivo/bar'
import { nivoTheme } from '../../styles/nivoTheme'
import { voteColors, esgColors, esgLabels } from '../../styles/colors'
import type { BarDatum, BarVotersMap } from '../../data/transforms'
import type { EsgCategory, VoteValue } from '../../data/types'
import useIsMobile from '../../hooks/useIsMobile'
import { getBarChartMargin, getBarChartLegends } from './BarChart.config'
import styles from './BarChart.module.scss'

interface BarChartProps {
  data: BarDatum[]
  votersMap: BarVotersMap
  esgMap: Record<string, EsgCategory>
}

interface TooltipProps extends BarTooltipProps<BarDatum> {
  votersMap: BarVotersMap
}

interface EsgTooltipState {
  x: number
  y: number
  category: EsgCategory
  resolution: string
}

function BarTooltip({ id, value, data, votersMap }: TooltipProps) {
  const vote = id as VoteValue
  const resolutionVoters = votersMap[data.resolutionId] ?? {}
  const voters = resolutionVoters[vote] ?? []
  const total = Object.values(resolutionVoters).flat().length

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipVote} style={{ color: voteColors[vote] }}>
        {vote}
      </p>
      <p className={styles.tooltipCount}>
        {value} of {total} investors
      </p>
      <ul className={styles.tooltipVoters}>
        {voters.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

function BarChart({ data, votersMap, esgMap }: BarChartProps) {
  const isMobile = useIsMobile()
  const chartRef = useRef<HTMLDivElement>(null)
  const [esgTooltip, setEsgTooltip] = useState<EsgTooltipState | null>(null)

  const EsgLayer = useCallback(
    ({ bars }: BarCustomLayerProps<BarDatum>) => {
      const groups = new Map<string, { cx: number }>()
      bars.forEach((bar) => {
        const key = bar.data.indexValue as string
        if (!groups.has(key)) {
          groups.set(key, { cx: bar.x + bar.width / 2 })
        }
      })

      return (
        <>
          {Array.from(groups.entries()).map(([resolution, { cx }]) => {
            const category = esgMap[resolution]
            if (!category) return null

            return (
              <g key={resolution} transform={`translate(${cx}, -18)`}>
                <circle
                  r={10}
                  fill={esgColors[category]}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    if (!chartRef.current) return
                    const rect = chartRef.current.getBoundingClientRect()
                    const circleRect = e.currentTarget.getBoundingClientRect()
                    setEsgTooltip({
                      x: circleRect.left - rect.left + circleRect.width / 2,
                      y: circleRect.top - rect.top,
                      category,
                      resolution,
                    })
                  }}
                  onMouseLeave={() => setEsgTooltip(null)}
                />
                <text
                  textAnchor='middle'
                  dominantBaseline='central'
                  fill='white'
                  fontSize={9}
                  fontWeight={700}
                  fontFamily="'IBM Plex Sans', sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {category}
                </text>
              </g>
            )
          })}
        </>
      )
    },
    [esgMap]
  )

  const layers = useMemo(
    () => ['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', EsgLayer] as const,
    [EsgLayer]
  )

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Investor Votes by Resolution</h2>
      <div className={styles.chart} ref={chartRef}>
        <ResponsiveBar
          data={data}
          keys={['For', 'Against', 'Abstain']}
          indexBy='resolution'
          groupMode='stacked'
          layout='vertical'
          colors={({ id }) => voteColors[id as string]}
          theme={nivoTheme}
          margin={getBarChartMargin(isMobile)}
          padding={0.35}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: -35,
            legend: 'Resolution',
            legendPosition: 'middle',
            legendOffset: isMobile ? 88 : 80,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 5,
            legend: 'Number of Investors',
            legendPosition: 'middle',
            legendOffset: -36,
          }}
          animate={false}
          enableLabel={false}
          tooltip={(props) => <BarTooltip {...props} votersMap={votersMap} />}
          legends={getBarChartLegends(isMobile)}
          layers={layers}
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
    </div>
  )
}

export default BarChart
