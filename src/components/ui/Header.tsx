import { Link, useLocation } from 'react-router-dom'
import oxproxLogo from '../../assets/oxprox-logo-white.svg'
import styles from './Header.module.scss'

function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/voting-records', label: 'Demo Page' },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to='/' className={styles.logoLink}>
          <img src={oxproxLogo} alt='OxProx' className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.navLink}
              data-active={location.pathname === item.path}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
