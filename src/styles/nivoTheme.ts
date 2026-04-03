// =============================================================================
// Nivo Theme — shared chart theme applied across all chart components
// =============================================================================

import { colors } from './colors'

export const nivoTheme = {
  text: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    fill: colors.navy,
  },
  axis: {
    ticks: {
      text: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 11,
        fill: colors.stone,
      },
    },
    legend: {
      text: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        fill: colors.navy,
      },
    },
  },
  legends: {
    text: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: 12,
      fill: colors.navy,
    },
  },
  tooltip: {
    container: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: 12,
      background: colors.white,
      color: colors.navy,
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(14, 32, 67, 0.12)',
      padding: '10px 14px',
    },
  },
}
