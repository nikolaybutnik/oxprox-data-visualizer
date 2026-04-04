// =============================================================================
// RadarChart Config — responsive margin configuration
// =============================================================================

export function getRadarChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 55, right: 90, bottom: 55, left: 90 }
    : { top: 70, right: 90, bottom: 70, left: 90 }
}
