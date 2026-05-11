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

# Monday:

- Plan/ implement screen size variation/ mobile view

- User guide pages
  - Income [income tax is calculated *for taxpayers like you*]
  - Sales [Improve Text visually and complete tax area visual]
  - Property [Copy Sales tax format]
  - Legislative Map [Graphic to show how the overlap checks work?]

# Meeting Notes:

- Map components:
  - add click functionality on map for auto-calculations
  - click list to highlight on leg map

- revise purpose text in homepage popups [description text in types file]
  - talk to budget folks for how they want their committees described?
