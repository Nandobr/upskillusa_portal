import type { BusinessOpportunity, BusinessOpportunityReport } from "@/lib/implementation-lab";
import type { Language } from "@/lib/content";
import {
  createUnknownEmployeeEstimate,
  selectAuditEmployeeEstimate,
  type EmployeeEstimate,
} from "./audit-employee-estimate.ts";
import {
  EMPLOYEE_SEARCH_DEFAULT_TIMEOUT_MS,
  requestFirecrawlEmployeeSearch,
  resolveIndexedEmployeeEvidence,
  shouldRequestEmployeeSearch,
  type AcceptedEmployeeSearchEvidence,
  type OfficialLinkedInCompanyUrlEvidence,
  type TrustedCanonicalCompanyIdentity,
  normalizeLinkedInCompanyUrl,
} from "./audit-employee-search.ts";

type ScrapeResult = {
  markdown: string;
  metadata: Record<string, unknown>;
  links: string[];
};

type PainCategory = {
  department: string;
  symptom: string;
};

type CostModel = {
  employees: number | null;
  employee_estimate: EmployeeEstimate;
  industry_label: string;
  addressable_roles: number | null;
  weekly_hours_reclaimable: number | null;
  annual_hours_reclaimable: number | null;
  fully_loaded_cost_per_role: number;
  annual_value_at_risk: number | null;
  five_year_cost_of_inaction: number | null;
  pain_hours_per_year: Array<number | null>;
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
  name?: string | null;
  companyName?: string | null;
  isActive?: boolean | null;
  status?: string | null;
  domainStatus?: string | null;
  domain?: {
    state?: string | null;
  } | null;
  about?: {
    name?: string | null;
    isActive?: boolean | null;
    status?: string | null;
    domainStatus?: string | null;
    totalEmployeesExact?: number | null;
    totalEmployees?: string | null;
    industry?: string | null;
    industries?: string[] | null;
  } | null;
} | null;

export type ProviderFailureReason =
  | "missing-key"
  | "authorization"
  | "payment-required"
  | "timeout"
  | "rate-limited"
  | "provider-error"
  | "malformed-response"
  | "no-results";

export type ProviderOutcome<T> =
  | { status: "success"; data: T; observedAt: string }
  | { status: "unavailable"; reason: ProviderFailureReason }
  | { status: "failure"; reason: ProviderFailureReason; httpStatus?: number };

type EmployeeEvidenceResolution = {
  estimate: EmployeeEstimate;
  searchEvidence: AcceptedEmployeeSearchEvidence | null;
};

type EmployeeSearchConfig = {
  enabled: boolean;
  apiKey?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
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

const languageInstruction: Record<Language, string> = {
  en: "Write all user-facing string values in English.",
  es: "Write all user-facing string values in Spanish. Keep JSON keys, numbers, IDs, and enum-like values in English.",
  pt: "Write all user-facing string values in Brazilian Portuguese. Keep JSON keys, numbers, IDs, and enum-like values in English.",
};

const auditEmailCopy: Record<Language, {
  subject: (company: string) => string;
  diagnostic: string;
  annualCost: string;
  annualCostDetail: string;
  employeeAssumption: string;
  addressableRoles: string;
  recoverable: string;
  fiveYearGap: string;
  fiveYearDetail: string;
  score: string;
  executiveSummary: string;
  operationsHeading: string;
  hoursUnavailable: string;
  notEstimated: string;
  trappedHours: (hours: string) => string;
  roadmapEyebrow: string;
  roadmapDetail: string;
  methodology: string;
  unknownDisclosure: string;
  inactiveDisclosure: string;
  structuredSource: string;
  searchSource: string;
  confidence: Record<"high" | "medium" | "none", string>;
  rangeDisclosure: (range: string, source: string, confidence: string) => string;
  exactDisclosure: (source: string, confidence: string) => string;
}> = {
  en: {
    subject: (company) => `Your AI Readiness Diagnostic for ${company}`,
    diagnostic: "UpSkill USA · AI Readiness Diagnostic",
    annualCost: "Annual Cost of Inaction",
    annualCostDetail: "in labor value locked in repeatable work, every year",
    employeeAssumption: "Employee planning assumption",
    addressableRoles: "addressable roles",
    recoverable: "hrs/wk recoverable",
    fiveYearGap: "5-Year Competitive Gap",
    fiveYearDetail: "if competitors deploy AI before you do.",
    score: "Autonomous Workforce Score",
    executiveSummary: "Executive Summary",
    operationsHeading: "What's hiding in your operations",
    hoursUnavailable: "Hours not estimated",
    notEstimated: "Not estimated",
    trappedHours: (hours) => `~${hours} hrs/yr trapped in this work`,
    roadmapEyebrow: "Your roadmap is ready",
    roadmapDetail: "Sign up to unlock your role-by-role automation map, 90-day pilot plan, and ROI projections by department.",
    methodology: "Methodology: when employee evidence is available, cost figures use the reported count or the conservative lower bound of a reported range, industry-standard fully-loaded labor cost, and automatable-work share. Unknown company size is not estimated. 5-year figure compounded for competitive productivity gap.",
    unknownDisclosure: "Company size unavailable. Employee-based opportunity metrics were not estimated.",
    inactiveDisclosure: "The submitted company domain was identified as inactive.",
    structuredSource: "structured company data",
    searchSource: "public company-size information found online",
    confidence: { high: "high", medium: "medium", none: "none" },
    rangeDisclosure: (range, source, confidence) => `Conservative estimate based on the lower end of the reported ${range} range; source: ${source}; confidence: ${confidence}.`,
    exactDisclosure: (source, confidence) => `Reported employee count from ${source}; confidence: ${confidence}.`,
  },
  es: {
    subject: (company) => `Tu diagnóstico de preparación para IA de ${company}`,
    diagnostic: "UpSkill USA · Diagnóstico de preparación para IA",
    annualCost: "Costo anual de la inacción",
    annualCostDetail: "en valor laboral atrapado en trabajo repetitivo cada año",
    employeeAssumption: "Supuesto de planificación de empleados",
    addressableRoles: "puestos abordables",
    recoverable: "h/sem recuperables",
    fiveYearGap: "Brecha competitiva a 5 años",
    fiveYearDetail: "si tus competidores implementan IA antes que tú.",
    score: "Puntuación de fuerza laboral autónoma",
    executiveSummary: "Resumen ejecutivo",
    operationsHeading: "Lo que se oculta en tus operaciones",
    hoursUnavailable: "Horas no estimadas",
    notEstimated: "No estimado",
    trappedHours: (hours) => `~${hours} h/año atrapadas en este trabajo`,
    roadmapEyebrow: "Tu hoja de ruta está lista",
    roadmapDetail: "Regístrate para desbloquear tu mapa de automatización por puesto, un plan piloto de 90 días y proyecciones de ROI por departamento.",
    methodology: "Metodología: cuando hay evidencia de empleados, los costos usan el conteo reportado o el límite inferior conservador de un rango reportado, el costo laboral total estándar de la industria y la proporción de trabajo automatizable. No se estima un tamaño de empresa desconocido. La cifra a 5 años incorpora la brecha de productividad competitiva.",
    unknownDisclosure: "Tamaño de empresa no disponible. No se estimaron métricas de oportunidad basadas en empleados.",
    inactiveDisclosure: "El dominio de la empresa fue identificado como inactivo.",
    structuredSource: "datos estructurados de la empresa",
    searchSource: "información pública sobre el tamaño de la empresa encontrada en línea",
    confidence: { high: "alta", medium: "media", none: "ninguna" },
    rangeDisclosure: (range, source, confidence) => `Estimación conservadora basada en el límite inferior del rango reportado ${range}; fuente: ${source}; confianza: ${confidence}.`,
    exactDisclosure: (source, confidence) => `Conteo de empleados reportado por ${source}; confianza: ${confidence}.`,
  },
  pt: {
    subject: (company) => `Seu diagnóstico de prontidão para IA da ${company}`,
    diagnostic: "UpSkill USA · Diagnóstico de prontidão para IA",
    annualCost: "Custo anual da inação",
    annualCostDetail: "em valor de trabalho preso a tarefas repetitivas a cada ano",
    employeeAssumption: "Premissa de planejamento de empregados",
    addressableRoles: "funções abordáveis",
    recoverable: "h/sem recuperáveis",
    fiveYearGap: "Lacuna competitiva em 5 anos",
    fiveYearDetail: "se os concorrentes implantarem IA antes de você.",
    score: "Pontuação da força de trabalho autônoma",
    executiveSummary: "Resumo executivo",
    operationsHeading: "O que está escondido nas suas operações",
    hoursUnavailable: "Horas não estimadas",
    notEstimated: "Não estimado",
    trappedHours: (hours) => `~${hours} h/ano presas neste trabalho`,
    roadmapEyebrow: "Seu roteiro está pronto",
    roadmapDetail: "Cadastre-se para desbloquear seu mapa de automação por função, plano-piloto de 90 dias e projeções de ROI por departamento.",
    methodology: "Metodologia: quando há evidência de empregados, os custos usam a contagem informada ou o limite inferior conservador de uma faixa informada, o custo total de trabalho padrão do setor e a parcela de trabalho automatizável. Tamanho de empresa desconhecido não é estimado. O valor de 5 anos incorpora a lacuna competitiva de produtividade.",
    unknownDisclosure: "Tamanho da empresa indisponível. As métricas de oportunidade baseadas em empregados não foram estimadas.",
    inactiveDisclosure: "O domínio da empresa foi identificado como inativo.",
    structuredSource: "dados estruturados da empresa",
    searchSource: "informações públicas sobre o tamanho da empresa encontradas online",
    confidence: { high: "alta", medium: "média", none: "nenhuma" },
    rangeDisclosure: (range, source, confidence) => `Estimativa conservadora baseada no limite inferior da faixa informada ${range}; fonte: ${source}; confiança: ${confidence}.`,
    exactDisclosure: (source, confidence) => `Contagem de empregados informada por ${source}; confiança: ${confidence}.`,
  },
};

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
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function createLiveBusinessAudit(args: {
  websiteInput: string;
  email: string;
  language?: Language;
}): Promise<LiveBusinessAuditResult> {
  const { url, domain } = normalizeBusinessUrl(args.websiteInput);
  let leadId: string | null = null;

  try {
    leadId = await createPendingLead(domain, args.email);
    const [scrapeOutcome, enrichmentOutcome] = await Promise.all([scrapeCompany(url), enrichCompany(domain)]);
    const scrape = scrapeOutcome.status === "success" ? scrapeOutcome.data : null;
    const enrichment = enrichmentOutcome.status === "success" ? enrichmentOutcome.data : null;
    const employeeEvidence = await resolveEmployeeEvidence({
      domain,
      scrape,
      enrichment: enrichment as CompanyEnrichmentLike,
      enrichmentOutcome,
    });
    const llmAudit = await runGeminiAudit({
      domain,
      url,
      scrape,
      enrichment,
      employeeEstimate: employeeEvidence.estimate,
      language: args.language ?? "en",
    });
    const costModel = computeCostModel(enrichment as CompanyEnrichmentLike, llmAudit.pain_categories, employeeEvidence.estimate);
    const audit: AuditReport = { ...llmAudit, cost_model: costModel };
    const report = mapAuditToBusinessReport(audit, domain, args.email);
    const emailSent = await trySendAuditEmail(args.email, domain, report, args.language ?? "en");

    await finalizeLead({
      leadId,
      status: "completed",
      audit,
      enrichment: {
        scrape_metadata: scrape?.metadata ?? null,
        companies_api: enrichment,
        employee_estimate: employeeEvidence.estimate,
        employee_search_evidence: employeeEvidence.searchEvidence,
        provider_diagnostics: {
          website: summarizeProviderOutcome(scrapeOutcome),
          companies_api: summarizeProviderOutcome(enrichmentOutcome),
        },
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

export async function scrapeCompany(url: string): Promise<ProviderOutcome<ScrapeResult>> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return { status: "unavailable", reason: "missing-key" };

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        url,
        formats: ["markdown", "links"],
        onlyMainContent: false,
      }),
    });

    if (!response.ok) return providerHttpFailure(response.status);
    const json = (await response.json().catch(() => null)) as {
      data?: { markdown?: string; metadata?: Record<string, unknown>; links?: unknown };
      markdown?: string;
      metadata?: Record<string, unknown>;
      links?: unknown;
    } | null;
    if (!json || typeof json !== "object") return { status: "failure", reason: "malformed-response" };

    return {
      status: "success",
      observedAt: new Date().toISOString(),
      data: {
        markdown: (json.data?.markdown || json.markdown || "").slice(0, 8000),
        metadata: json.data?.metadata || json.metadata || {},
        links: normalizeBoundedStringList(json.data?.links ?? json.links),
      },
    };
  } catch (error) {
    return { status: "failure", reason: isAbortError(error) ? "timeout" : "provider-error" };
  }
}

export async function enrichCompany(domain: string): Promise<ProviderOutcome<unknown>> {
  const apiKey = process.env.THECOMPANIESAPI_API_KEY;
  if (!apiKey) return { status: "unavailable", reason: "missing-key" };

  try {
    const response = await fetch(`https://api.thecompaniesapi.com/v2/companies/${encodeURIComponent(domain)}`, {
      headers: { Authorization: `Basic ${apiKey}` },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return providerHttpFailure(response.status);
    const data = await response.json().catch(() => null);
    if (!data || typeof data !== "object") return { status: "failure", reason: "malformed-response" };
    return { status: "success", data, observedAt: new Date().toISOString() };
  } catch (error) {
    return { status: "failure", reason: isAbortError(error) ? "timeout" : "provider-error" };
  }
}

export async function resolveEmployeeEvidence(args: {
  domain: string;
  scrape: ScrapeResult | null;
  enrichment: CompanyEnrichmentLike;
  enrichmentOutcome: ProviderOutcome<unknown>;
  searchConfig?: EmployeeSearchConfig;
}): Promise<EmployeeEvidenceResolution> {
  const exact = args.enrichment?.about?.totalEmployeesExact ?? null;
  const bucket = args.enrichment?.about?.totalEmployees ?? null;
  const primaryEstimate = selectAuditEmployeeEstimate({
    exact,
    bucket,
    inactiveDomain: hasTrustedInactiveCompanyEvidence(args.enrichment),
    provider: "the-companies-api",
    observedAt: args.enrichmentOutcome.status === "success" ? args.enrichmentOutcome.observedAt : null,
    domainMatch: "not-required",
  });
  if (!shouldRequestEmployeeSearch(primaryEstimate)) {
    return { estimate: primaryEstimate, searchEvidence: null };
  }

  const canonicalIdentity = canonicalCompanyIdentity(
    args.domain,
    args.scrape,
    args.enrichment,
    args.enrichmentOutcome.status === "success",
  );
  const companyName = canonicalIdentity.companyName;
  const officialLinkedInEvidence = collectOfficialLinkedInEvidence({
    domain: args.domain,
    scrape: args.scrape,
    enrichment: args.enrichment,
    enrichmentSucceeded: args.enrichmentOutcome.status === "success",
  });
  const searchOutcome = await requestFirecrawlEmployeeSearch({
    enabled: args.searchConfig?.enabled ?? process.env.FIRECRAWL_EMPLOYEE_SEARCH_ENABLED === "true",
    apiKey: args.searchConfig?.apiKey ?? process.env.FIRECRAWL_API_KEY,
    companyName,
    domain: args.domain,
    timeoutMs: args.searchConfig?.timeoutMs ?? employeeSearchTimeoutMs(),
    fetchImpl: args.searchConfig?.fetchImpl,
  });
  if (searchOutcome.status !== "success") {
    return {
      estimate: createUnknownEmployeeEstimate(searchOutcome.reason, {
        provider: searchOutcome.reason === "fallback-disabled" || searchOutcome.reason === "missing-provider-key"
          ? "none"
          : "firecrawl",
      }),
      searchEvidence: null,
    };
  }

  const resolution = resolveIndexedEmployeeEvidence({
    results: searchOutcome.results,
    companyName,
    domain: args.domain,
    canonicalIdentity: canonicalIdentity.trustedIdentity,
    officialLinkedInEvidence,
    observedAt: searchOutcome.observedAt,
  });
  if (resolution.status === "accepted") {
    return { estimate: resolution.estimate, searchEvidence: resolution.evidence };
  }
  return {
    estimate: createUnknownEmployeeEstimate(resolution.reason, { provider: "firecrawl" }),
    searchEvidence: null,
  };
}

function normalizeBoundedStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap((item) =>
    typeof item === "string" && item.length <= 2_000 ? [item] : [],
  );
}

function collectOfficialLinkedInEvidence(args: {
  domain: string;
  scrape: ScrapeResult | null;
  enrichment: CompanyEnrichmentLike;
  enrichmentSucceeded: boolean;
}): OfficialLinkedInCompanyUrlEvidence[] {
  const evidence: OfficialLinkedInCompanyUrlEvidence[] = [];
  if (args.scrape && scrapeSourceMatchesDomain(args.scrape.metadata, args.domain)) {
    for (const value of (args.scrape.links ?? []).slice(0, 100)) {
      const url = normalizeLinkedInCompanyUrl(value);
      if (url) evidence.push({ url, source: "official-site" });
    }
  }
  if (args.enrichmentSucceeded) {
    for (const value of boundedObjectStrings(args.enrichment)) {
      const url = normalizeLinkedInCompanyUrl(value);
      if (url) evidence.push({ url, source: "the-companies-api" });
    }
  }
  const unique = new Map<string, OfficialLinkedInCompanyUrlEvidence>();
  for (const item of evidence) unique.set(`${item.source}:${item.url}`, item);
  return [...unique.values()].slice(0, 10);
}

function scrapeSourceMatchesDomain(metadata: Record<string, unknown>, domain: string) {
  const expected = normalizeBusinessUrl(domain).domain.toLowerCase();
  const sourceCandidates = [metadata.sourceURL, metadata.sourceUrl]
    .filter((candidate): candidate is string => typeof candidate === "string" && Boolean(candidate.trim()));
  if (sourceCandidates.length === 0) return false;
  const allMetadataCandidates = [
    ...sourceCandidates,
    metadata.url,
    metadata.canonicalUrl,
    metadata.canonicalURL,
  ].filter((candidate): candidate is string => typeof candidate === "string" && Boolean(candidate.trim()));
  return allMetadataCandidates.every((candidate) => {
    try {
      return normalizeBusinessUrl(candidate).domain.toLowerCase() === expected;
    } catch {
      return false;
    }
  });
}

function boundedObjectStrings(value: unknown) {
  const strings: string[] = [];
  const queue: Array<{ value: unknown; depth: number }> = [{ value, depth: 0 }];
  let visited = 0;
  while (queue.length && visited < 200 && strings.length < 100) {
    const current = queue.shift();
    if (!current) break;
    visited += 1;
    if (typeof current.value === "string") {
      if (current.value.length <= 2_000) strings.push(current.value);
      continue;
    }
    if (!current.value || typeof current.value !== "object" || current.depth >= 5) continue;
    const children = Array.isArray(current.value)
      ? current.value.slice(0, 50)
      : Object.values(current.value as Record<string, unknown>).slice(0, 50);
    for (const child of children) queue.push({ value: child, depth: current.depth + 1 });
  }
  return strings;
}

export function hasTrustedInactiveCompanyEvidence(enrichment: CompanyEnrichmentLike) {
  if (!enrichment) return false;
  if (enrichment.isActive === false || enrichment.about?.isActive === false) return true;
  const statuses = [
    enrichment.status,
    enrichment.domainStatus,
    enrichment.about?.status,
    enrichment.about?.domainStatus,
    enrichment.domain?.state,
  ];
  return statuses.some((status) =>
    typeof status === "string" && /^(?:inactive|parked|closed|defunct)$/i.test(status.trim()),
  );
}

function canonicalCompanyIdentity(
  domain: string,
  scrape: ScrapeResult | null,
  enrichment: CompanyEnrichmentLike,
  enrichmentSucceeded: boolean,
): { companyName: string; trustedIdentity: TrustedCanonicalCompanyIdentity | null } {
  const enrichmentName = enrichment?.name ?? enrichment?.companyName ?? enrichment?.about?.name;
  if (typeof enrichmentName === "string" && enrichmentName.trim()) {
    const companyName = enrichmentName.trim().slice(0, 100);
    return {
      companyName,
      trustedIdentity: enrichmentSucceeded
        ? { companyName, domain, source: "the-companies-api" }
        : null,
    };
  }
  const title = scrape?.metadata?.title;
  if (typeof title === "string" && title.trim()) {
    const officialSiteMatches = scrapeMetadataMatchesDomain(scrape?.metadata ?? {}, domain);
    const officialCompanyName = officialSiteMatches
      ? companyNameFromOfficialPageTitle(title, domain)
      : null;
    const companyName = officialCompanyName
      ?? firstMeaningfulPageTitleSegment(title)
      ?? companyNameFromWebsite(domain);
    return {
      companyName,
      trustedIdentity: officialCompanyName
        ? { companyName: officialCompanyName, domain, source: "official-site" }
        : null,
    };
  }
  return { companyName: companyNameFromWebsite(domain), trustedIdentity: null };
}

const GENERIC_PAGE_TITLE_SEGMENT = /^(?:home|homepage|welcome|official site|official website|website)$/i;

function pageTitleSegments(title: string) {
  return title
    .split(/\s+[-|\u2013\u2014]\s+|[|\u2013\u2014]/)
    .map((segment) => segment.trim().slice(0, 100))
    .filter((segment) => segment && !GENERIC_PAGE_TITLE_SEGMENT.test(segment));
}

function firstMeaningfulPageTitleSegment(title: string) {
  return pageTitleSegments(title)[0] ?? null;
}

function companyNameFromOfficialPageTitle(title: string, domain: string) {
  const domainStem = normalizeCanonicalIdentity(normalizeBusinessUrl(domain).domain.split(".")[0] ?? "");
  if (domainStem.length < 5) return null;

  const corroboratedSegments = pageTitleSegments(title).filter(
    (segment) => normalizeCanonicalIdentity(segment) === domainStem,
  );
  return corroboratedSegments.length === 1 ? corroboratedSegments[0] : null;
}

function normalizeCanonicalIdentity(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(?:llc|inc|corp|corporation|company|co|ltd|limited)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

function scrapeMetadataMatchesDomain(metadata: Record<string, unknown>, domain: string) {
  return scrapeSourceMatchesDomain(metadata, domain);
}

function employeeSearchTimeoutMs() {
  const configured = Number(process.env.FIRECRAWL_EMPLOYEE_SEARCH_TIMEOUT_MS);
  return Number.isFinite(configured)
    ? Math.min(8_000, Math.max(1_000, Math.round(configured)))
    : EMPLOYEE_SEARCH_DEFAULT_TIMEOUT_MS;
}

function summarizeProviderOutcome<T>(outcome: ProviderOutcome<T>) {
  return outcome.status === "success"
    ? { status: outcome.status, observedAt: outcome.observedAt }
    : { status: outcome.status, reason: outcome.reason };
}

function providerHttpFailure(status: number): ProviderOutcome<never> {
  if (status === 401 || status === 403) return { status: "failure", reason: "authorization", httpStatus: status };
  if (status === 402) return { status: "failure", reason: "payment-required", httpStatus: status };
  if (status === 408) return { status: "failure", reason: "timeout", httpStatus: status };
  if (status === 429) return { status: "failure", reason: "rate-limited", httpStatus: status };
  if (status === 404) return { status: "unavailable", reason: "no-results" };
  return { status: "failure", reason: "provider-error", httpStatus: status };
}

function isAbortError(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1]?.trim() || trimmed;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini returned no JSON object");
  }
  return JSON.parse(source.slice(start, end + 1));
}

async function runGeminiAudit(args: {
  domain: string;
  url: string;
  scrape: ScrapeResult | null;
  enrichment: unknown | null;
  employeeEstimate: EmployeeEstimate;
  language: Language;
}): Promise<LlmAuditPart> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const userPayload = {
    domain: args.domain,
    url: args.url,
    scrape_summary: args.scrape?.markdown ?? null,
    scrape_metadata: args.scrape?.metadata ?? null,
    enrichment: args.enrichment ?? null,
    employee_estimate: {
      status: args.employeeEstimate.status,
      value: args.employeeEstimate.value,
      declared_range: args.employeeEstimate.declaredRange,
      basis: args.employeeEstimate.basis,
      provider: args.employeeEstimate.provider,
      confidence: args.employeeEstimate.confidence,
    },
  };

  const prompt = `${AUDIT_SYSTEM_PROMPT}

Schema:
${JSON.stringify(auditJsonSchema, null, 2)}

Language:
${languageInstruction[args.language]}

Employee-size guardrail:
The employee_estimate object is deterministic. If it is known, size_estimate must describe its declared range or reported count. If it is inactive, size_estimate must say the submitted company domain is inactive. If it is unknown, size_estimate must say company size is unavailable. Never infer a different range, vague market segment, or numeric headcount from the website text.

Generate the AI Readiness diagnostic for this company. Data:

${JSON.stringify(userPayload, null, 2)}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini error ${response.status}: ${text.slice(0, 300)}`);
  }

  const json = (await response.json()) as GeminiResponse;
  const content = json.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  if (!content) throw new Error("Gemini returned no content");
  return parseJsonObject(content) as LlmAuditPart;
}

export function computeCostModel(
  enrichment: CompanyEnrichmentLike,
  painCategories: PainCategory[],
  employeeEstimate: EmployeeEstimate,
): CostModel {
  const slug = enrichment?.about?.industry ?? enrichment?.about?.industries?.[0] ?? null;
  const profile = pickIndustry(slug ?? undefined);
  const fullyLoadedCost = Math.round(profile.avgWage * FULLY_LOADED_MULTIPLIER);
  const isInactive = employeeEstimate.status === "inactive";
  const employees = employeeEstimate.value;
  const addressableRoles = isInactive
    ? 0
    : employees === null
      ? null
      : Math.round(employees * profile.addressabilityFactor);
  const weeklyHoursReclaimable = addressableRoles === null
    ? null
    : Math.round(addressableRoles * 40 * profile.automatableHoursPct);
  const annualHoursReclaimable = weeklyHoursReclaimable === null
    ? null
    : weeklyHoursReclaimable * WORKING_WEEKS;
  const hourlyRate = fullyLoadedCost / HOURS_PER_FTE_YEAR;
  const annualValueAtRisk = annualHoursReclaimable === null
    ? null
    : Math.round(annualHoursReclaimable * hourlyRate);
  const fiveYearCostOfInaction = annualValueAtRisk === null
    ? null
    : Math.round(annualValueAtRisk * 5 * FIVE_YEAR_COMPOUND);

  const weights = painCategories.length > 0 ? painCategories.map((_, index) => 1 / (index + 1.6)) : [];
  const weightTotal = weights.reduce((total, value) => total + value, 0) || 1;
  const painHours = annualHoursReclaimable === null
    ? painCategories.map(() => null)
    : weights.map((weight) => Math.round((annualHoursReclaimable * weight) / weightTotal / 100) * 100);

  return {
    employees,
    employee_estimate: employeeEstimate,
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

function pickIndustry(slug: string | undefined): IndustryProfile {
  if (!slug) return DEFAULT_PROFILE;
  const value = slug.toLowerCase();
  for (const [pattern, profile] of INDUSTRY_TABLE) {
    if (pattern.test(value)) return profile;
  }
  return DEFAULT_PROFILE;
}

export function mapAuditToBusinessReport(
  audit: AuditReport,
  website: string,
  email: string,
): BusinessOpportunityReport {
  const cost = audit.cost_model;
  const opportunities = audit.pain_categories.slice(0, 4).map((pain, index) =>
    mapPainToOpportunity(pain, cost.pain_hours_per_year[index] ?? null, index),
  );

  return {
    kind: "business",
    companyName: audit.company_name || companyNameFromWebsite(website),
    website,
    email,
    industry: audit.industry || cost.industry_label,
    sizeEstimate: cost.employee_estimate.declaredRange
      ?? (cost.employee_estimate.status === "known" && cost.employees !== null
        ? `${formatNumber(cost.employees)} employees`
        : cost.employee_estimate.status === "inactive"
          ? "Inactive company"
          : "Company size unavailable"),
    opportunityScore: clampScore(audit.autonomous_workforce_score),
    executiveSummary: audit.executive_summary,
    scoreRationale: audit.score_rationale,
    annualValueAtRisk: cost.annual_value_at_risk,
    fiveYearCostOfInaction: cost.five_year_cost_of_inaction,
    employees: cost.employees,
    employeeEstimate: cost.employee_estimate,
    addressableRoles: cost.addressable_roles,
    weeklyHoursReclaimable: cost.weekly_hours_reclaimable,
    annualHoursReclaimable: cost.annual_hours_reclaimable,
    fteEquivalent: cost.annual_hours_reclaimable === null
      ? null
      : cost.annual_hours_reclaimable / HOURS_PER_FTE_YEAR,
    opportunities,
    isDemo: false,
  };
}

function mapPainToOpportunity(pain: PainCategory, estimatedAnnualHours: number | null, index: number): BusinessOpportunity {
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

async function trySendAuditEmail(
  email: string,
  website: string,
  report: BusinessOpportunityReport,
  language: Language,
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return false;

  const html = renderEmailHtml(report, website, language);
  const subject = auditEmailCopy[language].subject(report.companyName);
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

export function renderEmailHtml(report: BusinessOpportunityReport, website: string, language: Language = "en") {
  const copy = auditEmailCopy[language];
  const painRows = report.opportunities
    .map(
      (opportunity) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eaeaea;">
          <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:700;">${escapeHtml(opportunity.department)}</div>
          <div style="font-size:15px;color:#0f172a;margin-top:4px;">${escapeHtml(opportunity.symptom)}</div>
          <div style="font-size:13px;color:#475569;margin-top:6px;">${opportunity.estimatedAnnualHours === null ? copy.hoursUnavailable : copy.trappedHours(formatNumber(opportunity.estimatedAnnualHours))}</div>
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#0B1F3B;font-weight:700;">${copy.diagnostic}</div>
    <h1 style="font-size:28px;line-height:1.2;margin:8px 0 4px;">${escapeHtml(report.companyName)}</h1>
    <div style="color:#475569;font-size:14px;">${escapeHtml(website)} · ${escapeHtml(report.industry)} · ${escapeHtml(report.sizeEstimate)}</div>

    <div style="margin:28px 0;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#0B1F3B;color:#ffffff;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#F5C84C;font-weight:700;">${copy.annualCost}</div>
      <div style="font-size:48px;font-weight:800;color:#ffffff;line-height:1;margin-top:6px;">${formatEmailUsdShort(report.annualValueAtRisk, language)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:8px;">${copy.annualCostDetail}</div>
      <div style="margin-top:16px;display:block;font-size:13px;color:rgba(255,255,255,0.85);">
        ${copy.employeeAssumption}: ${formatEmailNumber(report.employees, language)} · ${formatEmailNumber(report.addressableRoles, language)} ${copy.addressableRoles} · ${formatEmailNumber(report.weeklyHoursReclaimable, language)} ${copy.recoverable}
      </div>
      <div style="margin-top:8px;font-size:12px;color:rgba(255,255,255,0.72);">${escapeHtml(employeeEstimateDisclosure(report.employeeEstimate, language))}</div>
    </div>

    <div style="margin:0 0 28px;padding:20px;border:1px solid #fde68a;background:#fffbeb;border-radius:12px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#92400e;font-weight:700;">${copy.fiveYearGap}</div>
      <div style="font-size:32px;font-weight:800;color:#0B1F3B;margin-top:4px;">${formatEmailUsdShort(report.fiveYearCostOfInaction, language)}</div>
      <div style="font-size:13px;color:#475569;margin-top:4px;">${copy.fiveYearDetail}</div>
    </div>

    <div style="margin:8px 0 6px;font-size:13px;color:#64748b;">${copy.score}: <b style="color:#0B1F3B;">${Math.round(report.opportunityScore)}/100</b></div>
    <p style="font-size:14px;line-height:1.6;color:#334155;margin:4px 0 0;">${escapeHtml(report.scoreRationale)}</p>

    <h2 style="font-size:18px;margin:28px 0 8px;">${copy.executiveSummary}</h2>
    <p style="font-size:15px;line-height:1.6;color:#1f2937;">${escapeHtml(report.executiveSummary)}</p>

    <h2 style="font-size:18px;margin:28px 0 8px;">${copy.operationsHeading}</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">${painRows}</table>

    <div style="margin:28px 0;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0B1F3B,#1e3a5f);color:#ffffff;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#F5C84C;font-weight:700;">${copy.roadmapEyebrow}</div>
      <div style="font-size:20px;font-weight:700;margin-top:6px;line-height:1.3;">${copy.roadmapDetail}</div>
    </div>

    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eaeaea;font-size:11px;color:#64748b;line-height:1.5;">
      ${copy.methodology}
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

export function employeeEstimateDisclosure(estimate: EmployeeEstimate, language: Language = "en") {
  const copy = auditEmailCopy[language];
  if (estimate.status === "unknown") return copy.unknownDisclosure;
  if (estimate.status === "inactive") return copy.inactiveDisclosure;
  const source = estimate.provider === "the-companies-api" ? copy.structuredSource : copy.searchSource;
  const confidence = copy.confidence[estimate.confidence];
  if (estimate.basis === "range-lower-bound" && estimate.declaredRange) {
    return copy.rangeDisclosure(estimate.declaredRange, source, confidence);
  }
  return copy.exactDisclosure(source, confidence);
}

function formatUsdShort(value: number | null) {
  if (value === null) return "Not estimated";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatNumber(value: number | null) {
  if (value === null) return "Not estimated";
  return Math.round(value).toLocaleString("en-US");
}

function formatEmailNumber(value: number | null, language: Language) {
  if (value === null) return auditEmailCopy[language].notEstimated;
  const locale = language === "es" ? "es-US" : language === "pt" ? "pt-BR" : "en-US";
  return Math.round(value).toLocaleString(locale);
}

function formatEmailUsdShort(value: number | null, language: Language) {
  if (value === null) return auditEmailCopy[language].notEstimated;
  return formatUsdShort(value);
}
