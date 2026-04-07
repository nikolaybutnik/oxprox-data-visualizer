// =============================================================================
// Color Constants — derived from _tokens.scss via virtual:scss-tokens
// (single source of truth lives in SCSS; this file re-exports for TS/JS)
// =============================================================================

import {
  colors as _colors,
  graphColors as _graphColors,
  shadows as _shadows,
  overlays as _overlays,
} from 'virtual:scss-tokens'

export const colors = _colors
export const graphColors = _graphColors
export const shadows = _shadows
export const overlays = _overlays

export const voteColors: Record<string, string> = {
  For: graphColors.teal,
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

// One color per investor — used by radar and chord charts.
// Ordered for maximum visual distinction; first 5 match the sample dataset.
export const investorColors = [
  graphColors.blue,
  graphColors.teal,
  graphColors.orange,
  graphColors.yellow,
  graphColors.lavender,
  graphColors.lime,
  graphColors.crimson,
  graphColors.pink,
  graphColors.blueLight,
  graphColors.tealDark,
  graphColors.olive,
  graphColors.navy,
]

export const voteLegendItems = [
  { label: 'For', color: voteColors.For },
  { label: 'Against', color: voteColors.Against },
  { label: 'Abstain', color: voteColors.Abstain },
]
