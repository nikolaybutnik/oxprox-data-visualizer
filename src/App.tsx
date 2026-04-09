import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import Dashboard from './pages/Dashboard'
import VotingRecords from './pages/VotingRecords'
import styles from './App.module.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Voting Records has its own full-page layout with sidebar */}
        <Route path='/voting-records' element={<VotingRecords />} />
        {/* All other routes use the standard Header/Footer layout */}
        <Route
          path='*'
          element={
            <div className={styles.layout}>
              <Header />
              <main className={styles.main}>
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
