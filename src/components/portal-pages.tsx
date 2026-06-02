"use client";

import Link from "next/link";
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
import { usePortalContent } from "@/components/language-provider";

const icons: Record<FrameworkKey, typeof Sparkles> = {
  inspire: Sparkles,
  learn: GraduationCap,
  adapt: CalendarDays,
  implement: Workflow,
};

function replaceTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value || "..."),
    template,
  );
}

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

function StepNavCard({ keyName, variant }: { keyName: FrameworkKey; variant: "previous" | "next" }) {
  const { content } = usePortalContent();
  const framework = content.frameworks[keyName];
  const Icon = icons[keyName];

  return (
    <Link className={`step-nav-card ${variant}`} href={framework.route}>
      <div>
        <div className="step-nav-step">
          <span>{framework.tab}</span>
          <Icon size={16} aria-hidden />
        </div>
        <h3>{framework.title}</h3>
        <p className="framework-question">{framework.question}</p>
      </div>
      <span className="button-row">
        <span className="button blue">
          {framework.cta}
          <ArrowRight size={16} aria-hidden />
        </span>
      </span>
    </Link>
  );
}

function StepNavItem({ keyName, variant }: { keyName: FrameworkKey; variant: "previous" | "next" }) {
  return (
    <div className={`step-nav-item ${variant}`}>
      {variant === "previous" ? (
        <span className="step-nav-arrow" aria-hidden>
          &lt;-
        </span>
      ) : null}
      <StepNavCard keyName={keyName} variant={variant} />
      {variant === "next" ? (
        <span className="step-nav-arrow" aria-hidden>
          -&gt;
        </span>
      ) : null}
    </div>
  );
}

function StepNavigation({ keyName }: { keyName: FrameworkKey }) {
  const currentIndex = frameworkOrder.indexOf(keyName);
  const previousKey = frameworkOrder[currentIndex - 1];
  const nextKey = frameworkOrder[currentIndex + 1];

  return (
    <div className={`step-nav-grid ${previousKey ? "" : "single-next"}`}>
      {previousKey ? <StepNavItem keyName={previousKey} variant="previous" /> : null}
      {nextKey ? <StepNavItem keyName={nextKey} variant="next" /> : null}
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
              <div className="pill-label">{content.overview.title}</div>
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
  if (!demo.notes) {
    return null;
  }

  return (
    <div className="demo-notes">
      <strong>{demo.commentsLabel ?? "Comments:"}</strong>
      {demo.notes.map((note) => (
        <p key={note}>{note}</p>
      ))}
      {demo.nextStep ? <p className="demo-next-step">{demo.nextStep}</p> : null}
    </div>
  );
}

function IkigaiDemo() {
  const { content } = usePortalContent();
  const form = content.forms.ikigai;
  const demo = content.pages.inspire.demo;
  const [values, setValues] = useState({
    love: "",
    skill: "",
    need: "",
    paid: "",
  });

  const complete = Object.values(values).every((value) => value.trim().length > 0);
  const statement = useMemo(
    () => replaceTemplate(form.purposeTemplate, values),
    [form.purposeTemplate, values],
  );

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{demo.resultTitle}</h2>
      <div className="form-grid two">
        {Object.entries(form)
          .filter(([key]) => key !== "purposeTemplate")
          .map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <textarea
                value={values[key as keyof typeof values]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </label>
          ))}
      </div>
      <div className="result-panel">
        {complete ? <p>{statement}</p> : <p className="empty-state">{demo.emptyState}</p>}
      </div>
      <DemoNotes demo={demo} />
    </article>
  );
}

function LearnDemo() {
  const { content } = usePortalContent();
  const demo = content.pages.learn.demo;
  const [track, setTrack] = useState("worker");

  const resources = {
    worker: ["AI basics", "Prompt practice", "Role-specific workflow ideas"],
    professor: ["AI Institute primer", "Classroom use cases", "Assessment patterns"],
    employer: ["Team readiness map", "Custom GPT preparation", "Seminar sponsorship"],
  };

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{demo.resultTitle}</h2>
      <label className="field">
        <span>{demo.emptyState}</span>
        <select value={track} onChange={(event) => setTrack(event.target.value)}>
          <option value="worker">Worker</option>
          <option value="professor">Professor</option>
          <option value="employer">Employer</option>
        </select>
      </label>
      <div className="result-panel">
        <ul>
          {resources[track as keyof typeof resources].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <DemoNotes demo={demo} />
    </article>
  );
}

function AdaptDemo() {
  const { content } = usePortalContent();
  const seminar = content.forms.seminar;
  const plan = content.forms.adaptationPlan;
  const demo = content.pages.adapt.demo;
  const [interest, setInterest] = useState({ name: "", organization: "", role: "", city: "" });
  const [values, setValues] = useState({
    role: "",
    automate: "",
    augment: "",
    own: "",
    become: "",
  });

  const summary = replaceTemplate(plan.summaryTemplate, values);
  const hasInterest = Object.values(interest).some((value) => value.trim().length > 0);

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{demo.resultTitle}</h2>
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
        {Object.entries(plan)
          .filter(([key]) => key !== "summaryTemplate")
          .map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input
                value={values[key as keyof typeof values]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </label>
          ))}
      </div>
      <div className="result-panel">
        <p>{summary}</p>
      </div>
      <DemoNotes demo={demo} />
    </article>
  );
}

function ImplementDemo() {
  const { content } = usePortalContent();
  const audit = content.forms.audit;
  const demo = content.pages.implement.demo;
  const [values, setValues] = useState({
    companyUrl: "",
    workflowName: "",
    humanGate: "",
  });

  const workflow = replaceTemplate(audit.workflowTemplate, values);

  return (
    <article className="demo-panel">
      <span className="demo-label">{demo.label}</span>
      <h2>{demo.resultTitle}</h2>
      <div className="form-grid">
        {Object.entries(audit)
          .filter(([key]) => key !== "mockFinding" && key !== "workflowTemplate")
          .map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input
                value={values[key as keyof typeof values]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </label>
          ))}
      </div>
      <div className="result-panel">
        <h3>Demo content</h3>
        <p>{audit.mockFinding}</p>
        <p>{workflow}</p>
      </div>
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
        <h3>Installer Agents</h3>
        <p>{content.agents.installer}</p>
      </article>
      <article className="card">
        <Brain size={22} aria-hidden />
        <h3>Educator Agents</h3>
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
    return <IkigaiDemo />;
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

  return (
    <>
      <PageHero keyName={keyName} />

      <section className="section">
        <div className="section-inner two-column">
          <div>
            <div className="pill-label">{framework.title}</div>
            <h2>{framework.audience}</h2>
            <p>{framework.summary}</p>
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
      ) : (
        <section className="section step-nav-section">
          <div className="section-inner">
            <StepNavigation keyName={keyName} />
          </div>
        </section>
      )}
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
