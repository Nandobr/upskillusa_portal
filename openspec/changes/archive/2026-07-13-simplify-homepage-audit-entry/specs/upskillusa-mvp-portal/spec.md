## ADDED Requirements

### Requirement: Homepage AI Opportunity Report launcher
The overview route SHALL present a URL-only launcher in the existing homepage hero that hands the visitor into the canonical Implement business-leader audit without generating or rendering an audit on the homepage.

#### Scenario: Visitor views the homepage hero launcher
- **WHEN** a visitor navigates to `/`
- **THEN** the existing homepage eyebrow, headline, and introduction remain visible
- **AND** the hero displays a labeled company URL input, the English CTA `Get your free AI Opportunity Report` or its selected-language equivalent, and a Watch Demo link to `/demo`
- **AND** the hero does not display a trust-claim row or the claims `30-second audit` and `Enterprise-grade security`

#### Scenario: Visitor submits a valid company URL
- **WHEN** a visitor submits a valid company URL from the homepage hero
- **THEN** the system stores a fresh Implement draft with Business Leader selected and the trimmed company URL prefilled
- **AND** it clears the Implement email, report, selected pilot, saved timestamp, workflow, guardrail, and employee-selection state to their defaults
- **AND** it preserves Inspire, Learn, and Adapt draft data
- **AND** it navigates to `/implement` without requesting `/api/analyze-business-opportunity`

#### Scenario: Visitor submits an invalid company URL
- **WHEN** a visitor submits an empty or invalid company URL from the homepage hero
- **THEN** the visitor remains on `/`
- **AND** the system displays a localized accessible validation error
- **AND** it does not update the Implement draft or request the audit API

#### Scenario: Visitor continues the audit in Implement
- **WHEN** the visitor arrives at `/implement` through the homepage launcher
- **THEN** the Business Leader path is selected and the submitted company URL is prefilled
- **AND** the report contact email is empty and required before generation
- **AND** only the existing Implement submission requests the audit API
- **AND** the existing Implement business opportunity report renders the response without a homepage-specific report variant

#### Scenario: Visitor watches the demo
- **WHEN** a visitor activates Watch Demo from the homepage hero
- **THEN** the system navigates to `/demo` without altering the Implement draft or requesting the audit API

### Requirement: Homepage journey preservation
The overview route SHALL keep the existing four-framework journey directly below the redesigned hero.

#### Scenario: Visitor views content below the hero
- **WHEN** a visitor views the homepage below the hero launcher
- **THEN** the existing overview heading remains visible
- **AND** exactly four framework cards remain in the existing Imagine, Learn, Seminar, and Implement order
- **AND** the former user-facing `Inspire` label is renamed to `Imagine` while its `/inspire` route and behavior remain unchanged

### Requirement: Localized and responsive homepage launcher
The homepage launcher SHALL provide equivalent English, Spanish, and Brazilian Portuguese behavior and SHALL remain accessible and usable across supported viewport widths.

#### Scenario: Visitor changes language
- **WHEN** a visitor selects EN, ES, or PT
- **THEN** the URL label, placeholder, validation error, CTA, and Watch Demo label use the selected language
- **AND** the English CTA remains exactly `Get your free AI Opportunity Report`

#### Scenario: Visitor uses keyboard or assistive technology
- **WHEN** a visitor operates the launcher without a pointer
- **THEN** the URL input has a programmatic label, URL autocomplete/input semantics, visible focus, and Enter-key submission
- **AND** validation feedback is announced as an alert
- **AND** decorative icons are hidden from assistive technology

#### Scenario: Visitor uses a narrow viewport
- **WHEN** a visitor views the homepage at smartphone width
- **THEN** the URL input, CTA, Watch Demo action, and four framework cards stack without clipped text or horizontal scrolling
- **AND** interactive controls remain at least 44 pixels high

#### Scenario: Visitor views the desktop header and launcher
- **WHEN** a visitor views the homepage at desktop width
- **THEN** the URL launcher uses a compact centered width with input and CTA controls no shorter than 44 pixels
- **AND** the primary header navigation labels use a larger readable font without colliding or wrapping
- **AND** the homepage Watch Demo button is approximately 30 percent shorter than its previous 48-pixel presentation
- **AND** the homepage hero headline uses a balanced scale that does not overpower the launcher or alter other page headings

### Requirement: Homepage audit retirement and data cleanup
The overview route SHALL no longer collect email, generate, render, or persist a homepage-specific audit report and SHALL remove legacy homepage report data when possible.

#### Scenario: Homepage loads with legacy audit data
- **WHEN** browser storage contains `upskillusa.homepageAuditReport.v1` or `upskillusa.homepageAuditReport.v2`
- **THEN** the homepage removes both legacy entries on a best-effort basis
- **AND** it does not hydrate or display the stored report or contact email

#### Scenario: Browser storage cleanup is unavailable
- **WHEN** browser privacy settings prevent access to local storage
- **THEN** the homepage hero remains usable and does not crash

#### Scenario: Homepage source and styles are retired
- **WHEN** the launcher replaces the prior homepage audit section
- **THEN** homepage-specific audit form, report, persistence, and loading/error rendering code is no longer active
- **AND** no `.homepage-audit` or `.homepage-audit-*` selector remains in the application styles
- **AND** shared Implement report code and `.business-audit-*` styles remain available

## REMOVED Requirements

### Requirement: Homepage Free AI Opportunity Audit Report
**Reason**: The homepage-specific email collection, API request, and inline report duplicate the canonical Implement business-leader audit and create inconsistent report ownership.

**Migration**: Replace the homepage section with the URL-only hero launcher; collect email, request the audit, and render the report through `/implement`.

### Requirement: Homepage audit local persistence
**Reason**: A homepage-specific saved report is no longer needed once the homepage stops rendering reports, and retained report/contact data creates unnecessary browser-storage exposure.

**Migration**: Best-effort remove the v1/v2 homepage audit keys and use the existing Implement draft only to stage a fresh URL handoff, not to persist a homepage report.
