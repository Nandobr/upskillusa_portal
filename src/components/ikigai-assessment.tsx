"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  Mic,
  Palette,
  RefreshCw,
  Scale,
  Sparkles,
  Waves,
  Wrench,
  Zap,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { mergeWithDefaults, usePlanDraft } from "@/components/plan-provider";
import { usePortalContent } from "@/components/language-provider";
import { occupations } from "@/lib/data/occupations";
import {
  assessmentCopy,
  computeIkigaiMatches,
  defaultAssessmentResult,
  feelingOptions,
  formatCurrency,
  formatNumber,
  formatOutlook,
  getBestActionOccupation,
  getCategoryLabel,
  getComparedOccupations,
  getMatchOccupations,
  getPathway,
  getRecommendations,
  humanSkills,
  interestAreas,
  pathways,
  vulnerabilityLabels,
  workStyleOptions,
  type IkigaiAssessmentResult,
  type Occupation,
  type PathwayId,
  type Recommendation,
} from "@/lib/ikigai-assessment";
import type { InspirePlanInput } from "@/lib/plan";

type AssessmentStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const pathwayIcons: Record<PathwayId, LucideIcon> = {
  explorer: GraduationCap,
  "market-ready": ClipboardCheck,
  pivot: RefreshCw,
  amplify: Zap,
};

const skillIcons: Record<string, LucideIcon> = {
  heart: Heart,
  lightbulb: Lightbulb,
  wrench: Wrench,
  award: Award,
  scale: Scale,
  mic: Mic,
  flask: FlaskConical,
  palette: Palette,
  handshake: Handshake,
  waves: Waves,
  chart: BarChart3,
  book: BookOpen,
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function buildLegacyFields(assessment: IkigaiAssessmentResult): Pick<
  InspirePlanInput,
  "role" | "organization" | "motivation" | "desiredOutcome" | "humanStrengths"
> {
  const topMatch = getMatchOccupations(assessment.matches.slice(0, 1), occupations)[0]?.occupation;
  const pathway = getPathway(assessment.pathwayId);

  return {
    role: topMatch?.title ?? "",
    organization: pathway?.name ?? "",
    motivation: assessment.currentSituation,
    desiredOutcome: topMatch
      ? `explore ${topMatch.title} as an AI-resilient career direction`
      : "",
    humanStrengths: assessment.humanSkills.join(", "),
  };
}

function buildUpdatedInspire(
  current: InspirePlanInput,
  assessment: IkigaiAssessmentResult,
): InspirePlanInput {
  return {
    ...current,
    ...buildLegacyFields(assessment),
    assessment,
  };
}

function SectionShell({
  children,
  complete,
  eyebrow,
  step,
  title,
}: {
  children: ReactNode;
  complete?: boolean;
  eyebrow: string;
  step: number;
  title: string;
}) {
  return (
    <section className={`assessment-step-card ${complete ? "complete" : ""}`}>
      <div className="assessment-step-heading">
        <span className="assessment-step-number">{step}</span>
        <div>
          <span className="assessment-step-eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`assessment-choice ${active ? "selected" : ""}`}
      type="button"
      onClick={onClick}
    >
      <span className="assessment-choice-mark" aria-hidden />
      <span>{children}</span>
    </button>
  );
}

function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`assessment-chip ${active ? "selected" : ""}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="assessment-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}

function getVulnerabilityClass(score: number) {
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function getComparisonValueClass(label: string, occupation: Occupation) {
  if (label === "AI Vulnerability") return getVulnerabilityClass(occupation.vulnerability);
  if (label === "AI Exposure") return "exposure";
  if (label === "Growth Outlook") {
    const outlook = occupation.outlook ?? 0;
    if (outlook >= 10) return "growth-high";
    if (outlook >= 0) return "growth";
    return "growth-negative";
  }
  if (label === "Employment" || label === "Median Pay") return "metric-strong";
  return "";
}

function getInitialAssessmentStep(assessment: IkigaiAssessmentResult): AssessmentStep {
  if (!assessment.pathwayId) return 0;
  if (assessment.compareSlugs.length >= 2 || assessment.recommendations.length > 0) return 8;
  if (assessment.matches.length > 0) return 7;
  if (assessment.workStyle.length > 0 || assessment.interests.length > 0) return 6;
  if (assessment.humanSkills.length > 0) return 5;
  if (assessment.feelings.length > 0) return 4;
  if (assessment.currentSituation) return 3;
  return 1;
}

function AssessmentProgress({ step }: { step: Exclude<AssessmentStep, 0> }) {
  return (
    <div className="assessment-progress-wrap" aria-label={`Step ${step} of 8`}>
      <div className="assessment-progress">
        <span style={{ width: `${Math.round((step / 8) * 100)}%` }} />
      </div>
      <span>Step {step} of 8</span>
    </div>
  );
}

export function IkigaiAssessment() {
  const router = useRouter();
  const { content } = usePortalContent();
  const { draft, updateInspire } = usePlanDraft();
  const values = mergeWithDefaults(draft).inspire;
  const assessment = values.assessment;
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(() =>
    getInitialAssessmentStep(assessment),
  );
  const activeStep =
    currentStep === 0 && assessment.pathwayId ? getInitialAssessmentStep(assessment) : currentStep;
  const hasAssessmentProgress =
    Boolean(assessment.pathwayId) ||
    Boolean(assessment.currentSituation) ||
    assessment.feelings.length > 0 ||
    assessment.humanSkills.length > 0 ||
    assessment.interests.length > 0 ||
    assessment.workStyle.length > 0 ||
    assessment.matches.length > 0 ||
    assessment.compareSlugs.length > 0;
  const pathway = getPathway(assessment.pathwayId);
  const currentFeelings = pathway ? feelingOptions[pathway.id] : [];
  const rankedMatches = getMatchOccupations(assessment.matches, occupations);
  const comparedOccupations = getComparedOccupations(assessment.compareSlugs, occupations);
  const bestActionOccupation = getBestActionOccupation(
    assessment.compareSlugs,
    assessment.matches,
    occupations,
  );
  const computedRecommendations = getRecommendations(bestActionOccupation, assessment.pathwayId);
  const displayedRecommendations =
    computedRecommendations.length > 0 ? computedRecommendations : assessment.recommendations;

  function saveAssessment(nextAssessment: IkigaiAssessmentResult) {
    updateInspire(buildUpdatedInspire(values, nextAssessment));
  }

  function updateAssessment(
    updater: (current: IkigaiAssessmentResult) => IkigaiAssessmentResult,
  ) {
    saveAssessment(updater(assessment));
  }

  function resetDownstream(current: IkigaiAssessmentResult): IkigaiAssessmentResult {
    return {
      ...current,
      matches: [],
      compareSlugs: [],
      recommendations: [],
      savedAt: undefined,
    };
  }

  function choosePathway(pathwayId: PathwayId) {
    saveAssessment({
      ...defaultAssessmentResult,
      pathwayId,
    });
    setCurrentStep(1);
  }

  function resetAssessment() {
    saveAssessment(defaultAssessmentResult);
    setCurrentStep(0);
  }

  function confirmResetAssessment() {
    if (window.confirm("Start the assessment over? This will clear your current assessment answers.")) {
      resetAssessment();
    }
  }

  function computeMatches() {
    const matches = computeIkigaiMatches(assessment, occupations);

    saveAssessment({
      ...assessment,
      matches,
      compareSlugs: [],
      recommendations: [],
      savedAt: new Date().toISOString(),
    });
    setCurrentStep(7);
  }

  function toggleCompare(occupation: Occupation) {
    const exists = assessment.compareSlugs.includes(occupation.slug);
    const compareSlugs = exists
      ? assessment.compareSlugs.filter((slug) => slug !== occupation.slug)
      : [...assessment.compareSlugs, occupation.slug].slice(0, 3);
    const best = getBestActionOccupation(compareSlugs, assessment.matches, occupations);
    const recommendations = getRecommendations(best, assessment.pathwayId);

    saveAssessment({
      ...assessment,
      compareSlugs,
      recommendations,
      savedAt: new Date().toISOString(),
    });
  }

  function saveAndGo(href: string) {
    saveAssessment({ ...assessment, savedAt: new Date().toISOString() });
    router.push(href);
  }

  function goToComparison() {
    const best = getBestActionOccupation(assessment.compareSlugs, assessment.matches, occupations);
    saveAssessment({
      ...assessment,
      recommendations: getRecommendations(best, assessment.pathwayId),
      savedAt: new Date().toISOString(),
    });
    setCurrentStep(8);
  }

  return (
    <article className="assessment-panel">
      <div className="assessment-intro">
        <div className="assessment-intro-top">
          <span className="demo-label">{assessmentCopy.label}</span>
          {hasAssessmentProgress ? (
            <button
              className="assessment-reset-button"
              type="button"
              onClick={confirmResetAssessment}
            >
              Start over
            </button>
          ) : null}
        </div>
        <p className="assessment-intro-summary">
          {content.frameworks.inspire.summary}
        </p>
        <p className="assessment-note">{assessmentCopy.storageNote}</p>
      </div>

      {activeStep === 0 || !pathway ? (
        <SectionShell
          complete={Boolean(pathway)}
          eyebrow="Choose your pathway"
          step={1}
          title="Where are you starting from?"
        >
          <div className="pathway-grid assessment-pathways">
            {pathways.map((item) => {
              const Icon = pathwayIcons[item.id];
              return (
                <button
                  aria-pressed={assessment.pathwayId === item.id}
                  className={`pathway-card assessment-pathway-card ${
                    assessment.pathwayId === item.id ? "selected" : ""
                  }`}
                  key={item.id}
                  type="button"
                  onClick={() => choosePathway(item.id)}
                >
                  <Icon size={24} aria-hidden />
                  <strong>{item.name}</strong>
                  <span>{item.audience}</span>
                  <p>{item.desc}</p>
                </button>
              );
            })}
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 1 ? (
        <SectionShell complete={Boolean(assessment.name)} eyebrow="IKIGAI preamble" step={1} title={pathway.preamble.title}>
          <div className="assessment-preamble">
            <div>
              <strong>{assessmentCopy.ikigaiTitle}</strong>
              <p>{assessmentCopy.ikigaiBody}</p>
            </div>
            <div className="assessment-preamble-main">
              <span className="assessment-preamble-icon" aria-hidden>
                {pathway.icon}
              </span>
              <p>{pathway.preamble.message}</p>
              <p className="assessment-preamble-tagline">{assessmentCopy.tagline}</p>
            </div>
            <label className="field assessment-name-field">
              <span>{assessmentCopy.firstNameLabel}</span>
              <input
                placeholder={assessmentCopy.firstNamePlaceholder}
                value={assessment.name}
                onChange={(event) =>
                  updateAssessment((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={resetAssessment}>
              {assessmentCopy.maybeLaterLabel}
            </button>
            <button className="button primary" type="button" onClick={() => setCurrentStep(2)}>
              {assessmentCopy.beginLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 2 ? (
        <SectionShell
          complete={Boolean(assessment.currentSituation)}
          eyebrow="Current situation"
          step={2}
          title={assessment.name ? `${assessment.name}, ${pathway.preamble.prompt}` : pathway.preamble.prompt}
        >
          <AssessmentProgress step={2} />
          <p className="assessment-step-subtitle">Select the option that best describes you right now:</p>
          <div className="assessment-choice-list">
            {pathway.situationOptions.map((option) => (
              <ChoiceButton
                active={assessment.currentSituation === option}
                key={option}
                onClick={() =>
                  updateAssessment((current) =>
                    resetDownstream({
                      ...current,
                      currentSituation: option,
                      feelings: [],
                      humanSkills: [],
                      interests: [],
                      workStyle: [],
                    }),
                  )
                }
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(1)}>
              {assessmentCopy.backLabel}
            </button>
            <button
              className="button primary"
              type="button"
              disabled={!assessment.currentSituation}
              onClick={() => setCurrentStep(3)}
            >
              {assessmentCopy.continueLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 3 ? (
        <SectionShell complete={assessment.feelings.length > 0} eyebrow="Feelings check-in" step={3} title="How are you feeling about all this?">
          <AssessmentProgress step={3} />
          <p className="assessment-step-subtitle">Be honest — there are no wrong answers. Select all that resonate:</p>
          <div className="assessment-chip-grid">
            {currentFeelings.map((option) => (
              <ChipButton
                active={assessment.feelings.includes(option)}
                key={option}
                onClick={() =>
                  updateAssessment((current) =>
                    resetDownstream({
                      ...current,
                      feelings: toggleValue(current.feelings, option),
                      humanSkills: [],
                      interests: [],
                      workStyle: [],
                    }),
                  )
                }
              >
                {option}
              </ChipButton>
            ))}
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(2)}>
              {assessmentCopy.backLabel}
            </button>
            <button className="button primary" type="button" onClick={() => setCurrentStep(4)}>
              {assessmentCopy.continueLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 4 ? (
        <SectionShell complete={assessment.humanSkills.length > 0} eyebrow="What you are good at" step={4} title="Let's Discover Your Human Superpowers">
          <AssessmentProgress step={4} />
          <p className="assessment-step-subtitle">
            {'IKIGAI asks: "What are you good at?" — These are the skills AI '}
            <em>cannot</em>
            {" replace. Pick your top 3–4:"}
          </p>
          <div className="assessment-skill-grid">
            {humanSkills.map((skill) => {
              const Icon = skill.icon ? skillIcons[skill.icon] ?? Sparkles : Sparkles;
              return (
                <button
                  aria-pressed={assessment.humanSkills.includes(skill.name)}
                  className={`assessment-skill-card ${
                    assessment.humanSkills.includes(skill.name) ? "selected" : ""
                  }`}
                  key={skill.name}
                  type="button"
                  onClick={() =>
                    updateAssessment((current) =>
                      resetDownstream({
                        ...current,
                        humanSkills: toggleValue(current.humanSkills, skill.name),
                        interests: [],
                        workStyle: [],
                      }),
                    )
                  }
                >
                  <Icon size={20} aria-hidden />
                  <strong>{skill.name}</strong>
                  <span>{skill.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(3)}>
              {assessmentCopy.backLabel}
            </button>
            <button
              className="button primary"
              type="button"
              disabled={assessment.humanSkills.length < 1}
              onClick={() => setCurrentStep(5)}
            >
              {assessmentCopy.continueLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 5 ? (
        <SectionShell complete={assessment.interests.length > 0} eyebrow="What you love" step={5} title="What Lights You Up?">
          <AssessmentProgress step={5} />
          <p className="assessment-step-subtitle">
            {'IKIGAI asks: "What do you love?" — Pick 2–3 areas that genuinely interest you:'}
          </p>
          <div className="assessment-chip-grid">
            {interestAreas.map((interest) => (
              <ChipButton
                active={assessment.interests.includes(interest.name)}
                key={interest.name}
                onClick={() =>
                  updateAssessment((current) =>
                    resetDownstream({
                      ...current,
                      interests: toggleValue(current.interests, interest.name),
                      workStyle: [],
                    }),
                  )
                }
              >
                {interest.name}
              </ChipButton>
            ))}
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(4)}>
              {assessmentCopy.backLabel}
            </button>
            <button
              className="button primary"
              type="button"
              disabled={assessment.interests.length < 1}
              onClick={() => setCurrentStep(6)}
            >
              {assessmentCopy.continueLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 6 ? (
        <SectionShell complete={assessment.workStyle.length > 0} eyebrow="How you want to work" step={6} title="How Do You Want to Work?">
          <AssessmentProgress step={6} />
          <p className="assessment-step-subtitle">
            {'Select the work styles that feel most like "you":'}
          </p>
          <div className="assessment-choice-list">
            {workStyleOptions.map((option) => (
              <ChoiceButton
                active={assessment.workStyle.includes(option.name)}
                key={option.name}
                onClick={() =>
                  updateAssessment((current) =>
                    resetDownstream({
                      ...current,
                      workStyle: toggleValue(current.workStyle, option.name),
                    }),
                  )
                }
              >
                {option.name}
              </ChoiceButton>
            ))}
          </div>
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(5)}>
              {assessmentCopy.backLabel}
            </button>
            <button className="button primary" type="button" onClick={computeMatches}>
              {assessmentCopy.seeMatchesLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 7 ? (
        <SectionShell complete={assessment.matches.length > 0} eyebrow="Ranked matches" step={7} title={`${assessment.name ? `${assessment.name}, here` : "Here"} Are Your Top Career Matches`}>
          <AssessmentProgress step={7} />
          {rankedMatches.length > 0 ? (
            <>
              <p className="assessment-step-subtitle">
                Based on your human superpowers ({assessment.humanSkills.slice(0, 3).join(", ")}), interests ({assessment.interests.slice(0, 3).join(", ")}), and work style preferences, we narrowed 342 occupations to these {rankedMatches.length} matches:
              </p>
              <p className="assessment-note">{assessmentCopy.sourceNote}</p>
              <div className="match-card-list">
                {rankedMatches.map(({ occupation, score }, index) => {
                  const selected = assessment.compareSlugs.includes(occupation.slug);
                  const vulnerabilityLabel =
                    vulnerabilityLabels[occupation.vulnerability] ?? occupation.vulnerability_label;

                  return (
                    <article className={`match-card ${selected ? "selected" : ""}`} key={occupation.slug}>
                      <div className="match-rank">#{index + 1}</div>
                      <div className="match-card-body">
                        <div className="match-card-title-row">
                          <h4>{occupation.title}</h4>
                          <span className="match-score">Score {score}</span>
                        </div>
                        <p>{getCategoryLabel(occupation.category)}</p>
                        <div className="match-metrics">
                          <span className={`vulnerability-pill ${getVulnerabilityClass(occupation.vulnerability)}`}>
                            {vulnerabilityLabel} ({occupation.vulnerability}/10)
                          </span>
                          <Metric label="Pay" value={formatCurrency(occupation.pay)} />
                          <Metric label="Growth" value={formatOutlook(occupation.outlook)} />
                          <Metric label="Jobs" value={formatNumber(occupation.jobs)} />
                        </div>
                      </div>
                      <button
                        aria-pressed={selected}
                        className={`button ${selected ? "ghost" : "blue"} match-compare-button`}
                        type="button"
                        onClick={() => toggleCompare(occupation)}
                      >
                        {selected ? "✓ Compare" : "+ Compare"}
                      </button>
                    </article>
                  );
                })}
              </div>
              {assessment.compareSlugs.length > 0 ? (
                <div className="compare-bar">
                  <span>{assessment.compareSlugs.length} selected for comparison</span>
                  <button
                    className="button blue"
                    type="button"
                    disabled={assessment.compareSlugs.length < 2}
                    onClick={goToComparison}
                  >
                    {assessmentCopy.compareSideBySideLabel}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <p className="empty-state">Select work styles and generate matches to see results.</p>
          )}
          <div className="assessment-step-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(6)}>
              {assessmentCopy.backLabel}
            </button>
            <button
              className="button primary"
              type="button"
              disabled={assessment.compareSlugs.length < 2}
              onClick={goToComparison}
              title={assessment.compareSlugs.length < 2 ? "Select at least 2 careers to compare" : undefined}
            >
              {assessmentCopy.compareSelectedLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      {pathway && activeStep === 8 ? (
        <SectionShell complete={comparedOccupations.length >= 2} eyebrow="Compare up to three" step={8} title={assessmentCopy.comparisonTitle}>
          <AssessmentProgress step={8} />
          <p className="assessment-step-subtitle">
            {"Here's how your selected careers stack up against each other and against AI:"}
          </p>
          {comparedOccupations.length >= 2 ? (
            <>
              <div className="comparison-wrap">
                <div className="comparison-table-scroll">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        {comparedOccupations.map((occupation) => (
                          <th className="compare-col-header" key={occupation.slug}>
                            <span className="compare-occ-title">{occupation.title}</span>
                            <span className="compare-occ-cat">{getCategoryLabel(occupation.category)}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["AI Vulnerability", (occupation: Occupation) => `${occupation.vulnerability}/10`],
                        ["AI Exposure", (occupation: Occupation) => `${occupation.exposure}/10`],
                        ["Employment", (occupation: Occupation) => formatNumber(occupation.jobs)],
                        ["Median Pay", (occupation: Occupation) => formatCurrency(occupation.pay)],
                        ["Growth Outlook", (occupation: Occupation) => formatOutlook(occupation.outlook)],
                        ["Education", (occupation: Occupation) => occupation.education],
                      ].map(([label, formatter]) => {
                        const rowLabel = label as string;

                        return (
                          <tr key={rowLabel}>
                            <td>{rowLabel}</td>
                            {comparedOccupations.map((occupation) => (
                              <td
                                className={getComparisonValueClass(rowLabel, occupation)}
                                key={occupation.slug}
                              >
                                {(formatter as (item: Occupation) => string)(occupation)}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="comparison-rationales">
                  {comparedOccupations.map((occupation) => (
                    <article className="comparison-rationale" key={occupation.slug}>
                      <h4>{occupation.title} — AI Analysis:</h4>
                      <p>{occupation.exposure_rationale}</p>
                      <a href={occupation.url} rel="noreferrer" target="_blank">
                        View full BLS profile →
                      </a>
                    </article>
                  ))}
                </div>
              </div>
              <details className="assessment-review-section">
                <summary>▶ Review & Edit Your Responses</summary>
                <div className="assessment-review-content">
                  <div className="review-item"><strong>Pathway:</strong> {pathway.name}</div>
                  <div className="review-item"><strong>Situation:</strong> {assessment.currentSituation || "Not specified"}</div>
                  <div className="review-item"><strong>Feeling:</strong> {assessment.feelings.join(", ") || "Not specified"}</div>
                  <div className="review-item"><strong>Human Skills:</strong> {assessment.humanSkills.join(", ") || "None selected"}</div>
                  <div className="review-item"><strong>Interests:</strong> {assessment.interests.join(", ") || "None selected"}</div>
                  <div className="review-item"><strong>Work Style:</strong> {assessment.workStyle.join(", ") || "None selected"}</div>
                  <div className="review-edit-buttons">
                    <button className="button ghost" type="button" onClick={() => setCurrentStep(4)}>
                      Edit Skills
                    </button>
                    <button className="button ghost" type="button" onClick={() => setCurrentStep(5)}>
                      Edit Interests
                    </button>
                    <button className="button ghost" type="button" onClick={() => setCurrentStep(6)}>
                      Edit Work Style
                    </button>
                    <button className="button ghost" type="button" onClick={confirmResetAssessment}>
                      Start Over
                    </button>
                  </div>
                </div>
              </details>
              <div className="recommendation-list">
                <h4>Your Personalized Action Plan</h4>
                {displayedRecommendations.map((recommendation: Recommendation, index) => (
                  <article className="recommendation-item" key={recommendation.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h4>{recommendation.title}</h4>
                      <p>{recommendation.body}</p>
                    </div>
                  </article>
                ))}
                <div className="assessment-local-resources">
                  <h5>National Resources</h5>
                  <p>
                    <a href="https://www.onetonline.org" rel="noreferrer" target="_blank">
                      O*NET Career Explorer
                    </a>
                    {" · "}
                    <a href="https://www.bls.gov/ooh/" rel="noreferrer" target="_blank">
                      Bureau of Labor Statistics
                    </a>
                    {" · "}
                    <a href="https://www.careeronestop.org" rel="noreferrer" target="_blank">
                      CareerOneStop
                    </a>
                  </p>
                </div>
              </div>
              <div className="assessment-action-plan">
                <h4>📋 Your Next Steps — Action Plan</h4>
                <div className="action-plan-items">
                  {[
                    "Generate a complete application package: tailored resume, cover letter, and skills summary",
                    "Review direct apply links to matching positions on job boards",
                    "Customize each application — you review, you refine, you submit",
                    "Use AI tools to practice interviews and refine your pitch",
                    "Track applications and follow up within 5-7 business days",
                  ].map((item, index) => (
                    <div className="action-item" key={item}>
                      <span className="action-num">{index + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="action-plan-note">
                  UpSkill USA™ preserves your agency — AI prepares you, but you make the final decisions. Ethically clear, legally safe, and more effective than mass automation.
                </p>
              </div>
            </>
          ) : (
            <p className="empty-state">Select at least 2 careers to compare.</p>
          )}
          <div className="assessment-step-actions assessment-final-actions">
            <button className="button ghost" type="button" onClick={() => setCurrentStep(7)}>
              {assessmentCopy.backToMatchesLabel}
            </button>
            <button className="button primary" type="button" onClick={() => saveAndGo("/plan")}>
              {assessmentCopy.saveToPlanLabel}
            </button>
            <button className="button ghost" type="button" onClick={() => saveAndGo("/learn")}>
              {assessmentCopy.saveToLearnLabel}
            </button>
          </div>
        </SectionShell>
      ) : null}

      <div className="demo-notes assessment-demo-notes">
        <strong>{content.ui.commentsLabel}</strong>
        <p>{assessmentCopy.sourceNote}</p>
        <p>{assessmentCopy.storageNote}</p>
      </div>
    </article>
  );
}
