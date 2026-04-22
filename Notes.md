### Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

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

# Expenditure side

- Types of dollars:
  - State income tax [Use query from Brian?]
  - State Sales Tax [Use query from Brian?]
  - Entity property tax [Evaluate Auditor data]
  - Sales tax options [Cross-check code?]
  - Registration fees [Cross-check code?]
  - Fuel taxes [Cross-check code?]

# Misc notes

- Email Jason for review meeting
  - Consider privacy/ data risks and strategies to mitigate [!!!]

- Swap out Baselayers for UGRS's hybrid tiles in mapping blocks: https://gis.utah.gov/products/sgid/base-maps/

- Wire up the home results block to the global context

- Design changes:
  - change income tax chart color [green? red?]
  - Fix styling of 'clear receipt' button on home page

# Accomplish Today
