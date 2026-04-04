import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import ChartToggle from './components/ui/ChartToggle'
import { investors, resolutions, votes } from './data/dataset'
import {
  toBarData,
  toEsgMap,
  toHeatmapData,
  toPieData,
  toRadarData,
  toChordData,
} from './data/transforms'
import styles from './App.module.scss'

const { data: barData, votersMap } = toBarData(votes, resolutions, investors)
const heatmapData = toHeatmapData(votes, resolutions, investors)
const pieData = toPieData(votes)
const radarData = toRadarData(votes, resolutions, investors)
const radarKeys = investors.map((i) => i.label)
const chordVariants = (['all', 'E', 'S', 'G'] as const).reduce(
  (acc, key) => {
    const filtered =
      key === 'all'
        ? resolutions
        : resolutions.filter((r) => r.esgCategory === key)
    acc[key] = {
      data: toChordData(votes, filtered, investors),
      resolutionCount: filtered.length,
      resolutionLabels: filtered.map((r) => r.shortLabel),
    }
    return acc
  },
  {} as Record<
    'all' | 'E' | 'S' | 'G',
    {
      data: ReturnType<typeof toChordData>
      resolutionCount: number
      resolutionLabels: string[]
    }
  >,
)
const esgMap = toEsgMap(resolutions)

function App() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <ChartToggle
            barData={barData}
            votersMap={votersMap}
            esgMap={esgMap}
            heatmapData={heatmapData}
            pieData={pieData}
            radarData={radarData}
            radarKeys={radarKeys}
            chordVariants={chordVariants}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
