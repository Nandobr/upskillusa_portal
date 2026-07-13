import {
  createRangeEmployeeEstimate,
  parseEmployeeRange,
  type EmployeeEstimate,
  type EmployeeEstimateUnavailableReason,
  type EmployeeRange,
} from "./audit-employee-estimate.ts";

export const EMPLOYEE_SEARCH_MAX_RESULTS = 5;
export const EMPLOYEE_SEARCH_MAX_QUERY_LENGTH = 240;
export const EMPLOYEE_SEARCH_MAX_TITLE_LENGTH = 180;
export const EMPLOYEE_SEARCH_MAX_EXCERPT_LENGTH = 500;
export const EMPLOYEE_SEARCH_DEFAULT_TIMEOUT_MS = 4_500;

export type IndexedCompanyResult = {
  url: string;
  title: string;
  description: string;
};

export type TrustedCanonicalCompanyIdentity = {
  companyName: string;
  domain: string;
  source: "the-companies-api" | "official-site";
};

export type OfficialLinkedInCompanyUrlEvidence = {
  url: string;
  source: "the-companies-api" | "official-site";
};

export type AcceptedEmployeeSearchEvidence = {
  url: string;
  title: string;
  excerpt: string;
  observedAt: string;
};

export type EmployeeSearchResolution =
  | {
      status: "accepted";
      estimate: EmployeeEstimate;
      evidence: AcceptedEmployeeSearchEvidence;
    }
  | {
      status: "unavailable";
      reason: EmployeeEstimateUnavailableReason;
    };

export type EmployeeSearchRequestOutcome =
  | {
      status: "success";
      results: IndexedCompanyResult[];
      observedAt: string;
    }
  | {
      status: "unavailable" | "failure";
      reason: EmployeeEstimateUnavailableReason;
      httpStatus?: number;
    };

export function shouldRequestEmployeeSearch(estimate: EmployeeEstimate) {
  return estimate.status === "unknown";
}

export async function requestFirecrawlEmployeeSearch(args: {
  enabled: boolean;
  apiKey?: string;
  companyName: string;
  domain: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): Promise<EmployeeSearchRequestOutcome> {
  if (!args.enabled) return { status: "unavailable", reason: "fallback-disabled" };
  if (!args.apiKey) return { status: "unavailable", reason: "missing-provider-key" };

  const timeoutMs = Math.min(8_000, Math.max(1_000, args.timeoutMs ?? EMPLOYEE_SEARCH_DEFAULT_TIMEOUT_MS));
  const fetchImpl = args.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${args.apiKey}`,
      },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        query: buildEmployeeSearchQuery(args.companyName, args.domain),
        limit: EMPLOYEE_SEARCH_MAX_RESULTS,
        country: "us",
      }),
    });

    if (!response.ok) {
      return {
        status: "failure",
        reason: firecrawlFailureReason(response.status),
        httpStatus: response.status,
      };
    }
    const payload = await response.json().catch(() => null);
    const results = normalizeIndexedCompanyResults(payload);
    if (!results) return { status: "failure", reason: "malformed-response" };
    if (results.length === 0) return { status: "unavailable", reason: "no-results" };
    return { status: "success", results, observedAt: new Date().toISOString() };
  } catch (error) {
    return {
      status: "failure",
      reason: error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")
        ? "timeout"
        : "provider-error",
    };
  }
}

type Candidate = {
  result: IndexedCompanyResult;
  range: EmployeeRange;
};

const LINKEDIN_COMPANY_HOSTS = new Set(["linkedin.com", "www.linkedin.com"]);
const LEGACY_MARKERS = /\b(?:legacy|former|old page|no longer active|archived)\b/i;
const GLOBAL_SCOPE_MARKERS = /\b(?:global|worldwide|international headquarters|global organization)\b/i;
const LOCAL_SCOPE_MARKERS = /\b(?:florida location|florida showroom|local branch|regional office|subsidiary)\b/i;
const RELATED_ENTITY_SCOPE_MARKERS = /\b(?:parent (?:company|organization)|(?:a |the )?division of|(?:a |the )?business unit(?: of)?)\b/i;

export function buildEmployeeSearchQuery(companyName: string, domain: string) {
  const safeName = boundPlainText(companyName, 100);
  const safeDomain = normalizeDomain(domain).slice(0, 100);
  return boundPlainText(
    `${safeName} ${safeDomain} "company size" employees site:linkedin.com/company`,
    EMPLOYEE_SEARCH_MAX_QUERY_LENGTH,
  );
}

export function normalizeIndexedCompanyResults(value: unknown): IndexedCompanyResult[] | null {
  if (!value || typeof value !== "object") return null;
  const root = value as { data?: unknown };
  const rawData = root.data;
  const rows = Array.isArray(rawData)
    ? rawData
    : rawData && typeof rawData === "object" && Array.isArray((rawData as { web?: unknown }).web)
      ? (rawData as { web: unknown[] }).web
      : null;
  if (!rows) return null;

  return rows.slice(0, EMPLOYEE_SEARCH_MAX_RESULTS).flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const item = row as { url?: unknown; title?: unknown; description?: unknown };
    if (typeof item.url !== "string") return [];
    return [{
      url: item.url.slice(0, 500),
      title: boundPlainText(typeof item.title === "string" ? item.title : "", EMPLOYEE_SEARCH_MAX_TITLE_LENGTH),
      description: boundPlainText(
        typeof item.description === "string" ? item.description : "",
        EMPLOYEE_SEARCH_MAX_EXCERPT_LENGTH,
      ),
    }];
  });
}

export function resolveIndexedEmployeeEvidence(args: {
  results: IndexedCompanyResult[];
  companyName: string;
  domain: string;
  canonicalIdentity?: TrustedCanonicalCompanyIdentity | null;
  officialLinkedInEvidence?: OfficialLinkedInCompanyUrlEvidence[];
  observedAt?: string;
}): EmployeeSearchResolution {
  const identityMatches: Candidate[] = [];
  const officialLinkedInUrls = new Set(
    (args.officialLinkedInEvidence ?? [])
      .slice(0, 10)
      .map((evidence) => normalizeLinkedInCompanyUrl(evidence.url))
      .filter((url): url is string => url !== null),
  );
  const singleOfficialLinkedInUrl = officialLinkedInUrls.size === 1
    ? [...officialLinkedInUrls][0]
    : null;
  let sawDomainMismatch = false;
  let sawIdentityMismatch = false;
  let sawAmbiguousScope = false;

  for (const result of args.results.slice(0, EMPLOYEE_SEARCH_MAX_RESULTS)) {
    if (!isLinkedInCompanyPage(result.url)) continue;
    const text = `${result.title} ${result.description}`;
    const range = parseEmployeeRange(text, { requireEmployeeContext: true });
    if (!range) continue;

    const normalizedResultUrl = normalizeLinkedInCompanyUrl(result.url);
    if (officialLinkedInUrls.size > 1) {
      sawAmbiguousScope = true;
      continue;
    }
    if (singleOfficialLinkedInUrl) {
      if (normalizedResultUrl !== singleOfficialLinkedInUrl) {
        sawIdentityMismatch = true;
        continue;
      }
      // The submitted domain's own website or domain-keyed company record points
      // to this exact company page. A name check would incorrectly reject rebrands.
    } else {
      const matchesSubmittedDomain = textMatchesDomain(text, args.domain);
      if (matchesSubmittedDomain) {
        if (!textMatchesCompanyIdentity(result.title, args.companyName, args.domain)) {
          sawIdentityMismatch = true;
          continue;
        }
      } else if (!args.canonicalIdentity || !canonicalIdentityMatchesDomain(args.canonicalIdentity, args.domain)) {
        sawDomainMismatch = true;
        continue;
      } else if (!matchesCanonicalLinkedInIdentity(result, args.canonicalIdentity.companyName)) {
        sawIdentityMismatch = true;
        continue;
      }
    }
    if (LEGACY_MARKERS.test(text) || hasAmbiguousScope(text, args.companyName)) {
      sawAmbiguousScope = true;
      continue;
    }
    identityMatches.push({ result, range });
  }

  if (identityMatches.length === 0) {
    return {
      status: "unavailable",
      reason: sawAmbiguousScope
        ? "ambiguous-scope"
        : sawIdentityMismatch
          ? "identity-mismatch"
          : sawDomainMismatch
            ? "domain-mismatch"
            : "no-match",
    };
  }

  const uniqueRanges = new Map<string, Candidate>();
  for (const candidate of identityMatches) {
    uniqueRanges.set(`${candidate.range.min}:${candidate.range.max ?? "open"}`, candidate);
  }
  if (uniqueRanges.size !== 1) {
    return { status: "unavailable", reason: "conflicting-ranges" };
  }

  const candidate = identityMatches[0];
  const observedAt = args.observedAt ?? new Date().toISOString();
  const excerpt = boundPlainText(candidate.result.description, EMPLOYEE_SEARCH_MAX_EXCERPT_LENGTH);
  const rangeText = candidate.range.max === null
    ? `${candidate.range.min}+ employees`
    : `${candidate.range.min}-${candidate.range.max} employees`;
  const estimate = createRangeEmployeeEstimate(
    rangeText,
    {
      provider: "firecrawl",
      confidence: "medium",
      evidenceUrl: candidate.result.url,
      evidenceExcerpt: excerpt,
      observedAt,
      domainMatch: "matched",
    },
    { requireEmployeeContext: true },
  );
  if (!estimate) return { status: "unavailable", reason: "invalid-range" };

  return {
    status: "accepted",
    estimate,
    evidence: {
      url: candidate.result.url,
      title: candidate.result.title,
      excerpt,
      observedAt,
    },
  };
}

export function boundPlainText(value: string, maxLength: number) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isLinkedInCompanyPage(value: string) {
  return normalizeLinkedInCompanyUrl(value) !== null;
}

export function normalizeLinkedInCompanyUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !LINKEDIN_COMPANY_HOSTS.has(url.hostname.toLowerCase())) return null;
    const match = url.pathname.match(/^\/company\/([^/]+)\/?$/);
    if (!match?.[1]) return null;
    const slug = decodeURIComponent(match[1]).trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
    return `https://www.linkedin.com/company/${slug}`;
  } catch {
    return null;
  }
}

function normalizeDomain(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .replace(/\.$/, "");
}

function textMatchesDomain(text: string, domain: string) {
  const expected = normalizeDomain(domain);
  if (expected.length < 4) return false;
  const escaped = expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(?:^|[^a-z0-9.-])(?:www\\.)?${escaped}(?=$|[^a-z0-9.-]|\\.(?:\\s|$))`,
    "i",
  ).test(text);
}

function normalizeCompanyIdentity(value: string) {
  return value
    .toLowerCase()
    .replace(/\blinkedin\b/g, " ")
    .replace(/\b(?:llc|inc|corp|corporation|company|co|ltd|limited)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function textMatchesCompanyIdentity(title: string, companyName: string, domain: string) {
  const expected = normalizeCompanyIdentity(companyName);
  const titleIdentity = normalizeCompanyIdentity(title);
  const domainStem = normalizeCompanyIdentity(normalizeDomain(domain).split(".")[0]).replace(/\s/g, "");
  const expectedCompact = expected.replace(/\s/g, "");
  const titleCompact = titleIdentity.replace(/\s/g, "");
  if (expectedCompact.length >= 4 && (titleCompact.includes(expectedCompact) || expectedCompact.includes(titleCompact))) {
    return true;
  }
  return domainStem.length >= 5 && titleCompact.includes(domainStem);
}

function canonicalIdentityMatchesDomain(identity: TrustedCanonicalCompanyIdentity, domain: string) {
  return normalizeDomain(identity.domain) === normalizeDomain(domain);
}

function matchesCanonicalLinkedInIdentity(result: IndexedCompanyResult, companyName: string) {
  const normalizedExpected = normalizeCompanyIdentity(companyName);
  const expected = normalizedExpected.replace(/\s/g, "");
  const title = normalizeCompanyIdentity(result.title).replace(/\s/g, "");
  const hasSpecificIdentity = normalizedExpected.split(/\s+/).filter(Boolean).length >= 2 || expected.length >= 8;
  if (!hasSpecificIdentity || title !== expected) return false;

  try {
    const slug = decodeURIComponent(new URL(result.url).pathname.split("/").filter(Boolean)[1] ?? "");
    return normalizeCompanyIdentity(slug).replace(/\s/g, "") === expected;
  } catch {
    return false;
  }
}

function hasAmbiguousScope(text: string, companyName: string) {
  const expectedGlobalScope = /\b(?:global|worldwide|international)\b/i.test(companyName);
  return RELATED_ENTITY_SCOPE_MARKERS.test(text)
    || LOCAL_SCOPE_MARKERS.test(text)
    || (!expectedGlobalScope && GLOBAL_SCOPE_MARKERS.test(text));
}

function firecrawlFailureReason(status: number): EmployeeEstimateUnavailableReason {
  if (status === 401 || status === 403) return "authorization";
  if (status === 402) return "payment-required";
  if (status === 408) return "timeout";
  if (status === 429) return "rate-limited";
  if (status >= 500) return "provider-error";
  return "provider-error";
}
