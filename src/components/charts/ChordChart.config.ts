// =============================================================================
// ChordChart Config — responsive margin configuration
// =============================================================================

export function getChordChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 50, right: 50, bottom: 50, left: 50 }
    : { top: 60, right: 60, bottom: 60, left: 60 }
}

export function getChordLabelOffset(isMobile: boolean) {
  return isMobile ? 20 : 12
}

export function getChordInnerRadiusRatio(isMobile: boolean) {
  return isMobile ? 0.9 : 0.82
}

export function getChordLabelFontSize(isMobile: boolean) {
  return isMobile ? 9 : 12
}
