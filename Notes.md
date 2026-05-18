### Taxpayer Receipt development checklist

From IT [Matt] Security: https://snyk.io/

- gondola-toga-message-henry [quad-word key for production version maps under legislature's domain]

# Production To-Do's:

- Audit Data:
  - Compute typical county and municipality spending profiles from auditor data [conditioned on county/ city class?]
    - Condition political subdivision spending on county/ city class

- Income
  - Investigate household size vs not include
    - randomly sample to assess divergence
    - Consider re-sizing buckets [1, 2, 3-4, 5+]?
  - Grab accurate shares of population in each filing status for Income User Guide Demo

  - Meet with Alex
    - Am I using this data correctly?
    - Can we derive Entity Balances from transaction data? Is there another table?
    - Any feedback on the receipt?

- Pre-production cleanup:
  - Update dependencies to latest versions
  - spell-check all components
  - set up follow-up meeting with outside groups [Mid-June?]

# Version 2 Notes:

- Add 'filter by entity type' option to the property page.
- consider deriving utility classes app-wide
- Future: new areas siphoning off new growth
- Future: API access to sales tax rates [potentially other data?]

# Do Today:

- Plan/ implement screen size variation/ mobile view
