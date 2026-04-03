import { voteColors } from '../../styles/colors'
import type { VoteValue } from '../../data/types'
import styles from './VoteLegend.module.scss'

const VOTE_KEYS: VoteValue[] = ['For', 'Against', 'Abstain']

interface VoteLegendProps {
  direction?: 'row' | 'column'
}

function VoteLegend({ direction = 'row' }: VoteLegendProps) {
  return (
    <ul className={styles.legend} data-direction={direction}>
      {VOTE_KEYS.map((vote) => (
        <li key={vote} className={styles.item}>
          <span
            className={styles.dot}
            style={{ background: voteColors[vote] }}
          />
          <span className={styles.label}>{vote}</span>
        </li>
      ))}
    </ul>
  )
}

export default VoteLegend
