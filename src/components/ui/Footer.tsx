import styles from './Footer.module.scss'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.wordmark}>OxProx</span>
        <span className={styles.disclaimer}>
          Data for illustrative purposes only
        </span>
      </div>
    </footer>
  )
}

export default Footer
