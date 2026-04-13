# Taxpayer Receipt development checklist

From IT Security: https://snyk.io/
Use UGRS hybrid base for property and sales tax maps: https://gis.utah.gov/products/sgid/base-maps/

# Main Page

- Three column sankey visualization
  - Column 1: Revenue sources [Income, Sales, Property, Fees]
    - These are fed by the results of the underlying calculations pages
  - Column 2: Taxing Entities [State, County, School District, etc.]
    - Entities shown here is the union of entities from the sales tax page and the property tax page
  - Column 3: Spending Purposes
    - Catagories: Criminal Justice, Economic Development, Education, General Government, Infrastructure, Natural Resources, and Social Services
    - Fed by:
      - COBI for state appropraitions data
      - State Auditor for data from political subdivisions
- Option to print or email your reciept?
- Overall effective tax rate?
- Median Utahn [single vs household?] Profile?

# Income Tax

- Use average/ median values for defaults
- Variables:
  - Gross income
  - Filing Status
  - Number of Dependents
  - Residence/ partial year-income?

- Visuals
  - Graph comparing percentile of income to effective tax rate
  - Graph comparing percential of income to nominal tax liability [logged?]
  - Allow graphs to be conditional on filing status and number of dependents
  - Consider privacy/ data risks and stratagies to mitigate [!!!]

# Sales Tax

- Interactive Map visualization
  - Allows user to input addresses where they spend?
    - 'Generate Default' based on property location and gross income?
    - Split between food and non-food?
  - Lists address and amounts in left column, show tax entity rate & revenue on right column
  - Put markers on map in center for each address entered by user
  - Toggle between tax entities and tax areas?

# Property Tax

- Interactive Map visualization
  - Swap out baselayer for UGRS's hybrid tiles
  - sort entities by tax liability amount
- Rental Imputation overhaul?
- Factor in residential exemption

# Fuel & Fees

- add explanatory notes/ pop-ups
  - What each fee is, who it applies to, what it's used for?
  - 6 Month-registrations?
  - Code citations for each fee?
  - Revise fee description language
  - double check usage description against code [and check code citations]

# Strech goals

- Add a tool for collecting which sales & property taxing areas/ entites overlap legislative districts?
- Consider doing retrospective calcualtions for how tax burden has changed over time?

# Accomplish Today

- review fee pop-ups:
  - description langugage
  - uses as laid out in code
  - check code citations
- write general caveats for fee page

- Sort property tax entities by estimated liabilty
- Factor in Residential Exemption

- Get started on Sales Tax page
