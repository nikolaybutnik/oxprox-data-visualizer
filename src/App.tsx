import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import BarChart from './components/charts/BarChart'
import HeatmapChart from './components/charts/HeatmapChart'
import PieChart from './components/charts/PieChart'
import RadarChart from './components/charts/RadarChart'
import ChordChart from './components/charts/ChordChart'
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
          <BarChart data={barData} votersMap={votersMap} esgMap={esgMap} />
          <HeatmapChart data={heatmapData} esgMap={esgMap} />
          <PieChart data={pieData} />
          <RadarChart data={radarData} keys={radarKeys} />
          <ChordChart variants={chordVariants} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
