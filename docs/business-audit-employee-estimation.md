# Business audit employee estimation

The Companies API remains the primary employee-data source. When it returns neither a usable exact count nor a recognized range, the server may make one Firecrawl Search request for indexed company-size evidence. Accepted ranges use their lower bound for planning calculations.

## Server configuration

- `FIRECRAWL_EMPLOYEE_SEARCH_ENABLED=true` enables the fallback. Any other value is the kill switch; live audits continue with an unknown employee estimate.
- `FIRECRAWL_API_KEY` is used only by server code and must never use a `NEXT_PUBLIC_` prefix or be included in client bundles.
- `FIRECRAWL_EMPLOYEE_SEARCH_TIMEOUT_MS` is optional. Values are constrained to 1,000–8,000 ms; the default is 4,500 ms.

Each eligible audit issues at most one `POST /v2/search` request with at most five indexed results. The request intentionally omits `scrapeOptions` and does not scrape LinkedIn pages or employee profiles. Stored evidence is limited to normalized estimate metadata and a bounded accepted-result excerpt.

Monitor fallback request volume, latency, Firecrawl credit consumption, accepted-result rate, and machine-readable failure reasons. If latency, cost, or match quality exceeds the operational budget, disable `FIRECRAWL_EMPLOYEE_SEARCH_ENABLED`; no report-code deployment is required.

## Production-readiness verification

Run the deterministic readiness check in CI or locally. It uses mocked responses, spends no provider credits, verifies disabled and enabled behavior, and records only sanitized latency, request-count, outcome, and reason observations:

```sh
npm run audit:readiness:test
```

An optional live smoke check is available only through the explicit `--live` flag. It reads server configuration from the process environment (and `.env.local` when supported), never prints keys, company names, domains, queries, excerpts, or URLs, and enforces a maximum of one Firecrawl `/v2/search` request:

```sh
npm run audit:readiness:test -- --live --company "Example Company" --domain example.com
```

The live command consumes Firecrawl search credit and must not be placed in deterministic CI. Run it only against an approved company/domain fixture after confirming `FIRECRAWL_EMPLOYEE_SEARCH_ENABLED=true`, the operational credit budget, and the expected one-request charge. Use the default deterministic command to verify the kill switch without network access or credit usage.

### Sanitized live observation

On 2026-07-12, the opt-in live readiness check recorded `requestCount=1`, `latencyMs=1615`, `outcome=unavailable`, and `reason=domain-mismatch`. The strict identity/domain validator rejected the indexed result as designed; this is an expected, nonfatal fallback outcome, and the audit remains in the unknown employee-size state. The check used one provider request and one corresponding search credit. No company, domain, query, result URL, excerpt, or provider key is retained in this observation.
