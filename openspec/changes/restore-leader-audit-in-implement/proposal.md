## Why

Business Leaders need the fastest path to company-level value: entering a company URL and contact email to see concrete AI opportunity areas before choosing a first pilot. Moving the audit back into Step 4 makes the leader journey feel directly connected to implementation, while Employees can keep the personal task transformation path.

## What Changes

- Restore the Step 4 `/implement` Business Leader path so it starts with company URL intake.
- Ask for contact email after a valid URL, in the same Business Leader path, before generating the audit.
- Generate the existing company-level AI Opportunity Report for Business Leaders using the existing audit API and demo fallback behavior.
- Keep the Employee path unchanged: work area, task selection, Task Transformation Report, first pilot, guardrails, and save.
- Remove `Opportunity` from the top navigation and mobile navigation.
- Keep the `/opportunity` route unlinked for now to avoid breaking existing URLs or deployment previews.
- Update Step 4 copy and notes so company URL audit language lives in the Business Leader path again.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `upskillusa-mvp-portal`: Step 4 Business Leader journey changes from personal readiness task selection back to company URL/email audit, and top navigation no longer includes the Opportunity link.

## Impact

- Affected routes/components: `/implement`, app shell navigation content, Step 4 report rendering, local AI-Ready Action Plan output, and copy in `src/lib/content.ts`.
- API surface: reuse `/api/analyze-business-opportunity` for the restored Business Leader path.
- State/persistence: Step 4 Business Leader data should save company URL, contact email, business opportunity report, selected pilot, and guardrails locally.
- `/opportunity` route: remains available but unlinked unless a later cleanup explicitly removes it.
- Verification: lint, typecheck, build, and browser checks if approved for Business Leader URL/email/audit flow, Employee path regression, and nav removal.
