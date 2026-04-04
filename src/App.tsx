import { useState } from 'react'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import ChartToggle from './components/ui/ChartToggle'
import { investors, resolutions, votes } from './data/dataset'
import {
  largeInvestors,
  largeResolutions,
  largeVotes,
} from './data/largeDataset'
import {
  toBarData,
  toEsgMap,
  toHeatmapData,
  toPieData,
  toRadarData,
  toChordData,
} from './data/transforms'
import styles from './App.module.scss'

// Pre-compute both datasets at module level — no work on tab switch
function buildDataset(
  v: typeof votes,
  r: typeof resolutions,
  i: typeof investors,
) {
  const { data: barData, votersMap } = toBarData(v, r, i)
  const chordVariants = (['all', 'E', 'S', 'G'] as const).reduce(
    (acc, key) => {
      const filtered =
        key === 'all' ? r : r.filter((res) => res.esgCategory === key)
      acc[key] = {
        data: toChordData(v, filtered, i),
        resolutionCount: filtered.length,
        resolutionLabels: filtered.map((res) => res.shortLabel),
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
  return {
    barData,
    votersMap,
    esgMap: toEsgMap(r),
    heatmapData: toHeatmapData(v, r, i),
    pieData: toPieData(v),
    radarData: toRadarData(v, r, i),
    radarKeys: i.map((inv) => inv.label),
    chordVariants,
  }
}

const sampleDataset = buildDataset(votes, resolutions, investors)
const largeDataset = buildDataset(largeVotes, largeResolutions, largeInvestors)

const DATASETS = [
  { id: 'sample', label: 'Sample', meta: '5 investors · 5 resolutions' },
  { id: 'large', label: 'Large', meta: '12 investors · 10 resolutions' },
] as const

type DatasetId = (typeof DATASETS)[number]['id']

function App() {
  const [datasetId, setDatasetId] = useState<DatasetId>('sample')
  const dataset = datasetId === 'sample' ? sampleDataset : largeDataset

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.datasetSwitcher}>
            {DATASETS.map((ds) => (
              <button
                key={ds.id}
                className={styles.datasetBtn}
                data-active={datasetId === ds.id}
                onClick={() => setDatasetId(ds.id)}
              >
                <span className={styles.datasetLabel}>{ds.label}</span>
                <span className={styles.datasetMeta}>{ds.meta}</span>
              </button>
            ))}
          </div>
          <ChartToggle {...dataset} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
