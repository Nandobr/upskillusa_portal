"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  Bot,
  Brain,
  BriefcaseBusiness,
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
  Loader2,
  Mail,
  Megaphone,
  Network,
  PlayCircle,
  Printer,
  RotateCw,
  Scale,
  Settings,
  Sparkles,
  TrendingUp,
  Unplug,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { frameworkOrder, type FrameworkKey, type Language } from "@/lib/content";
import { IkigaiAssessment } from "@/components/ikigai-assessment";
import { usePortalContent } from "@/components/language-provider";
import { mergeWithDefaults, usePlanDraft } from "@/components/plan-provider";
import { SegmentedProgress } from "@/components/segmented-progress";
import {
  defaultDraft,
  generateSeminarResult,
  generateUpgradePlan,
  generateLearnReport,
  getLearnToolOptions,
  getPlanCopy,
  learnFormatOptions,
  learnGoalsByGroup,
  learnGroupOptions,
  learnReportToText,
  planToText,
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

function FormattedStepLabel({ value }: { value: string }) {
  return <>{value.toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase())}</>;
}

function OverviewArcTitle({ value }: { value: string }) {
  const parts = value.split(/\s*->\s*/);

  return (
    <>
      {parts.map((part, index) => (
        <span className="overview-arc-part" key={`${part}-${index}`}>
          {index > 0 ? <ArrowRight size={22} strokeWidth={2.2} aria-hidden /> : null}
          <span>{part}</span>
        </span>
      ))}
    </>
  );
}

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

const seminarBuilderCopy = {
  en: {
    subtitle: "Build a local seminar prep artifact. Nothing is registered or sent.",
    trackEyebrow: "Seminar track",
    trackTitle: "Choose your seminar track",
    workerLabel: "Employee",
    workerDescription: "Estimate saved hours and prepare a Manifest of Saved Hours.",
    businessLabel: "Business Leader",
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
                <span>
                  <FormattedStepLabel value={framework.tab} />
                </span>
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
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading overview-heading">
            <div>
              <div className="overview-title-line">{content.overview.title}</div>
              <h2 className="overview-arc-title">
                <OverviewArcTitle value={content.brand.tagline} />
              </h2>
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

  return (
    <section className="page-hero framework-hero">
      <div className="section-inner">
        <span className="eyebrow page-step-label">
          <Icon size={13} aria-hidden />
          <FormattedStepLabel value={framework.tab} />: {framework.title}
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
    values.goal &&
    values.tool &&
    values.format
      ? {
          group: values.group,
          startingPoint: defaultDraft.learn.startingPoint,
          goal: values.goal,
          tool: values.tool,
          format: values.format,
          time: defaultDraft.learn.time,
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
    if (!report) return;

    printReportAsPdf("UpSkill USA LEARN Report");
    setReportStatus("LEARN Report PDF dialog opened.");
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

      <section className={`assessment-step-card ${values.group ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">Who is learning?</span>
            <h3>Choose your group</h3>
          </div>
        </div>
        <SegmentedProgress current={1} total={4} />
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
        <section className={`assessment-step-card ${values.goal ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">2</span>
            <div>
              <span className="assessment-step-eyebrow">Practical goal</span>
              <h3>What do you want AI to help you do?</h3>
          </div>
        </div>
          <SegmentedProgress current={2} total={4} />
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

      {values.group && values.goal ? (
        <section className={`assessment-step-card ${values.tool ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">3</span>
            <div>
              <span className="assessment-step-eyebrow">Tool</span>
              <h3>Choose the AI tool you want to learn</h3>
          </div>
        </div>
          <SegmentedProgress current={3} total={4} />
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

      {values.group && values.goal && values.tool ? (
        <section className={`assessment-step-card ${values.format ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">4</span>
            <div>
              <span className="assessment-step-eyebrow">Learning format</span>
              <h3>How do you want to learn?</h3>
          </div>
        </div>
          <SegmentedProgress current={4} total={4} />
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

      {report ? (
        <section className="result-panel learn-report-panel printable-report">
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
              Download PDF
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
  const hasTrack = Boolean(builderValues.track);
  const hasWorkCategory = Boolean(builderValues.workCategory);
  const hasWorkflow = Boolean(builderValues.workflow?.trim());
  const hasWorkerWeeklyHours = Boolean(builderValues.worker?.weeklyHoursSaved);
  const hasWorkerHourlyValue = Boolean(builderValues.worker?.hourlyValue);
  const hasWorkerProofPoint = Boolean(builderValues.worker?.proofPoint?.trim());
  const hasBusinessWorkersAffected = Boolean(builderValues.business?.workersAffected);
  const hasBusinessWeeklyHours = Boolean(builderValues.business?.weeklyHoursSavedPerWorker);
  const hasBusinessHourlyValue = Boolean(builderValues.business?.blendedHourlyValue);
  const hasMultiplier = Boolean(builderValues.multiplier);
  const showAreaStep = hasTrack;
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
  const hasSeminarProgress = Boolean(draft.adapt) || Object.keys(builderValues).length > 0;
  const seminarInputRows =
    showResult && result
      ? buildSeminarInputRows({
          values,
          copy,
          builderCopy,
          proofOptions,
        })
      : [];

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

    printReportAsPdf(result.title);
    setResultStatus("Seminar PDF dialog opened.");
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

      <section className={`assessment-step-card ${hasTrack ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">{builderCopy.trackEyebrow}</span>
            <h3>{builderCopy.trackTitle}</h3>
          </div>
        </div>
        <SegmentedProgress current={1} total={7} />
        <div className="assessment-pathways learn-option-grid two seminar-track-grid">
        {(["business", "worker"] as SeminarTrack[]).map((track) => (
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

      {showAreaStep ? (
        <section className={`assessment-step-card ${hasWorkCategory ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">2</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.areaEyebrow}</span>
              <h3>{builderCopy.areaTitle}</h3>
          </div>
        </div>
          <SegmentedProgress current={2} total={7} />
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
            <span className="assessment-step-number">3</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.workflowEyebrow}</span>
              <h3>{builderCopy.workflowTitle}</h3>
          </div>
        </div>
          <SegmentedProgress current={3} total={7} />
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
            <span className="assessment-step-number">4</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.workersAffected : builderCopy.weeklyHoursSaved}</h3>
          </div>
        </div>
          <SegmentedProgress current={4} total={7} />
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
            <span className="assessment-step-number">5</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.weeklyHoursSavedPerWorker : builderCopy.hourlyValue}</h3>
          </div>
        </div>
          <SegmentedProgress current={5} total={7} />
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
            <span className="assessment-step-number">6</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{values.track === "business" ? builderCopy.blendedHourlyValue : builderCopy.proofPoint}</h3>
          </div>
        </div>
          <SegmentedProgress current={6} total={7} />
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
            <span className="assessment-step-number">7</span>
            <div>
              <span className="assessment-step-eyebrow">{builderCopy.valueEyebrow}</span>
              <h3>{builderCopy.multiplier}</h3>
          </div>
        </div>
          <SegmentedProgress current={7} total={7} />
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
        <section className="result-panel learn-report-panel printable-report">
          <span className="demo-label">{content.ui.demoContentTitle}</span>
          <h3>{result.title}</h3>
          <p>{result.summary}</p>
          <div className="seminar-print-inputs">
            <h4>Selected Seminar Inputs</h4>
            <dl>
              {seminarInputRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
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
              Download PDF
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
  const businessReport = values.report?.kind === "business" ? values.report : undefined;
  const employeeReport = values.report?.kind === "employee" ? values.report : undefined;
  const normalizedCompanyUrl = values.companyUrl.trim();
  const normalizedEmail = values.email.trim();
  const canSubmitCompanyUrl = normalizedCompanyUrl.includes(".");
  const canSubmitBusinessAudit = canSubmitCompanyUrl && normalizedEmail.includes("@") && normalizedEmail.includes(".");
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

  async function analyzeBusiness() {
    if (!canSubmitBusinessAudit) {
      setError(canSubmitCompanyUrl ? "Enter a valid contact email." : "Enter a valid company URL.");
      return;
    }

    setLoadingPath("business");
    setError("");
    setSaveStatus("");

    try {
      const response = await fetch("/api/analyze-business-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: normalizedCompanyUrl, email: normalizedEmail }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        report?: BusinessOpportunityReport;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.report) {
        throw new Error(payload.error || "Could not generate the opportunity audit.");
      }

      updateValues({
        audience: "business",
        companyUrl: normalizedCompanyUrl,
        email: normalizedEmail,
        report: payload.report,
        selectedPilot: undefined,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate audit.");
    } finally {
      setLoadingPath(null);
    }
  }

  async function analyzeEmployee() {
    if (!values.workArea || values.audience !== "employee") return;

    setLoadingPath("employee");
    setError("");
    setSaveStatus("");

    try {
      const response = await fetch("/api/analyze-employee-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "employee",
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
        audience: "employee",
        report: payload.report,
        selectedPilot: undefined,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate report.");
    } finally {
      setLoadingPath(null);
    }
  }

  function selectEmployeePilot(task: ImplementationTask) {
    const pilot = pilotFromEmployeeTask(task, "employee");
    updateValues({
      selectedPilot: pilot,
      workflowName: task.task_name,
      pilotScope: task.description,
      humanGate: task.human_ownership,
    });
  }

  function selectBusinessPilot(opportunity: BusinessOpportunity) {
    const pilot = pilotFromBusinessOpportunity(opportunity);
    updateValues({
      selectedPilot: pilot,
      workflowName: pilot.label,
      pilotScope: pilot.workflow,
      humanGate: pilot.humanReview,
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
  const canAnalyzeEmployee = Boolean(values.audience === "employee" && values.workArea && taskCount >= 3);
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
        Choose the path that fits you. Leaders audit company opportunity; employees see how daily tasks transform.
      </p>

      <section className={`assessment-step-card ${values.audience ? "complete" : ""}`}>
        <div className="assessment-step-heading">
          <span className="assessment-step-number">1</span>
          <div>
            <span className="assessment-step-eyebrow">Audience</span>
            <h3>Who are you exploring AI for?</h3>
          </div>
        </div>
        <SegmentedProgress current={1} total={3} />
        <div className="assessment-pathways learn-option-grid two">
          <button
            aria-pressed={values.audience === "business"}
            className={`assessment-pathway-card ${values.audience === "business" ? "selected" : ""}`}
            type="button"
            onClick={() => chooseAudience("business")}
          >
            <strong>Business Leader</strong>
            <p>Audit your company website, capture contact email, and choose a first AI pilot.</p>
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

      {isLeaderPath ? (
        <section className={`assessment-step-card ${canSubmitBusinessAudit ? "complete" : ""}`}>
          <div className="assessment-step-heading">
            <span className="assessment-step-number">2</span>
            <div>
              <span className="assessment-step-eyebrow">Company audit</span>
              <h3>Start with your company website</h3>
          </div>
        </div>
          <SegmentedProgress current={2} total={3} />
          <form
            className="implementation-business-audit"
            onSubmit={(event) => {
              event.preventDefault();
              analyzeBusiness();
            }}
          >
            <div className="implementation-business-audit-fields">
              <label className="field">
                <span>Company URL</span>
                <span className="opportunity-input-shell">
                  <Globe size={24} strokeWidth={1.9} aria-hidden />
                  <input
                    autoComplete="url"
                    inputMode="url"
                    value={values.companyUrl}
                    placeholder="yourcompany.com"
                    onChange={(event) =>
                      updateValues({
                        companyUrl: event.target.value,
                        report: undefined,
                        selectedPilot: undefined,
                      })
                    }
                  />
                </span>
              </label>
              <label className="field">
                <span>Contact email</span>
                <span className="opportunity-input-shell">
                  <Mail size={22} strokeWidth={1.9} aria-hidden />
                  <input
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    placeholder="name@company.com"
                    onChange={(event) =>
                      updateValues({
                        email: event.target.value,
                        report: undefined,
                        selectedPilot: undefined,
                      })
                    }
                  />
                </span>
              </label>
            </div>
            <div className="assessment-step-actions">
              <button
                className="button blue"
                type="submit"
                disabled={!canSubmitBusinessAudit || loadingPath === "business"}
              >
                {loadingPath === "business" ? "Analyzing..." : "Generate AI Opportunity Report"}
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {values.audience === "employee" ? (
        <>
          <section className={`assessment-step-card ${values.workArea ? "complete" : ""}`}>
            <div className="assessment-step-heading">
              <span className="assessment-step-number">2</span>
              <div>
                <span className="assessment-step-eyebrow">Work area</span>
                <h3>Choose where your work sits</h3>
              </div>
            </div>
            <SegmentedProgress current={2} total={3} />
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
                  <h3>Select what fills your calendar</h3>
                </div>
                <span className="implementation-selected-count">
                  <span aria-hidden />
                  {taskCount} tasks selected
                </span>
              </div>
              <SegmentedProgress current={3} total={3} />
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
                  <span>Add a task you do not see</span>
                  <input
                    value={customTaskDraft}
                    placeholder="Type a task and press Add"
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
                  {loadingPath === "employee" ? "Analyzing..." : "Generate Task Transformation Report"}
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {loadingPath === "business" ? <OpportunityLoading /> : null}
      {loadingPath === "employee" ? <ImplementationLoading audience="employee" /> : null}
      {error ? <ImplementationError message={error} /> : null}

      {businessReport ? (
        <BusinessOpportunityReportView
          report={businessReport}
          selectedPilot={values.selectedPilot}
          onSelect={selectBusinessPilot}
        />
      ) : null}

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
      <Loader2 size={28} aria-hidden />
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
      <Loader2 size={28} aria-hidden />
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
  const reportText = businessReportToText(report);

  return (
    <section className="implementation-report business-audit-report printable-report">
      <div className="business-audit-header">
        <div>
          <span className="implementation-report-eyebrow">AI Readiness Diagnostic</span>
          <h3>{report.companyName}</h3>
          <p>{report.website} · {report.industry} · {report.sizeEstimate}</p>
        </div>
        <div className="implementation-report-actions">
          <span className="implementation-report-pill">{report.isDemo ? "Sample data" : "Live audit"}</span>
          <ReportActionButton icon={Clipboard} label="Copy" onClick={() => copyReportText(reportText)} />
          <ReportActionButton
            icon={Download}
            label="Download PDF"
            onClick={() => printReportAsPdf(`${report.companyName} AI Opportunity Report`)}
          />
          <ReportActionButton icon={Printer} label="Print / Save PDF" onClick={() => printReportAsPdf(`${report.companyName} AI Opportunity Report`)} />
        </div>
      </div>
      {report.demoReason ? <p className="implementation-demo-note">{report.demoReason}</p> : null}

      <div className="business-audit-value-band">
        <div className="business-audit-value-content">
          <span>
            <TrendingUp size={15} aria-hidden />
            Annual Cost of Inaction
          </span>
          <strong>{formatShortUsd(report.annualValueAtRisk)}</strong>
          <p>
            in fully loaded labor value locked inside repeatable, addressable work at {report.companyName}.
          </p>
          <div className="business-audit-dark-stats">
            <BusinessDarkStat icon={Users} label="Employees" value={formatLabNumber(report.employees)} hint={report.sizeEstimate} />
            <BusinessDarkStat
              icon={Users}
              label="Addressable roles"
              value={formatLabNumber(report.addressableRoles)}
              hint={report.industry}
            />
            <BusinessDarkStat
              icon={Clock}
              label="Recoverable / week"
              value={`${formatLabNumber(report.weeklyHoursReclaimable)} hrs`}
              hint={`${formatLabNumber(report.annualHoursReclaimable)} hrs/year`}
            />
          </div>
        </div>
      </div>

      <div className="business-audit-gap-band">
        <div>
          <span>
            <AlertCircle size={15} aria-hidden />
            5-Year Competitive Gap
          </span>
          <p>Cumulative value lost if competitors deploy AI before you do.</p>
        </div>
        <strong>{formatShortUsd(report.fiveYearCostOfInaction)}</strong>
      </div>

      <div className="business-audit-summary">
        <div className="business-audit-score">
          <span>Workforce Score</span>
          <strong>{Math.round(report.opportunityScore)}<small>/100</small></strong>
        </div>
        <div>
          <h4>Executive Summary</h4>
          <p>{report.executiveSummary}</p>
          <p className="implementation-muted">{report.scoreRationale}</p>
        </div>
      </div>

      <div className="business-audit-opportunities">
        <h4>What&apos;s hiding in your operations</h4>
        <p className="implementation-muted">High-volume manual work surfaced from company signals and common workflow patterns.</p>
        <div className="business-opportunity-list">
          {report.opportunities.map((opportunity) => {
            const selected = selectedPilot?.id === opportunity.id;
            return (
              <button
                aria-pressed={selected}
                className={`business-opportunity-row ${selected ? "selected" : ""}`}
                key={opportunity.id}
                type="button"
                onClick={() => onSelect(opportunity)}
              >
                <div>
                  <span>{opportunity.department}</span>
                  <strong>{opportunity.pilotLabel}</strong>
                  <small>{opportunity.symptom}</small>
                </div>
                <em>
                  <span>Trapped</span>
                  ~{formatLabNumber(opportunity.estimatedAnnualHours)} hrs/year
                </em>
              </button>
            );
          })}
        </div>
      </div>

      <div className="business-audit-methodology">
        <b>Methodology:</b> directional figures combine company context, common addressable workflow patterns,
        and conservative labor-value assumptions. Use this as a first-pilot planning estimate.
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
  const weeklyHours = report.summary.estimated_monthly_hours_saved / 4.33;
  const readinessScore = Math.min(92, Math.max(58, 62 + automationPotential));
  const reportText = employeeReportToText(report);

  return (
    <section className="employee-action-report printable-report">
      <div className="employee-action-header">
        <div className="employee-action-identity">
          <span className="employee-action-avatar" aria-hidden>
            AI
          </span>
          <div>
            <span className="implementation-report-eyebrow">
              {isLeader ? "Personal AI Readiness Report" : "AI-Ready Action Plan"}
            </span>
            <h3>{report.workArea}</h3>
            <p>
              {report.skillsAnalyzed} skills analyzed · {report.tasks.length}{" "}
              {isLeader ? "responsibilities generated" : "tasks generated"} · readiness band:{" "}
              <b>{readinessBand}</b>
            </p>
          </div>
        </div>
        <div className="implementation-report-actions">
          {report.isDemo || report.demoReason ? <span className="implementation-report-pill">Sample data</span> : null}
          <ReportActionButton icon={RotateCw} label="Regenerate" onClick={onRegenerate} />
          <ReportActionButton icon={Clipboard} label="Copy" onClick={() => copyReportText(reportText)} />
          <ReportActionButton
            icon={Download}
            label="Download PDF"
            onClick={() => printReportAsPdf(`${report.workArea} AI-Ready Action Plan`)}
          />
        </div>
      </div>
      {report.demoReason ? <p className="implementation-demo-note">{report.demoReason}</p> : null}

      <div className="employee-metric-grid">
        <EmployeeMetricCard
          label="Hours recovered / week"
          value={weeklyHours.toFixed(1)}
          sub="From automated and augmented work"
          tone="green"
        />
        <EmployeeMetricCard
          label="AI readiness score"
          value={`${readinessScore}/100`}
          sub="Task-level confidence"
          tone="blue"
        />
        <EmployeeMetricCard
          label="Recommended pathway"
          value="3 tracks"
          sub="Personalized"
          tone="slate"
        />
      </div>

      <div className="employee-bucket-row">
        <BucketCount label="Automate" count={report.summary.automate_count} bucket="AUTOMATE" />
        <BucketCount label="Augment" count={report.summary.augment_count} bucket="AUGMENT" />
        <BucketCount label="OWN" count={report.summary.own_count} bucket="OWN" />
      </div>

      <div className="employee-report-body">
        <section>
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
        </section>
        <section>
          <h4>Recommended AI tools</h4>
          <div className="employee-tool-list">
            {report.tools.map((tool) => (
              <span key={tool}>
                <CheckCircle2 size={14} aria-hidden />
                {tool}
              </span>
            ))}
          </div>
        </section>
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

function ReportActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Clock;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="implementation-small-action" type="button" onClick={onClick}>
      <Icon size={14} aria-hidden />
      {label}
    </button>
  );
}

function BusinessDarkStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="business-dark-stat">
      <span>
        <Icon size={14} aria-hidden />
        {label}
      </span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function EmployeeMetricCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "green" | "blue" | "slate";
}) {
  return (
    <div className={`employee-metric-card ${tone}`}>
      <span>{label}</span>
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
          {beforeHours.toFixed(1)}h {"->"} <b>{afterHours.toFixed(1)}h</b>
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

function businessReportToText(report: BusinessOpportunityReport) {
  return [
    "AI Opportunity Report",
    `${report.companyName}`,
    `${report.website} · ${report.industry} · ${report.sizeEstimate}`,
    "",
    `Annual Cost of Inaction: ${formatShortUsd(report.annualValueAtRisk)}`,
    `5-Year Competitive Gap: ${formatShortUsd(report.fiveYearCostOfInaction)}`,
    `Workforce Score: ${Math.round(report.opportunityScore)}/100`,
    `Recoverable / week: ${formatLabNumber(report.weeklyHoursReclaimable)} hrs`,
    "",
    "Executive Summary",
    report.executiveSummary,
    report.scoreRationale,
    "",
    "What's hiding in your operations",
    ...report.opportunities.map(
      (opportunity) =>
        `- ${opportunity.department}: ${opportunity.pilotLabel} (${formatLabNumber(
          opportunity.estimatedAnnualHours,
        )} hrs/year) - ${opportunity.symptom}`,
    ),
  ].join("\n");
}

function employeeReportToText(report: EmployeeTransformationReport) {
  return [
    "AI-Ready Action Plan",
    `${report.workArea}`,
    `${report.skillsAnalyzed} skills analyzed · ${report.tasks.length} tasks generated`,
    "",
    `Hours saved / month: ${report.summary.estimated_monthly_hours_saved.toFixed(1)}`,
    `FTE equivalent: ${report.summary.estimated_fte_equivalent_saved.toFixed(2)}`,
    `Buckets: ${report.summary.automate_count} automate, ${report.summary.augment_count} augment, ${report.summary.own_count} own`,
    "",
    "Task-by-task breakdown",
    ...report.tasks.map((task) => {
      const beforeHours = (task.avg_minutes_per_instance * task.instances_per_month) / 60;
      const afterHours = Math.max(0, beforeHours - task.monthly_hours_saved);
      return `- ${task.bucket}: ${task.task_name} (${beforeHours.toFixed(1)}h -> ${afterHours.toFixed(1)}h). AI does: ${task.ai_action}`;
    }),
    "",
    "Recommended AI tools",
    ...report.tools.map((tool) => `- ${tool}`),
  ].join("\n");
}

function buildSeminarInputRows({
  values,
  copy,
  builderCopy,
  proofOptions,
}: {
  values: AdaptPlanInput;
  copy: ReturnType<typeof getPlanCopy>;
  builderCopy: (typeof seminarBuilderCopy)[keyof typeof seminarBuilderCopy];
  proofOptions: SeminarChoice<string>[];
}) {
  const rows: Array<[string, string]> = [
    [builderCopy.trackEyebrow, values.track === "business" ? builderCopy.businessLabel : builderCopy.workerLabel],
    [builderCopy.areaEyebrow, copy.workCategories[values.workCategory]],
    [builderCopy.workflowEyebrow, values.workflow],
  ];

  if (values.track === "business") {
    const workersAffected = businessWorkersAffectedOptions.find(
      (option) => option.value === values.business.workersAffected,
    );
    const weeklyHours = businessWeeklyHourOptions.find(
      (option) => option.value === values.business.weeklyHoursSavedPerWorker,
    );
    const hourlyValue = businessHourlyValueOptions.find(
      (option) => option.value === values.business.blendedHourlyValue,
    );
    rows.push(
      [builderCopy.workersAffected, workersAffected?.label ?? `${values.business.workersAffected}`],
      [builderCopy.weeklyHoursSavedPerWorker, weeklyHours?.label ?? `${values.business.weeklyHoursSavedPerWorker}`],
      [builderCopy.blendedHourlyValue, hourlyValue?.label ?? `$${values.business.blendedHourlyValue}/hr`],
    );
  } else {
    const weeklyHours = workerWeeklyHourOptions.find((option) => option.value === values.worker.weeklyHoursSaved);
    const hourlyValue = workerHourlyValueOptions.find((option) => option.value === values.worker.hourlyValue);
    const proofPoint = proofOptions.find((option) => option.value === values.worker.proofPoint);
    rows.push(
      [builderCopy.weeklyHoursSaved, weeklyHours?.label ?? `${values.worker.weeklyHoursSaved} hours`],
      [builderCopy.hourlyValue, hourlyValue?.label ?? `$${values.worker.hourlyValue}/hr`],
      [builderCopy.proofPoint, proofPoint?.label ?? values.worker.proofPoint],
    );
  }

  const multiplier = seminarMultiplierOptions.find((option) => option.value === values.multiplier);
  rows.push([builderCopy.multiplier, multiplier?.label ?? `${values.multiplier}x`]);
  return rows;
}

function copyReportText(text: string) {
  if (!navigator.clipboard) return;
  void navigator.clipboard.writeText(text);
}

function printReportAsPdf(title: string) {
  const previousTitle = document.title;
  document.title = title;
  document.body.classList.add("printing-report");

  const cleanup = () => {
    document.body.classList.remove("printing-report");
    document.title = previousTitle;
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);
  window.print();
  window.setTimeout(cleanup, 800);
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
  const isInspiration = keyName === "inspire";
  const showIntroCopy = !isInspiration && keyName !== "adapt";
  const showPageSections = keyName !== "adapt" && content.pages[keyName].sections.length > 0;

  return (
    <>
      <PageHero keyName={keyName} />

      <section className={isInspiration ? "section framework-assessment-section" : "section"}>
        <div className={isInspiration ? "section-inner framework-flow-inspire" : "section-inner framework-flow-page"}>
          <div className={isInspiration ? "framework-intro" : "framework-intro framework-page-intro"}>
            <div className="pill-label">{framework.title}</div>
            {showIntroCopy ? (
              <>
                <h2>{framework.audience}</h2>
                {keyName !== "implement" ? <p>{framework.summary}</p> : null}
              </>
            ) : null}
          </div>
          <DemoForRoute keyName={keyName} />
        </div>
      </section>

      {showPageSections ? (
        <section className="section muted">
          <div className="section-inner">
            <PageSections keyName={keyName} />
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
    printReportAsPdf("UpSkill USA AI Upgrade Plan");
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
                Download PDF
              </button>
              <button className="button danger" type="button" onClick={clearSavedPlan}>
                {copy.actions.clearPlan}
              </button>
            </div>
            {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}
          </aside>

          <article className="plan-document printable-report">
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
