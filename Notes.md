# Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

# Global

- Consider reviewing each page and re-sizing the components
- Swap out Baselayers for UGRS's hybrid tiles in mapping blocks: https://gis.utah.gov/products/sgid/base-maps/

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
  - Consider privacy/ data risks and strategies to mitigate [!!!]

# Sales Tax

- 'Generate Default' based on property location and gross income?

# Property Tax

- Rental Imputation overhaul?

# Accomplish Today

- Review Income tax data
- compute general percentile information
- begin building income tax graphs
