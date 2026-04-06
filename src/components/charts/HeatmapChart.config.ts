// =============================================================================
// HeatmapChart Config — responsive margin and axis configuration
// =============================================================================

export function getHeatmapMargin(isMobile: boolean, investorCount: number) {
  const isLarge = investorCount > 5
  if (isMobile) {
    return isLarge
      ? { top: 95, right: 8, bottom: 8, left: 120 }
      : { top: 68, right: 14, bottom: 8, left: 80 }
  }
  return isLarge
    ? { top: 95, right: 20, bottom: 20, left: 172 }
    : { top: 60, right: 20, bottom: 20, left: 172 }
}

export function getHeatmapAxisTop(isMobile: boolean, investorCount: number) {
  const isLarge = investorCount > 5
  return {
    tickSize: 0,
    tickPadding: 10,
    tickRotation: isLarge ? -90 : isMobile ? -45 : 0,
    legend: 'Investor',
    legendPosition: 'middle' as const,
    legendOffset: isLarge ? -85 : isMobile ? -58 : -46,
  }
}
