"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Network,
  PlayCircle,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { frameworkOrder, type FrameworkKey } from "@/lib/content";
import { IkigaiAssessment } from "@/components/ikigai-assessment";
import { usePortalContent } from "@/components/language-provider";
import { mergeWithDefaults, usePlanDraft } from "@/components/plan-provider";
import {
  comfortOptions,
  generateUpgradePlan,
  getPlanCopy,
  learningPreferenceOptions,
  planToText,
  timeOptions,
  trackOptions,
  workCategories,
  type AdaptPlanInput,
  type AiComfort,
  type ImplementPlanInput,
  type LearnPlanInput,
  type LearningPreference,
  type TimeCommitment,
  type UserTrack,
  type WorkCategoryKey,
} from "@/lib/plan";

const icons: Record<FrameworkKey, typeof Sparkles> = {
  inspire: Sparkles,
  learn: GraduationCap,
  adapt: CalendarDays,
  implement: Workflow,
};

const userTrackKeys = Object.keys(trackOptions) as UserTrack[];
const comfortKeys = Object.keys(comfortOptions) as AiComfort[];
const timeKeys = Object.keys(timeOptions) as TimeCommitment[];
const learningPreferenceKeys = Object.keys(learningPreferenceOptions) as LearningPreference[];
const workCategoryKeys = Object.keys(workCategories) as WorkCategoryKey[];

function FrameworkCards() {
  const { content } = usePortalContent();

  return (
    <div className="framework-grid">
      {frameworkOrder.map((key) => {
        const framework = content.frameworks[key];
        const Icon = icons[key];

        return (
          <Link className="framework-card" href={framework.route} key={key}>
            <div>
              <div className="framework-step">
                <span>{framework.tab}</span>
                <Icon size={18} aria-hidden />
              </div>
              <h3>{framework.title}</h3>
              <p className="framework-question">{framework.question}</p>
              <p>{framework.summary}</p>
            </div>
            <span className="button-row">
              <span className="button blue">
                {framework.cta}
                <ArrowRight size={16} aria-hidden />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function OverviewPage() {
  const { content } = usePortalContent();
  const heroLines = content.brand.lockup.split(". ").map((line, index, lines) => {
    if (index < lines.length - 1 && !line.endsWith(".")) {
      return `${line}.`;
    }

    return line;
  });

  return (
    <>
      <section className="hero">
        <div className="section-inner hero-content hero-centered">
          <span className="eyebrow">
            <Sparkles size={15} aria-hidden />
            {content.overview.eyebrow}
          </span>
          <h1>
            {heroLines.map((line) => (
              <span className="hero-title-line" key={line}>
                {line}
              </span>
            ))}
          </h1>
          <p>{content.overview.intro}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/inspire">
              {content.overview.primaryCta}
              <ArrowRight size={17} aria-hidden />
            </Link>
            <Link className="button secondary" href="/plan">
              {content.ui.viewPlanCta}
              <CheckCircle2 size={17} aria-hidden />
            </Link>
            <Link className="button secondary" href="/learn">
              {content.overview.secondaryCta}
              <PlayCircle size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading overview-heading">
            <div>
              <div className="overview-title-line">{content.overview.title}</div>
              <h2>{content.brand.tagline}</h2>
            </div>
            <p className="overview-promise">{content.brand.promise}</p>
          </div>
          <FrameworkCards />
        </div>
      </section>
    </>
  );
}

function PageHero({ keyName }: { keyName: FrameworkKey }) {
  const { content } = usePortalContent();
  const framework = content.frameworks[keyName];
  const Icon = icons[keyName];
  const heroLabel = `${framework.tab} : ${framework.title}`.toUpperCase();

  return (
    <section className="page-hero">
      <div className="section-inner">
        <span className="eyebrow page-step-label">
          <Icon size={15} aria-hidden />
          {heroLabel}
        </span>
        <h1>{framework.question}</h1>
        <p>{content.pages[keyName].hero}</p>
      </div>
    </section>
  );
}

function PageSections({ keyName }: { keyName: FrameworkKey }) {
  const { content } = usePortalContent();

  return (
    <div className="card-grid">
      {content.pages[keyName].sections.map((section) => (
        <article className="card" key={section.title}>
          <h3>{section.title}</h3>
          <p>{section.body}</p>
          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function DemoNotes({ demo }: { demo: { commentsLabel?: string; notes?: string[]; nextStep?: string } }) {
  const { content } = usePortalContent();

  if (!demo.notes) {
    return null;
  }

  return (
    <div className="demo-notes">
      <strong>{demo.commentsLabel ?? content.ui.commentsLabel}</strong>
      {demo.notes.map((note) => (
        <p key={note}>{note}</p>
      ))}
      {demo.nextStep ? <p className="demo-next-step">{demo.nextStep}</p> : null}
    </div>
  );
}

function SavePlanActions({
  onSave,
  nextHref,
  nextLabel,
}: {
  onSave: () => void;
  nextHref?: string;
  nextLabel?: string;
}) {
  const router = useRouter();
  const { language } = usePortalContent();
  const copy = getPlanCopy(language);

  return (
    <div className="plan-actions">
      {nextHref ? (
        <button
          className="button blue"
          type="button"
          onClick={() => {
            onSave();
            router.push(nextHref);
          }}
        >
          {nextLabel ?? copy.actions.saveAndContinue}
          <ArrowRight size={16} aria-hidden />
        </button>
      ) : null}
      <button
        className="button ghost"
        type="button"
        onClick={() => {
          onSave();
          router.push("/plan");
        }}
      >
        {copy.actions.viewPlanSoFar}
        <ClipboardListIcon />
      </button>
    </div>
  );
}

function ClipboardListIcon() {
  return <CheckCircle2 size={16} aria-hidden />;
}

function LearnDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const demo = content.pages.learn.demo;
  const { draft, updateLearn } = usePlanDraft();
  const values = mergeWithDefaults(draft).learn;
  const setValues = (updater: (current: LearnPlanInput) => LearnPlanInput) => {
    updateLearn(updater(values));
  };

  const plan = useMemo(
    () => generateUpgradePlan({ ...draft, learn: values }, language),
    [draft, language, values],
  );

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{copy.headings.learningPath}</h2>
      <div className="form-grid two">
        <label className="field">
          <span>{copy.fields.track}</span>
          <select
            value={values.track}
            onChange={(event) =>
              setValues((current) => ({ ...current, track: event.target.value as UserTrack }))
            }
          >
            {userTrackKeys.map((key) => (
              <option key={key} value={key}>
                {copy.tracks[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{copy.fields.aiComfort}</span>
          <select
            value={values.aiComfort}
            onChange={(event) =>
              setValues((current) => ({ ...current, aiComfort: event.target.value as AiComfort }))
            }
          >
            {comfortKeys.map((key) => (
              <option key={key} value={key}>
                {copy.comfort[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{copy.fields.timeAvailable}</span>
          <select
            value={values.timeCommitment}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                timeCommitment: event.target.value as TimeCommitment,
              }))
            }
          >
            {timeKeys.map((key) => (
              <option key={key} value={key}>
                {copy.time[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{copy.fields.learningPreference}</span>
          <select
            value={values.learningPreference}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                learningPreference: event.target.value as LearningPreference,
              }))
            }
          >
            {learningPreferenceKeys.map((key) => (
              <option key={key} value={key}>
                {copy.preferences[key]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="result-panel">
        <ul>
          {plan.sections
            .find((section) => section.title === copy.plan.learningTitle)
            ?.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <SavePlanActions
        nextHref="/adapt"
        nextLabel={copy.actions.saveToAdapt}
        onSave={() => updateLearn(values)}
      />
      <DemoNotes demo={demo} />
    </article>
  );
}

function AdaptDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const seminar = content.forms.seminar;
  const demo = content.pages.adapt.demo;
  const { draft, updateAdapt } = usePlanDraft();
  const [interest, setInterest] = useState({ name: "", organization: "", role: "", city: "" });
  const values = mergeWithDefaults(draft).adapt;
  const setValues = (updater: (current: AdaptPlanInput) => AdaptPlanInput) => {
    updateAdapt(updater(values));
  };

  const plan = useMemo(
    () => generateUpgradePlan({ ...draft, adapt: values }, language),
    [draft, language, values],
  );
  const hasInterest = Object.values(interest).some((value) => value.trim().length > 0);

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{copy.headings.opportunityDraft}</h2>
      <div className="form-grid two">
        {Object.entries(seminar)
          .filter(([key]) => key !== "confirmation")
          .map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input
                value={interest[key as keyof typeof interest]}
                onChange={(event) =>
                  setInterest((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </label>
          ))}
      </div>
      {hasInterest ? <p className="result-panel">{seminar.confirmation}</p> : null}
      <div className="form-grid two">
        <label className="field">
          <span>{copy.fields.workArea}</span>
          <select
            value={values.workCategory}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                workCategory: event.target.value as WorkCategoryKey,
              }))
            }
          >
            {workCategoryKeys.map((key) => (
              <option key={key} value={key}>
                {copy.workCategories[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{copy.fields.workflowPain}</span>
          <input
            value={values.workflowPain}
            onChange={(event) =>
              setValues((current) => ({ ...current, workflowPain: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.mainSteps}</span>
          <textarea
            value={values.mainSteps}
            onChange={(event) =>
              setValues((current) => ({ ...current, mainSteps: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.delay}</span>
          <textarea
            value={values.delay}
            onChange={(event) =>
              setValues((current) => ({ ...current, delay: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.repetitiveWork}</span>
          <textarea
            value={values.repetitiveWork}
            onChange={(event) =>
              setValues((current) => ({ ...current, repetitiveWork: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.judgmentNeeds}</span>
          <textarea
            value={values.judgmentNeeds}
            onChange={(event) =>
              setValues((current) => ({ ...current, judgmentNeeds: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.desiredOutcome}</span>
          <input
            value={values.desiredOutcome}
            onChange={(event) =>
              setValues((current) => ({ ...current, desiredOutcome: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.own}</span>
          <input
            value={values.own}
            onChange={(event) => setValues((current) => ({ ...current, own: event.target.value }))}
          />
        </label>
        <label className="field">
          <span>{copy.fields.become}</span>
          <input
            value={values.become}
            onChange={(event) =>
              setValues((current) => ({ ...current, become: event.target.value }))
            }
          />
        </label>
      </div>
      <div className="result-panel">
        <h3>{plan.levelLabel}</h3>
        <p>
          {plan.sections.find((section) => section.title === copy.plan.adaptationTitle)?.body ??
            copy.feedback.mapWorkflow}
        </p>
      </div>
      <SavePlanActions
        nextHref="/implement"
        nextLabel={copy.actions.saveToImplement}
        onSave={() => updateAdapt(values)}
      />
      <DemoNotes demo={demo} />
    </article>
  );
}

function ImplementDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const audit = content.forms.audit;
  const demo = content.pages.implement.demo;
  const { draft, updateImplement } = usePlanDraft();
  const values = mergeWithDefaults(draft).implement;
  const setValues = (updater: (current: ImplementPlanInput) => ImplementPlanInput) => {
    updateImplement(updater(values));
  };

  const plan = useMemo(
    () => generateUpgradePlan({ ...draft, implement: values }, language),
    [draft, language, values],
  );
  const pilot = plan.sections.find((section) => section.title === copy.plan.pilotTitle);

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{copy.headings.completePlan}</h2>
      <div className="form-grid two">
        <label className="field">
          <span>{audit.companyUrl}</span>
          <input
            value={values.companyUrl}
            onChange={(event) =>
              setValues((current) => ({ ...current, companyUrl: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{audit.workflowName}</span>
          <input
            value={values.workflowName}
            onChange={(event) =>
              setValues((current) => ({ ...current, workflowName: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{copy.fields.pilotScope}</span>
          <input
            value={values.pilotScope}
            onChange={(event) =>
              setValues((current) => ({ ...current, pilotScope: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>{audit.humanGate}</span>
          <input
            value={values.humanGate}
            onChange={(event) =>
              setValues((current) => ({ ...current, humanGate: event.target.value }))
            }
          />
        </label>
      </div>
      <div className="check-grid">
        {[
          ["impactsPeople", copy.safetyQuestions.impactsPeople],
          ["usesSensitiveData", copy.safetyQuestions.usesSensitiveData],
          ["harmIfWrong", copy.safetyQuestions.harmIfWrong],
          ["needsExplanation", copy.safetyQuestions.needsExplanation],
          ["hasAppealPath", copy.safetyQuestions.hasAppealPath],
        ].map(([key, label]) => (
          <label className="check-field" key={key}>
            <input
              type="checkbox"
              checked={values[key as keyof ImplementPlanInput] as boolean}
              onChange={(event) =>
                setValues((current) => ({ ...current, [key]: event.target.checked }))
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="result-panel">
        <h3>{content.ui.demoContentTitle}</h3>
        <p>{audit.mockFinding}</p>
        <p>{pilot?.body}</p>
        <p>
          {copy.plan.riskLevel(
            plan.riskLevel ? copy.risk[plan.riskLevel] : copy.feedback.notAssessed,
          )}
        </p>
      </div>
      <SavePlanActions
        nextHref="/plan"
        nextLabel={copy.actions.saveAndViewComplete}
        onSave={() => updateImplement(values)}
      />
      <DemoNotes demo={demo} />
    </article>
  );
}

function AgentsPanel() {
  const { content } = usePortalContent();

  return (
    <div className="card-grid">
      <article className="card">
        <Building2 size={22} aria-hidden />
        <h3>{content.ui.agents.installerTitle}</h3>
        <p>{content.agents.installer}</p>
      </article>
      <article className="card">
        <Brain size={22} aria-hidden />
        <h3>{content.ui.agents.educatorTitle}</h3>
        <p>{content.agents.educator}</p>
      </article>
      <article className="card">
        <BadgeCheck size={22} aria-hidden />
        <h3>{content.brand.giBillLine}</h3>
        <p>{content.brand.promise}</p>
      </article>
    </div>
  );
}

function DemoForRoute({ keyName }: { keyName: FrameworkKey }) {
  if (keyName === "inspire") {
    return <IkigaiAssessment />;
  }
  if (keyName === "learn") {
    return <LearnDemo />;
  }
  if (keyName === "adapt") {
    return <AdaptDemo />;
  }
  return <ImplementDemo />;
}

export function FrameworkPage({ keyName }: { keyName: FrameworkKey }) {
  const { content } = usePortalContent();
  const framework = content.frameworks[keyName];
  const nextIndex = frameworkOrder.indexOf(keyName) + 1;
  const nextKey = frameworkOrder[nextIndex];
  const nextFramework = nextKey ? content.frameworks[nextKey] : null;
  const isInspiration = keyName === "inspire";
  const showIntroCta = keyName === "implement";

  return (
    <>
      <PageHero keyName={keyName} />

      <section className={isInspiration ? "section framework-assessment-section" : "section"}>
        <div className={isInspiration ? "section-inner framework-flow-inspire" : "section-inner framework-flow-page"}>
          <div className={isInspiration ? "framework-intro" : "framework-intro framework-page-intro"}>
            <div className="pill-label">{framework.title}</div>
            {!isInspiration ? (
              <>
                <h2>{framework.audience}</h2>
                <p>{framework.summary}</p>
              </>
            ) : null}
            {showIntroCta ? (
              <div className="button-row">
                {nextFramework ? (
                  <Link className="button blue" href={nextFramework.route}>
                    {nextFramework.cta}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                ) : (
                  <Link className="button blue" href="/">
                    {content.nav[0].label}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
              </div>
            ) : null}
          </div>
          <DemoForRoute keyName={keyName} />
        </div>
      </section>

      {content.pages[keyName].sections.length > 0 ? (
        <section className="section muted">
          <div className="section-inner">
            <PageSections keyName={keyName} />
          </div>
        </section>
      ) : null}

      {keyName === "implement" ? (
        <section className="section">
          <div className="section-inner">
            <AgentsPanel />
          </div>
        </section>
      ) : null}
    </>
  );
}

export function PlanPage() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const { draft, clearPlan } = usePlanDraft();
  const [copyStatus, setCopyStatus] = useState("");
  const plan = useMemo(() => generateUpgradePlan(draft, language), [draft, language]);
  const nextFramework = plan.nextStep ? content.frameworks[plan.nextStep] : null;
  const planText = useMemo(() => planToText(plan, language), [language, plan]);

  function copyPlan() {
    if (!navigator.clipboard) {
      setCopyStatus(copy.feedback.copyUnavailable);
      return;
    }

    navigator.clipboard
      .writeText(planText)
      .then(() => setCopyStatus(copy.feedback.copied))
      .catch(() => setCopyStatus(copy.feedback.copyFailed));
  }

  function downloadPlan() {
    const blob = new Blob([planText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "upskill-usa-ai-upgrade-plan.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearSavedPlan() {
    if (window.confirm(copy.feedback.clearConfirm)) {
      clearPlan();
      setCopyStatus("");
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="section-inner">
          <span className="eyebrow page-step-label">
            <CheckCircle2 size={15} aria-hidden />
            {copy.headings.pageEyebrow}
          </span>
          <h1>{copy.headings.pageTitle}</h1>
          <p>{copy.headings.pageIntro}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner plan-layout">
          <aside className="plan-sidebar">
            <span className="demo-label">{plan.levelLabel}</span>
            <div className="plan-progress">
              {frameworkOrder.map((key, index) => {
                const complete = plan.completedSteps.includes(key);
                const framework = content.frameworks[key];
                return (
                  <Link
                    className={complete ? "plan-progress-step complete" : "plan-progress-step"}
                    href={framework.route}
                    key={key}
                  >
                    <span>{index + 1}</span>
                    <strong>{framework.title}</strong>
                  </Link>
                );
              })}
            </div>
            <div className="button-row plan-sidebar-actions">
              {nextFramework ? (
                <Link className="button blue" href={nextFramework.route}>
                  {copy.actions.continueTo} {nextFramework.title}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              ) : (
                <Link className="button blue" href="/implement">
                  {copy.actions.reviewImplementation}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              )}
              <button className="button ghost" type="button" onClick={copyPlan}>
                {copy.actions.copyPlan}
              </button>
              <button className="button ghost" type="button" onClick={downloadPlan}>
                {copy.actions.downloadPlan}
              </button>
              <button className="button danger" type="button" onClick={clearSavedPlan}>
                {copy.actions.clearPlan}
              </button>
            </div>
            {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}
          </aside>

          <article className="plan-document">
            {plan.sections.map((section) => (
              <section className="plan-section" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="plan-section">
              <h2>{plan.level === 4 ? copy.headings.nextSevenDays : copy.headings.nextThreeDays}</h2>
              <ol>
                {plan.nextActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </section>

            <section className="plan-section">
              <h2>{copy.headings.afterSevenDays}</h2>
              <ul>
                {plan.afterSevenDays.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}

export const overviewIcons = {
  Lightbulb,
  CheckCircle2,
  Network,
  Bot,
  BriefcaseBusiness,
};
