# OxProx — Investor Voting Data Visualization

An interactive data visualisation dashboard showing how five institutional investors voted across five ESG resolutions at a company shareholder meeting.

Built for OxProx to demonstrate how rich, interactive visualisations can make complex shareholder voting data intuitive, informative, and actionable.

**Live demo:** [oxprox-data-visualizer.vercel.app](https://oxprox-data-visualizer.vercel.app)

---

## Running locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

To run the data transform unit tests:

```bash
npm run test
```

---

## What was built

The spec asked for a single chart with tooltips and responsive layout. Rather than stop there, the dashboard presents the same dataset through five complementary chart views — each suited to a different analytical lens — toggled via an animated tab interface.

### Chart views

| Tab | Chart | What it answers |
|-----|-------|-----------------|
| Votes by Resolution | Stacked bar | How did the full group vote on each proposal? Were resolutions contested or unanimous? |
| Voting Grid | Heatmap | Exactly which investor voted what on each resolution — the full matrix at a glance |
| Distribution | Donut | What is the overall For / Against / Abstain split across all 25 votes? |
| Profiles | Radar | What is each investor's overall voting personality? Consistent For? Mixed? Against-leaning? |
| Agreements | Chord | Which investors tend to vote the same way as each other, and on which ESG category? |

Both the chord and radar charts include per-investor toggle pills (defaulting to All) that show or hide individual investors. The chord diagram also has an **E / S / G / All** ESG filter; switching category resets the investor selection for a clean view of each topic. When the selected combination produces no shared votes, a "No shared votes for these filters" placeholder replaces the chart. Both controls use the investor's colour directly in the pill, eliminating the need for a separate legend.

### Dataset switcher

A **Sample / Large** toggle above the chart tabs lets you switch between the original 5×5 dataset and an expanded 12-investor × 10-resolution dataset with realistic institutional investor archetypes (ESG champions, sovereign wealth funds, mainstream asset managers, activist pensions). Both datasets are pre-computed at module level so switching is instant.

The larger dataset demonstrates how all five chart views scale to real-world data volumes. One known limitation: the Agreements (chord) chart uses `@react-spring/web` internally for ribbon path animations, which has a compatibility issue with React 19. With 12 investors the chart produces 66 ribbon paths and hover interactions become noticeably slower. This is a known upstream issue; the 5-investor sample dataset performs normally.

### Technical decisions

**Stack:** React 19, TypeScript, Vite, Nivo (charts), Framer Motion (transitions), SCSS Modules.

**Data layer:** All transforms (`toBarData`, `toHeatmapData`, `toPieData`, `toRadarData`, `toChordData`) are pure functions that accept raw arrays and return Nivo-compatible shapes. They're called once at module level in `App.tsx` and passed down as props — no data fetching inside components, no shared mutable state.

**Performance:** Each chart is `React.lazy`-loaded and code-split so only the active chart's Nivo package is fetched. The bar chart (always shown first) is eagerly imported. The other four are prefetched in the background at module load time so tab switches feel instant.

**Heatmap tooltips:** Nivo's `cellComponent` prop creates one React component instance per cell; all 25 re-render on every hover event. To avoid this, the heatmap uses a custom `layers` entry (`HeatmapCellLayer`) that renders cells as plain SVG and uses `useTooltip` from `@nivo/tooltip` — the same mechanism `ResponsiveBar` uses internally. This gives Nivo-standard tooltip behaviour without the 25-instance overhead.

**ESG indicators:** The bar chart and heatmap both render E / S / G category badges with hover tooltips. These use React `useState` (not imperative DOM) so they stay in sync across resize and re-render.

**Design tokens:** Colour values are defined once in `_tokens.scss` and extracted at build time by a custom Vite plugin (`build/vite-plugin-scss-tokens.ts`). The plugin compiles the SCSS, scrapes the `$color-*` and `$graph-*` variables, and serves them as a virtual module (`virtual:scss-tokens`) that `colors.ts` imports. This avoids duplicating hex values between SCSS and the JS/TS layer (Nivo requires plain strings for chart colours).

**Responsive:** Mobile-first SCSS with a single `768px` breakpoint. Charts use CSS Grid (`1fr auto`) for the legend column — not flexbox — because Nivo's `ResizeObserver` measures the container before flex layout resolves, which would produce a 0px width and a blank chart.

---

## Project structure

```
build/                — Custom Vite plugins (SCSS token extraction)
src/
  components/
    charts/           — One .tsx + .config.ts + .module.scss per chart
    ui/               — Header, Footer, Legend, ChartToggle
  data/
    types.ts          — Domain types
    dataset.ts        — Hard-coded sample data
    transforms.ts     — Pure data transform functions
    __tests__/        — 24 Vitest unit tests
  styles/             — SCSS tokens, reset, global styles, Nivo theme
```
