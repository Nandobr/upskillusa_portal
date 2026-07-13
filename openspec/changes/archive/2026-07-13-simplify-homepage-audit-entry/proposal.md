## Why

The homepage currently duplicates audit collection, persistence, and report presentation that already exist in the Implement business-leader path. Replacing that duplicate with a focused hero launcher will create one canonical audit experience while keeping the homepage's four-framework journey clear.

## What Changes

- Remove the standalone homepage audit section, its inline report presentation, and its homepage-specific saved-report behavior.
- Add a company-URL launcher to the existing homepage hero with the exact English CTA `Get your free AI Opportunity Report` and equivalent Spanish and Brazilian Portuguese copy.
- On valid submission, stage a fresh business-leader audit in the existing Implement draft, prefill the company URL, and navigate to `/implement` without calling the audit API from the homepage.
- Keep email collection, audit generation, errors/loading, and the canonical business opportunity report exclusively in the existing Implement flow.
- Keep the four framework cards and their surrounding overview content directly below the hero.
- Keep the Watch Demo action, but remove the unsubstantiated `30-second audit` and `Enterprise-grade security` claims and remove the trust-claim row rather than replacing it with new marketing claims.
- Remove obsolete homepage-audit storage data and unused `.homepage-audit-*` styles after the launcher replaces the old section.

## Capabilities

### New Capabilities

### Modified Capabilities

- `upskillusa-mvp-portal`: Change the overview audit entry from an independently generated homepage report to a URL-only hero handoff into the canonical Implement business-leader audit, while preserving the four framework cards, multilingual behavior, accessibility, and responsive presentation.

## Impact

- Affected code: homepage composition and client state handoff in `src/components/portal-pages.tsx`, homepage/Opportunity copy reuse or extraction, and obsolete homepage audit styles in `src/app/globals.css`.
- Existing systems reused unchanged: Plan Provider draft persistence, `/api/analyze-business-opportunity`, Implement business-leader form, shared audit services, and `BusinessOpportunityReportView`.
- Data/privacy: legacy homepage report storage keys containing report/contact data will be removed; no email or report is collected or stored by the new homepage launcher.
- Routes: `/`, `/implement`, and `/demo` remain public; this change does not remove or redirect the existing `/opportunity` route.
- Dependencies and database schema: no new package, service, API, or schema change is expected.
