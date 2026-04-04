// =============================================================================
// Color Constants — mirrors _tokens.scss graph palette for use in TS/JS
// (e.g. Nivo chart props that require plain string values)
// =============================================================================

export const colors = {
  navy:       '#0E2043',
  blue:       '#527CEE',
  blueLight:  '#8ABCFF',
  bluePale:   '#E1EFFF',
  stone:      '#66625E',
  sand:       '#E8E4E1',
  offwhite:   '#F2F1EF',
  white:      '#FFFFFF',
  orange:     '#FF6948',
} as const

export const graphColors = {
  navy:       '#0E2043',
  blue:       '#527CEE',
  blueLight:  '#8ABCFF',
  tealDark:   '#597B79',
  teal:       '#25C3B2',
  olive:      '#989A37',
  lime:       '#B8D12C',
  orange:     '#FF6948',
  yellow:     '#E6AC12',
  crimson:    '#9D013D',
  pink:       '#D7559E',
  lavender:   '#D699F9',
} as const

export const voteColors: Record<string, string> = {
  For:     graphColors.teal,
  Against: graphColors.orange,
  Abstain: graphColors.blueLight,
}

export const esgColors: Record<string, string> = {
  E: graphColors.lime,
  S: graphColors.blue,
  G: graphColors.yellow,
}

export const esgLabels: Record<string, string> = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance',
}

export const voteLegendItems = [
  { label: 'For',     color: voteColors.For },
  { label: 'Against', color: voteColors.Against },
  { label: 'Abstain', color: voteColors.Abstain },
]
