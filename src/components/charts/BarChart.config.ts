// =============================================================================
// BarChart Config — responsive margin and legend configuration
// =============================================================================

export function getBarChartMargin(isMobile: boolean) {
  return isMobile
    ? { top: 36, right: 20, bottom: 150, left: 40 }
    : { top: 36, right: 140, bottom: 90, left: 50 }
}

export function getBarChartLegends(isMobile: boolean) {
  return isMobile
    ? [
        {
          dataFrom: 'keys' as const,
          anchor: 'bottom' as const,
          direction: 'row' as const,
          justify: false,
          translateX: 0,
          translateY: 130,
          itemWidth: 80,
          itemHeight: 20,
          itemsSpacing: 8,
          symbolSize: 10,
          symbolShape: 'circle' as const,
        },
      ]
    : [
        {
          dataFrom: 'keys' as const,
          anchor: 'bottom-right' as const,
          direction: 'column' as const,
          justify: false,
          translateX: 130,
          translateY: 0,
          itemWidth: 120,
          itemHeight: 24,
          itemsSpacing: 4,
          symbolSize: 12,
          symbolShape: 'circle' as const,
        },
      ]
}
