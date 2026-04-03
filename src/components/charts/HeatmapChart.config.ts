// =============================================================================
// HeatmapChart Config — responsive margin and axis configuration
// =============================================================================

export function getHeatmapMargin(isMobile: boolean) {
  return isMobile
    ? { top: 68, right: 24, bottom: 40, left: 84 }
    : { top: 60, right: 100, bottom: 20, left: 172 }
}

export function getHeatmapAxisTop(isMobile: boolean) {
  return {
    tickSize: 0,
    tickPadding: 10,
    tickRotation: isMobile ? -45 : 0,
    legend: 'Investor',
    legendPosition: 'middle' as const,
    legendOffset: isMobile ? -58 : -46,
  }
}
