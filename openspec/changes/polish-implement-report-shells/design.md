## Design Notes

### Employee Report

The Employee report should follow the reference app's Maria-style card:

- Single compact white card with a small persona/work-area header.
- Light metric cards instead of the executive navy KPI band.
- Task rows should be tight and scan-friendly: bucket pill, task name, before-to-after hours, progress bar, and optional selected state.
- Recommended tools should appear as stacked rows with check icons.
- The dark "skill roadmap" CTA should remain, but be smaller and less dominant than the task report.

### Business Leader Report

The Business Leader report should follow the reference app's executive audit:

- Premium white card.
- Header with report eyebrow, company metadata, demo/sample pill, and actions.
- Navy hero band emphasizing annual value opportunity / cost of inaction.
- Three dark stat cards inside the navy band.
- Gold competitive-gap band.
- Workforce/opportunity score plus executive summary.
- Compact opportunity rows that also act as first-pilot selectors.

### Constraints

- Keep report data contracts unchanged.
- Keep selected-pilot behavior unchanged.
- Keep all outputs labeled as demo/fallback where the current data says they are demo/fallback.
- Report download actions should use the browser print-to-PDF flow and isolate the report card for printing.
- Browser verification is required for the report action flow after implementation.
