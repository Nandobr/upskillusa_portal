"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  BadgeCheck,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  Clipboard,
  Crown,
  Download,
  DollarSign,
  EyeOff,
  GraduationCap,
  Globe,
  Lightbulb,
  Megaphone,
  Network,
  PlayCircle,
  RotateCw,
  Scale,
  Settings,
  Sparkles,
  TrendingUp,
  Unplug,
  Users,
  Wrench,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { frameworkOrder, type FrameworkKey, type Language } from "@/lib/content";
import { IkigaiAssessment } from "@/components/ikigai-assessment";
import { usePortalContent } from "@/components/language-provider";
import { mergeWithDefaults, usePlanDraft } from "@/components/plan-provider";
import {
  aiStartingPointOptions,
  defaultDraft,
  generateSeminarResult,
  generateUpgradePlan,
  generateLearnReport,
  getSeminarReadinessCount,
  getLearnToolOptions,
  getPlanCopy,
  learnFormatOptions,
  learnGoalsByGroup,
  learnGroupOptions,
  learnReportToText,
  learnTimeOptions,
  planToText,
  seminarReadinessItems,
  workCategories,
  type AdaptPlanInput,
  type ImplementPlanInput,
  type LearnPlanInput,
  type SeminarTrack,
  type WorkCategoryKey,
} from "@/lib/plan";
import {
  formatLabNumber,
  formatShortUsd,
  getWorkArea,
  pilotFromBusinessOpportunity,
  pilotFromEmployeeTask,
  workAreaOptions,
  type BusinessOpportunity,
  type BusinessOpportunityReport,
  type EmployeeTransformationReport,
  type ImplementAudience,
  type ImplementPilot,
  type ImplementationTask,
  type ImplementWorkAreaKey,
} from "@/lib/implementation-lab";

const icons: Record<FrameworkKey, typeof Sparkles> = {
  inspire: Sparkles,
  learn: GraduationCap,
  adapt: CalendarDays,
  implement: Workflow,
};

const workCategoryKeys = Object.keys(workCategories) as WorkCategoryKey[];

const workAreaIcons: Record<ImplementWorkAreaKey, typeof Crown> = {
  "Executive Leadership": Crown,
  Operations: Settings,
  "Finance and Accounting": DollarSign,
  Sales: TrendingUp,
  Marketing: Megaphone,
  "Engineering and IT": Code2,
  "Data and AI": Brain,
  "HR and People Operations": Users,
  "Legal and Compliance": Scale,
};

type SeminarChoice<T extends string | number> = {
  value: T;
  label: string;
  description: string;
};

const workerWeeklyHourOptions: SeminarChoice<number>[] = [
  { value: 2, label: "2 hours", description: "A small weekly task or handoff." },
  { value: 5, label: "5 hours", description: "A repeated task across several days." },
  { value: 10, label: "10 hours", description: "A heavy workflow worth redesigning." },
];

const workerHourlyValueOptions: SeminarChoice<number>[] = [
  { value: 20, label: "$20/hr", description: "Entry or support role estimate." },
  { value: 30, label: "$30/hr", description: "Skilled operations estimate." },
  { value: 50, label: "$50/hr", description: "Specialized or supervisory estimate." },
];

const businessWorkersAffectedOptions: SeminarChoice<number>[] = [
  { value: 5, label: "5 workers", description: "One team or shift." },
  { value: 12, label: "12 workers", description: "A department-sized pilot." },
  { value: 25, label: "25 workers", description: "A larger operating group." },
];

const businessWeeklyHourOptions: SeminarChoice<number>[] = [
  { value: 1, label: "1 hour each", description: "Light improvement across the team." },
  { value: 3, label: "3 hours each", description: "Meaningful repeated work." },
  { value: 5, label: "5 hours each", description: "A workflow with clear leverage." },
];

const businessHourlyValueOptions: SeminarChoice<number>[] = [
  { value: 25, label: "$25/hr", description: "Blended frontline value." },
  { value: 35, label: "$35/hr", description: "Blended skilled team value." },
  { value: 55, label: "$55/hr", description: "Blended specialist value." },
];

const seminarMultiplierOptions: SeminarChoice<number>[] = [
  { value: 2, label: "2x", description: "Conservative estimate." },
  { value: 3.7, label: "3.7x", description: "Seminar working figure." },
  { value: 5, label: "5x", description: "Stretch estimate." },
];

const proofPointOptions: Record<Language, SeminarChoice<string>[]> = {
  en: [
    {
      value: "Compare time logs before and after a six-week pilot.",
      label: "Time logs",
      description: "Compare time before and after a six-week pilot.",
    },
    {
      value: "Show before-and-after samples with human review notes.",
      label: "Work samples",
      description: "Use safe samples and review notes.",
    },
    {
      value: "Track fewer handoffs, rework loops, or delayed replies.",
      label: "Handoff count",
      description: "Measure fewer delays or repeated loops.",
    },
  ],
  es: [
    {
      value: "Comparar registros de tiempo antes y despues de un piloto de seis semanas.",
      label: "Registros de tiempo",
      description: "Compara tiempo antes y despues del piloto.",
    },
    {
      value: "Mostrar muestras de antes y despues con notas de revision humana.",
      label: "Muestras de trabajo",
      description: "Usa muestras seguras y notas de revision.",
    },
    {
      value: "Medir menos traspasos, retrabajo o respuestas demoradas.",
      label: "Conteo de traspasos",
      description: "Mide menos demoras o ciclos repetidos.",
    },
  ],
  pt: [
    {
      value: "Comparar registros de tempo antes e depois de um piloto de seis semanas.",
      label: "Registros de tempo",
      description: "Compare tempo antes e depois do piloto.",
    },
    {
      value: "Mostrar amostras de antes e depois com notas de revisao humana.",
      label: "Amostras de trabalho",
      description: "Use amostras seguras e notas de revisao.",
    },
    {
      value: "Medir menos repasses, retrabalho ou respostas atrasadas.",
      label: "Contagem de repasses",
      description: "Meça menos atrasos ou ciclos repetidos.",
    },
  ],
};

const readinessChoiceOptions: Record<
  Language,
  (SeminarChoice<string> & { readiness: AdaptPlanInput["readiness"] })[]
> = {
  en: [
    {
      value: "ready",
      label: "Ready now",
      description: "I can bring the workflow, time estimate, sample, and review owner.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: true,
        canExplainReview: true,
      },
    },
    {
      value: "partial",
      label: "Partly ready",
      description: "I know the workflow and time spent, but need help with evidence.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: false,
        canExplainReview: false,
      },
    },
    {
      value: "guided",
      label: "Need seminar help",
      description: "I want the seminar to help me choose and prove the workflow.",
      readiness: {
        bringWorkflow: false,
        knowTimeSpent: false,
        haveSample: false,
        canExplainReview: false,
      },
    },
  ],
  es: [
    {
      value: "ready",
      label: "Listo ahora",
      description: "Puedo llevar el flujo, tiempo estimado, muestra y responsable de revision.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: true,
        canExplainReview: true,
      },
    },
    {
      value: "partial",
      label: "Parcialmente listo",
      description: "Conozco el flujo y el tiempo, pero necesito ayuda con evidencia.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: false,
        canExplainReview: false,
      },
    },
    {
      value: "guided",
      label: "Necesito ayuda",
      description: "Quiero que el seminario me ayude a elegir y probar el flujo.",
      readiness: {
        bringWorkflow: false,
        knowTimeSpent: false,
        haveSample: false,
        canExplainReview: false,
      },
    },
  ],
  pt: [
    {
      value: "ready",
      label: "Pronto agora",
      description: "Posso levar o fluxo, estimativa de tempo, amostra e responsavel por revisao.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: true,
        canExplainReview: true,
      },
    },
    {
      value: "partial",
      label: "Parcialmente pronto",
      description: "Conheco o fluxo e o tempo, mas preciso de ajuda com evidencia.",
      readiness: {
        bringWorkflow: true,
        knowTimeSpent: true,
        haveSample: false,
        canExplainReview: false,
      },
    },
    {
      value: "guided",
      label: "Preciso de ajuda",
      description: "Quero que o seminario me ajude a escolher e provar o fluxo.",
      readiness: {
        bringWorkflow: false,
        knowTimeSpent: false,
        haveSample: false,
        canExplainReview: false,
      },
    },
  ],
};

const seminarBuilderCopy = {
  en: {
    subtitle: "Build a local seminar prep artifact. Nothing is registered or sent.",
    trackEyebrow: "Seminar track",
    trackTitle: "Choose your seminar track",
    workerLabel: "Worker / Employee",
    workerDescription: "Estimate saved hours and prepare a Manifest of Saved Hours.",
    businessLabel: "Business Leader / Owner",
    businessDescription: "Map team productivity into a Company AI-Ready Action Plan.",
    readinessEyebrow: "Readiness",
    readinessTitle: "Check your seminar readiness",
    readinessPartial: (ready: number, total: number) => `${ready}/${total} ready. You can start now and bring the rest to the seminar.`,
    readinessComplete: "You are ready to turn learning into an AI-Ready Action Plan.",
    areaEyebrow: "Work area",
    areaTitle: "Choose the work area",
    workflowEyebrow: "Workflow",
    workflowTitle: "Choose one workflow or problem",
    workflowLabel: "Workflow or problem",
    workflowPlaceholder: "Example: weekly customer follow-up emails",
    valueEyebrow: "Value estimate",
    valueTitle: "Estimate the value created",
    weeklyHoursSaved: "Weekly hours saved",
    hourlyValue: "Hourly value",
    workersAffected: "Workers affected",
    weeklyHoursSavedPerWorker: "Weekly hours saved per worker",
    blendedHourlyValue: "Blended hourly value",
    multiplier: "Value multiplier",
    proofPoint: "How will you prove the saved hours?",
    proofPlaceholder: "Example: compare time logs before and after a six-week pilot",
    empty: "Complete the seminar prep fields to generate your draft.",
    annualValue: "Estimated annual value",
    weeklyValue: "Weekly hours saved",
    multiplierLabel: "Multiplier",
    copyResult: "Copy result",
    downloadResult: "Download result",
    saveResult: "Save to AI-Ready Action Plan",
    copied: "Seminar prep copied.",
    downloaded: "Seminar prep downloaded.",
    saved: "Saved to your AI-Ready Action Plan.",
  },
  es: {
    subtitle: "Crea un artefacto local de preparación. No se registra ni se envía nada.",
    trackEyebrow: "Ruta del seminario",
    trackTitle: "Elige tu ruta del seminario",
    workerLabel: "Trabajador / empleado",
    workerDescription: "Estima horas ahorradas y prepara un Manifiesto de horas ahorradas.",
    businessLabel: "Líder / dueño de negocio",
    businessDescription: "Convierte la productividad del equipo en un plan de acción empresarial listo para IA.",
    readinessEyebrow: "Preparación",
    readinessTitle: "Revisa tu preparación para el seminario",
    readinessPartial: (ready: number, total: number) => `${ready}/${total} listo. Puedes empezar ahora y llevar lo demás al seminario.`,
    readinessComplete: "Estás listo para convertir el aprendizaje en un plan de acción listo para IA.",
    areaEyebrow: "Área de trabajo",
    areaTitle: "Elige el área de trabajo",
    workflowEyebrow: "Flujo",
    workflowTitle: "Elige un flujo o problema",
    workflowLabel: "Flujo o problema",
    workflowPlaceholder: "Ejemplo: correos semanales de seguimiento a clientes",
    valueEyebrow: "Estimación de valor",
    valueTitle: "Estima el valor creado",
    weeklyHoursSaved: "Horas ahorradas por semana",
    hourlyValue: "Valor por hora",
    workersAffected: "Trabajadores afectados",
    weeklyHoursSavedPerWorker: "Horas ahorradas por trabajador por semana",
    blendedHourlyValue: "Valor horario combinado",
    multiplier: "Multiplicador de valor",
    proofPoint: "¿Cómo probarás las horas ahorradas?",
    proofPlaceholder: "Ejemplo: comparar registros de tiempo antes y después de un piloto de seis semanas",
    empty: "Completa los campos de preparación para generar tu borrador.",
    annualValue: "Valor anual estimado",
    weeklyValue: "Horas semanales ahorradas",
    multiplierLabel: "Multiplicador",
    copyResult: "Copiar resultado",
    downloadResult: "Descargar resultado",
    saveResult: "Guardar en el plan de acción listo para IA",
    copied: "Preparación del seminario copiada.",
    downloaded: "Preparación del seminario descargada.",
    saved: "Guardado en tu plan de acción listo para IA.",
  },
  pt: {
    subtitle: "Crie um artefato local de preparação. Nada é registrado ou enviado.",
    trackEyebrow: "Trilha do seminário",
    trackTitle: "Escolha sua trilha do seminário",
    workerLabel: "Trabalhador / funcionário",
    workerDescription: "Estime horas economizadas e prepare um Manifesto de horas economizadas.",
    businessLabel: "Líder / dono de negócio",
    businessDescription: "Transforme a produtividade da equipe em um plano de ação da empresa pronto para IA.",
    readinessEyebrow: "Preparação",
    readinessTitle: "Confira sua preparação para o seminário",
    readinessPartial: (ready: number, total: number) => `${ready}/${total} pronto. Você pode começar agora e levar o restante ao seminário.`,
    readinessComplete: "Você está pronto para transformar aprendizagem em um plano de ação pronto para IA.",
    areaEyebrow: "Área de trabalho",
    areaTitle: "Escolha a área de trabalho",
    workflowEyebrow: "Fluxo",
    workflowTitle: "Escolha um fluxo ou problema",
    workflowLabel: "Fluxo ou problema",
    workflowPlaceholder: "Exemplo: e-mails semanais de acompanhamento de clientes",
    valueEyebrow: "Estimativa de valor",
    valueTitle: "Estime o valor criado",
    weeklyHoursSaved: "Horas economizadas por semana",
    hourlyValue: "Valor por hora",
    workersAffected: "Trabalhadores afetados",
    weeklyHoursSavedPerWorker: "Horas economizadas por trabalhador por semana",
    blendedHourlyValue: "Valor horário combinado",
    multiplier: "Multiplicador de valor",
    proofPoint: "Como você vai comprovar as horas economizadas?",
    proofPlaceholder: "Exemplo: comparar registros de tempo antes e depois de um piloto de seis semanas",
    empty: "Complete os campos de preparação para gerar seu rascunho.",
    annualValue: "Valor anual estimado",
    weeklyValue: "Horas semanais economizadas",
    multiplierLabel: "Multiplicador",
    copyResult: "Copiar resultado",
    downloadResult: "Baixar resultado",
    saveResult: "Salvar no plano de ação pronto para IA",
    copied: "Preparação do seminário copiada.",
    downloaded: "Preparação do seminário baixada.",
    saved: "Salvo no seu plano de ação pronto para IA.",
  },
} as const;

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
  const heroLabel =
    keyName === "adapt"
      ? `${framework.tab} · ${framework.title}`
      : `${framework.tab} : ${framework.title}`.toUpperCase();

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

function LearnDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const demo = content.pages.learn.demo;
  const { draft, updateLearn, clearLearn } = usePlanDraft();
  const [values, setValues] = useState<Partial<LearnPlanInput>>(() => draft.learn ?? {});
  const [reportStatus, setReportStatus] = useState("");
  const [saved, setSaved] = useState(false);
  const hasLearnProgress = Object.values(values).some(Boolean) || Boolean(draft.learn);
  const goals = values.group ? learnGoalsByGroup[values.group] : [];
  const tools = getLearnToolOptions(values.goal);
  const completeValues =
    values.group &&
    values.startingPoint &&
    values.goal &&
    values.tool &&
    values.format &&
    values.time
      ? {
          group: values.group,
          startingPoint: values.startingPoint,
          goal: values.goal,
          tool: values.tool,
          format: values.format,
          time: values.time,
          reportSummary: "",
          nextAction: "",
        }
      : null;
  const report = completeValues ? generateLearnReport(completeValues) : null;
  const reportText = report ? learnReportToText(report) : "";

  function updatePathway(nextValues: Partial<LearnPlanInput>) {
    setSaved(false);
    setReportStatus("");
    setValues(nextValues);
  }

  function resetLearnPathway() {
    setValues({});
    setSaved(false);
    setReportStatus("");
    clearLearn();
  }

  function confirmResetLearnPathway() {
    if (window.confirm("Start the LEARN pathway over? This will clear your current LEARN selections and saved report.")) {
      resetLearnPathway();
    }
  }

  function saveReport() {
    if (!report || !completeValues) return;

    updateLearn({
      ...completeValues,
      reportSummary: report.planSummary,
      nextAction: report.nextAction,
    });
    setSaved(true);
    setReportStatus("LEARN Report saved to your AI-Ready Action Plan.");
  }

  function copyReport() {
    if (!reportText) return;

    if (!navigator.clipboard) {
      setReportStatus(copy.feedback.copyUnavailable);
      return;
    }

    navigator.clipboard
      .writeText(reportText)
      .then(() => setReportStatus("LEARN Report copied."))
      .catch(() => setReportStatus(copy.feedback.copyFailed));
  }

  function downloadReport() {
    if (!reportText) return;

    const blob = new Blob([reportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "upskill-usa-learn-report.md";
    link.click();
    URL.revokeObjectURL(url);
    setReportStatus("LEARN Report downloaded.");
  }

  return (
    <article className="demo-panel learn-pathway-panel">
      <div className="assessment-intro-top">
        <span className="demo-label">{demo.label}</span>
        {hasLearnProgress ? (
          <button
            className="assessment-reset-button"
            type="button"
            onClick={confirmResetLearnPathway}
          >
            Start over
          </button>
        ) : null}
      </div>
      <h2>{copy.headings.learningPath}</h2>
      <p className="assessment-step-subtitle">
        Build a downloadable LEARN Report with selectable choices only.
      </p>

      <section className={`assessment-step-card ${values.group ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">Who is learning?</span>
            <h3>Choose your group</h3>
          </div>
        </div>
        <div className="assessment-pathways learn-option-grid four">
          {learnGroupOptions.map((option) => (
            <button
              aria-pressed={values.group === option.id}
              className={`assessment-pathway-card ${values.group === option.id ? "selected" : ""}`}
              key={option.id}
              type="button"
              onClick={() => updatePathway({ group: option.id })}
            >
              <strong>{option.label}</strong>
              <p>{option.description}</p>
            </button>
          ))}
        </div>
      </section>

      {values.group ? (
        <section className={`assessment-step-card ${values.startingPoint ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">2</span>
            <div>
              <span className="assessment-step-eyebrow">AI starting point</span>
              <h3>How familiar are you with AI tools?</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {aiStartingPointOptions.map((option) => (
              <button
                aria-pressed={values.startingPoint === option.id}
                className={`assessment-choice ${values.startingPoint === option.id ? "selected" : ""}`}
                key={option.id}
                type="button"
                onClick={() =>
                  updatePathway({
                    group: values.group,
                    startingPoint: option.id,
                  })
                }
              >
                <span className="assessment-choice-mark" aria-hidden />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {values.group && values.startingPoint ? (
        <section className={`assessment-step-card ${values.goal ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">3</span>
            <div>
              <span className="assessment-step-eyebrow">Practical goal</span>
              <h3>What do you want AI to help you do?</h3>
            </div>
          </div>
          <div className="assessment-skill-grid learn-option-grid three">
            {goals.map((option) => (
              <button
                aria-pressed={values.goal === option.id}
                className={`assessment-skill-card ${values.goal === option.id ? "selected" : ""}`}
                key={option.id}
                type="button"
                onClick={() =>
                  updatePathway({
                    group: values.group,
                    startingPoint: values.startingPoint,
                    goal: option.id,
                  })
                }
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {values.group && values.startingPoint && values.goal ? (
        <section className={`assessment-step-card ${values.tool ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">4</span>
            <div>
              <span className="assessment-step-eyebrow">Tool</span>
              <h3>Choose the AI tool you want to learn</h3>
            </div>
          </div>
          <div className="assessment-skill-grid learn-option-grid four">
            {tools.map((option) => (
              <button
                aria-pressed={values.tool === option.id}
                className={`assessment-skill-card ${values.tool === option.id ? "selected" : ""}`}
                key={option.id}
                type="button"
                onClick={() =>
                  updatePathway({
                    group: values.group,
                    startingPoint: values.startingPoint,
                    goal: values.goal,
                    tool: option.id,
                  })
                }
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {values.group && values.startingPoint && values.goal && values.tool ? (
        <section className={`assessment-step-card ${values.format ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">5</span>
            <div>
              <span className="assessment-step-eyebrow">Learning format</span>
              <h3>How do you want to learn?</h3>
            </div>
          </div>
          <div className="assessment-chip-grid learn-option-grid three">
            {learnFormatOptions.map((option) => (
              <button
                aria-pressed={values.format === option.id}
                className={`assessment-chip ${values.format === option.id ? "selected" : ""}`}
                key={option.id}
                type="button"
                onClick={() =>
                  updatePathway({
                    group: values.group,
                    startingPoint: values.startingPoint,
                    goal: values.goal,
                    tool: values.tool,
                    format: option.id,
                  })
                }
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {values.group && values.startingPoint && values.goal && values.tool && values.format ? (
        <section className={`assessment-step-card ${values.time ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">6</span>
            <div>
              <span className="assessment-step-eyebrow">Time today</span>
              <h3>How much time do you have?</h3>
            </div>
          </div>
          <div className="assessment-chip-grid learn-option-grid three">
            {learnTimeOptions.map((option) => (
              <button
                aria-pressed={values.time === option.id}
                className={`assessment-chip ${values.time === option.id ? "selected" : ""}`}
                key={option.id}
                type="button"
                onClick={() =>
                  updatePathway({
                    group: values.group,
                    startingPoint: values.startingPoint,
                    goal: values.goal,
                    tool: values.tool,
                    format: values.format,
                    time: option.id,
                  })
                }
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {report ? (
        <section className="result-panel learn-report-panel">
          <span className="demo-label">{report.demoLabel}</span>
          <h3>{report.title}</h3>
          <div className="learn-report-grid">
            <div>
              <h4>Selected Path</h4>
              <ul>
                {report.path.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>AI Learning Profile</h4>
              <p>{report.profileSummary}</p>
            </div>
            <div>
              <h4>Recommended Learning Path</h4>
              <ul>
                {report.learningPath.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Tool Starter Guide</h4>
              <ul>
                {report.toolStarterGuide.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="learn-report-prompt">
            <h4>Practice Prompt</h4>
            <p>{report.practicePrompt}</p>
          </div>
          <div className="learn-report-next">
            <h4>Next Action</h4>
            <p>{report.nextAction}</p>
          </div>
          <div className="plan-actions learn-report-actions">
            <button className="button ghost" type="button" onClick={copyReport}>
              Copy report
              <Clipboard size={16} aria-hidden />
            </button>
            <button className="button ghost" type="button" onClick={downloadReport}>
              Download report
              <Download size={16} aria-hidden />
            </button>
            <button className="button blue" type="button" onClick={saveReport}>
              Save to AI-Ready Action Plan
              <CheckCircle2 size={16} aria-hidden />
            </button>
          </div>
          {reportStatus ? <p className="copy-status">{reportStatus}</p> : null}
          {saved ? <p className="demo-next-step">Saved. Your LEARN Report is complete; you can continue when ready.</p> : null}
        </section>
      ) : null}
      <DemoNotes demo={demo} />
    </article>
  );
}

function AdaptDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const builderCopy = seminarBuilderCopy[language] ?? seminarBuilderCopy.en;
  const demo = content.pages.adapt.demo;
  const router = useRouter();
  const { draft, updateAdapt, clearAdapt } = usePlanDraft();
  const [builderValues, setBuilderValues] = useState<Partial<AdaptPlanInput>>(
    () => draft.adapt ?? {},
  );
  const values: AdaptPlanInput = {
    ...defaultDraft.adapt,
    ...builderValues,
    readiness: {
      ...defaultDraft.adapt.readiness,
      ...builderValues.readiness,
    },
    worker: {
      ...defaultDraft.adapt.worker,
      ...builderValues.worker,
    },
    business: {
      ...defaultDraft.adapt.business,
      ...builderValues.business,
    },
  };
  const [resultStatus, setResultStatus] = useState("");
  const saved = Boolean(values.savedAt);
  const readinessCount = getSeminarReadinessCount(values);
  const hasTrack = Boolean(builderValues.track);
  const hasReadinessDecision = Boolean(builderValues.readiness);
  const hasWorkCategory = Boolean(builderValues.workCategory);
  const hasWorkflow = Boolean(builderValues.workflow?.trim());
  const hasWorkerWeeklyHours = Boolean(builderValues.worker?.weeklyHoursSaved);
  const hasWorkerHourlyValue = Boolean(builderValues.worker?.hourlyValue);
  const hasWorkerProofPoint = Boolean(builderValues.worker?.proofPoint?.trim());
  const hasBusinessWorkersAffected = Boolean(builderValues.business?.workersAffected);
  const hasBusinessWeeklyHours = Boolean(builderValues.business?.weeklyHoursSavedPerWorker);
  const hasBusinessHourlyValue = Boolean(builderValues.business?.blendedHourlyValue);
  const hasMultiplier = Boolean(builderValues.multiplier);
  const showAreaStep = hasTrack && hasReadinessDecision;
  const showWorkflowStep = showAreaStep && hasWorkCategory;
  const showFirstValueStep = showWorkflowStep && hasWorkflow;
  const showSecondValueStep =
    showFirstValueStep &&
    (values.track === "business" ? hasBusinessWorkersAffected : hasWorkerWeeklyHours);
  const showThirdValueStep =
    showSecondValueStep &&
    (values.track === "business" ? hasBusinessWeeklyHours : hasWorkerHourlyValue);
  const showMultiplierStep =
    showThirdValueStep &&
    (values.track === "business" ? hasBusinessHourlyValue : hasWorkerProofPoint);
  const showResult = showMultiplierStep && hasMultiplier;
  const result = showResult ? generateSeminarResult(values, language) : undefined;
  const workflowOptions = builderValues.workCategory
    ? workCategories[builderValues.workCategory].examples
    : [];
  const proofOptions = proofPointOptions[language] ?? proofPointOptions.en;
  const readinessOptions = readinessChoiceOptions[language] ?? readinessChoiceOptions.en;
  const hasSeminarProgress = Boolean(draft.adapt) || Object.keys(builderValues).length > 0;

  function replacePathway(nextValues: Partial<AdaptPlanInput>) {
    setResultStatus("");
    setBuilderValues({
      ...nextValues,
      resultText: undefined,
      savedAt: undefined,
    });
  }

  function resetSeminarPathway() {
    setBuilderValues({});
    setResultStatus("");
    clearAdapt();
  }

  function confirmResetSeminarPathway() {
    if (
      window.confirm(
        "Start the AI-Ready Seminar builder over? This will clear your current Step 3 selections and saved result.",
      )
    ) {
      resetSeminarPathway();
    }
  }

  function chooseReadiness(readiness: AdaptPlanInput["readiness"]) {
    setResultStatus("");
    replacePathway({
      track: values.track,
      readiness,
    });
  }

  function isReadinessSelected(readiness: AdaptPlanInput["readiness"]) {
    return seminarReadinessItems.every((item) => values.readiness[item.id] === readiness[item.id]);
  }

  function pathBase() {
    return {
      track: values.track,
      readiness: values.readiness,
      workCategory: values.workCategory,
      workflow: values.workflow,
    };
  }

  function copyResult() {
    if (!result) return;

    if (!navigator.clipboard) {
      setResultStatus(copy.feedback.copyUnavailable);
      return;
    }

    navigator.clipboard
      .writeText(result.text)
      .then(() => setResultStatus(builderCopy.copied))
      .catch(() => setResultStatus(copy.feedback.copyFailed));
  }

  function downloadResult() {
    if (!result) return;

    const blob = new Blob([result.text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.filename;
    link.click();
    URL.revokeObjectURL(url);
    setResultStatus(builderCopy.downloaded);
  }

  function saveResult() {
    if (!result) return;

    const savedValues = {
      ...values,
      resultText: result.text,
      savedAt: new Date().toISOString(),
    };
    setBuilderValues(savedValues);
    updateAdapt(savedValues);
    setResultStatus(builderCopy.saved);
  }

  function saveAndContinue() {
    saveResult();
    router.push("/implement");
  };

  return (
    <article className="demo-panel learn-pathway-panel">
      <div className="assessment-intro-top">
        <span className="demo-label">{demo.label}</span>
        {hasSeminarProgress ? (
          <button
            className="assessment-reset-button"
            type="button"
            onClick={confirmResetSeminarPathway}
          >
            Start over
          </button>
        ) : null}
      </div>
      <h2>{content.frameworks.adapt.question}</h2>
      <p className="assessment-step-subtitle">{builderCopy.subtitle}</p>

      <section className={`assessment-step-card ${hasTrack ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">{builderCopy.trackEyebrow}</span>
            <h3>{builderCopy.trackTitle}</h3>
          </div>
        </div>
        <div className="assessment-pathways learn-option-grid two">
          {(["worker", "business"] as SeminarTrack[]).map((track) => (
            <button
              aria-pressed={builderValues.track === track}
              className={`assessment-pathway-card ${builderValues.track === track ? "selected" : ""}`}
              key={track}
              type="button"
              onClick={() =>
                replacePathway({
                  track,
                })
              }
            >
              <strong>{track === "business" ? builderCopy.businessLabel : builderCopy.workerLabel}</strong>
              <p>{track === "business" ? builderCopy.businessDescription : builderCopy.workerDescription}</p>
            </button>
          ))}
        </div>
      </section>

      {hasTrack ? (
        <section className="assessment-step-card">
          <div className="assessment-step-heading">
            <span className="assessment-step-number">2</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.readinessEyebrow}</span>
              <h3>{builderCopy.readinessTitle}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {readinessOptions.map((option) => {
              const selected = hasReadinessDecision && isReadinessSelected(option.readiness);

              return (
                <button
                  aria-pressed={selected}
                  className={`assessment-choice ${selected ? "selected" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() => chooseReadiness(option.readiness)}
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              );
            })}
          </div>
          {hasReadinessDecision ? (
            <p className="seminar-readiness-status">
              {readinessCount.ready === readinessCount.total
                ? builderCopy.readinessComplete
                : builderCopy.readinessPartial(readinessCount.ready, readinessCount.total)}
            </p>
          ) : null}
        </section>
      ) : null}

      {showAreaStep ? (
        <section className={`assessment-step-card ${hasWorkCategory ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">3</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.areaEyebrow}</span>
              <h3>{builderCopy.areaTitle}</h3>
            </div>
          </div>
          <div className="assessment-skill-grid learn-option-grid four">
            {workCategoryKeys.map((key) => (
              <button
                aria-pressed={builderValues.workCategory === key}
                className={`assessment-skill-card ${builderValues.workCategory === key ? "selected" : ""}`}
                key={key}
                type="button"
                onClick={() =>
                  replacePathway({
                    track: values.track,
                    readiness: values.readiness,
                    workCategory: key,
                  })
                }
              >
                <strong>{copy.workCategories[key]}</strong>
                <span>{workCategories[key].examples.join(", ")}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {showWorkflowStep ? (
        <section className={`assessment-step-card ${hasWorkflow ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">4</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.workflowEyebrow}</span>
              <h3>{builderCopy.workflowTitle}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {workflowOptions.map((workflow) => {
              return (
                <button
                  aria-pressed={builderValues.workflow === workflow}
                  className={`assessment-choice ${builderValues.workflow === workflow ? "selected" : ""}`}
                  key={workflow}
                  type="button"
                  onClick={() =>
                    replacePathway({
                      track: values.track,
                      readiness: values.readiness,
                      workCategory: values.workCategory,
                      workflow,
                    })
                  }
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{workflow}</strong>
                    <small>{copy.workCategories[values.workCategory]}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showFirstValueStep ? (
        <section
          className={`assessment-step-card ${
            values.track === "business" ? (hasBusinessWorkersAffected ? "complete" : "") : hasWorkerWeeklyHours ? "complete" : ""
          }`}
        >
          <div className="assessment-step-heading">
            <span className="assessment-step-number">5</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.workersAffected : builderCopy.weeklyHoursSaved}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {(values.track === "business" ? businessWorkersAffectedOptions : workerWeeklyHourOptions).map((option) => {
              const selected =
                values.track === "business"
                  ? builderValues.business?.workersAffected === option.value
                  : builderValues.worker?.weeklyHoursSaved === option.value;

              return (
                <button
                  aria-pressed={selected}
                  className={`assessment-choice ${selected ? "selected" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() =>
                    values.track === "business"
                      ? replacePathway({
                          ...pathBase(),
                          business: {
                            ...defaultDraft.adapt.business,
                            workersAffected: option.value,
                          },
                          worker: defaultDraft.adapt.worker,
                        })
                      : replacePathway({
                          ...pathBase(),
                          worker: {
                            ...defaultDraft.adapt.worker,
                            weeklyHoursSaved: option.value,
                          },
                          business: defaultDraft.adapt.business,
                        })
                  }
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showSecondValueStep ? (
        <section
          className={`assessment-step-card ${
            values.track === "business" ? (hasBusinessWeeklyHours ? "complete" : "") : hasWorkerHourlyValue ? "complete" : ""
          }`}
        >
          <div className="assessment-step-heading">
            <span className="assessment-step-number">6</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.weeklyHoursSavedPerWorker : builderCopy.hourlyValue}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {(values.track === "business" ? businessWeeklyHourOptions : workerHourlyValueOptions).map((option) => {
              const selected =
                values.track === "business"
                  ? builderValues.business?.weeklyHoursSavedPerWorker === option.value
                  : builderValues.worker?.hourlyValue === option.value;

              return (
                <button
                  aria-pressed={selected}
                  className={`assessment-choice ${selected ? "selected" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() =>
                    values.track === "business"
                      ? replacePathway({
                          ...pathBase(),
                          business: {
                            ...defaultDraft.adapt.business,
                            workersAffected: values.business.workersAffected,
                            weeklyHoursSavedPerWorker: option.value,
                          },
                          worker: defaultDraft.adapt.worker,
                        })
                      : replacePathway({
                          ...pathBase(),
                          worker: {
                            ...defaultDraft.adapt.worker,
                            weeklyHoursSaved: values.worker.weeklyHoursSaved,
                            hourlyValue: option.value,
                          },
                          business: defaultDraft.adapt.business,
                        })
                  }
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showThirdValueStep ? (
        <section
          className={`assessment-step-card ${
            values.track === "business" ? (hasBusinessHourlyValue ? "complete" : "") : hasWorkerProofPoint ? "complete" : ""
          }`}
        >
          <div className="assessment-step-heading">
            <span className="assessment-step-number">7</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.blendedHourlyValue : builderCopy.proofPoint}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {(values.track === "business" ? businessHourlyValueOptions : proofOptions).map((option) => {
              const selected =
                values.track === "business"
                  ? builderValues.business?.blendedHourlyValue === option.value
                  : builderValues.worker?.proofPoint === option.value;

              return (
                <button
                  aria-pressed={selected}
                  className={`assessment-choice ${selected ? "selected" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() =>
                    values.track === "business"
                      ? replacePathway({
                          ...pathBase(),
                          business: {
                            ...defaultDraft.adapt.business,
                            workersAffected: values.business.workersAffected,
                            weeklyHoursSavedPerWorker: values.business.weeklyHoursSavedPerWorker,
                            blendedHourlyValue: option.value as number,
                          },
                          worker: defaultDraft.adapt.worker,
                        })
                      : replacePathway({
                          ...pathBase(),
                          worker: {
                            ...defaultDraft.adapt.worker,
                            weeklyHoursSaved: values.worker.weeklyHoursSaved,
                            hourlyValue: values.worker.hourlyValue,
                            proofPoint: option.value as string,
                          },
                          business: defaultDraft.adapt.business,
                        })
                  }
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showMultiplierStep ? (
        <section className={`assessment-step-card ${hasMultiplier ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">8</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{builderCopy.multiplier}</h3>
            </div>
          </div>
          <div className="assessment-choice-list">
            {seminarMultiplierOptions.map((option) => {
              const selected = builderValues.multiplier === option.value;

              return (
                <button
                  aria-pressed={selected}
                  className={`assessment-choice ${selected ? "selected" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() =>
                    replacePathway({
                      ...pathBase(),
                      worker: values.worker,
                      business: values.business,
                      multiplier: option.value,
                    })
                  }
                >
                  <span className="assessment-choice-mark" aria-hidden />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showResult && result ? (
        <section className="result-panel learn-report-panel">
          <span className="demo-label">{content.ui.demoContentTitle}</span>
          <h3>{result.title}</h3>
          <p>{result.summary}</p>
          <div className="seminar-value-grid">
            <div className="seminar-value-card">
              <span>{builderCopy.annualValue}</span>
              <strong>{result.annualValueLabel}</strong>
            </div>
            <div className="seminar-value-card">
              <span>{builderCopy.weeklyValue}</span>
              <strong>{result.weeklyHoursSaved.toLocaleString()}</strong>
            </div>
            <div className="seminar-value-card">
              <span>{builderCopy.multiplierLabel}</span>
              <strong>{result.multiplier}x</strong>
            </div>
          </div>
          <ul>
            {result.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="plan-actions learn-report-actions">
            <button className="button ghost" type="button" onClick={copyResult}>
              {builderCopy.copyResult}
              <Clipboard size={16} aria-hidden />
            </button>
            <button className="button ghost" type="button" onClick={downloadResult}>
              {builderCopy.downloadResult}
              <Download size={16} aria-hidden />
            </button>
            <button className="button blue" type="button" onClick={saveResult}>
              {builderCopy.saveResult}
              <CheckCircle2 size={16} aria-hidden />
            </button>
            <button className="button ghost" type="button" onClick={saveAndContinue}>
              {copy.actions.saveToImplement}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
          {resultStatus ? <p className="copy-status">{resultStatus}</p> : null}
          {saved ? <p className="demo-next-step">{demo.nextStep}</p> : null}
        </section>
      ) : showMultiplierStep ? (
        <p className="empty-state">{builderCopy.empty}</p>
      ) : null}
      <DemoNotes demo={demo} />
    </article>
  );
}

function ImplementDemo() {
  const { content, language } = usePortalContent();
  const copy = getPlanCopy(language);
  const demo = content.pages.implement.demo;
  const { draft, updateImplement, clearImplement } = usePlanDraft();
  const [values, setValues] = useState<ImplementPlanInput>(
    () => mergeWithDefaults(draft).implement,
  );
  const [customTaskDraft, setCustomTaskDraft] = useState("");
  const [loadingPath, setLoadingPath] = useState<ImplementPlanInput["audience"] | null>(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const hasProgress = Boolean(
    values.audience ||
      values.companyUrl ||
      values.email ||
      values.workArea ||
      values.report ||
      values.selectedPilot,
  );
  const taskCount = values.selectedTasks.length + values.customTasks.length;
  const employeeReport = values.report?.kind === "employee" ? values.report : undefined;
  const storedImplementKey = JSON.stringify(draft.implement ?? null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setValues(mergeWithDefaults(draft).implement);
      setCustomTaskDraft("");
      setError("");
      setSaveStatus("");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [draft, storedImplementKey]);

  function updateValues(patch: Partial<ImplementPlanInput>) {
    setError("");
    setSaveStatus("");
    setValues((current) => ({ ...current, ...patch, savedAt: undefined }));
  }

  function resetImplementationLab() {
    const nextValues = { ...defaultDraft.implement };
    setValues(nextValues);
    setCustomTaskDraft("");
    setError("");
    setSaveStatus("");
    clearImplement();
  }

  function confirmResetImplementationLab() {
    if (
      window.confirm(
        "Start the AI Implementation Lab over? This will clear your current Step 4 selections and saved report.",
      )
    ) {
      resetImplementationLab();
    }
  }

  function chooseAudience(audience: NonNullable<ImplementPlanInput["audience"]>) {
    updateValues({
      ...defaultDraft.implement,
      audience,
    });
  }

  function chooseWorkArea(workArea: ImplementWorkAreaKey) {
    const area = getWorkArea(workArea);
    updateValues({
      audience: values.audience,
      workArea,
      selectedTasks: area.topSkills,
      customTasks: [],
      report: undefined,
      selectedPilot: undefined,
    });
  }

  function toggleTask(task: string) {
    updateValues({
      selectedTasks: values.selectedTasks.includes(task)
        ? values.selectedTasks.filter((item) => item !== task)
        : [...values.selectedTasks, task],
      report: undefined,
      selectedPilot: undefined,
    });
  }

  function addCustomTask() {
    const task = customTaskDraft.trim();
    if (!task || values.customTasks.includes(task) || values.selectedTasks.includes(task)) {
      setCustomTaskDraft("");
      return;
    }

    updateValues({
      customTasks: [...values.customTasks, task],
      report: undefined,
      selectedPilot: undefined,
    });
    setCustomTaskDraft("");
  }

  function removeCustomTask(task: string) {
    updateValues({
      customTasks: values.customTasks.filter((item) => item !== task),
      report: undefined,
      selectedPilot: undefined,
    });
  }

  async function analyzeEmployee() {
    if (!values.workArea || !values.audience) return;

    setLoadingPath(values.audience);
    setError("");
    setSaveStatus("");

    try {
      const response = await fetch("/api/analyze-employee-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: values.audience,
          workArea: values.workArea,
          tasks: values.selectedTasks,
          customTasks: values.customTasks,
        }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        report?: EmployeeTransformationReport;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.report) {
        throw new Error(payload.error || "Could not generate the Task Transformation Report.");
      }

      updateValues({
        audience: values.audience,
        report: {
          ...payload.report,
          title:
            values.audience === "business"
              ? "Personal AI Readiness Report"
              : payload.report.title || "Task Transformation Report",
        },
        selectedPilot: undefined,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate report.");
    } finally {
      setLoadingPath(null);
    }
  }

  function selectEmployeePilot(task: ImplementationTask) {
    const pilot = pilotFromEmployeeTask(task, values.audience ?? "employee");
    updateValues({
      selectedPilot: pilot,
      workflowName: task.task_name,
      pilotScope: task.description,
      humanGate: task.human_ownership,
    });
  }

  function saveImplementation() {
    if (!values.report || !values.selectedPilot) {
      setError("Choose a first pilot before saving Step 4.");
      return;
    }

    const savedValues: ImplementPlanInput = {
      ...values,
      workflowName: values.selectedPilot.label,
      pilotScope: values.selectedPilot.workflow,
      humanGate: values.selectedPilot.humanReview,
      savedAt: new Date().toISOString(),
    };
    setValues(savedValues);
    updateImplement(savedValues);
    setSaveStatus("Saved to your AI-Ready Action Plan.");
  }

  const selectedArea = values.workArea ? getWorkArea(values.workArea) : undefined;
  const canAnalyzeEmployee = Boolean(values.audience && values.workArea && taskCount >= 3);
  const isLeaderPath = values.audience === "business";

  return (
    <article className="demo-panel learn-pathway-panel implementation-lab-panel">
      <div className="assessment-intro-top">
        <span className="demo-label">{demo.label}</span>
        {hasProgress ? (
          <button
            className="assessment-reset-button"
            type="button"
            onClick={confirmResetImplementationLab}
          >
            Start over
          </button>
        ) : null}
      </div>
      <h2>Build My First AI Pilot</h2>
      <p className="assessment-step-subtitle">
        Choose the path that fits you. Leaders see personal AI readiness; employees see how daily tasks transform.
      </p>

      <section className={`assessment-step-card ${values.audience ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">Audience</span>
            <h3>Who are you exploring AI for?</h3>
          </div>
        </div>
        <div className="assessment-pathways learn-option-grid two">
          <button
            aria-pressed={values.audience === "business"}
            className={`assessment-pathway-card ${values.audience === "business" ? "selected" : ""}`}
            type="button"
            onClick={() => chooseAudience("business")}
          >
            <strong>Business Leader</strong>
            <p>See how your responsibilities and decision workflows can become AI-ready.</p>
          </button>
          <button
            aria-pressed={values.audience === "employee"}
            className={`assessment-pathway-card ${values.audience === "employee" ? "selected" : ""}`}
            type="button"
            onClick={() => chooseAudience("employee")}
          >
            <strong>Employee / Worker</strong>
            <p>See which daily tasks AI can automate, augment, or leave human-owned.</p>
          </button>
        </div>
      </section>

      {values.audience ? (
        <>
          <section className={`assessment-step-card ${values.workArea ? "complete" : ""}`}>
            <div className="assessment-step-heading">
              <span className="assessment-step-number">2</span>
              <div>
                <span className="assessment-step-eyebrow">Work area</span>
                <h3>{isLeaderPath ? "Choose where you lead" : "Choose where your work sits"}</h3>
              </div>
            </div>
            <div className="assessment-skill-grid learn-option-grid three">
              {workAreaOptions.map((area) => {
                const AreaIcon = workAreaIcons[area.category];

                return (
                  <button
                    aria-pressed={values.workArea === area.category}
                    className={`assessment-skill-card implementation-work-area-card ${
                      values.workArea === area.category ? "selected" : ""
                    }`}
                    key={area.category}
                    type="button"
                    onClick={() => chooseWorkArea(area.category)}
                  >
                    <AreaIcon size={15} strokeWidth={2.4} aria-hidden />
                    <strong>{area.category}</strong>
                    <span>{area.focus}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedArea ? (
            <section className={`assessment-step-card ${taskCount >= 3 ? "complete" : ""}`}>
              <div className="assessment-step-heading implementation-task-selector-heading">
                <span className="assessment-step-number">3</span>
                <div>
                  <span className="assessment-step-eyebrow">
                    {selectedArea.category} · {selectedArea.skills.length} skills
                  </span>
                  <h3>{isLeaderPath ? "Select your responsibilities" : "Select what fills your calendar"}</h3>
                </div>
                <span className="implementation-selected-count">
                  <span aria-hidden />
                  {taskCount} {isLeaderPath ? "responsibilities" : "tasks"} selected
                </span>
              </div>
              <div className="implementation-chip-grid">
                {selectedArea.skills.map((task) => {
                  const selected = values.selectedTasks.includes(task);
                  return (
                    <button
                      aria-pressed={selected}
                      className={`implementation-chip ${selected ? "selected" : ""}`}
                      key={task}
                      type="button"
                      onClick={() => toggleTask(task)}
                    >
                      {task}
                    </button>
                  );
                })}
                {values.customTasks.map((task) => (
                  <span className="implementation-chip selected removable" key={task}>
                    {task}
                    <button
                      aria-label={`Remove ${task}`}
                      type="button"
                      onClick={() => removeCustomTask(task)}
                    >
                      <X size={12} aria-hidden />
                    </button>
                  </span>
                ))}
              </div>
              <div className="implementation-custom-task">
                <label className="field">
                  <span>{isLeaderPath ? "Add a responsibility you do not see" : "Add a task you do not see"}</span>
                  <input
                    value={customTaskDraft}
                    placeholder={isLeaderPath ? "Type a responsibility and press Add" : "Type a task and press Add"}
                    onChange={(event) => setCustomTaskDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomTask();
                      }
                    }}
                  />
                </label>
                <button
                  className="button ghost"
                  type="button"
                  disabled={!customTaskDraft.trim()}
                  onClick={addCustomTask}
                >
                  Add
                </button>
              </div>
              <div className="assessment-step-actions">
                <button
                  className="button blue"
                  type="button"
                  disabled={!canAnalyzeEmployee || loadingPath === "employee"}
                  onClick={analyzeEmployee}
                >
                  {loadingPath
                    ? "Analyzing..."
                    : isLeaderPath
                      ? "Generate Personal AI Readiness Report"
                      : "Generate Task Transformation Report"}
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {loadingPath ? <ImplementationLoading audience={loadingPath} /> : null}
      {error ? <ImplementationError message={error} /> : null}

      {employeeReport ? (
        <EmployeeTransformationReportView
          report={employeeReport}
          audience={values.audience ?? "employee"}
          selectedPilot={values.selectedPilot}
          onSelect={selectEmployeePilot}
          onRegenerate={analyzeEmployee}
        />
      ) : null}

      {values.selectedPilot ? (
        <ImplementationGuardrails
          copy={copy}
          values={values}
          saveStatus={saveStatus}
          onChange={updateValues}
          onSave={saveImplementation}
        />
      ) : null}

      <DemoNotes demo={demo} />
    </article>
  );
}

function ImplementationLoading({ audience }: { audience: ImplementPlanInput["audience"] }) {
  const items =
    audience === "business"
      ? [
          "Mapping selected responsibilities...",
          "Classifying Automate / Augment / Own...",
          "Estimating personal AI readiness...",
          "Preparing first pilot options...",
        ]
      : [
          "Mapping selected work tasks...",
          "Classifying Automate / Augment / Own...",
          "Calculating monthly hours saved...",
          "Preparing first pilot options...",
        ];

  return (
    <section className="implementation-loading">
      <Clock size={28} aria-hidden />
      <h3>{audience === "business" ? "Building your Personal AI Readiness Report..." : "Building your Task Transformation Report..."}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            <CheckCircle2 size={16} aria-hidden />
            <span>{index + 1}. {item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImplementationError({ message }: { message: string }) {
  return (
    <section className="implementation-error">
      <AlertCircle size={20} aria-hidden />
      <p>{message}</p>
    </section>
  );
}

function OpportunityLoading() {
  const items = [
    "Scanning your website...",
    "Enriching company context...",
    "Calculating addressable workforce...",
    "Modeling first opportunity areas...",
  ];

  return (
    <section className="implementation-loading">
      <Clock size={28} aria-hidden />
      <h3>Building your Company Opportunity Audit...</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            <CheckCircle2 size={16} aria-hidden />
            <span>{index + 1}. {item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BusinessOpportunityReportView({
  report,
  selectedPilot,
  onSelect,
}: {
  report: BusinessOpportunityReport;
  selectedPilot?: ImplementPilot;
  onSelect: (opportunity: BusinessOpportunity) => void;
}) {
  return (
    <section className="implementation-report">
      <div className="implementation-report-header">
        <div>
          <span className="demo-label">{report.isDemo ? "Demo AI Opportunity Report" : "AI Opportunity Report"}</span>
          <h3>{report.companyName}</h3>
          <p>{report.website} · {report.industry} · {report.sizeEstimate}</p>
        </div>
        <button className="implementation-small-action" type="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>
      {report.demoReason ? <p className="implementation-demo-note">{report.demoReason}</p> : null}
      <div className="implementation-kpi-band">
        <ImplementationStat
          icon={TrendingUp}
          label="Annual value opportunity"
          value={formatShortUsd(report.annualValueAtRisk)}
          sub="Directional estimate"
        />
        <ImplementationStat
          icon={Clock}
          label="Recoverable / week"
          value={`${formatLabNumber(report.weeklyHoursReclaimable)} hrs`}
          sub={`${report.fteEquivalent.toFixed(1)} FTE equivalent`}
        />
        <ImplementationStat
          icon={Sparkles}
          label="Opportunity score"
          value={`${Math.round(report.opportunityScore)}/100`}
          sub="Workflow readiness"
        />
      </div>
      <div className="implementation-report-body">
        <div>
          <h4>Executive Summary</h4>
          <p>{report.executiveSummary}</p>
          <p className="implementation-muted">{report.scoreRationale}</p>
        </div>
        <div>
          <h4>Choose a first opportunity</h4>
          <div className="implementation-opportunity-list">
            {report.opportunities.map((opportunity) => {
              const selected = selectedPilot?.id === opportunity.id;
              return (
                <button
                  aria-pressed={selected}
                  className={`implementation-opportunity ${selected ? "selected" : ""}`}
                  key={opportunity.id}
                  type="button"
                  onClick={() => onSelect(opportunity)}
                >
                  <span>{opportunity.department}</span>
                  <strong>{opportunity.pilotLabel}</strong>
                  <small>{opportunity.symptom}</small>
                  <em>~{formatLabNumber(opportunity.estimatedAnnualHours)} hrs/year</em>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmployeeTransformationReportView({
  report,
  audience,
  selectedPilot,
  onSelect,
  onRegenerate,
}: {
  report: EmployeeTransformationReport;
  audience: ImplementAudience;
  selectedPilot?: ImplementPilot;
  onSelect: (task: ImplementationTask) => void;
  onRegenerate: () => void;
}) {
  const isLeader = audience === "business";
  const sortedTasks = [...report.tasks].sort((a, b) => {
    const order: Record<ImplementationTask["bucket"], number> = {
      AUTOMATE: 0,
      AUGMENT: 1,
      OWN: 2,
    };
    return order[a.bucket] - order[b.bucket] || b.monthly_hours_saved - a.monthly_hours_saved;
  });
  const automatableTasks = sortedTasks.filter((task) => task.bucket === "AUTOMATE");
  const firstPilotTask = automatableTasks[0] ?? sortedTasks.find((task) => task.bucket === "AUGMENT");
  const moreAutomateCount = Math.max(0, report.summary.automate_count - 1);
  const automationPotential = Math.round((report.summary.automate_count / Math.max(1, report.tasks.length)) * 100);
  const readinessBand = report.tasks.length >= 12 ? "Developing" : "Emerging";

  return (
    <section className="implementation-report">
      <div className="implementation-report-header implementation-report-header-spacious">
        <div>
          <span className="implementation-report-eyebrow">
            {isLeader ? "Personal AI Readiness Report" : "Task Transformation Report"}
          </span>
          <h3>{report.workArea}</h3>
          <p>
            {report.skillsAnalyzed} skills analyzed · {report.tasks.length}{" "}
            {isLeader ? "responsibilities generated" : "tasks generated"} · readiness band:{" "}
            <b>{readinessBand}</b>
          </p>
        </div>
        <button className="implementation-small-action" type="button" onClick={onRegenerate}>
          <RotateCw size={14} aria-hidden />
          Regenerate
        </button>
      </div>
      {report.demoReason ? <p className="implementation-demo-note">{report.demoReason}</p> : null}
      <div className="implementation-kpi-band">
        <ImplementationStat
          icon={Clock}
          label="Hours saved / month"
          value={report.summary.estimated_monthly_hours_saved.toFixed(0)}
          sub="From AI deployment"
        />
        <ImplementationStat
          icon={Users}
          label="FTE equivalent"
          value={report.summary.estimated_fte_equivalent_saved.toFixed(2)}
          sub="Per month"
        />
        <ImplementationStat
          icon={Sparkles}
          label="Automation potential"
          value={`${automationPotential}%`}
          sub={`${report.summary.automate_count} of ${report.tasks.length} tasks`}
        />
      </div>
      <div className="implementation-bucket-row">
        <BucketCount label="Augment" count={report.summary.augment_count} bucket="AUGMENT" />
        <BucketCount label="OWN" count={report.summary.own_count} bucket="OWN" />
        <BucketCount label="Automate" count={report.summary.automate_count} bucket="AUTOMATE" />
      </div>
      <div className="implementation-report-body">
        <div>
          <h4>Task-by-task breakdown</h4>
          <p className="implementation-muted">
            {isLeader
              ? "Hours per month across leadership work, before vs. after AI deployment."
              : "Hours per month, before vs. after AI deployment."}
          </p>
          <div className="implementation-task-list">
            {sortedTasks.map((task) => (
              <ImplementationTaskRow
                key={task.task_id}
                task={task}
                selected={selectedPilot?.id === `task-${task.task_id}`}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
        <div>
          <h4>Recommended AI tools</h4>
          <div className="implementation-tool-list">
            {report.tools.map((tool) => (
              <span key={tool}>
                <Wrench size={14} aria-hidden />
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="implementation-workflow-cta">
        <span className="implementation-workflow-cta-label">Your skill roadmap is ready</span>
        <h4>{isLeader ? "Turn this into your leadership AI workflow." : "Turn this into your daily AI workflow."}</h4>
        <ul>
          {firstPilotTask ? (
            <li>
              <CheckCircle2 size={16} aria-hidden />
              <span>
                Customize <b>{firstPilotTask.task_name}</b>
                {moreAutomateCount > 0 ? (
                  <>
                    {" "}(and <b>{moreAutomateCount}</b> more)
                  </>
                ) : null}{" "}
                inside your first AI pilot
              </span>
            </li>
          ) : null}
          <li>
            <CheckCircle2 size={16} aria-hidden />
            <span>
              Reclaim <b>{report.summary.estimated_monthly_hours_saved.toFixed(0)}h/month</b> - that is{" "}
              <b>{report.summary.estimated_fte_equivalent_saved.toFixed(2)} FTE</b> of your week back
            </span>
          </li>
          {report.summary.own_count > 0 ? (
            <li>
              <CheckCircle2 size={16} aria-hidden />
              <span>
                Keep owning the <b>{report.summary.own_count}</b>{" "}
                {isLeader ? "responsibilities only you can lead" : "tasks only you can do"}
              </span>
            </li>
          ) : null}
        </ul>
        {firstPilotTask ? (
          <button className="button primary" type="button" onClick={() => onSelect(firstPilotTask)}>
            Use this as my first pilot
            <ArrowRight size={16} aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ImplementationStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="implementation-stat">
      <span>
        <Icon size={14} aria-hidden />
        {label}
      </span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function BucketCount({
  label,
  count,
  bucket,
}: {
  label: string;
  count: number;
  bucket: ImplementationTask["bucket"];
}) {
  return (
    <div className={`implementation-bucket ${bucket.toLowerCase()}`}>
      <span>{label}</span>
      <strong>{count}</strong>
    </div>
  );
}

function ImplementationTaskRow({
  task,
  selected,
  onSelect,
}: {
  task: ImplementationTask;
  selected: boolean;
  onSelect: (task: ImplementationTask) => void;
}) {
  const beforeHours = (task.avg_minutes_per_instance * task.instances_per_month) / 60;
  const afterHours = Math.max(0, beforeHours - task.monthly_hours_saved);
  const progressPct = Math.max(3, Math.min(100, beforeHours > 0 ? (afterHours / beforeHours) * 100 : 0));
  const canPilot = task.bucket !== "OWN";

  return (
    <button
      aria-pressed={selected}
      className={`implementation-task-row ${selected ? "selected" : ""}`}
      type="button"
      disabled={!canPilot}
      onClick={() => onSelect(task)}
    >
      <div className="implementation-task-row-header">
        <div>
          <BucketBadge bucket={task.bucket} />
          <strong>{task.task_name}</strong>
        </div>
        <span className="implementation-task-hours">
          {beforeHours.toFixed(1)}h {"->"} {afterHours.toFixed(1)}h
        </span>
      </div>
      <span className="implementation-task-progress" aria-hidden>
        <span style={{ width: `${progressPct}%` }} />
      </span>
      <p>
        <b>AI does:</b> {task.ai_action}
      </p>
    </button>
  );
}

function BucketBadge({ bucket }: { bucket: ImplementationTask["bucket"] }) {
  return <span className={`implementation-badge ${bucket.toLowerCase()}`}>{bucket}</span>;
}

function ImplementationGuardrails({
  copy,
  values,
  saveStatus,
  onChange,
  onSave,
}: {
  copy: ReturnType<typeof getPlanCopy>;
  values: ImplementPlanInput;
  saveStatus: string;
  onChange: (patch: Partial<ImplementPlanInput>) => void;
  onSave: () => void;
}) {
  const pilot = values.selectedPilot;
  if (!pilot) return null;

  return (
    <section className="assessment-step-card implementation-guardrails complete">
      <div className="assessment-step-heading">
        <span className="assessment-step-number">4</span>
        <div>
          <span className="assessment-step-eyebrow">First pilot</span>
          <h3>Add guardrails and save</h3>
        </div>
      </div>
      <div className="implementation-pilot-card">
        <div>
          <span className="demo-label">Selected pilot</span>
          <h4>{pilot.label}</h4>
          <p>{pilot.workflow} · {pilot.hoursPerWeek} hrs/week estimate · threshold {pilot.confidenceThreshold}%</p>
        </div>
        <div className="implementation-scope-grid">
          <div>
            <h5>In scope</h5>
            <ul>
              {pilot.inScope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Out of scope</h5>
            <ul>
              {pilot.outOfScope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
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
              onChange={(event) => onChange({ [key]: event.target.checked })}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <div className="plan-actions learn-report-actions">
        <button className="button blue" type="button" onClick={onSave}>
          {copy.actions.saveAndViewComplete}
          <CheckCircle2 size={16} aria-hidden />
        </button>
        <Link className="button ghost" href="/plan">
          View AI-Ready Action Plan
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      {saveStatus ? <p className="copy-status">{saveStatus}</p> : null}
    </section>
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

const opportunityCopy: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    intro: string;
    urlLabel: string;
    urlPlaceholder: string;
    urlButton: string;
    emailEyebrow: string;
    emailTitle: string;
    emailIntro: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailButton: string;
    change: string;
    restart: string;
    trust: string[];
    whyEyebrow: string;
    whyTitle: string;
    whyAside: string;
    whyCards: Array<{ title: string; description: string }>;
  }
> = {
  en: {
    eyebrow: "Enterprise AI Readiness Audit",
    title: "Identify where AI can transform operations across your company.",
    titleHighlight: "transform operations",
    intro:
      "Enter your company URL to generate a real-time audit of AI-ready workflows, operational gaps, and automation opportunities across your organization.",
    urlLabel: "Company URL",
    urlPlaceholder: "yourcompany.com",
    urlButton: "Get Your AI Readiness Audit",
    emailEyebrow: "Company selected",
    emailTitle: "Where should we prepare the report?",
    emailIntro: "The audit appears on this page. Email is used as the report contact for this MVP.",
    emailLabel: "Report contact email",
    emailPlaceholder: "you@company.com",
    emailButton: "Generate report",
    change: "Change company",
    restart: "Start another audit",
    trust: ["30-second audit", "No credit card required", "Enterprise-grade security"],
    whyEyebrow: "Why now",
    whyTitle: "Why AI automation is failing today",
    whyAside: "UpSkill USA fixes all three.",
    whyCards: [
      {
        title: "Emulators stuck in proof-of-concept",
        description: "82% of enterprise AI pilots never reach production. Reliability gaps kill momentum.",
      },
      {
        title: "No visibility into task-level impact",
        description: "Leaders can't measure ROI when automation lives inside opaque emulator loops.",
      },
      {
        title: "No bridge between automation and workforce",
        description: "Workers fear replacement. There's no path from displacement risk to upgraded work.",
      },
    ],
  },
  es: {
    eyebrow: "Auditoría de preparación empresarial para IA",
    title: "Identifica dónde la IA puede transformar operaciones en tu empresa.",
    titleHighlight: "transformar operaciones",
    intro:
      "Ingresa la URL de tu empresa para generar una auditoría en tiempo real de flujos preparados para IA, brechas operativas y oportunidades de automatización.",
    urlLabel: "URL de empresa",
    urlPlaceholder: "tuempresa.com",
    urlButton: "Obtener auditoría de preparación",
    emailEyebrow: "Empresa seleccionada",
    emailTitle: "¿Dónde preparamos el reporte?",
    emailIntro: "La auditoría aparece en esta página. El email se usa como contacto del reporte para este MVP.",
    emailLabel: "Email de contacto",
    emailPlaceholder: "tu@empresa.com",
    emailButton: "Generar reporte",
    change: "Cambiar empresa",
    restart: "Iniciar otra auditoría",
    trust: ["Auditoría en 30 segundos", "Sin tarjeta de crédito", "Seguridad empresarial"],
    whyEyebrow: "Por qué ahora",
    whyTitle: "Por qué falla la automatización con IA hoy",
    whyAside: "UpSkill USA corrige los tres puntos.",
    whyCards: [
      {
        title: "Emuladores atascados en prueba de concepto",
        description: "Muchos pilotos de IA empresarial no llegan a producción. Las brechas de confiabilidad frenan el avance.",
      },
      {
        title: "Sin visibilidad del impacto por tarea",
        description: "Los líderes no pueden medir ROI cuando la automatización vive en ciclos opacos.",
      },
      {
        title: "Sin puente entre automatización y fuerza laboral",
        description: "Los trabajadores temen ser reemplazados. Falta un camino hacia trabajo mejorado.",
      },
    ],
  },
  pt: {
    eyebrow: "Auditoria de prontidão empresarial para IA",
    title: "Identifique onde a IA pode transformar operações na sua empresa.",
    titleHighlight: "transformar operações",
    intro:
      "Insira a URL da sua empresa para gerar uma auditoria em tempo real de fluxos preparados para IA, gargalos operacionais e oportunidades de automação.",
    urlLabel: "URL da empresa",
    urlPlaceholder: "suaempresa.com",
    urlButton: "Obter auditoria de prontidão",
    emailEyebrow: "Empresa selecionada",
    emailTitle: "Onde devemos preparar o relatório?",
    emailIntro: "A auditoria aparece nesta página. O email é usado como contato do relatório neste MVP.",
    emailLabel: "Email de contato",
    emailPlaceholder: "voce@empresa.com",
    emailButton: "Gerar relatório",
    change: "Trocar empresa",
    restart: "Iniciar outra auditoria",
    trust: ["Auditoria em 30 segundos", "Sem cartão de crédito", "Segurança empresarial"],
    whyEyebrow: "Por que agora",
    whyTitle: "Por que a automação com IA falha hoje",
    whyAside: "A UpSkill USA corrige os três pontos.",
    whyCards: [
      {
        title: "Emuladores presos na prova de conceito",
        description: "Muitos pilotos empresariais de IA não chegam à produção. Lacunas de confiabilidade travam o avanço.",
      },
      {
        title: "Sem visibilidade do impacto por tarefa",
        description: "Líderes não conseguem medir ROI quando a automação vive em ciclos opacos.",
      },
      {
        title: "Sem ponte entre automação e força de trabalho",
        description: "Trabalhadores temem substituição. Falta um caminho para trabalho aprimorado.",
      },
    ],
  },
};

function HighlightedOpportunityTitle({ title, highlight }: { title: string; highlight: string }) {
  const [before, after] = title.split(highlight);
  if (after === undefined) {
    return <>{title}</>;
  }
  return (
    <>
      {before}
      <span>{highlight}</span>
      {after}
    </>
  );
}

const opportunityWhyIcons = [AlertCircle, EyeOff, Unplug];

export function OpportunityPage() {
  const { language } = usePortalContent();
  const copy = opportunityCopy[language];
  const [step, setStep] = useState<"website" | "email" | "loading" | "report">("website");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [report, setReport] = useState<BusinessOpportunityReport | null>(null);
  const [selectedPilot, setSelectedPilot] = useState<ImplementPilot | undefined>();
  const [error, setError] = useState("");

  const normalizedWebsite = website.trim();
  const canSubmitWebsite = normalizedWebsite.includes(".");
  const canSubmitEmail = email.trim().includes("@") && email.trim().includes(".");

  function resetAudit() {
    setStep("website");
    setWebsite("");
    setEmail("");
    setReport(null);
    setSelectedPilot(undefined);
    setError("");
  }

  function submitWebsite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitWebsite) {
      setError("Enter a valid company URL.");
      return;
    }
    setError("");
    setStep("email");
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitEmail) {
      setError("Enter a valid email.");
      return;
    }

    setStep("loading");
    setError("");
    setSelectedPilot(undefined);

    try {
      const response = await fetch("/api/analyze-business-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: normalizedWebsite, email }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        report?: BusinessOpportunityReport;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.report) {
        throw new Error(payload.error || "Could not generate the opportunity audit.");
      }

      setReport(payload.report);
      setStep("report");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate audit.");
      setStep("email");
    }
  }

  function selectOpportunity(opportunity: BusinessOpportunity) {
    setSelectedPilot(pilotFromBusinessOpportunity(opportunity));
  }

  return (
    <>
      <section className="page-hero opportunity-hero" id="opportunity-audit">
        <div className="section-inner">
          <span className="eyebrow page-step-label">
            <Sparkles size={15} aria-hidden />
            {copy.eyebrow}
          </span>
          <h1>
            <HighlightedOpportunityTitle title={copy.title} highlight={copy.titleHighlight} />
          </h1>
          <p>{copy.intro}</p>

          {step === "website" ? (
            <form className="opportunity-form" onSubmit={submitWebsite}>
              <label className="field">
                <span>{copy.urlLabel}</span>
                <span className="opportunity-input-shell">
                  <Globe size={28} strokeWidth={1.9} aria-hidden />
                  <input
                    autoComplete="url"
                    inputMode="url"
                    value={website}
                    placeholder={copy.urlPlaceholder}
                    onChange={(event) => {
                      setWebsite(event.target.value);
                      if (error) {
                        setError("");
                      }
                    }}
                  />
                </span>
              </label>
              <button className="button primary" type="submit">
                {copy.urlButton}
                <ArrowRight size={16} aria-hidden />
              </button>
            </form>
          ) : null}
          {step === "website" && error ? (
            <div className="opportunity-inline-error" role="alert">
              <AlertCircle size={16} aria-hidden />
              <p>{error}</p>
            </div>
          ) : null}
          {step === "website" ? (
            <>
              <div className="opportunity-trust-pills">
                {copy.trust.map((item) => (
                  <span key={item}>
                    <CheckCircle2 size={16} aria-hidden />
                    {item}
                  </span>
                ))}
              </div>
              <Link className="button primary opportunity-demo-button" href="/demo">
                <PlayCircle size={16} aria-hidden />
                Watch Demo
              </Link>
            </>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="section-inner framework-flow-page">
          {step === "email" ? (
            <article className="demo-panel opportunity-panel">
              <div className="assessment-intro-top">
                <span className="demo-label">{copy.emailEyebrow}</span>
                <button className="assessment-reset-button" type="button" onClick={() => setStep("website")}>
                  {copy.change}
                </button>
              </div>
              <h2>{copy.emailTitle}</h2>
              <p className="assessment-step-subtitle">
                {normalizedWebsite} · {copy.emailIntro}
              </p>
              <form className="implementation-custom-task" onSubmit={submitEmail}>
                <label className="field">
                  <span>{copy.emailLabel}</span>
                  <input
                    autoComplete="email"
                    type="email"
                    value={email}
                    placeholder={copy.emailPlaceholder}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <button className="button blue" type="submit" disabled={!canSubmitEmail}>
                  {copy.emailButton}
                  <ArrowRight size={16} aria-hidden />
                </button>
              </form>
            </article>
          ) : null}

          {step === "loading" ? <OpportunityLoading /> : null}
          {step !== "website" && error ? <ImplementationError message={error} /> : null}

          {step === "report" && report ? (
            <div className="opportunity-report-wrap">
              <div className="assessment-intro-top">
                <span className="demo-label">Company Opportunity Audit</span>
                <button className="assessment-reset-button" type="button" onClick={resetAudit}>
                  {copy.restart}
                </button>
              </div>
              <BusinessOpportunityReportView
                report={report}
                selectedPilot={selectedPilot}
                onSelect={selectOpportunity}
              />
            </div>
          ) : null}

          {step === "website" ? (
            <section className="opportunity-why-section">
              <div className="section-heading">
                <div>
                  <span className="demo-page-label">{copy.whyEyebrow}</span>
                  <h2>{copy.whyTitle}</h2>
                </div>
                <p>{copy.whyAside}</p>
              </div>
              <div className="opportunity-why-grid">
                {copy.whyCards.map((card, index) => {
                  const Icon = opportunityWhyIcons[index] ?? AlertCircle;
                  return (
                  <article className="opportunity-why-card" key={card.title}>
                    <Icon size={18} aria-hidden />
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <a href="#opportunity-audit">
                      We solve this
                      <ArrowRight size={13} aria-hidden />
                    </a>
                  </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </>
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
