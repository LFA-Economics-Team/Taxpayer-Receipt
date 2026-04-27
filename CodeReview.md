# Taxpayer Receipt — Codebase Summary & Evaluation

_Reviewed: 2026-04-27_

---

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS 4, React Router, Recharts, React-Leaflet, and `@turf` for geospatial analysis.

---

## What's Built (and Working)

- **5 functional tax calculators**: Income, Sales, Property, Fees/Fuel, Legislative Map
- **Complex tax logic**: Effective rate lookup from observed taxpayer data (Utah flat income tax), property exemptions, tiered vehicle fees, multi-district sales tax
- **Interactive maps**: Point-in-polygon lookups via Turf, Nominatim geocoding for sales tax
- **Global state**: `AppContext.tsx` wires all calculators together — income, properties, cars, and locations share state; derived tax totals (`incomeTax`, `propertyTax`, `salesTax`, `fuelTax`, `fees`) are computed via `useMemo` and consumed by all pages. Location id=0 auto-syncs with the primary property address and income info.
- **Home page ControlBlock**: Fully wired to AppContext — address geocodes on blur to `upsertPrimaryProperty`, income/filing status update `setIncomeInfo`, vehicle fields (year/make/model with cascading dropdowns) call `upsertFirstCar`
- **Home ResultsBlock**: "Your Estimated Taxes Paid" reads live values from AppContext and computes an effective rate; "Your Estimated Public Purchases" reads `purposeAmounts` directly from context
- **Sankey diagram**: `ReceiptSankey.tsx` implements a full 3-column Recharts `Sankey` with custom node rendering (name + dollar label, intelligent edge-aware label positioning). `SankeyBlock.tsx` drives data transformation and shows a "fill in the form first" placeholder when no data exists
- **Dynamic allocation pipeline**: All five tax types now compute entity shares dynamically from AppState rather than static fractions. Income and fuel tax use exported constants (`INCOME_TAX_ENTITY_SHARES`, `FUEL_TAX_ENTITY_SHARES`); property tax derives shares from actual entity liabilities via `PROPERTY_ENTITY_TYPE_MAP`; sales tax uses `SALES_COMPONENT_ENTITY_ASSIGNMENT` keyed to rate components; fees use `FEE_ENTITY_ASSIGNMENT`. `TAX_TO_ENTITY` has been removed and replaced with `TAX_KEYS` / `TaxKey`. `entityAmounts` and `purposeAmounts` are memoized in AppContext and consumed by all pages; `SankeyBlock` drives tax-to-entity links from the same `sharesByTax` lookup. `ENTITY_TO_PURPOSE` remains a static estimated table pending real COBI/Auditor data.
- **Income charts**: All 4 charts (`LineChartTemplate`) in an expandable grid layout select the correct dataset by `filingStatus` and plot the user's income percentile as a reference line
- **Fees/Fuel tab**: Complete rewrite — `FeesFuelsContent.tsx` calculates all 7 fee types (registration, age-based, corridor, driver ed, uninsured motorist, alt-fuel, pollution control) with inline info tooltips citing specific Utah statutes
- **Consistent UI**: Dark green/gray design system, 3-column layouts, controlled inputs throughout

---

## What's Incomplete

| Area            | Status                                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Allocation data | `ENTITY_TO_PURPOSE` uses estimated fractions — not yet backed by COBI or State Auditor data (see Notes.md). Tax-to-entity layer is now fully dynamic. |
| PDF / Email     | Buttons present in Home `ResultsBlock` (lines 121–126) but no implementation                                                                          |
| Error handling  | Geocoding failures, bad GeoJSON, and network errors all silently fail                                                                                 |

---

## Code Quality Concerns

### Pending Cleanup

- **`ENTITY_TO_PURPOSE` in `AppContext.tsx`**: If entity-to-purpose allocations are converted to dynamic calculations (parallel to the completed tax-to-entity refactor), this constant's values will be bypassed. Plan to replace with `ENTITY_KEYS` / `PURPOSE_KEYS` registries and dynamic share objects at that time.

### Lower Priority

- Geospatial polygon intersections re-run on every render — `Notes.md` already flags this for pre-calculation

---

## Overall Assessment

This is a **near-complete prototype**. The Fees/Fuel tab received the biggest update this cycle — full fee calculation with statute-cited tooltips. The Sankey file was renamed from `RecieptSankey.tsx` to `ReceiptSankey.tsx` (typo fix); `SankeyBlock.tsx` import updated accordingly. All core tax flows remain solid.

The main remaining work is swapping the estimated allocation fractions for real COBI/Auditor data.

### Recommended Next Priorities

1. Replace estimated `ENTITY_TO_PURPOSE` fractions with real COBI and State Auditor data
2. Add basic error UI for geocoding and network failures
3. Implement PDF / Email
