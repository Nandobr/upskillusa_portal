# Wire Business Leader Audit Services

## Why

The Step 4 Business Leader URL audit has the report UI shell ready, but the backend should follow the working reference app service path so it can become live as soon as API keys are provided.

## What Changes

- Refactor only the Business Leader URL audit API path.
- Add Supabase lead persistence helpers and SQL migration matching the reference `leads`, `create_pending_lead`, and `finalize_lead` pattern.
- Add Firecrawl scrape, The Companies API enrichment, OpenAI strict JSON audit, deterministic cost model, and automatic Resend email support.
- Keep existing demo fallback when required live keys are missing.
- Do not touch Employee report generation in this change.

## Reference

Source of truth inspected locally:

- `/private/tmp/autonomous-enterprise-platform/src/lib/audit.functions.ts`
- `/private/tmp/autonomous-enterprise-platform/src/lib/audit-types.ts`
- `/private/tmp/autonomous-enterprise-platform/src/lib/cost-model.ts`
- `/private/tmp/autonomous-enterprise-platform/supabase/migrations/*`

