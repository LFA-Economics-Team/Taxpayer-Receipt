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

# Production To-Do's:

- devise share-out from entities to purposes
  - state: weighted shares of ITF, GF, and TF?
  - county/ municipality/ special district: auditor data?

- devise print/ email methods [Playwrite?]

- Review meeting
  - Jason for Tax Commission
  - Chris/ Megan for LRGC
  - Econ Team, Jon, and Tim
  - gondola-toga-message-henry [quad-word key for production version under legislature's domain]

# Team input:

- Rounding Rules
- Expenditure conditioned on Revenue [Entity + Revenue]
- Entity aggregation
  - State, County, School Districts, Municipalities, Special Districts [average spending profiles???]
  - State, Property Entities, Sales Area [Specific Spending Profiles???]
