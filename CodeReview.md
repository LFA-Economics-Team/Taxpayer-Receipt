# Taxpayer Receipt — Codebase Summary & Evaluation

_Reviewed: 2026-04-23_

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
- **Home ResultsBlock**: "Your Estimated Taxes Paid" reads live values from AppContext and computes an effective rate
- **Income charts**: All 4 charts (`LineChartTemplate`) select the correct dataset by `filingStatus` and plot the user's income percentile as a reference line
- **Consistent UI**: Dark green/gray design system, 3-column layouts, controlled inputs throughout

---

## What's Incomplete

| Area             | Status                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Sankey           | `RecieptSankey.tsx` renders `<div>Test Chart</div>` — no actual Sankey implemented                                              |
| Public Purchases | "Your Estimated Public Purchases" in Home `ResultsBlock` shows hardcoded `$0` for every row — no tax-to-spending mapping exists |
| PDF / Email      | Buttons present in Home `ResultsBlock` (lines 130–135) but no implementation                                                    |
| Error handling   | Geocoding failures, bad GeoJSON, and network errors all silently fail                                                           |

---

## Code Quality Concerns

### Medium Priority

- Several domain constants are hardcoded and scattered — should be centralized in `types.tsx` following the `FEES_FUEL_CONSTANTS` pattern:

  | File                                                      | Value                                | Meaning                                                                 |
  | --------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
  | `SalesResultsBlock.tsx`                                   | `0.0175`                             | Food state sales tax rate                                               |
  | `SalesInputBlock.tsx`                                     | `4.85%`                              | Non-food state sales tax rate (in display text)                         |
  | `GraphBlock.tsx`                                          | `0.0455`                             | Statutory income tax reference rate                                     |
  | `PropertyContent.tsx`                                     | `0.55`                               | Primary residence exemption multiplier                                  |
  | `PropertyMapBlock.tsx`, `SalesMapBlock.tsx`, `LegMap.tsx` | `39.5, -111.5`, `7`                  | Utah map center and default zoom — duplicated across 3 files            |
  | `PropertyMapBlock.tsx`, `LegMap.tsx`                      | `0.003, 0.002, 0.001, 0.0005, 0.005` | Property tax rate opacity thresholds — duplicated                       |
  | `SalesMapBlock.tsx`, `LegMap.tsx`                         | `0.085, 0.08, 0.075, 0.07, 0.065`    | Sales tax rate color thresholds — duplicated                            |
  | `PropertyMapBlockHybrid.tsx`                              | `0.15`, RGB values                   | Max rate threshold and color gradient values (file is currently unused) |

- `as GeoJSON.FeatureCollection` and `feature as any` casts bypass type safety at load time

### Lower Priority

- `PropertyMapBlockHybrid.tsx` reads a `VITE_DISCOVER_TOKEN` env var but is never used — dead code
- Geospatial polygon intersections re-run on every render — `Notes.md` already flags this for pre-calculation
- Typos: "Reciept" is misspelled throughout (component name, nav); "Perecntile" in `GraphBlock.tsx` grid item title (line 44)

---

## Overall Assessment

This is a **solid prototype** with the hardest parts done — geospatial filtering, multi-entity tax calculations, and map UI are non-trivial and appear correct. Global state and all per-page calculators are now wired together; the Home page shows live totals. The main remaining gaps are the **Sankey visualization**, the **public spending allocation**, and basic **error UI** for geocoding/network failures.

### Recommended Next Priorities

1. Implement the Sankey diagram (replace `RecieptSankey.tsx` placeholder)
2. Build the tax-to-spending mapping for "Your Estimated Public Purchases"
3. Add basic error UI for geocoding and network failures
4. Centralize remaining magic numbers in other calculators
