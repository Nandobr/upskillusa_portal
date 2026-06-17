import { NextResponse } from "next/server";
import {
  createLiveBusinessAudit,
  hasRequiredLiveBusinessAuditKey,
  isValidBusinessEmail,
  normalizeBusinessUrl,
} from "@/lib/business-audit-services";
import { createDemoBusinessReport } from "@/lib/implementation-lab";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { website?: unknown; email?: unknown };
    const websiteInput = typeof body.website === "string" ? body.website.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

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

    const result = await createLiveBusinessAudit({ websiteInput, email });

    return NextResponse.json({
      ok: true,
      report: result.report,
      source: result.source,
      lead_id: result.leadId,
      email_sent: result.emailSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown audit error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
