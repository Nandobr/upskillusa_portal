import type { BusinessOpportunity, BusinessOpportunityReport } from "@/lib/implementation-lab";

type ScrapeResult = {
  markdown: string;
  metadata: Record<string, unknown>;
};

type PainCategory = {
  department: string;
  symptom: string;
};

type CostModel = {
  employees: number;
  employee_source: "exact" | "bucket-midpoint" | "default";
  industry_label: string;
  addressable_roles: number;
  weekly_hours_reclaimable: number;
  annual_hours_reclaimable: number;
  fully_loaded_cost_per_role: number;
  annual_value_at_risk: number;
  five_year_cost_of_inaction: number;
  pain_hours_per_year: number[];
};

type LlmAuditPart = {
  company_name: string;
  industry: string;
  size_estimate: string;
  autonomous_workforce_score: number;
  score_rationale: string;
  executive_summary: string;
  pain_categories: PainCategory[];
};

type AuditReport = LlmAuditPart & {
  cost_model: CostModel;
};

type CompanyEnrichmentLike = {
  about?: {
    totalEmployeesExact?: number | null;
    totalEmployees?: string | null;
    industry?: string | null;
    industries?: string[] | null;
  } | null;
} | null;

type OpenAiChatResponse = {
  choices?: { message?: { content?: string } }[];
};

type LiveBusinessAuditResult = {
  report: BusinessOpportunityReport;
  leadId: string | null;
  emailSent: boolean;
  source: "live";
};

type IndustryProfile = {
  label: string;
  avgWage: number;
  addressabilityFactor: number;
  automatableHoursPct: number;
};

const AUDIT_SYSTEM_PROMPT = `You are an enterprise AI deployment strategist for UpSkill USA - "The Reliable Autonomous Workforce Platform".

Given enrichment data about a company, produce a SHORT diagnostic that names operational pain - but does NOT prescribe solutions. Your output drives motivation; the actual playbook is gated behind signup.

Required outputs:
- "Autonomous Workforce Score" (0-100): the percent of this company's workflows that could realistically run end-to-end with AI emulators at high reliability today. Calibrate based on industry, size, and tech stack signals.
- score_rationale: 1-2 sentences explaining the score, citing specific signals from the data.
- executive_summary: EXACTLY 2 sentences. Open with the operational reality at this company. Close with the strategic risk of waiting. Do NOT mention specific AI solutions, vendors, or playbook items.
- pain_categories: 3-4 items. Each has a "department" and a "symptom" - a one-sentence description of the WORK that is currently manual and repetitive at this company. NAME THE WOUND, NEVER THE BANDAGE. Do not say "could be automated", "AI emulators could", or recommend any tool/process.

Tone: serious, executive, defensible. No hype, no emojis, no marketing language. Every claim should sound like it came from a McKinsey diagnostic, not a sales deck.

Return ONLY valid JSON matching the provided schema.`;

const auditJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "company_name",
    "industry",
    "size_estimate",
    "autonomous_workforce_score",
    "score_rationale",
    "executive_summary",
    "pain_categories",
  ],
  properties: {
    company_name: { type: "string" },
    industry: { type: "string" },
    size_estimate: { type: "string" },
    autonomous_workforce_score: { type: "number", minimum: 0, maximum: 100 },
    score_rationale: { type: "string" },
    executive_summary: { type: "string" },
    pain_categories: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["department", "symptom"],
        properties: {
          department: { type: "string" },
          symptom: { type: "string" },
        },
      },
    },
  },
} as const;

const INDUSTRY_TABLE: Array<[RegExp, IndustryProfile]> = [
  [/bank|financ|insur|capital|invest/, { label: "Financial services", avgWage: 95_000, addressabilityFactor: 0.55, automatableHoursPct: 0.3 }],
  [/legal|law/, { label: "Legal services", avgWage: 105_000, addressabilityFactor: 0.5, automatableHoursPct: 0.27 }],
  [/software|saas|internet|technolog|computer/, { label: "Software & technology", avgWage: 115_000, addressabilityFactor: 0.5, automatableHoursPct: 0.28 }],
  [/health|hospital|medical|pharma|biotech/, { label: "Healthcare", avgWage: 78_000, addressabilityFactor: 0.4, automatableHoursPct: 0.22 }],
  [/retail|ecommerce|consumer/, { label: "Retail & consumer", avgWage: 58_000, addressabilityFactor: 0.45, automatableHoursPct: 0.25 }],
  [/manufactur|industrial|automotive/, { label: "Manufacturing", avgWage: 68_000, addressabilityFactor: 0.35, automatableHoursPct: 0.24 }],
  [/logistic|transport|supply|shipping/, { label: "Logistics & transportation", avgWage: 62_000, addressabilityFactor: 0.4, automatableHoursPct: 0.26 }],
  [/educat|school|university|e-learning/, { label: "Education", avgWage: 64_000, addressabilityFactor: 0.4, automatableHoursPct: 0.22 }],
  [/media|publish|marketing|advertis/, { label: "Media & marketing", avgWage: 82_000, addressabilityFactor: 0.55, automatableHoursPct: 0.32 }],
  [/govern|public|nonprofit|family-services|social/, { label: "Public sector & social services", avgWage: 66_000, addressabilityFactor: 0.45, automatableHoursPct: 0.24 }],
  [/real.?estate|property/, { label: "Real estate", avgWage: 72_000, addressabilityFactor: 0.45, automatableHoursPct: 0.26 }],
  [/consult|profession.*service/, { label: "Professional services", avgWage: 92_000, addressabilityFactor: 0.55, automatableHoursPct: 0.3 }],
  [/energy|utilit|oil|gas/, { label: "Energy & utilities", avgWage: 88_000, addressabilityFactor: 0.35, automatableHoursPct: 0.22 }],
  [/hospitality|restaurant|hotel|travel/, { label: "Hospitality & travel", avgWage: 52_000, addressabilityFactor: 0.4, automatableHoursPct: 0.24 }],
];

const DEFAULT_PROFILE: IndustryProfile = {
  label: "Cross-industry",
  avgWage: 78_000,
  addressabilityFactor: 0.45,
  automatableHoursPct: 0.25,
};

const HOURS_PER_FTE_YEAR = 2080;
const WORKING_WEEKS = 50;
const FULLY_LOADED_MULTIPLIER = 1.3;
const FIVE_YEAR_COMPOUND = 1.15;
const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const DEFAULT_FROM_ADDRESS = "UpSkill USA <support@vibegreeting.com>";

export function normalizeBusinessUrl(input: string) {
  const raw = input.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  return {
    url: url.toString(),
    domain: url.hostname.replace(/^www\./i, ""),
  };
}

export function isValidBusinessEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function hasRequiredLiveBusinessAuditKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function createLiveBusinessAudit(args: {
  websiteInput: string;
  email: string;
}): Promise<LiveBusinessAuditResult> {
  const { url, domain } = normalizeBusinessUrl(args.websiteInput);
  let leadId: string | null = null;

  try {
    leadId = await createPendingLead(domain, args.email);
    const [scrape, enrichment] = await Promise.all([scrapeCompany(url), enrichCompany(domain)]);
    const llmAudit = await runOpenAiAudit({ domain, url, scrape, enrichment });
    const costModel = computeCostModel(enrichment as CompanyEnrichmentLike, llmAudit.pain_categories);
    const audit: AuditReport = { ...llmAudit, cost_model: costModel };
    const report = mapAuditToBusinessReport(audit, domain, args.email);
    const emailSent = await trySendAuditEmail(args.email, domain, report);

    await finalizeLead({
      leadId,
      status: "completed",
      audit,
      enrichment: {
        scrape_metadata: scrape?.metadata ?? null,
        companies_api: enrichment,
      },
      error: null,
    });

    return { report, leadId, emailSent, source: "live" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown business audit error";
    await finalizeLead({
      leadId,
      status: "failed",
      audit: null,
      enrichment: null,
      error: message,
    });
    throw error;
  }
}

async function scrapeCompany(url: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) return null;
    const json = (await response.json()) as {
      data?: { markdown?: string; metadata?: Record<string, unknown> };
      markdown?: string;
      metadata?: Record<string, unknown>;
    };

    return {
      markdown: (json.data?.markdown || json.markdown || "").slice(0, 8000),
      metadata: json.data?.metadata || json.metadata || {},
    };
  } catch {
    return null;
  }
}

async function enrichCompany(domain: string): Promise<unknown | null> {
  const apiKey = process.env.THECOMPANIESAPI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://api.thecompaniesapi.com/v2/companies/${encodeURIComponent(domain)}`, {
      headers: { Authorization: `Basic ${apiKey}` },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function runOpenAiAudit(args: {
  domain: string;
  url: string;
  scrape: ScrapeResult | null;
  enrichment: unknown | null;
}): Promise<LlmAuditPart> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const userPayload = {
    domain: args.domain,
    url: args.url,
    scrape_summary: args.scrape?.markdown ?? null,
    scrape_metadata: args.scrape?.metadata ?? null,
    enrichment: args.enrichment ?? null,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_AUDIT_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ai_readiness_audit",
          strict: true,
          schema: auditJsonSchema,
        },
      },
      messages: [
        { role: "system", content: AUDIT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate the AI Readiness diagnostic for this company. Data:\n\n${JSON.stringify(
            userPayload,
            null,
            2,
          )}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text.slice(0, 300)}`);
  }

  const json = (await response.json()) as OpenAiChatResponse;
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");
  return JSON.parse(content) as LlmAuditPart;
}

function computeCostModel(enrichment: CompanyEnrichmentLike, painCategories: PainCategory[]): CostModel {
  const exact = enrichment?.about?.totalEmployeesExact ?? null;
  const bucket = enrichment?.about?.totalEmployees ?? null;
  const slug = enrichment?.about?.industry ?? enrichment?.about?.industries?.[0] ?? null;

  let employees: number;
  let source: CostModel["employee_source"];
  if (typeof exact === "number" && exact > 0) {
    employees = Math.round(exact);
    source = "exact";
  } else {
    const midpoint = midpointForBucket(bucket ?? undefined);
    if (midpoint) {
      employees = midpoint;
      source = "bucket-midpoint";
    } else {
      employees = 250;
      source = "default";
    }
  }

  const profile = pickIndustry(slug ?? undefined);
  const addressableRoles = Math.round(employees * profile.addressabilityFactor);
  const weeklyHoursReclaimable = Math.round(addressableRoles * 40 * profile.automatableHoursPct);
  const annualHoursReclaimable = weeklyHoursReclaimable * WORKING_WEEKS;
  const fullyLoadedCost = Math.round(profile.avgWage * FULLY_LOADED_MULTIPLIER);
  const hourlyRate = fullyLoadedCost / HOURS_PER_FTE_YEAR;
  const annualValueAtRisk = Math.round(annualHoursReclaimable * hourlyRate);
  const fiveYearCostOfInaction = Math.round(annualValueAtRisk * 5 * FIVE_YEAR_COMPOUND);

  const weights = painCategories.length > 0 ? painCategories.map((_, index) => 1 / (index + 1.6)) : [];
  const weightTotal = weights.reduce((total, value) => total + value, 0) || 1;
  const painHours = weights.map((weight) =>
    Math.round((annualHoursReclaimable * weight) / weightTotal / 100) * 100,
  );

  return {
    employees,
    employee_source: source,
    industry_label: profile.label,
    addressable_roles: addressableRoles,
    weekly_hours_reclaimable: weeklyHoursReclaimable,
    annual_hours_reclaimable: annualHoursReclaimable,
    fully_loaded_cost_per_role: fullyLoadedCost,
    annual_value_at_risk: annualValueAtRisk,
    five_year_cost_of_inaction: fiveYearCostOfInaction,
    pain_hours_per_year: painHours,
  };
}

function midpointForBucket(bucket: string | undefined): number | null {
  if (!bucket) return null;
  const map: Record<string, number> = {
    "1-10": 5,
    "11-50": 30,
    "51-200": 125,
    "201-500": 350,
    "501-1k": 750,
    "1k-5k": 3000,
    "5k-10k": 7500,
    "10k-50k": 30000,
    "50k-100k": 75000,
    "100k+": 150000,
  };
  return map[bucket] ?? null;
}

function pickIndustry(slug: string | undefined): IndustryProfile {
  if (!slug) return DEFAULT_PROFILE;
  const value = slug.toLowerCase();
  for (const [pattern, profile] of INDUSTRY_TABLE) {
    if (pattern.test(value)) return profile;
  }
  return DEFAULT_PROFILE;
}

function mapAuditToBusinessReport(
  audit: AuditReport,
  website: string,
  email: string,
): BusinessOpportunityReport {
  const cost = audit.cost_model;
  const opportunities = audit.pain_categories.slice(0, 4).map((pain, index) =>
    mapPainToOpportunity(pain, cost.pain_hours_per_year[index] ?? 0, index),
  );

  return {
    kind: "business",
    companyName: audit.company_name || companyNameFromWebsite(website),
    website,
    email,
    industry: audit.industry || cost.industry_label,
    sizeEstimate: audit.size_estimate || `${formatNumber(cost.employees)} employees`,
    opportunityScore: clampScore(audit.autonomous_workforce_score),
    executiveSummary: audit.executive_summary,
    scoreRationale: audit.score_rationale,
    annualValueAtRisk: cost.annual_value_at_risk,
    fiveYearCostOfInaction: cost.five_year_cost_of_inaction,
    employees: cost.employees,
    addressableRoles: cost.addressable_roles,
    weeklyHoursReclaimable: cost.weekly_hours_reclaimable,
    annualHoursReclaimable: cost.annual_hours_reclaimable,
    fteEquivalent: cost.annual_hours_reclaimable / HOURS_PER_FTE_YEAR,
    opportunities,
    isDemo: false,
  };
}

function mapPainToOpportunity(pain: PainCategory, estimatedAnnualHours: number, index: number): BusinessOpportunity {
  const department = pain.department || "Operations";
  return {
    id: slugify(`${department}-${index + 1}`),
    department,
    symptom: pain.symptom,
    estimatedAnnualHours,
    pilotLabel: `${department} workflow pilot`,
    aiAction: "Map repeatable inputs, draft first-pass work, and route exceptions for human review.",
    humanReview: `${department} owner reviews exceptions, risk, and final decisions.`,
  };
}

async function createPendingLead(website: string, email: string): Promise<string | null> {
  if (!hasSupabaseServerConfig()) return null;
  return await supabaseRpc<string>("create_pending_lead", {
    _website: website,
    _email: email,
  });
}

async function finalizeLead(args: {
  leadId: string | null;
  status: "completed" | "failed";
  audit: AuditReport | null;
  enrichment: unknown | null;
  error: string | null;
}) {
  if (!args.leadId || !hasSupabaseServerConfig()) return;
  await supabaseRpc<null>("finalize_lead", {
    _lead_id: args.leadId,
    _status: args.status,
    _audit: args.audit,
    _enrichment: args.enrichment,
    _error: args.error,
  });
}

function hasSupabaseServerConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function supabaseRpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration");
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase RPC ${fn} failed (${response.status}): ${text.slice(0, 240)}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function trySendAuditEmail(email: string, website: string, report: BusinessOpportunityReport): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return false;

  const html = renderEmailHtml(report, website);
  const subject = `Your AI Readiness Diagnostic for ${report.companyName}`;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_ADDRESS;

  try {
    if (process.env.LOVABLE_API_KEY) {
      const response = await fetch(`${RESEND_GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": resendApiKey,
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject,
          html,
        }),
      });
      return response.ok;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject,
        html,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function renderEmailHtml(report: BusinessOpportunityReport, website: string) {
  const painRows = report.opportunities
    .map(
      (opportunity) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eaeaea;">
          <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:700;">${escapeHtml(opportunity.department)}</div>
          <div style="font-size:15px;color:#0f172a;margin-top:4px;">${escapeHtml(opportunity.symptom)}</div>
          <div style="font-size:13px;color:#475569;margin-top:6px;">~${formatNumber(opportunity.estimatedAnnualHours)} hrs/yr trapped in this work</div>
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#0B1F3B;font-weight:700;">UpSkill USA · AI Readiness Diagnostic</div>
    <h1 style="font-size:28px;line-height:1.2;margin:8px 0 4px;">${escapeHtml(report.companyName)}</h1>
    <div style="color:#475569;font-size:14px;">${escapeHtml(website)} · ${escapeHtml(report.industry)} · ${escapeHtml(report.sizeEstimate)}</div>

    <div style="margin:28px 0;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#0B1F3B;color:#ffffff;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#F5C84C;font-weight:700;">Annual Cost of Inaction</div>
      <div style="font-size:48px;font-weight:800;color:#ffffff;line-height:1;margin-top:6px;">${formatUsdShort(report.annualValueAtRisk)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:8px;">in labor value locked in repeatable work, every year</div>
      <div style="margin-top:16px;display:block;font-size:13px;color:rgba(255,255,255,0.85);">
        ${formatNumber(report.employees)} employees · ${formatNumber(report.addressableRoles)} addressable roles · ${formatNumber(report.weeklyHoursReclaimable)} hrs/wk recoverable
      </div>
    </div>

    <div style="margin:0 0 28px;padding:20px;border:1px solid #fde68a;background:#fffbeb;border-radius:12px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#92400e;font-weight:700;">5-Year Competitive Gap</div>
      <div style="font-size:32px;font-weight:800;color:#0B1F3B;margin-top:4px;">${formatUsdShort(report.fiveYearCostOfInaction)}</div>
      <div style="font-size:13px;color:#475569;margin-top:4px;">if competitors deploy AI before you do.</div>
    </div>

    <div style="margin:8px 0 6px;font-size:13px;color:#64748b;">Autonomous Workforce Score: <b style="color:#0B1F3B;">${Math.round(report.opportunityScore)}/100</b></div>
    <p style="font-size:14px;line-height:1.6;color:#334155;margin:4px 0 0;">${escapeHtml(report.scoreRationale)}</p>

    <h2 style="font-size:18px;margin:28px 0 8px;">Executive Summary</h2>
    <p style="font-size:15px;line-height:1.6;color:#1f2937;">${escapeHtml(report.executiveSummary)}</p>

    <h2 style="font-size:18px;margin:28px 0 8px;">What's hiding in your operations</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">${painRows}</table>

    <div style="margin:28px 0;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0B1F3B,#1e3a5f);color:#ffffff;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#F5C84C;font-weight:700;">Your roadmap is ready</div>
      <div style="font-size:20px;font-weight:700;margin-top:6px;line-height:1.3;">Sign up to unlock your role-by-role automation map, 90-day pilot plan, and ROI projections by department.</div>
    </div>

    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eaeaea;font-size:11px;color:#64748b;line-height:1.5;">
      Methodology: cost figures derived from headcount x industry-standard fully-loaded labor cost x automatable-work share. 5-year figure compounded for competitive productivity gap.
    </div>
  </div>
</body></html>`;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function companyNameFromWebsite(website: string) {
  const domain = website.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0] || "Company";
  const name = domain.split(".")[0] || "Company";
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatUsdShort(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatNumber(value: number) {
  return Math.round(value).toLocaleString("en-US");
}
