# Taxpayer Receipt — Codebase Summary & Evaluation

_Reviewed: 2026-04-20_

---

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS 4, React Router, Recharts, React-Leaflet, and `@turf` for geospatial analysis.

---

## What's Built (and Working)

- **5 functional tax calculators**: Income, Sales, Property, Fees/Fuel, Legislative Map
- **Complex tax logic**: Effective rate lookup from observed taxpayer data (Utah flat income tax), property exemptions, tiered vehicle fees, multi-district sales tax
- **Interactive maps**: Point-in-polygon lookups via Turf, Nominatim geocoding for sales tax
- **Consistent UI**: Dark green/gray design system, 3-column layouts, controlled inputs throughout

---

## What's Incomplete

| Area           | Status                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Home page      | ControlBlock inputs never wire to state; results always show $0; Sankey is `<div>Test Chart</div>` |
| Global state   | No Context/Zustand — data doesn't flow between pages                                               |
| Income charts  | Grid scaffold exists but chart data isn't fully connected                                          |
| Error handling | Geocoding failures, bad GeoJSON, network errors all silently fail                                  |

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
- Home page `ControlBlock` has uncontrolled `<form>` inputs with no `useState` — atypical vs. the rest of the app
- Geospatial polygon intersections re-run on every render — `Notes.md` already flags this for pre-calculation

---

## Overall Assessment

This is a **solid early prototype** with the hardest parts done well — the geospatial filtering, multi-entity tax calculations, and map UI are non-trivial and appear correct. The main gap is **integration**: the Home page is meant to be the aggregation hub, but it's currently disconnected from all the sub-page calculators. Adding a global state layer (React Context or Zustand) would unlock the intended UX where a user enters their profile once and sees a combined receipt across all tax types.

### Recommended Next Priorities

1. Global state to carry user inputs across pages
2. Wire the Home page ControlBlock + implement the Sankey
3. Centralize remaining magic numbers in other calculators
4. Add basic error UI for geocoding and network failures
