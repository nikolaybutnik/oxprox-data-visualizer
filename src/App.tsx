import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import BarChart from './components/charts/BarChart'
import HeatmapChart from './components/charts/HeatmapChart'
import PieChart from './components/charts/PieChart'
import { investors, resolutions, votes } from './data/dataset'
import { toBarData, toEsgMap, toHeatmapData, toPieData } from './data/transforms'
import styles from './App.module.scss'

const { data: barData, votersMap } = toBarData(votes, resolutions, investors)
const heatmapData = toHeatmapData(votes, resolutions, investors)
const pieData = toPieData(votes)
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
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
