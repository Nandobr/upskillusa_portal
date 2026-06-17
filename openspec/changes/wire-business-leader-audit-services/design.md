# Design

## Boundary

This change applies only to `/api/analyze-business-opportunity`. The Employee/Personal task report route remains Gemini-only and is not wired to Supabase, Firecrawl, The Companies API, URL-audit lead storage, or Resend.

## Service Sequence

The Business Leader audit follows the reference app sequence:

1. Validate website and email.
2. Normalize the website to URL/domain.
3. Create a pending Supabase lead when Supabase server keys are available.
4. Scrape website content with Firecrawl when `FIRECRAWL_API_KEY` is available.
5. Enrich company metadata with The Companies API when `THECOMPANIESAPI_API_KEY` is available.
6. Generate JSON audit output with Gemini when `GEMINI_API_KEY` is available.
7. Compute value/cost figures deterministically from enrichment and pain categories.
8. Send audit email automatically when Resend configuration is available.
9. Finalize Supabase lead with audit, enrichment, status, and error.

## Missing Keys

If `GEMINI_API_KEY` is missing, the route returns the existing labeled demo report. Firecrawl and The Companies API enrich the live audit when configured. Supabase and Resend are no-ops unless configured.

## Email

The reference app sends the audit email automatically after successful generation. This app supports the same behavior. It prefers the Lovable Resend gateway when `LOVABLE_API_KEY` and `RESEND_API_KEY` exist, and supports direct Resend API with `RESEND_API_KEY` for this Next.js app.
