## 1. Localized Homepage Launcher

- [x] 1.1 Add typed EN/ES/PT homepage launcher copy for the company URL label, placeholder, validation error, and CTA, using the exact English text `Get your free AI Opportunity Report` and the existing localized Watch Demo label.
- [x] 1.2 Add controlled homepage hero URL state and validation with a programmatic label, URL input semantics, Enter submission, visible localized `role="alert"` feedback, and no homepage audit API request.
- [x] 1.3 On valid submit, replace only the Implement draft with a fresh `defaultDraft.implement` containing `audience: "business"`, the trimmed URL, and an empty email, then navigate to `/implement` while preserving Inspire, Learn, and Adapt drafts.
- [x] 1.4 Add the hero launcher and `/demo` action beneath the existing homepage introduction, omit the trust-claim row, and keep the existing overview heading and four framework cards unchanged directly below the hero.

## 2. Legacy Homepage Audit Retirement

- [x] 2.1 Add a best-effort, idempotent homepage cleanup for `upskillusa.homepageAuditReport.v1` and `.v2` that never hydrates old report/contact data and does not break the launcher when local storage is unavailable.
- [x] 2.2 Remove the homepage-only audit payload/storage types and helpers, form/submission/loading/error behavior, inline report component, and imports while retaining every estimate/report helper still used by `BusinessOpportunityReportView` and Implement.
- [x] 2.3 Add responsive homepage hero launcher styles for a wide flexible desktop form, wrapping localized CTA text, visible focus, 44px controls, and stacked 320px/390px mobile layouts.
- [x] 2.4 Remove every base and responsive `.homepage-audit`/`.homepage-audit-*` selector, verify zero remaining references, and retain shared `.business-audit-*`, estimate-disclosure, loading, and report styles.
- [x] 2.5 Compact the homepage hero launcher on desktop by reducing its overall width and the input/CTA heights while retaining 44px minimum targets, localized CTA wrapping, and the existing mobile stacking.
- [x] 2.6 Further reduce the desktop launcher width and input/CTA height while keeping controls at least 44px, preserving localized wrapping, focus treatment, and mobile stacking.
- [x] 2.7 Increase the top primary-navigation font size without causing desktop or mobile header collisions.
- [x] 2.8 Rename the user-facing `Inspire` framework/page label to `Imagine` in EN and equivalent ES/PT copy while keeping the `/inspire` route and internal draft keys unchanged.
- [x] 2.9 Reduce the homepage Watch Demo button’s desktop height by approximately 30 percent, while preserving a 44px mobile touch target, localized text, and `/demo` behavior.
- [x] 2.10 Reduce only the homepage hero headline scale by roughly 10–15 percent on desktop while preserving readable mobile wrapping and leaving other page headings unchanged.

## 3. Handoff and Regression Verification

- [x] 3.1 Add deterministic checks for valid/invalid homepage URL handling, zero homepage audit requests, fresh business-draft staging, preservation of non-Implement drafts, stale Step 4 email/report/pilot/guardrail removal, and legacy storage cleanup.
- [x] 3.2 Extend localization checks for the exact English CTA, complete ES/PT launcher copy, Watch Demo, validation text, and absence of homepage timing/security claims.
- [x] 3.3 Use browser automation with a mocked audit endpoint to verify Home-to-Implement navigation, Business Leader selection, URL prefill, empty required email, exactly one request after Implement submission, and rendering through the existing Implement business report.
- [x] 3.4 Verify keyboard operation, accessible labeling/errors/focus, the `/demo` link, exactly four unchanged framework cards, and no overflow at desktop plus 920px, 620px, 390px, and 320px viewports.
- [x] 3.5 Regression-test direct Implement business and employee paths, then run the audit test suite, localization tests, lint, typecheck, production build, and strict OpenSpec validation.
- [x] 3.6 Re-verify desktop and mobile launcher proportions, overflow behavior, deterministic checks, lint, typecheck, production build, and strict OpenSpec validation after the compact sizing adjustment.
- [x] 3.7 Re-verify desktop/mobile launcher sizing, header navigation fit, Imagine localization and routes, then run deterministic tests, lint, typecheck, production build, and strict OpenSpec validation.
- [x] 3.8 Verify the Watch Demo button’s desktop/mobile rendered heights and route, then run lint, typecheck, production build, and strict OpenSpec validation.
- [x] 3.9 Verify the homepage headline scale and wrapping at desktop/mobile widths, then run lint, typecheck, production build, and strict OpenSpec validation.
