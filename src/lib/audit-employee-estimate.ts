export type EmployeeEstimateStatus = "known" | "unknown" | "inactive";

export type EmployeeEstimateBasis =
  | "reported-exact"
  | "range-lower-bound"
  | "inactive-domain"
  | "unavailable";

export type EmployeeEstimateProvider = "the-companies-api" | "firecrawl" | "none";

export type EmployeeEstimateConfidence = "high" | "medium" | "none";

export type EmployeeEstimateDomainMatch =
  | "matched"
  | "not-required"
  | "unknown"
  | "mismatched";

export type EmployeeEstimateUnavailableReason =
  | "missing-primary-data"
  | "missing-provider-key"
  | "fallback-disabled"
  | "authorization"
  | "payment-required"
  | "timeout"
  | "rate-limited"
  | "provider-error"
  | "malformed-response"
  | "no-results"
  | "no-match"
  | "domain-mismatch"
  | "identity-mismatch"
  | "ambiguous-scope"
  | "conflicting-ranges"
  | "invalid-range";

export type EmployeeRange = {
  min: number;
  max: number | null;
};

export type EmployeeEstimate = {
  status: EmployeeEstimateStatus;
  /** Numeric planning assumption. A range always contributes its lower bound. */
  value: number | null;
  /** Compatibility alias for existing cost-model consumers. */
  employees: number | null;
  range: EmployeeRange | null;
  declaredRange: string | null;
  basis: EmployeeEstimateBasis;
  provider: EmployeeEstimateProvider;
  confidence: EmployeeEstimateConfidence;
  evidenceUrl: string | null;
  evidenceExcerpt: string | null;
  observedAt: string | null;
  domainMatch: EmployeeEstimateDomainMatch;
  unavailableReason: EmployeeEstimateUnavailableReason | null;
};

export type EmployeeEstimateMetadata = Partial<
  Pick<
    EmployeeEstimate,
    | "provider"
    | "confidence"
    | "evidenceUrl"
    | "evidenceExcerpt"
    | "observedAt"
    | "domainMatch"
  >
>;

export type EmployeeEstimateInput = EmployeeEstimateMetadata & {
  exact?: number | null;
  /** Structured employee-range field from the primary enrichment provider. */
  bucket?: string | null;
  /** Must come from trusted structured provider evidence, never generated copy. */
  inactiveDomain?: boolean;
};

export type ParseEmployeeRangeOptions = {
  /**
   * Public snippets must explicitly describe employee/company size. Set to false
   * only for a provider field whose schema already guarantees employee context.
   */
  requireEmployeeContext?: boolean;
};

const MAX_PLAUSIBLE_EMPLOYEES = 10_000_000;
const NUMBER_TOKEN = String.raw`(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*[kK]?`;
const CLOSED_RANGE_PATTERN = new RegExp(
  String.raw`(?<![\d.,+\-\u2013\u2014])(${NUMBER_TOKEN})\s*[-\u2013\u2014]\s*(${NUMBER_TOKEN})(?![\d.,+\-\u2013\u2014])`,
  "g",
);
const OPEN_RANGE_PATTERN = new RegExp(
  String.raw`(?<![\d.,+\-\u2013\u2014])(${NUMBER_TOKEN})\s*\+(?![\d+])`,
  "g",
);

export function parseEmployeeRange(
  value: string | null | undefined,
  { requireEmployeeContext = true }: ParseEmployeeRangeOptions = {},
): EmployeeRange | null {
  if (!value) return null;

  const normalized = value.replace(/\u00a0/g, " ");
  const candidates: EmployeeRange[] = [];

  for (const match of normalized.matchAll(CLOSED_RANGE_PATTERN)) {
    if (requireEmployeeContext && !hasEmployeeContextNearMatch(normalized, match)) continue;
    const min = parseEmployeeNumber(match[1]);
    const max = parseEmployeeNumber(match[2]);
    if (min !== null && max !== null && min < max) candidates.push({ min, max });
  }

  for (const match of normalized.matchAll(OPEN_RANGE_PATTERN)) {
    if (requireEmployeeContext && !hasEmployeeContextNearMatch(normalized, match)) continue;
    const min = parseEmployeeNumber(match[1]);
    if (min !== null) candidates.push({ min, max: null });
  }

  const uniqueCandidates = uniqueRanges(candidates);
  return uniqueCandidates.length === 1 ? uniqueCandidates[0] : null;
}

export function lowerBoundForEmployeeRange(
  value: string | null | undefined,
  options?: ParseEmployeeRangeOptions,
): number | null {
  return parseEmployeeRange(value, options)?.min ?? null;
}

export function formatEmployeeRange(range: EmployeeRange): string {
  const min = range.min.toLocaleString("en-US");
  return range.max === null
    ? `${min}+ employees`
    : `${min}-${range.max.toLocaleString("en-US")} employees`;
}

export function createExactEmployeeEstimate(
  exact: number,
  metadata: EmployeeEstimateMetadata = {},
): EmployeeEstimate | null {
  const rounded = Number.isFinite(exact) ? Math.round(exact) : 0;
  if (!isPlausibleEmployeeNumber(rounded)) return null;

  return {
    status: "known",
    value: rounded,
    employees: rounded,
    range: { min: rounded, max: rounded },
    declaredRange: null,
    basis: "reported-exact",
    ...knownMetadata(metadata, "high"),
    unavailableReason: null,
  };
}

export function createRangeEmployeeEstimate(
  value: string,
  metadata: EmployeeEstimateMetadata = {},
  options: ParseEmployeeRangeOptions = {},
): EmployeeEstimate | null {
  const range = parseEmployeeRange(value, options);
  if (!range) return null;

  return {
    status: "known",
    value: range.min,
    employees: range.min,
    range,
    declaredRange: formatEmployeeRange(range),
    basis: "range-lower-bound",
    ...knownMetadata(metadata, metadata.provider === "firecrawl" ? "medium" : "high"),
    unavailableReason: null,
  };
}

export function createInactiveEmployeeEstimate(
  metadata: EmployeeEstimateMetadata = {},
): EmployeeEstimate {
  return {
    status: "inactive",
    value: null,
    employees: null,
    range: null,
    declaredRange: null,
    basis: "inactive-domain",
    provider: metadata.provider ?? "none",
    confidence: metadata.confidence ?? "high",
    evidenceUrl: metadata.evidenceUrl ?? null,
    evidenceExcerpt: metadata.evidenceExcerpt ?? null,
    observedAt: metadata.observedAt ?? null,
    domainMatch: metadata.domainMatch ?? "not-required",
    unavailableReason: null,
  };
}

export function createUnknownEmployeeEstimate(
  unavailableReason: EmployeeEstimateUnavailableReason = "missing-primary-data",
  metadata: EmployeeEstimateMetadata = {},
): EmployeeEstimate {
  return {
    status: "unknown",
    value: null,
    employees: null,
    range: null,
    declaredRange: null,
    basis: "unavailable",
    provider: metadata.provider ?? "none",
    confidence: "none",
    evidenceUrl: metadata.evidenceUrl ?? null,
    evidenceExcerpt: metadata.evidenceExcerpt ?? null,
    observedAt: metadata.observedAt ?? null,
    domainMatch: metadata.domainMatch ?? "unknown",
    unavailableReason,
  };
}

export function selectAuditEmployeeEstimate({
  exact,
  bucket,
  inactiveDomain,
  ...metadata
}: EmployeeEstimateInput): EmployeeEstimate {
  if (typeof exact === "number") {
    const exactEstimate = createExactEmployeeEstimate(exact, metadata);
    if (exactEstimate) return exactEstimate;
  }

  if (bucket) {
    const rangeEstimate = createRangeEmployeeEstimate(bucket, metadata, {
      requireEmployeeContext: false,
    });
    if (rangeEstimate) return rangeEstimate;
  }

  if (inactiveDomain === true) {
    return createInactiveEmployeeEstimate(metadata);
  }

  return createUnknownEmployeeEstimate("missing-primary-data", metadata);
}

function hasEmployeeContextNearMatch(value: string, match: RegExpMatchArray) {
  const index = match.index ?? 0;
  const start = Math.max(0, index - 48);
  const before = value.slice(start, index);
  const after = value.slice(index + match[0].length, index + match[0].length + 32);
  const explicitPrefix = /(?:employees?|people|staff|workforce|company\s+size|team\s+size)(?:\s+(?:of|is))?[^\d]{0,24}$/i;
  const explicitSuffix = /^\s*(?:full[-\s]?time\s+)?(?:employees?|people|staff)\b/i;
  return explicitPrefix.test(before) || explicitSuffix.test(after);
}

function knownMetadata(
  metadata: EmployeeEstimateMetadata,
  defaultConfidence: Exclude<EmployeeEstimateConfidence, "none">,
) {
  return {
    provider: metadata.provider ?? ("the-companies-api" as const),
    confidence: metadata.confidence ?? defaultConfidence,
    evidenceUrl: metadata.evidenceUrl ?? null,
    evidenceExcerpt: metadata.evidenceExcerpt ?? null,
    observedAt: metadata.observedAt ?? null,
    domainMatch: metadata.domainMatch ?? ("not-required" as const),
  };
}

function parseEmployeeNumber(value: string): number | null {
  const normalized = value.toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
  const multiplier = normalized.endsWith("k") ? 1000 : 1;
  const number = Number(normalized.replace(/k$/, ""));
  const result = number * multiplier;
  return Number.isInteger(result) && isPlausibleEmployeeNumber(result) ? result : null;
}

function isPlausibleEmployeeNumber(value: number) {
  return Number.isSafeInteger(value) && value > 0 && value <= MAX_PLAUSIBLE_EMPLOYEES;
}

function uniqueRanges(ranges: EmployeeRange[]) {
  const unique = new Map<string, EmployeeRange>();
  for (const range of ranges) unique.set(`${range.min}:${range.max ?? "open"}`, range);
  return [...unique.values()];
}
