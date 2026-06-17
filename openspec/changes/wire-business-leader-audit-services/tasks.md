## 1. Reference And Current Code Check

- [x] 1.1 Inspect the cloned reference app audit service flow.
- [x] 1.2 Inspect our current business and employee Step 4 API routes.
- [x] 1.3 Confirm Employee reports do not require URL-audit services for this change.

## 2. Business Audit Service Layer

- [x] 2.1 Add shared audit types, strict OpenAI schema, and deterministic cost model.
- [x] 2.2 Add Firecrawl and The Companies API service adapters.
- [x] 2.3 Add Supabase lead RPC helper with no-op behavior when keys are absent.
- [x] 2.4 Add automatic audit email helper matching the reference behavior.

## 3. API Route Integration

- [x] 3.1 Refactor `/api/analyze-business-opportunity` to use the service layer.
- [x] 3.2 Preserve the existing report UI data shape.
- [x] 3.3 Preserve demo fallback when live audit keys are missing.
- [x] 3.4 Leave employee report route untouched.

## 4. Supabase SQL

- [x] 4.1 Add SQL migration for `leads`.
- [x] 4.2 Add SQL RPC functions `create_pending_lead` and `finalize_lead`.

## 5. Verification

- [x] 5.1 Run `openspec validate --all`.
- [x] 5.2 Run `npm run typecheck`.
- [x] 5.3 Run `npm run lint`.
- [x] 5.4 Run `npm run build`.
- [x] 5.5 Ask before browser check.
