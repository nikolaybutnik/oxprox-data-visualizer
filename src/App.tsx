import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Charts will go here */}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
