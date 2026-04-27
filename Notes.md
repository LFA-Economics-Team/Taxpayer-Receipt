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

# Expenditure side

- Types of dollars:
  - State income tax [Use query from Brian?]
  - State Sales Tax [Use query from Brian?]
  - Entity property tax [Evaluate Auditor data]
  - Sales tax options [Cross-check code?]
    - STATE SALES AND USE TAX
    - LOCAL SALES AND USE TAX
    - COUNTY OPTION SALES TAX
    - MASS TRANSIT TAX
    - ADDITIONAL MASS TRANSIT TAX
    - MASS TRANSIT FIXED GUIDEWAY TAX
    - COUNTY OPTION TRANSPORTATION TAX
    - HIGHWAYS TAX
    - COUNTY AIRPORT, HIGHWAY, PUBLIC TRANSIT TAX
    - TRANSPORTATION INFRUSTRUCTURE TAX
    - COUNTY PUBLIC TRANSIT
    - SUPPLEMENTAL STATE SALES AND USE TAX
    - RURAL HOSPITAL TAX
    - BOTANICAL, CULTURAL, ZOO TAX
    - TOWN OPTION TAX
    - CITY OR TOWN OPTION TAX
    - RESORT COMMUNITY TAX
    - CORRECTIONAL FACILITY TAX
    - CAPITAL CITY REVITALIZATION TAX
    - EMERGENCY SERVICES TAX
  - Registration fees
    - Registration fee [41-1a-1206] Registration fees go to various things, mostly infrastrucutre [State, Infrastrucutre]
    - Age-Based fee [59-2-405.1] Registration fees go to various things, mostly infrastrucutre [State, Infrastrucure]
    - Corridor fee [41-1a-1222] Funds transportation infrastrucutre aquisition and preservation by political subdivisions [County, Infrastrucutre]
    - Driver's Ed fee [41-1a-1204] Funds driver ed/ student transport [State, Public Education]
    - Uninsured Motorists fee [41-1a-1218] Funds contract with Insure-rite for insurance verification [State, Criminal Justice]
    - Alt Fuel fee [72-1-213.1] Registration fees go to various things, mostly infrastrucutre [State, Infrastrucure]
    - Pollution Control fee [41-1a-12] Funds go to the county imposing the fee [County, General Government?]
  - Fuel taxes
    - Goes to Transportation fund [59-12-201(5)] [State, Infrastrucure]
    - .5% goes to the Off-highway Vehicle Account [59-12-201(8)] [State, Infrastrucure]

# Misc notes

- devise print/ email methods [ask Travis]

- Spin up dockerized version

- move source code into LFA team github

- Email Matt for Security Checks

- Email Jason for review meeting

- Swap out Baselayers for UGRS's hybrid tiles in mapping blocks: https://gis.utah.gov/products/sgid/base-maps/

# Team input:

- Rounding Rules
- Expenditure conditioned on Revenue [Entity + Revenue]
- Entity aggregation
  - State, County, School Districts, Municipalities, Special Districts [average spending profiles???]
  - State, Property Entities, Sales Area [Specific Spending Profiles???]
