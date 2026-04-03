// =============================================================================
// BarChart Config — responsive margin and axis configuration
// =============================================================================

export function getBarChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 36, right: 16, bottom: 110, left: 40 }
    : { top: 36, right: 16, bottom: 90, left: 50 }
}

export function getBarAxisBottom(isMobile: boolean) {
  return {
    tickSize: 0,
    tickPadding: 12,
    tickRotation: -35,
    legend: 'Resolution',
    legendPosition: 'middle' as const,
    legendOffset: isMobile ? 88 : 80,
  }
}

export const BAR_AXIS_LEFT = {
  tickSize: 0,
  tickPadding: 8,
  tickValues: 5,
  legend: 'Number of Investors',
  legendPosition: 'middle' as const,
  legendOffset: -36,
}
