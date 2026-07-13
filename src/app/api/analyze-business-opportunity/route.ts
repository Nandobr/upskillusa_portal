import { NextResponse } from "next/server";
import {
  createLiveBusinessAudit,
  hasRequiredLiveBusinessAuditKey,
  isValidBusinessEmail,
  normalizeBusinessUrl,
} from "@/lib/business-audit-services";
import { defaultLanguage, languages, type Language } from "@/lib/content";
import { createDemoBusinessReport } from "@/lib/implementation-lab";

function parseLanguage(value: unknown): Language {
  return typeof value === "string" && languages.includes(value as Language)
    ? (value as Language)
    : defaultLanguage;
}

function auditErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown audit error";
  if (/fetch failed/i.test(message)) {
    return "The live audit service could not be reached. Please try again in a moment.";
  }
  return message;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { website?: unknown; email?: unknown; language?: unknown };
    const websiteInput = typeof body.website === "string" ? body.website.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const language = parseLanguage(body.language);

    if (!websiteInput || !websiteInput.includes(".")) {
      return NextResponse.json({ ok: false, error: "Enter a valid company URL." }, { status: 400 });
    }

    if (!isValidBusinessEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }

    const { domain } = normalizeBusinessUrl(websiteInput);

    if (!hasRequiredLiveBusinessAuditKey()) {
      return NextResponse.json({
        ok: true,
        report: createDemoBusinessReport(domain, email),
        source: "demo",
        lead_id: null,
        email_sent: false,
      });
    }

    const result = await createLiveBusinessAudit({ websiteInput, email, language });

    return NextResponse.json({
      ok: true,
      report: result.report,
      source: result.source,
      lead_id: result.leadId,
      email_sent: result.emailSent,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: auditErrorMessage(error) }, { status: 500 });
  }
}
