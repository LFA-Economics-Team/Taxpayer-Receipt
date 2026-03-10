# Taxpayer Receipt development checklist

# Global

- Demo for teaching user to navigate the new and improved taxpayer receipt?
- Let box sizes scale proportional to revenue/ spending amounts in visualizations?

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

- Interactive TC-40 to calcualte individual income taxes?
- Use average/ median values for defaults
- Variables:
  - Gross income
  - Filing Status
  - Number of Dependents

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
  - Allows user to input addresses they own/ rent?
  - Classify addresses by primary residential vs everything else?
  - Lists address and values in left column, show tax entity rate & revenue on right column
  - Put markers on map in center for each address entered by user
  - Toggle between tax entities and tax areas?
- Rental Imputation overhaul?

# Misc & Fees

- Fuel taxes [motor and special fuels]
- Sin taxes [beer, cigarette, tobacco]
- Interactive list of fees? Sorted by commonality?
- Vehicle Registration Fees

# Misc

- Consider doing retrospective calcualtions for how tax burden has changed over time?
