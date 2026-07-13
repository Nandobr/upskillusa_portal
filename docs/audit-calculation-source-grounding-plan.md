# Audit calculation source-grounding plan

> **Status:** Planning document only. This is not an OpenSpec proposal, no OpenSpec change has been created for this work, and no application behavior is changed by this document.

## Executive summary

The business audit currently produces internally consistent calculations, but its public methodology language overstates how closely the inputs are grounded in named external sources. Industry wages, addressable-role shares, automatable-work shares, the fully-loaded labor multiplier, and the five-year uplift are hardcoded model assumptions inherited from the Lovable reference application. The source comments in that application are broad attributions, not reproducible mappings to specific tables, series, occupations, or study rows.

A defensible future model should:

1. Resolve the audited legal entity, employee scope, NAICS industry, and ownership.
2. Use current, versioned public data for headcount and labor cost where applicable.
3. Separate published facts from product assumptions and derived results.
4. Separate technical AI exposure from feasibility, adoption, utilization, realization, and economic capture.
5. Present conservative, base, and upside scenarios instead of one falsely precise estimate.
6. Retain source, period, transformation, uncertainty, and model-version provenance with every report.

Until that work is implemented and validated, the audit should describe its outputs as directional planning estimates rather than verified savings or source-derived facts.

## Current model

The current calculation is implemented in `src/lib/business-audit-services.ts`. An industry name is matched by regular expression to a hardcoded profile containing:

- average annual wage;
- addressable-role share; and
- automatable-work share.

The model then applies global constants:

| Input | Current value |
|---|---:|
| Hours per FTE year | 2,080 |
| Working weeks | 50 |
| Fully-loaded multiplier | 1.30 |
| Five-year uplift | 1.15 |

The current formula is:

```text
addressable roles = employee count × addressable-role share
recoverable hours/week = rounded addressable roles × 40 × automatable-work share
recoverable hours/year = rounded recoverable hours/week × 50
fully-loaded annual cost = average wage × 1.30
hourly labor value = fully-loaded annual cost ÷ 2,080
annual value = recoverable hours/year × hourly labor value
five-year value = annual value × 5 × 1.15
```

Employee-count handling has already been improved locally: accepted ranges use their conservative lower bound, an unknown company size remains unestimated, and the prior hidden default of 250 is no longer used.

### Why the displayed methodology is misleading

The methodology language implies that figures are derived directly from verified headcount, an industry-standard fully-loaded labor cost, and a published automatable-work share. In practice:

- employee evidence can be a provider-reported exact count or the conservative lower bound of an accepted range; it is not necessarily payroll-verified;
- the hardcoded wage is not linked to a reproducible BLS table row;
- the 1.30 multiplier is not linked to a specific compensation table or period;
- the addressable-role factor is omitted from the methodology statement and has no named external source;
- the automatable-work share is not mapped to a specific McKinsey exhibit or defined measurement;
- the 50-week assumption and intermediate rounding are omitted; and
- `annual value × 5 × 1.15` is a single uplift, not annual compounding.

Applying the wording literally would produce a different result from the code because the wording does not disclose the additional addressability factor.

## Findings from the Lovable reference repository

The reference repository is [BTCompKSU/autonomous-enterprise-platform](https://github.com/BTCompKSU/autonomous-enterprise-platform). Its [cost model at reviewed commit `f228d5f`](https://github.com/BTCompKSU/autonomous-enterprise-platform/blob/f228d5f65301eaf00eb19e2c63f01a28f1b15668/src/lib/cost-model.ts) contains substantially the same industry table and formula used by this app.

For Education, the reference hardcodes:

| Variable | Value | Reference status |
|---|---:|---|
| Base wage | $64,000 | Broadly attributed to BLS, without a table/series mapping |
| Addressable-role share | 40% | Product-model assumption; no specific external citation found |
| Automatable-work share | 22% | Broadly attributed to McKinsey, without an exhibit/row mapping |
| Fully-loaded multiplier | 1.30 | Broad attribution, without a reproducible source mapping |
| Five-year uplift | 1.15 | Product-model assumption |

The reference implementation could also use a range midpoint or a default of 250 employees while its UI described headcount as verified. The current app has corrected that employee-estimation behavior but retained the reference cost-model assumptions.

## Nova Southeastern University example

The reviewed Nova audit used these inputs:

| Input | Value |
|---|---:|
| Employee planning count | 6,160 |
| Education base wage | $64,000 |
| Fully-loaded multiplier | 1.30 |
| Addressable-role share | 40% |
| Automatable-work share | 22% |
| Working weeks | 50 |
| Hours per FTE year | 2,080 |

The code calculates:

```text
addressable roles
= 6,160 × 0.40
= 2,464

recoverable hours/week
= round(2,464 × 40 × 0.22)
= 21,683

recoverable hours/year
= 21,683 × 50
= 1,084,150

fully-loaded annual cost
= $64,000 × 1.30
= $83,200

hourly labor value
= $83,200 ÷ 2,080
= $40

annual value
= 1,084,150 × $40
= $43,366,000 (displayed as $43.4M)

five-year value
= $43,366,000 × 5 × 1.15
= $249,354,500 (displayed as $249.4M)
```

The displayed values therefore follow the current code. They do not, however, prove that each variable is correct for Nova or derived from the named external sources. The reference screenshot also showed a narrative label of “over 10,000 employees” while the deterministic calculation used 6,160, demonstrating why narrative and calculation inputs must share one evidence record.

## Facts, assumptions, and derived values

Every model input must be classified before it is used:

| Class | Meaning | Examples |
|---|---|---|
| Published fact | A value from an identified dataset/table and period | OEWS annual mean wage; ECEC compensation and wage costs |
| Reported evidence | A company/institution value reported by an accepted provider | Employee count; IPEDS staff count |
| Classification | A mapped identifier with evidence and confidence | NAICS, ownership, institution UnitID |
| Observed company value | Measured in the audited organization | Workflow volume; handling time; pilot time savings |
| Scenario assumption | A transparent, editable planning choice | Adoption, realization, economic capture |
| Derived value | Formula output from recorded inputs | Hourly compensation, annual capacity, five-year value |

The UI must not label reported evidence as independently verified, or a scenario assumption as research fact.

## Authoritative source hierarchy

### 1. Entity scope and headcount

For US higher-education institutions, prefer [IPEDS](https://nces.ed.gov/ipeds/) when its institution and employee scope matches the audit. Store the institution UnitID, survey component, reporting period, full-time/part-time treatment, and included entity scope. For Nova, the institution should be reconciled against [IPEDS UnitID 136215](https://nces.ed.gov/ipeds/institution-profile/136215).

If IPEDS is not applicable, use accepted company evidence with source date, scope, and confidence. Never silently combine counts for employees, faculty, contractors, affiliated clinics, or separate legal entities.

### 2. Industry and wage data

Replace regex-only industry selection with an evidence-backed NAICS mapping. Use the most specific supported NAICS level, falling back deliberately when a matching source row is unavailable.

Use BLS Occupational Employment and Wage Statistics industry/ownership data for wages:

- [OEWS tables and downloadable data](https://www.bls.gov/oes/tables.htm)
- [OEWS industry estimates](https://www.bls.gov/oes/current/oessrci.htm)
- [OEWS technical documentation](https://www.bls.gov/oes/current/oes_tec.htm)

For an aggregate payroll-style calculation, annual mean wage (`A_MEAN`) is generally more appropriate than median wage, but this is a model decision that must be documented. Prefer an occupation-weighted industry model when occupation staffing data is available rather than multiplying all workers by one sector-wide wage.

### 3. Employer compensation

OEWS wages exclude employer benefit costs. Derive a compensation factor from BLS Employer Costs for Employee Compensation rather than using a universal 1.30 constant:

```text
employer compensation factor = total employer compensation ÷ wages and salaries
```

Use an ECEC industry/ownership series consistent with the audited entity and wage scope:

- [BLS ECEC overview and data](https://www.bls.gov/ecec/)
- [ECEC private-industry table](https://www.bls.gov/news.release/ecec.t04.htm)

Call the result “employer compensation cost” unless additional overhead sources justify “fully loaded cost.” ECEC includes wages, benefits, and legally required employer costs; it does not automatically include facilities, equipment, recruiting, or general administrative overhead.

### 4. Occupations, tasks, and AI exposure

Use an industry occupation mix and a versioned occupation/task model. [O*NET database downloads](https://www.onetcenter.org/database.html) can support occupational task and work-activity definitions. O*NET task frequency is not a direct percentage of working time, so it cannot alone substantiate recoverable hours.

McKinsey's [2023 generative-AI economic potential report](https://www.mckinsey.com/~/media/mckinsey/business%20functions/mckinsey%20digital/our%20insights/the%20economic%20potential%20of%20generative%20ai%20the%20next%20productivity%20frontier/the-economic-potential-of-generative-ai-the-next-productivity-frontier.pdf) may inform a benchmark, but technical automation potential is not the same as adoption, hours saved, headcount reduction, or realized economic value. Any commercial encoding, redistribution, or branded attribution should receive licensing/legal review under [McKinsey's terms of use](https://www.mckinsey.com/terms-of-use/).

## NAICS and ownership mapping

The future pipeline should resolve and persist:

1. normalized domain and organization name;
2. legal entity and entity aliases;
3. primary NAICS code and label;
4. ownership category (private, state, local, or federal where relevant);
5. source evidence, match confidence, and review state; and
6. fallback level used when an exact source row is unavailable.

For Nova, colleges and universities are generally in the NAICS 6113 family, but the exact code, entity scope, and private/nonprofit ownership must be verified before selecting wage or compensation rows. The system must not infer a detailed code solely from a broad provider string such as “Higher Education.”

## Recommended calculation model

The future model should avoid using one “automatable-work share” as a proxy for every stage between technical capability and business value.

At occupation or workflow level:

```text
theoretical capacity_i
= worker count_i
× employer compensation_i
× technical exposure_i
× operational feasibility_i

realized value_i,t
= theoretical capacity_i
× adoption_i,t
× utilization_i,t
× realization_i,t
× economic capture_i,t

annual realized value_t
= sum(realized value_i,t)
```

Definitions:

- **Technical exposure:** share of tasks that current AI could assist or automate.
- **Operational feasibility:** share practically addressable after physical, regulatory, quality, integration, and human-judgment constraints.
- **Adoption:** share of eligible workers/workflows deployed in a period.
- **Utilization:** actual use among deployed workers/workflows.
- **Realization:** proportion of theoretical time savings observed in practice.
- **Economic capture:** proportion converted into capacity, cost avoidance, revenue, service quality, or another explicitly defined outcome.

If exposure already represents the share of total workforce hours, do not multiply by a second generic addressable-role percentage without proving the factors are independent; doing so can double-count the reduction.

## Five-year scenarios

Replace the single `× 1.15` uplift with an annual scenario model:

```text
five-year gross value = sum(year 1 through year 5 realized value)
five-year net present value
= sum((realized value_t - implementation cost_t) ÷ (1 + discount rate)^t)
```

Each scenario should contain explicit annual assumptions for adoption, realization, wage growth, implementation cost, and—if used—discount rate:

| Scenario | Intended use |
|---|---|
| Conservative | Low exposure/feasibility and slow adoption/realization |
| Base | Central benchmark assumptions |
| Upside | Mature adoption and strong measured realization |

Only use the term “compounded” when a value is actually compounded across periods. “Competitive gap” should be defined as a separate comparator scenario rather than an unexplained percentage uplift.

## Uncertainty and provenance schema

Every persisted input and result should retain:

```text
variable key
value, unit, and value type
classification: published | reported | observed | assumption | derived
publisher and dataset
source URL
table, series, row, or record identifier
release/reference period
retrieval date
geography
NAICS, SOC, ownership, and entity scope
raw value
transformation/formula
uncertainty measure (RSE, interval, confidence, or scenario range)
model/formula version
review state, reviewer, and approval date
license/use constraints
```

Historical reports must preserve the exact dataset and model versions used. Dataset refreshes must not silently recalculate previously delivered reports.

## Data pipeline and update governance

A production pipeline should:

1. download source files only from official publishers;
2. retain immutable raw snapshots and checksums;
3. validate schemas, units, suppression markers, duplicate keys, and row counts;
4. normalize source identifiers without discarding raw fields;
5. generate a versioned, reviewable application artifact;
6. compare new and prior releases for material changes;
7. require review for mapping or formula changes;
8. support rollback to the prior approved dataset/model; and
9. record release notes and effective dates.

Refresh cadence should follow each publisher's release schedule, not an arbitrary application deployment schedule. Source-data updates, model changes, and copy changes should be independently versioned.

## Recommended UI methodology wording

Until the source-grounded model exists, use language such as:

> **Methodology:** This directional planning estimate uses the reported employee count or conservative lower bound of an accepted range, combined with product-model assumptions for industry labor cost, addressable work, and automatable work. It is not a verified savings forecast. The five-year value applies a single planning uplift, not annual compounding.

After implementation, use dynamic wording generated from the actual report provenance, for example:

> **Methodology:** Employee scope and industry classification are shown below. Labor cost uses the cited BLS OEWS wage period and BLS ECEC employer-compensation factor. AI exposure is a research benchmark; feasibility, adoption, utilization, realization, and economic capture are scenario assumptions. Values are directional planning ranges, not guaranteed savings.

The report should include an expandable “How this was calculated” table showing each variable, value, type, period, source, and transformation. Narrative company-size labels must be generated from the same evidence record used by the cost model.

## Validation and tests

Future implementation should include:

- source-ingestion fixture tests using frozen official files;
- schema, unit, suppression, and source-period validation;
- NAICS/ownership mapping fixtures with reviewed expected outcomes;
- deterministic formula tests with hand-calculated examples;
- tests preventing double-counting of exposure and addressability;
- scenario and five-year year-by-year tests;
- provenance completeness and historical reproducibility tests;
- unknown, missing, stale, conflicting, and low-confidence evidence tests;
- UI, print/PDF, email, localization, accessibility, and mobile tests;
- copy tests preventing “verified,” “compounded,” or “source-derived” claims when unsupported;
- shadow comparisons against the current model across multiple industries and company sizes; and
- expert review of a sample of occupation/task mappings and outcomes.

Nova should be a required fixture, but validation must also cover small and large employers, public and private ownership, range-only employee evidence, inactive organizations, unknown headcount, and industries outside education.

## Phased future implementation

### Phase 0 — terminology and risk containment

- Correct the methodology copy and remove unsupported attribution/compounding claims.
- Label current outputs as directional model estimates.
- Preserve the current model version in reports.

### Phase 1 — evidence and provenance foundation

- Define the facts/assumptions/derived schema.
- Persist entity, headcount, source, scope, and confidence.
- Add provenance rendering before changing calculation values.

### Phase 2 — classification and labor-cost sources

- Add reviewed NAICS and ownership mapping.
- Ingest OEWS industry/ownership wage data.
- Derive employer compensation from compatible ECEC data.
- Establish source update and approval workflows.

### Phase 3 — exposure and scenario model

- Select a legally usable, reproducible occupation/task exposure method.
- Add feasibility, adoption, utilization, realization, and economic-capture scenarios.
- Replace the five-year uplift with an annual scenario model.

### Phase 4 — shadow validation

- Run old and new models side by side without changing customer-facing values.
- Review material differences across a representative company set.
- Validate Nova and other domain/industry/ownership fixtures with subject-matter reviewers.

### Phase 5 — controlled release

- Publish calculation details and uncertainty ranges.
- Version and migrate report serialization safely.
- Monitor source failures, mapping confidence, result drift, and user interpretation.
- Retain rollback capability.

An OpenSpec proposal should be created only after the open product decisions below are resolved sufficiently to define scope and acceptance criteria.

## Open product decisions

1. Is the primary output theoretical capacity, time savings, employer cost capacity, cost avoidance, revenue opportunity, or net present value?
2. Which employee scope should be used for universities: all staff, FTE staff, faculty/staff only, or another defined population?
3. Should institution-specific IPEDS data override commercial company-provider data, and under what recency/scope rules?
4. Should labor cost be sector-wide, occupation-weighted, geography-adjusted, or organization-provided?
5. Which AI-exposure dataset/method may be used commercially, and what attribution or licensing is required?
6. Who owns and approves feasibility and realization assumptions?
7. Are users allowed to edit scenario assumptions, and should those edits be persisted in the report?
8. What constitutes a “verified” input, and who may confer that status?
9. Which uncertainty presentation is clearest: ranges, confidence labels, sensitivity analysis, or all three?
10. Should the five-year output show gross capacity, implementation costs, discounted net value, a competitor comparator, or several clearly separated measures?
11. How frequently should source datasets and model mappings be reviewed?
12. What historical reproducibility and audit-retention period is required?

## Direct source links

- [Lovable reference repository](https://github.com/BTCompKSU/autonomous-enterprise-platform)
- [Lovable reference cost model, reviewed commit](https://github.com/BTCompKSU/autonomous-enterprise-platform/blob/f228d5f65301eaf00eb19e2c63f01a28f1b15668/src/lib/cost-model.ts)
- [IPEDS](https://nces.ed.gov/ipeds/)
- [Nova Southeastern University IPEDS profile, UnitID 136215](https://nces.ed.gov/ipeds/institution-profile/136215)
- [BLS OEWS tables](https://www.bls.gov/oes/tables.htm)
- [BLS OEWS industry estimates](https://www.bls.gov/oes/current/oessrci.htm)
- [BLS OEWS technical documentation](https://www.bls.gov/oes/current/oes_tec.htm)
- [BLS ECEC](https://www.bls.gov/ecec/)
- [BLS ECEC private-industry table](https://www.bls.gov/news.release/ecec.t04.htm)
- [O*NET database downloads](https://www.onetcenter.org/database.html)
- [McKinsey 2023 generative-AI report](https://www.mckinsey.com/~/media/mckinsey/business%20functions/mckinsey%20digital/our%20insights/the%20economic%20potential%20of%20generative%20ai%20the%20next%20productivity%20frontier/the-economic-potential-of-generative-ai-the-next-productivity-frontier.pdf)
- [McKinsey terms of use](https://www.mckinsey.com/terms-of-use/)
