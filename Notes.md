### Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

# Global

- Create state to manage user-inputs globally
- Swap out Baselayers for UGRS's hybrid tiles in mapping blocks: https://gis.utah.gov/products/sgid/base-maps/
- Consider pre-calculating legislative map polygon intersections

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

- Consider privacy/ data risks and strategies to mitigate [!!!]

# Sales Tax

-'Generate Default' based on property location and gross income?

- Guidance on estimating taxable spending

# Property Tax

- Rental Imputation overhaul?
- Convert to tax areas?

# Expenditure side

- Types of dollars:
  - State income tax [Use query from Brian?]
  - State Sales Tax [Use query from Brian?]
  - Entity property tax [Evaluate Auditor data]
  - Sales tax options [Cross-check code?]
  - Registration fees [Cross-check code?]
  - Fuel taxes [Cross-check code?]

# Accomplish Today

- Email Jason for review meeting

- Attempt negative buffer distance for sales tax map [-50m, review areas zeroed out]
  - https://geopandas.org/en/latest/docs/reference/api/geopandas.GeoSeries.buffer.html

- Review each page and re-size the components
