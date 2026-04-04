// =============================================================================
// PieChart Config — responsive margin configuration
// =============================================================================

export function getPieChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 20, right: 20, bottom: 20, left: 20 }
    : { top: 30, right: 30, bottom: 30, left: 30 }
}
