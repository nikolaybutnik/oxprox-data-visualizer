import oxproxLogo from '../../assets/oxprox-logo-white.svg'
import styles from './Header.module.scss'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img src={oxproxLogo} alt="OxProx" className={styles.logo} />
      </div>
    </header>
  )
}

export default Header
