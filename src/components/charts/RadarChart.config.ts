// =============================================================================
// RadarChart Config — responsive margin and investor colour configuration
// =============================================================================

import { graphColors } from '../../styles/colors'

export function getRadarChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 55, right: 75, bottom: 55, left: 75 }
    : { top: 70, right: 90, bottom: 70, left: 90 }
}

// One colour per investor, drawn from the graph palette
export const RADAR_INVESTOR_COLORS = [
  graphColors.blue,
  graphColors.teal,
  graphColors.orange,
  graphColors.yellow,
  graphColors.lavender,
]
