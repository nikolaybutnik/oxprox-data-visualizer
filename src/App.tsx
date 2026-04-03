import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import BarChart from './components/charts/BarChart'
import { investors, resolutions, votes } from './data/dataset'
import { toBarData, toEsgMap } from './data/transforms'
import styles from './App.module.scss'

const { data: barData, votersMap } = toBarData(votes, resolutions, investors)
const esgMap = toEsgMap(resolutions)

function App() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <BarChart data={barData} votersMap={votersMap} esgMap={esgMap} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
