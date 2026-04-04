import styles from './Legend.module.scss'

export interface LegendItem {
  label: string
  color: string
}

interface LegendProps {
  items: LegendItem[]
  direction?: 'row' | 'column'
}

function Legend({ items, direction = 'row' }: LegendProps) {
  return (
    <ul className={styles.legend} data-direction={direction}>
      {items.map(({ label, color }) => (
        <li key={label} className={styles.item}>
          <span className={styles.dot} style={{ background: color }} />
          <span className={styles.label}>{label}</span>
        </li>
      ))}
    </ul>
  )
}

export default Legend
