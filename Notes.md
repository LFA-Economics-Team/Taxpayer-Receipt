# Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

# Global

- Consider reviewing each page and re-sizing the components
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

- Change the state function to lookup percentile given user-input for income
- allow graphs to fill the graphblock when selected?

- Data work:
  - create 'cumulative share of income' variable
  - create 'cumulative share of tax' variable
  - create 'average income' variable

- Visuals
  - 1: Lorenz Curve [% of returns vs cumulative share of income]
  - 2: percentile of income to effective tax rate
  - 3: percential of income to cummulative share tax liability
  - 4: percentile of income vs houshold size?

  - Consider privacy/ data risks and strategies to mitigate [!!!]
  - add a vertical line to show the user where in the income spectrum they fall based on the user-input gross income

  -Results display: wire up the correct variables/ calculations

- Questions:
  - what is going on with the first percentile?

# Sales Tax

- 'Generate Default' based on property location and gross income?
- Guidance on estimating taxable spending

# Property Tax

- Rental Imputation overhaul? [Ask tax commission?]

# Accomplish Today
