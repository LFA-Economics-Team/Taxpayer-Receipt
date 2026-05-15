### Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

- gondola-toga-message-henry [quad-word key for production version maps under legislature's domain]

- consider deriving utility classes app-wide

# Production To-Do's:

- Review meeting
  - Alex from Audit [Am I using this data correctly? Entity Balances]

- Compute typical county and municipality spending profiles from auditor data [conditioned on county/ city class?]
  - Condition political subdivision spending on county/ city class

- Investigate household size vs not include
  - randomly sample to assess divergence
  - Consider re-sizing buckets [1, 2, 3-4, 5+]?

- fix geocoding
  - restrict to only allow Utah entries
  - implement error messages

- Pre-production cleanup:
  - Update dependencies to latest versions
  - spell-check all components
  - set up follow-up meeting with outside groups [Mid-June?]

- Plan/ implement screen size variation/ mobile view

- User guide pages
  - Income [income tax is calculated *for taxpayers like you*]
    - Grab accurate shares of population in each filing status.

# Meeting Notes:

- Organize legmap district results:
  - Median Rate within legislative district [And statewide]
  - Sort list by rate

- Map components:
  - add click functionality on map for auto-calculations [liability per $1,000 on sales and property maps]
  - click list to highlight on leg and property maps

# Version 2 Notes:

- Future: new areas siphoning off new growth
- Future: API access to sales tax rates [potentially other data?]
