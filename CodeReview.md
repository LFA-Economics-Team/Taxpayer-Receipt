# Taxpayer Receipt — Codebase Summary & Evaluation

_Reviewed: 2026-04-24_

---

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS 4, React Router, Recharts, React-Leaflet, and `@turf` for geospatial analysis.

---

## What's Built (and Working)

- **5 functional tax calculators**: Income, Sales, Property, Fees/Fuel, Legislative Map
- **Complex tax logic**: Effective rate lookup from observed taxpayer data (Utah flat income tax), property exemptions, tiered vehicle fees, multi-district sales tax
- **Interactive maps**: Point-in-polygon lookups via Turf, Nominatim geocoding for sales tax
- **Global state**: `AppContext.tsx` wires all calculators together — income, properties, cars, and locations share state; derived tax totals (`incomeTax`, `propertyTax`, `salesTax`, `fuelTax`, `fees`) are computed via `useMemo` and consumed by all pages
- **Home page ControlBlock**: Fully wired to AppContext — address geocodes to `upsertPrimaryProperty`, income/filing status update `setIncomeInfo`, vehicle fields call `upsertFirstCar`
- **Home ResultsBlock**: "Your Estimated Taxes Paid" reads live values from AppContext and computes an effective rate; "Your Estimated Public Purchases" is now wired via `TAX_TO_ENTITY` → `ENTITY_TO_PURPOSE` allocation tables
- **Sankey diagram**: `RecieptSankey.tsx` now implements a full 3-column Recharts `Sankey` with custom node rendering (name + dollar label). `SankeyBlock.tsx` drives the data transformation — tax amounts → entities → spending purposes — and shows a "fill in the form first" placeholder when no data exists
- **Spending allocation tables**: `TAX_TO_ENTITY` and `ENTITY_TO_PURPOSE` in `AppContext.tsx` define how each tax type flows through taxing entities to spending categories
- **Income charts**: All 4 charts (`LineChartTemplate`) select the correct dataset by `filingStatus` and plot the user's income percentile as a reference line
- **Consistent UI**: Dark green/gray design system, 3-column layouts, controlled inputs throughout

---

## What's Incomplete

| Area            | Status                                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Allocation data | `TAX_TO_ENTITY` and `ENTITY_TO_PURPOSE` use estimated fractions — not yet backed by COBI or State Auditor data (see Notes.md) |
| PDF / Email     | Buttons present in Home `ResultsBlock` (lines 135–142) but no implementation                                                  |
| Error handling  | Geocoding failures, bad GeoJSON, and network errors all silently fail                                                         |

---

## Code Quality Concerns

### Medium Priority

- **`CustomNode` defined inside `RecieptSankey`** — `CustomNode` is a React component declared inside the body of `RecieptSankey`. Because `chartWidth` is state, every resize triggers a re-render, which creates a new `CustomNode` reference, and Recharts unmounts/remounts every node. Extract `CustomNode` outside the component (passing `chartWidth` as a prop or via closure over a ref) to fix this.

- **Duplicate `entityAmounts` / `purposeAmount` logic** — `SankeyBlock.tsx:43–51` and `ResultsBlock.tsx:40–55` contain the same intermediate computation (tax amounts → entity amounts → purpose amounts). This could be moved into `AppContext` as derived state (alongside `totalTax`) or extracted as a shared utility so both consumers read the same numbers from a single source.

- **Hardcoded magic numbers still scattered** — several domain constants remain outside `types.tsx` / `FEES_FUEL_CONSTANTS`:

  | File                                                      | Value                                | Meaning                                                       |
  | --------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------- |
  | `SalesInputBlock.tsx`                                     | `4.85%`                              | Non-food state sales tax rate (in display text)               |
  | `GraphBlock.tsx`                                          | `0.0455`                             | Statutory income tax reference rate                           |
  | `PropertyContent.tsx`                                     | `0.55`                               | Primary residence exemption multiplier                        |
  | `PropertyMapBlock.tsx`, `SalesMapBlock.tsx`, `LegMap.tsx` | `39.5, -111.5`, `7`                  | Utah map center and default zoom — duplicated across 3 files  |
  | `PropertyMapBlock.tsx`, `LegMap.tsx`                      | `0.003, 0.002, 0.001, 0.0005, 0.005` | Property tax rate opacity thresholds — duplicated             |
  | `SalesMapBlock.tsx`, `LegMap.tsx`                         | `0.085, 0.08, 0.075, 0.07, 0.065`    | Sales tax rate color thresholds — duplicated                  |
  | `AppContext.tsx`                                          | `0.32`, `0.12`                       | Estimated spending shares of income for non-food / food sales |

- **`as GeoJSON.FeatureCollection` and `feature as any` casts** — still bypass type safety at load time in `AppContext.tsx`

### Lower Priority

- `PropertyMapBlockHybrid.tsx` reads a `VITE_DISCOVER_TOKEN` env var but is never used — dead code
- Geospatial polygon intersections re-run on every render — `Notes.md` already flags this for pre-calculation
- Typos: "Reciept" is misspelled throughout (component name, nav); "Perecntile" in `GraphBlock.tsx` grid item title (line 44)

---

## Overall Assessment

This is a **near-complete prototype** — the two biggest visualization gaps from the previous review have shipped. The Sankey diagram renders correctly with custom node labels and a sensible empty state, and "Your Estimated Public Purchases" now shows real derived values. The allocation fractions powering both are reasonable estimates; the main remaining work is swapping them for real COBI/Auditor data.

The most actionable technical debt right now is the `CustomNode`-inside-render pattern in `RecieptSankey`, which will cause visible jank on resize. The duplicate `entityAmounts` logic is a secondary concern since both blocks should always show the same numbers.

### Recommended Next Priorities

1. Fix `CustomNode` being defined inside `RecieptSankey` — move it outside the component
2. Replace estimated `TAX_TO_ENTITY` / `ENTITY_TO_PURPOSE` fractions with real COBI and State Auditor data
3. Deduplicate `entityAmounts` / `purposeAmount` into AppContext or a shared utility
4. Add basic error UI for geocoding and network failures
5. Implement PDF / Email
6. Centralize remaining magic numbers (map center/zoom, `0.32`/`0.12` spending shares, etc.)
