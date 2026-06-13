import type { FrameworkKey, Language } from "@/lib/content";
import {
  assessmentCopy,
  defaultAssessmentResult,
  formatCurrency,
  formatNumber,
  formatOutlook,
  getBestActionOccupation,
  getCategoryLabel,
  getComparedOccupations,
  getMatchOccupations,
  getPathway,
  getRecommendations,
  type IkigaiAssessmentResult,
} from "@/lib/ikigai-assessment";
import { occupations } from "@/lib/data/occupations";

export type UserTrack = "worker" | "educator" | "employer" | "partner";
export type AiComfort = "beginner" | "some" | "advanced";
export type TimeCommitment = "30-minutes" | "2-hours" | "saturday";
export type LearningPreference = "watch" | "read" | "practice" | "seminar";
export type LearnGroup = "student" | "educator" | "worker" | "entrepreneur";
export type AiStartingPoint = "new-to-ai" | "tried-ai" | "ready-for-work";
export type LearnGoal =
  | "study-faster"
  | "research-sources"
  | "prepare-projects"
  | "create-materials"
  | "responsible-use"
  | "planning-feedback"
  | "communicate-better"
  | "summarize-docs"
  | "routine-tasks"
  | "plan-offer"
  | "marketing-sales"
  | "operations-follow-up";
export type LearnTool = "chatgpt" | "claude" | "gemini" | "copilot" | "notebooklm";
export type LearnFormat = "watch" | "read" | "practice";
export type LearnTime = "10-minutes" | "30-minutes" | "1-hour";
export type WorkCategoryKey =
  | "customer-support"
  | "sales-marketing"
  | "human-resources"
  | "finance-admin"
  | "operations"
  | "training-education"
  | "it-data"
  | "leadership-strategy";
export type RiskLevel = "low" | "medium" | "high";
export type PlanLevel = 0 | 1 | 2 | 3 | 4;

export type InspirePlanInput = {
  userType: UserTrack;
  role: string;
  organization: string;
  motivation: string;
  desiredOutcome: string;
  humanStrengths: string;
  assessment: IkigaiAssessmentResult;
};

export type LearnPlanInput = {
  group: LearnGroup;
  startingPoint: AiStartingPoint;
  goal: LearnGoal;
  tool: LearnTool;
  format: LearnFormat;
  time: LearnTime;
  reportSummary: string;
  nextAction: string;
};

export type AdaptPlanInput = {
  workCategory: WorkCategoryKey;
  workflowPain: string;
  mainSteps: string;
  delay: string;
  repetitiveWork: string;
  judgmentNeeds: string;
  desiredOutcome: string;
  own: string;
  become: string;
};

export type ImplementPlanInput = {
  companyUrl: string;
  workflowName: string;
  pilotScope: string;
  humanGate: string;
  impactsPeople: boolean;
  usesSensitiveData: boolean;
  harmIfWrong: boolean;
  needsExplanation: boolean;
  hasAppealPath: boolean;
};

export type PlanDraft = {
  inspire?: InspirePlanInput;
  learn?: LearnPlanInput;
  adapt?: AdaptPlanInput;
  implement?: ImplementPlanInput;
};

export type GeneratedPlanSection = {
  title: string;
  body: string;
  items?: string[];
};

export type GeneratedPlan = {
  level: PlanLevel;
  levelLabel: string;
  completedSteps: FrameworkKey[];
  nextStep?: FrameworkKey;
  riskLevel?: RiskLevel;
  sections: GeneratedPlanSection[];
  nextActions: string[];
  afterSevenDays: string[];
};

export const planStorageKey = "upskillusa-ai-upgrade-plan";

export const trackOptions: Record<UserTrack, string> = {
  worker: "Worker or student",
  educator: "Educator",
  employer: "Employer or business leader",
  partner: "City, chamber, or community partner",
};

export const comfortOptions: Record<AiComfort, string> = {
  beginner: "Beginner",
  some: "Some experience",
  advanced: "Advanced",
};

export const timeOptions: Record<TimeCommitment, string> = {
  "30-minutes": "30 minutes",
  "2-hours": "2 hours",
  saturday: "Saturday session",
};

export const learningPreferenceOptions: Record<LearningPreference, string> = {
  watch: "Watch short lessons",
  read: "Read guides",
  practice: "Practice with prompts",
  seminar: "Join a guided seminar",
};

export type LearnOption<T extends string> = {
  id: T;
  label: string;
  description: string;
};

export type LearnReport = {
  title: string;
  demoLabel: string;
  path: string[];
  profileSummary: string;
  learningPath: string[];
  toolStarterGuide: string[];
  practicePrompt: string;
  nextAction: string;
  planSummary: string;
};

export const learnGroupOptions: LearnOption<LearnGroup>[] = [
  {
    id: "student",
    label: "Student",
    description: "I want to use AI to study, research, and prepare for work.",
  },
  {
    id: "educator",
    label: "Educator",
    description: "I want to use AI to teach, guide students, and save time.",
  },
  {
    id: "worker",
    label: "Worker",
    description: "I want to use AI to improve daily tasks and stay valuable at work.",
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    description: "I want to use AI to plan, market, sell, and operate better.",
  },
];

export const aiStartingPointOptions: LearnOption<AiStartingPoint>[] = [
  {
    id: "new-to-ai",
    label: "New to AI",
    description: "I need the basics before I try tools.",
  },
  {
    id: "tried-ai",
    label: "Tried AI a Few Times",
    description: "I have used AI, but I want better results.",
  },
  {
    id: "ready-for-work",
    label: "Ready to Use AI at Work",
    description: "I want repeatable workflows I can trust.",
  },
];

export const learnGoalsByGroup: Record<LearnGroup, LearnOption<LearnGoal>[]> = {
  student: [
    {
      id: "study-faster",
      label: "Study and Understand Faster",
      description: "Turn confusing material into clearer explanations and study steps.",
    },
    {
      id: "research-sources",
      label: "Research and Summarize Sources",
      description: "Work with readings, notes, and source material more effectively.",
    },
    {
      id: "prepare-projects",
      label: "Prepare Resumes, Projects, or Presentations",
      description: "Draft stronger school and career materials with human review.",
    },
  ],
  educator: [
    {
      id: "create-materials",
      label: "Create Teaching Materials",
      description: "Draft lessons, examples, quizzes, and activities faster.",
    },
    {
      id: "responsible-use",
      label: "Guide Students on Responsible AI Use",
      description: "Set clear boundaries and model ethical use.",
    },
    {
      id: "planning-feedback",
      label: "Save Time on Planning and Feedback",
      description: "Use AI for drafts while keeping educator judgment in control.",
    },
  ],
  worker: [
    {
      id: "communicate-better",
      label: "Write and Communicate Better",
      description: "Draft, revise, and clarify everyday work communication.",
    },
    {
      id: "summarize-docs",
      label: "Summarize Documents or Meetings",
      description: "Turn notes and long documents into clear action points.",
    },
    {
      id: "routine-tasks",
      label: "Save Time on Routine Tasks",
      description: "Build repeatable prompts for work you do often.",
    },
  ],
  entrepreneur: [
    {
      id: "plan-offer",
      label: "Plan My Business or Offer",
      description: "Clarify the customer, promise, offer, and first steps.",
    },
    {
      id: "marketing-sales",
      label: "Create Marketing and Sales Content",
      description: "Draft messages, posts, pages, and follow-up sequences.",
    },
    {
      id: "operations-follow-up",
      label: "Organize Operations and Follow-Up",
      description: "Create simple systems for tasks, customers, and next actions.",
    },
  ],
};

export const learnFormatOptions: LearnOption<LearnFormat>[] = [
  { id: "watch", label: "Watch", description: "Short lessons and examples." },
  { id: "read", label: "Read", description: "Quick guides and checklists." },
  { id: "practice", label: "Practice", description: "Prompts, exercises, and templates." },
];

export const learnTimeOptions: LearnOption<LearnTime>[] = [
  { id: "10-minutes", label: "10 Minutes", description: "One quick starting action." },
  { id: "30-minutes", label: "30 Minutes", description: "A focused mini-path." },
  { id: "1-hour", label: "1 Hour", description: "A complete starter session." },
];

export const learnToolOptions: Record<LearnTool, LearnOption<LearnTool>> = {
  chatgpt: {
    id: "chatgpt",
    label: "ChatGPT",
    description: "A flexible general AI assistant for writing, planning, and practice.",
  },
  claude: {
    id: "claude",
    label: "Claude",
    description: "A strong assistant for writing, reasoning, and longer documents.",
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    description: "Google's AI assistant for general help and Google-connected work.",
  },
  copilot: {
    id: "copilot",
    label: "Microsoft Copilot",
    description: "AI support for Microsoft documents, meetings, email, and work tasks.",
  },
  notebooklm: {
    id: "notebooklm",
    label: "NotebookLM",
    description: "A source-grounded tool for working with notes, documents, and readings.",
  },
};

const documentHeavyGoals = new Set<LearnGoal>(["research-sources", "summarize-docs"]);
const generalToolIds: LearnTool[] = ["chatgpt", "claude", "gemini", "copilot"];
const documentToolIds: LearnTool[] = ["notebooklm", "chatgpt", "claude", "copilot"];

export function getLearnToolOptions(goal: LearnGoal | undefined): LearnOption<LearnTool>[] {
  const ids = goal && documentHeavyGoals.has(goal) ? documentToolIds : generalToolIds;
  return ids.map((id) => learnToolOptions[id]);
}

function findLearnOption<T extends string>(options: LearnOption<T>[], id: T) {
  return options.find((option) => option.id === id) ?? options[0];
}

export function getLearnLabels(input: LearnPlanInput) {
  const group = findLearnOption(learnGroupOptions, input.group);
  const startingPoint = findLearnOption(aiStartingPointOptions, input.startingPoint);
  const goal = findLearnOption(learnGoalsByGroup[input.group], input.goal);
  const tool = learnToolOptions[input.tool];
  const format = findLearnOption(learnFormatOptions, input.format);
  const time = findLearnOption(learnTimeOptions, input.time);

  return { group, startingPoint, goal, tool, format, time };
}

export function generateLearnReport(input: LearnPlanInput): LearnReport {
  const labels = getLearnLabels(input);
  const learningVerb =
    input.format === "watch" ? "Watch one short demo" : input.format === "read" ? "Read one quick guide" : "Practice with one real prompt";
  const timeAction =
    input.time === "10-minutes"
      ? "Use one low-risk task today and stop after the first useful result."
      : input.time === "30-minutes"
        ? "Complete the starter practice, revise once, and save the best prompt."
        : "Run the practice on a real example, review the output, and write your repeatable next step.";
  const reviewAction =
    input.startingPoint === "ready-for-work"
      ? "Add a human review gate before the output affects a real person, customer, grade, or business decision."
      : "Review the output like a draft, not a final answer.";

  const profileSummary = `You are a ${labels.group.label.toLowerCase()} who is ${labels.startingPoint.label.toLowerCase()} and wants to ${labels.goal.label.toLowerCase()} with ${labels.tool.label}.`;
  const practicePrompt = `Act as a practical AI learning coach for a ${labels.group.label.toLowerCase()}. Help me ${labels.goal.label.toLowerCase()} using ${labels.tool.label}. Give me a simple first draft, explain what I should check, and end with three ways I can improve the result.`;
  const nextAction = `${learningVerb} for ${labels.time.label.toLowerCase()}. ${timeAction}`;
  const planSummary = `${labels.group.label}: ${labels.startingPoint.label}. Focus on "${labels.goal.label}" with ${labels.tool.label} using a ${labels.format.label.toLowerCase()} path for ${labels.time.label.toLowerCase()}.`;

  return {
    title: "Your LEARN Report",
    demoLabel: "Demo content - generated locally",
    path: [
      `Group: ${labels.group.label}`,
      `Starting point: ${labels.startingPoint.label}`,
      `Goal: ${labels.goal.label}`,
      `Tool: ${labels.tool.label}`,
      `Format: ${labels.format.label}`,
      `Time: ${labels.time.label}`,
    ],
    profileSummary,
    learningPath: [
      `Start with the smallest useful version of "${labels.goal.label}" before trying advanced workflows.`,
      `Use ${labels.tool.label} for draft support, explanation, comparison, and practice - not as the final authority.`,
      reviewAction,
    ],
    toolStarterGuide: [
      `${labels.tool.label} fits this path because it can help turn unclear work into a structured first draft.`,
      "Begin with context, desired output, constraints, and what a good answer should include.",
      "Ask for a revision after you review the first output; the second pass is usually where the value appears.",
    ],
    practicePrompt,
    nextAction,
    planSummary,
  };
}

export function learnReportToText(report: LearnReport) {
  return [
    report.title,
    report.demoLabel,
    "",
    "Selected Path",
    ...report.path.map((item) => `- ${item}`),
    "",
    "AI Learning Profile",
    report.profileSummary,
    "",
    "Recommended Learning Path",
    ...report.learningPath.map((item) => `- ${item}`),
    "",
    "Tool Starter Guide",
    ...report.toolStarterGuide.map((item) => `- ${item}`),
    "",
    "Practice Prompt",
    report.practicePrompt,
    "",
    "Next Action",
    report.nextAction,
  ].join("\n");
}

export const workCategories: Record<WorkCategoryKey, { label: string; examples: string[] }> = {
  "customer-support": {
    label: "Customer Support",
    examples: ["triage requests", "draft replies", "summarize cases"],
  },
  "sales-marketing": {
    label: "Sales and Marketing",
    examples: ["qualify leads", "draft outreach", "prepare campaign briefs"],
  },
  "human-resources": {
    label: "Human Resources",
    examples: ["schedule interviews", "prepare onboarding", "summarize policy questions"],
  },
  "finance-admin": {
    label: "Finance and Administration",
    examples: ["organize invoices", "draft reports", "follow up on approvals"],
  },
  operations: {
    label: "Operations",
    examples: ["coordinate work orders", "summarize status", "standardize checklists"],
  },
  "training-education": {
    label: "Training and Education",
    examples: ["build lessons", "draft quizzes", "support learners"],
  },
  "it-data": {
    label: "IT and Data",
    examples: ["document tickets", "summarize logs", "draft data requests"],
  },
  "leadership-strategy": {
    label: "Leadership and Strategy",
    examples: ["summarize decisions", "prepare briefings", "track initiatives"],
  },
};

export const planCopy = {
  en: {
    headings: {
      opportunitySeed: "Opportunity Seed",
      learningPath: "Learning Path",
      opportunityDraft: "AI Opportunity Draft",
      completePlan: "Complete AI Upgrade Plan",
      pageEyebrow: "AI UPGRADE PLAN",
      pageTitle: "Your plan so far",
      pageIntro:
        "This local MVP plan is generated from the four UpSkill USA steps you have completed: Inspire, Learn, Adapt, and Implement.",
      nextThreeDays: "Next 3 Days",
      nextSevenDays: "Next 7 Days",
      afterSevenDays: "After 7 Days",
    },
    actions: {
      saveAndContinue: "Save and continue",
      viewPlanSoFar: "View plan so far",
      saveToLearn: "Save and continue to Learn",
      saveToAdapt: "Save and continue to Adapt",
      saveToImplement: "Save and continue to Implement",
      saveAndViewComplete: "Save and view complete plan",
      continueTo: "Continue to",
      reviewImplementation: "Review implementation",
      copyPlan: "Copy plan",
      downloadPlan: "Download plan",
      clearPlan: "Clear plan",
    },
    fields: {
      userType: "Who are you?",
      role: "Current role",
      organization: "Organization or context",
      desiredOutcome: "Desired outcome",
      motivation: "Why does this matter to you?",
      humanStrengths: "Human strengths to protect",
      track: "User track",
      aiComfort: "AI comfort level",
      timeAvailable: "Time available",
      learningPreference: "Learning preference",
      workArea: "Work area",
      workflowPain: "Workflow that takes too long",
      mainSteps: "Main workflow steps",
      delay: "Where do people wait?",
      repetitiveWork: "What is repetitive?",
      judgmentNeeds: "What requires human judgment?",
      own: "What will you own?",
      become: "What will you become?",
      pilotScope: "Pilot scope",
    },
    feedback: {
      addRole: "Add your role to create the first seed of your plan.",
      mapWorkflow: "Map a workflow pain to create your opportunity draft.",
      copyUnavailable: "Copy is not available in this browser.",
      copied: "Plan copied.",
      copyFailed: "Copy failed. You can select the plan text manually.",
      clearConfirm: "Clear your locally saved AI Upgrade Plan?",
      notAssessed: "not assessed",
    },
    safetyQuestions: {
      impactsPeople: "Could this affect jobs, pay, benefits, education, or access?",
      usesSensitiveData: "Does this use sensitive personal or company data?",
      harmIfWrong: "Could a wrong answer harm someone or the business?",
      needsExplanation: "Would someone need to explain how the decision was made?",
      hasAppealPath: "Can a person correct or appeal the result?",
    },
    tracks: {
      worker: "Worker or student",
      educator: "Educator",
      employer: "Employer or business leader",
      partner: "City, chamber, or community partner",
    },
    comfort: {
      beginner: "Beginner",
      some: "Some experience",
      advanced: "Advanced",
    },
    time: {
      "30-minutes": "30 minutes",
      "2-hours": "2 hours",
      saturday: "Saturday session",
    },
    preferences: {
      watch: "Watch short lessons",
      read: "Read guides",
      practice: "Practice with prompts",
      seminar: "Join a guided seminar",
    },
    workCategories: {
      "customer-support": "Customer Support",
      "sales-marketing": "Sales and Marketing",
      "human-resources": "Human Resources",
      "finance-admin": "Finance and Administration",
      operations: "Operations",
      "training-education": "Training and Education",
      "it-data": "IT and Data",
      "leadership-strategy": "Leadership and Strategy",
    },
    risk: {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
    },
    levels: {
      0: "Start your AI Upgrade Plan",
      1: "Level 1: Opportunity Seed",
      2: "Level 2: Learning Path",
      3: "Level 3: AI Opportunity Draft",
      4: "Level 4: Complete AI Upgrade Plan",
    },
    plan: {
      title: "UpSkill USA AI Upgrade Plan",
      opportunityTitle: "Your AI Opportunity",
      learningTitle: "Recommended Learning Path",
      adaptationTitle: "Workflow Adaptation Plan",
      pilotTitle: "First Workflow Pilot",
      startTitle: "Start With Inspire",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `As ${role}, your opportunity is to use AI to move toward ${outcome} while protecting the human strengths that matter most: ${strengths}.`,
      context: (value: string) => `Context: ${value}`,
      motivation: (value: string) => `Motivation: ${value}`,
      learningBody: "Use this path to build confidence before changing real workflows.",
      adaptation: (workflow: string, category: string) =>
        `Focus on ${workflow} in ${category}. AI should assist the repetitive and delayed parts first, while humans keep ownership of judgment-heavy work.`,
      currentSteps: (value: string) => `Current steps: ${value}`,
      delay: (value: string) => `Delay or friction: ${value}`,
      repetitive: (value: string) => `Repetitive work: ${value}`,
      judgment: (value: string) => `Human judgment: ${value}`,
      own: (value: string) => `Own: ${value}`,
      become: (value: string) => `Become: ${value}`,
      pilot: (workflow: string, scope: string) =>
        `Pilot ${workflow} with a narrow scope: ${scope}.`,
      humanGate: (value: string) => `Human review gate: ${value}`,
      riskLevel: (value: string) => `Risk level: ${value}`,
      companyUrl: (value: string) => `Company URL: ${value}`,
      startBody:
        "Complete the Inspire step first so the plan can connect AI adoption to a real role, motivation, and human strength.",
    },
    defaults: {
      learner: "a learner",
      clearOutcome: "a clearer work outcome",
      strengths: "judgment, care, creativity, and domain knowledge",
      notSpecified: "not specified",
      notSpecifiedYet: "not specified yet",
      painfulWorkflow: "one painful workflow",
      selectedWorkArea: "the selected work area",
      mapBeforePilot: "map these before the pilot",
      humanReview: "the human review and final decision",
      workflowDesigner: "an AI-assisted workflow designer",
      oneWorkflow: "one workflow",
      smallTest: "a small, reversible test",
      approver: "assign a human approver before launch",
      noCompanyUrl: "not required for MVP",
    },
    learning: {
      incomplete: "Complete the Learn step to receive a learning path matched to your readiness.",
      beginner: "Start with AI basics and prompt practice before changing live workflows.",
      some: "Practice role-specific AI prompts and learn how to review AI-generated work.",
      advanced: "Focus on workflow design, team enablement, and responsible AI review patterns.",
      format: (time: string, preference: string) =>
        `Use a ${time.toLowerCase()} learning block and a ${preference.toLowerCase()} format.`,
      track: (track: string) => `Recommended track: ${track}.`,
    },
    nextActions: {
      level4: [
        "Day 1: Map the current workflow and choose one low-risk sample.",
        "Day 2: Create one AI prompt or template for the repetitive part of the work.",
        "Day 3: Test the prompt on sample cases and record what works.",
        "Day 4: Add the human review gate and decide who approves output.",
        "Day 5: Run the pilot on a small real example.",
        "Day 6: Measure time saved, quality, and risks found.",
        "Day 7: Decide whether to expand, revise, or stop the pilot.",
      ],
      level3: [
        "Day 1: Write the workflow steps in order.",
        "Day 2: Mark which steps are repetitive, delayed, or judgment-heavy.",
        "Day 3: Choose one small pilot and continue to Implement.",
      ],
      level2: [
        "Day 1: Complete one short learning resource.",
        "Day 2: Practice three prompts related to your role.",
        "Day 3: Pick one workflow pain and continue to Adapt.",
      ],
      level1: [
        "Day 1: Write your role and three tasks you repeat weekly.",
        "Day 2: Choose one task that feels low-risk to improve.",
        "Day 3: Continue to Learn and pick your AI readiness path.",
      ],
    },
    afterSevenDays: {
      complete: [
        "Learn More: return to Learn if confidence or skills still feel thin.",
        "Run A Bigger Pilot: return to Adapt and map the full team workflow.",
        "Get Help Implementing: request a seminar, educator agent, or installer agent when the workflow affects a team or has higher risk.",
      ],
      partial: ["Return to the portal and complete the next framework step to keep building momentum."],
    },
  },
  es: {
    headings: {
      opportunitySeed: "Semilla de oportunidad",
      learningPath: "Ruta de aprendizaje",
      opportunityDraft: "Borrador de oportunidad con IA",
      completePlan: "Plan completo de actualización con IA",
      pageEyebrow: "PLAN DE ACTUALIZACIÓN CON IA",
      pageTitle: "Tu plan hasta ahora",
      pageIntro:
        "Este plan MVP local se genera con los pasos de UpSkill USA que completaste: Inspirar, Aprender, Adaptar e Implementar.",
      nextThreeDays: "Próximos 3 días",
      nextSevenDays: "Próximos 7 días",
      afterSevenDays: "Después de 7 días",
    },
    actions: {
      saveAndContinue: "Guardar y continuar",
      viewPlanSoFar: "Ver plan hasta ahora",
      saveToLearn: "Guardar y continuar a Aprender",
      saveToAdapt: "Guardar y continuar a Adaptar",
      saveToImplement: "Guardar y continuar a Implementar",
      saveAndViewComplete: "Guardar y ver plan completo",
      continueTo: "Continuar a",
      reviewImplementation: "Revisar implementación",
      copyPlan: "Copiar plan",
      downloadPlan: "Descargar plan",
      clearPlan: "Borrar plan",
    },
    fields: {
      userType: "¿Quién eres?",
      role: "Rol actual",
      organization: "Organización o contexto",
      desiredOutcome: "Resultado deseado",
      motivation: "¿Por qué importa esto?",
      humanStrengths: "Fortalezas humanas que proteger",
      track: "Ruta de usuario",
      aiComfort: "Nivel de comodidad con IA",
      timeAvailable: "Tiempo disponible",
      learningPreference: "Preferencia de aprendizaje",
      workArea: "Área de trabajo",
      workflowPain: "Flujo de trabajo que toma demasiado tiempo",
      mainSteps: "Pasos principales del flujo",
      delay: "¿Dónde espera la gente?",
      repetitiveWork: "¿Qué es repetitivo?",
      judgmentNeeds: "¿Qué requiere juicio humano?",
      own: "¿Qué vas a asumir como propio?",
      become: "¿En qué te vas a convertir?",
      pilotScope: "Alcance del piloto",
    },
    feedback: {
      addRole: "Agrega tu rol para crear la primera semilla de tu plan.",
      mapWorkflow: "Mapea un dolor de flujo de trabajo para crear tu borrador de oportunidad.",
      copyUnavailable: "Copiar no está disponible en este navegador.",
      copied: "Plan copiado.",
      copyFailed: "No se pudo copiar. Puedes seleccionar el texto del plan manualmente.",
      clearConfirm: "¿Borrar tu Plan de actualización con IA guardado localmente?",
      notAssessed: "sin evaluar",
    },
    safetyQuestions: {
      impactsPeople: "¿Esto podría afectar empleo, salario, beneficios, educación o acceso?",
      usesSensitiveData: "¿Usa datos personales o empresariales sensibles?",
      harmIfWrong: "¿Una respuesta incorrecta podría dañar a una persona o al negocio?",
      needsExplanation: "¿Alguien tendría que explicar cómo se tomó la decisión?",
      hasAppealPath: "¿Una persona puede corregir o apelar el resultado?",
    },
    tracks: {
      worker: "Trabajador o estudiante",
      educator: "Educador",
      employer: "Empleador o líder empresarial",
      partner: "Ciudad, cámara o socio comunitario",
    },
    comfort: {
      beginner: "Principiante",
      some: "Algo de experiencia",
      advanced: "Avanzado",
    },
    time: {
      "30-minutes": "30 minutos",
      "2-hours": "2 horas",
      saturday: "Sesión sabatina",
    },
    preferences: {
      watch: "Ver lecciones cortas",
      read: "Leer guías",
      practice: "Practicar con prompts",
      seminar: "Unirse a un seminario guiado",
    },
    workCategories: {
      "customer-support": "Atención al cliente",
      "sales-marketing": "Ventas y marketing",
      "human-resources": "Recursos humanos",
      "finance-admin": "Finanzas y administración",
      operations: "Operaciones",
      "training-education": "Capacitación y educación",
      "it-data": "TI y datos",
      "leadership-strategy": "Liderazgo y estrategia",
    },
    risk: {
      low: "BAJO",
      medium: "MEDIO",
      high: "ALTO",
    },
    levels: {
      0: "Comienza tu Plan de actualización con IA",
      1: "Nivel 1: Semilla de oportunidad",
      2: "Nivel 2: Ruta de aprendizaje",
      3: "Nivel 3: Borrador de oportunidad con IA",
      4: "Nivel 4: Plan completo de actualización con IA",
    },
    plan: {
      title: "Plan de actualización con IA de UpSkill USA",
      opportunityTitle: "Tu oportunidad con IA",
      learningTitle: "Ruta de aprendizaje recomendada",
      adaptationTitle: "Plan de adaptación del flujo de trabajo",
      pilotTitle: "Primer piloto de flujo de trabajo",
      startTitle: "Empieza con Inspirar",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `Como ${role}, tu oportunidad es usar IA para avanzar hacia ${outcome} mientras proteges las fortalezas humanas más importantes: ${strengths}.`,
      context: (value: string) => `Contexto: ${value}`,
      motivation: (value: string) => `Motivación: ${value}`,
      learningBody: "Usa esta ruta para ganar confianza antes de cambiar flujos reales.",
      adaptation: (workflow: string, category: string) =>
        `Enfócate en ${workflow} dentro de ${category}. La IA debe asistir primero las partes repetitivas y demoradas, mientras las personas mantienen la responsabilidad del trabajo que exige juicio.`,
      currentSteps: (value: string) => `Pasos actuales: ${value}`,
      delay: (value: string) => `Demora o fricción: ${value}`,
      repetitive: (value: string) => `Trabajo repetitivo: ${value}`,
      judgment: (value: string) => `Juicio humano: ${value}`,
      own: (value: string) => `Asumirás: ${value}`,
      become: (value: string) => `Te convertirás en: ${value}`,
      pilot: (workflow: string, scope: string) =>
        `Haz un piloto de ${workflow} con un alcance reducido: ${scope}.`,
      humanGate: (value: string) => `Revisión humana: ${value}`,
      riskLevel: (value: string) => `Nivel de riesgo: ${value}`,
      companyUrl: (value: string) => `URL de empresa: ${value}`,
      startBody:
        "Completa primero Inspirar para que el plan conecte la adopción de IA con un rol, una motivación y una fortaleza humana reales.",
    },
    defaults: {
      learner: "una persona que aprende",
      clearOutcome: "un resultado laboral más claro",
      strengths: "juicio, cuidado, creatividad y conocimiento del dominio",
      notSpecified: "sin especificar",
      notSpecifiedYet: "aún sin especificar",
      painfulWorkflow: "un flujo de trabajo doloroso",
      selectedWorkArea: "el área de trabajo seleccionada",
      mapBeforePilot: "mapea esto antes del piloto",
      humanReview: "la revisión humana y la decisión final",
      workflowDesigner: "diseñador de flujos de trabajo asistidos por IA",
      oneWorkflow: "un flujo de trabajo",
      smallTest: "una prueba pequeña y reversible",
      approver: "asigna una persona aprobadora antes del lanzamiento",
      noCompanyUrl: "no requerida para el MVP",
    },
    learning: {
      incomplete: "Completa Aprender para recibir una ruta ajustada a tu preparación.",
      beginner: "Comienza con conceptos básicos de IA y práctica de prompts antes de cambiar flujos reales.",
      some: "Practica prompts específicos para tu rol y aprende a revisar trabajo generado por IA.",
      advanced: "Enfócate en diseño de flujos, preparación del equipo y patrones de revisión responsable de IA.",
      format: (time: string, preference: string) =>
        `Usa un bloque de aprendizaje de ${time.toLowerCase()} y un formato de ${preference.toLowerCase()}.`,
      track: (track: string) => `Ruta recomendada: ${track}.`,
    },
    nextActions: {
      level4: [
        "Día 1: Mapea el flujo actual y elige una muestra de bajo riesgo.",
        "Día 2: Crea un prompt o plantilla de IA para la parte repetitiva del trabajo.",
        "Día 3: Prueba el prompt con casos de ejemplo y registra qué funciona.",
        "Día 4: Agrega la revisión humana y decide quién aprueba el resultado.",
        "Día 5: Ejecuta el piloto con un ejemplo real pequeño.",
        "Día 6: Mide tiempo ahorrado, calidad y riesgos encontrados.",
        "Día 7: Decide si expandir, ajustar o detener el piloto.",
      ],
      level3: [
        "Día 1: Escribe los pasos del flujo en orden.",
        "Día 2: Marca qué pasos son repetitivos, demorados o requieren juicio.",
        "Día 3: Elige un piloto pequeño y continúa a Implementar.",
      ],
      level2: [
        "Día 1: Completa un recurso corto de aprendizaje.",
        "Día 2: Practica tres prompts relacionados con tu rol.",
        "Día 3: Elige un dolor de flujo de trabajo y continúa a Adaptar.",
      ],
      level1: [
        "Día 1: Escribe tu rol y tres tareas que repites cada semana.",
        "Día 2: Elige una tarea de bajo riesgo para mejorar.",
        "Día 3: Continúa a Aprender y elige tu ruta de preparación en IA.",
      ],
    },
    afterSevenDays: {
      complete: [
        "Aprender más: vuelve a Aprender si la confianza o las habilidades aún se sienten débiles.",
        "Ejecutar un piloto más grande: vuelve a Adaptar y mapea el flujo completo del equipo.",
        "Pedir ayuda para implementar: solicita un seminario, agente educador o agente instalador cuando el flujo afecte a un equipo o tenga mayor riesgo.",
      ],
      partial: ["Vuelve al portal y completa el siguiente paso del marco para mantener el impulso."],
    },
  },
  pt: {
    headings: {
      opportunitySeed: "Semente de oportunidade",
      learningPath: "Trilha de aprendizagem",
      opportunityDraft: "Rascunho de oportunidade com IA",
      completePlan: "Plano completo de atualização com IA",
      pageEyebrow: "PLANO DE ATUALIZAÇÃO COM IA",
      pageTitle: "Seu plano até agora",
      pageIntro:
        "Este plano MVP local é gerado a partir dos passos da UpSkill USA que você completou: Inspirar, Aprender, Adaptar e Implementar.",
      nextThreeDays: "Próximos 3 dias",
      nextSevenDays: "Próximos 7 dias",
      afterSevenDays: "Depois de 7 dias",
    },
    actions: {
      saveAndContinue: "Salvar e continuar",
      viewPlanSoFar: "Ver plano até agora",
      saveToLearn: "Salvar e continuar para Aprender",
      saveToAdapt: "Salvar e continuar para Adaptar",
      saveToImplement: "Salvar e continuar para Implementar",
      saveAndViewComplete: "Salvar e ver plano completo",
      continueTo: "Continuar para",
      reviewImplementation: "Revisar implementação",
      copyPlan: "Copiar plano",
      downloadPlan: "Baixar plano",
      clearPlan: "Limpar plano",
    },
    fields: {
      userType: "Quem é você?",
      role: "Função atual",
      organization: "Organização ou contexto",
      desiredOutcome: "Resultado desejado",
      motivation: "Por que isso importa?",
      humanStrengths: "Forças humanas a proteger",
      track: "Trilha do usuário",
      aiComfort: "Nível de conforto com IA",
      timeAvailable: "Tempo disponível",
      learningPreference: "Preferência de aprendizagem",
      workArea: "Área de trabalho",
      workflowPain: "Fluxo de trabalho que demora demais",
      mainSteps: "Principais passos do fluxo",
      delay: "Onde as pessoas esperam?",
      repetitiveWork: "O que é repetitivo?",
      judgmentNeeds: "O que exige julgamento humano?",
      own: "O que você vai assumir?",
      become: "No que você vai se tornar?",
      pilotScope: "Escopo do piloto",
    },
    feedback: {
      addRole: "Adicione sua função para criar a primeira semente do seu plano.",
      mapWorkflow: "Mapeie uma dor de fluxo de trabalho para criar seu rascunho de oportunidade.",
      copyUnavailable: "Copiar não está disponível neste navegador.",
      copied: "Plano copiado.",
      copyFailed: "Não foi possível copiar. Você pode selecionar o texto do plano manualmente.",
      clearConfirm: "Limpar seu Plano de atualização com IA salvo localmente?",
      notAssessed: "não avaliado",
    },
    safetyQuestions: {
      impactsPeople: "Isso pode afetar emprego, salário, benefícios, educação ou acesso?",
      usesSensitiveData: "Isso usa dados pessoais ou empresariais sensíveis?",
      harmIfWrong: "Uma resposta errada pode prejudicar alguém ou o negócio?",
      needsExplanation: "Alguém precisaria explicar como a decisão foi tomada?",
      hasAppealPath: "Uma pessoa pode corrigir ou contestar o resultado?",
    },
    tracks: {
      worker: "Trabalhador ou estudante",
      educator: "Educador",
      employer: "Empregador ou líder empresarial",
      partner: "Cidade, câmara ou parceiro comunitário",
    },
    comfort: {
      beginner: "Iniciante",
      some: "Alguma experiência",
      advanced: "Avançado",
    },
    time: {
      "30-minutes": "30 minutos",
      "2-hours": "2 horas",
      saturday: "Sessão de sábado",
    },
    preferences: {
      watch: "Assistir aulas curtas",
      read: "Ler guias",
      practice: "Praticar com prompts",
      seminar: "Participar de um seminário guiado",
    },
    workCategories: {
      "customer-support": "Atendimento ao cliente",
      "sales-marketing": "Vendas e marketing",
      "human-resources": "Recursos humanos",
      "finance-admin": "Finanças e administração",
      operations: "Operações",
      "training-education": "Treinamento e educação",
      "it-data": "TI e dados",
      "leadership-strategy": "Liderança e estratégia",
    },
    risk: {
      low: "BAIXO",
      medium: "MÉDIO",
      high: "ALTO",
    },
    levels: {
      0: "Comece seu Plano de atualização com IA",
      1: "Nível 1: Semente de oportunidade",
      2: "Nível 2: Trilha de aprendizagem",
      3: "Nível 3: Rascunho de oportunidade com IA",
      4: "Nível 4: Plano completo de atualização com IA",
    },
    plan: {
      title: "Plano de atualização com IA da UpSkill USA",
      opportunityTitle: "Sua oportunidade com IA",
      learningTitle: "Trilha de aprendizagem recomendada",
      adaptationTitle: "Plano de adaptação do fluxo de trabalho",
      pilotTitle: "Primeiro piloto de fluxo de trabalho",
      startTitle: "Comece por Inspirar",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `Como ${role}, sua oportunidade é usar IA para avançar em direção a ${outcome}, protegendo as forças humanas mais importantes: ${strengths}.`,
      context: (value: string) => `Contexto: ${value}`,
      motivation: (value: string) => `Motivação: ${value}`,
      learningBody: "Use esta trilha para ganhar confiança antes de mudar fluxos reais.",
      adaptation: (workflow: string, category: string) =>
        `Concentre-se em ${workflow} em ${category}. A IA deve ajudar primeiro nas partes repetitivas e demoradas, enquanto humanos mantêm a responsabilidade pelo trabalho que exige julgamento.`,
      currentSteps: (value: string) => `Passos atuais: ${value}`,
      delay: (value: string) => `Demora ou fricção: ${value}`,
      repetitive: (value: string) => `Trabalho repetitivo: ${value}`,
      judgment: (value: string) => `Julgamento humano: ${value}`,
      own: (value: string) => `Você vai assumir: ${value}`,
      become: (value: string) => `Você vai se tornar: ${value}`,
      pilot: (workflow: string, scope: string) =>
        `Faça um piloto de ${workflow} com um escopo reduzido: ${scope}.`,
      humanGate: (value: string) => `Revisão humana: ${value}`,
      riskLevel: (value: string) => `Nível de risco: ${value}`,
      companyUrl: (value: string) => `URL da empresa: ${value}`,
      startBody:
        "Complete Inspirar primeiro para que o plano conecte a adoção de IA a uma função, motivação e força humana reais.",
    },
    defaults: {
      learner: "uma pessoa em aprendizagem",
      clearOutcome: "um resultado de trabalho mais claro",
      strengths: "julgamento, cuidado, criatividade e conhecimento do domínio",
      notSpecified: "não especificado",
      notSpecifiedYet: "ainda não especificado",
      painfulWorkflow: "um fluxo de trabalho doloroso",
      selectedWorkArea: "a área de trabalho selecionada",
      mapBeforePilot: "mapeie isso antes do piloto",
      humanReview: "a revisão humana e a decisão final",
      workflowDesigner: "designer de fluxos de trabalho assistidos por IA",
      oneWorkflow: "um fluxo de trabalho",
      smallTest: "um teste pequeno e reversível",
      approver: "atribua uma pessoa aprovadora antes do lançamento",
      noCompanyUrl: "não obrigatória para o MVP",
    },
    learning: {
      incomplete: "Complete Aprender para receber uma trilha ajustada à sua prontidão.",
      beginner: "Comece com conceitos básicos de IA e prática de prompts antes de mudar fluxos reais.",
      some: "Pratique prompts específicos para sua função e aprenda a revisar trabalho gerado por IA.",
      advanced: "Concentre-se em desenho de fluxos, preparação de equipe e padrões de revisão responsável de IA.",
      format: (time: string, preference: string) =>
        `Use um bloco de aprendizagem de ${time.toLowerCase()} e um formato de ${preference.toLowerCase()}.`,
      track: (track: string) => `Trilha recomendada: ${track}.`,
    },
    nextActions: {
      level4: [
        "Dia 1: Mapeie o fluxo atual e escolha uma amostra de baixo risco.",
        "Dia 2: Crie um prompt ou modelo de IA para a parte repetitiva do trabalho.",
        "Dia 3: Teste o prompt em casos de exemplo e registre o que funciona.",
        "Dia 4: Adicione a revisão humana e decida quem aprova a saída.",
        "Dia 5: Rode o piloto em um exemplo real pequeno.",
        "Dia 6: Meça tempo economizado, qualidade e riscos encontrados.",
        "Dia 7: Decida se vai expandir, ajustar ou parar o piloto.",
      ],
      level3: [
        "Dia 1: Escreva os passos do fluxo em ordem.",
        "Dia 2: Marque quais passos são repetitivos, demorados ou exigem julgamento.",
        "Dia 3: Escolha um piloto pequeno e continue para Implementar.",
      ],
      level2: [
        "Dia 1: Complete um recurso curto de aprendizagem.",
        "Dia 2: Pratique três prompts relacionados à sua função.",
        "Dia 3: Escolha uma dor de fluxo de trabalho e continue para Adaptar.",
      ],
      level1: [
        "Dia 1: Escreva sua função e três tarefas que você repete semanalmente.",
        "Dia 2: Escolha uma tarefa de baixo risco para melhorar.",
        "Dia 3: Continue para Aprender e escolha sua trilha de prontidão em IA.",
      ],
    },
    afterSevenDays: {
      complete: [
        "Aprender mais: volte para Aprender se a confiança ou as habilidades ainda parecerem frágeis.",
        "Rodar um piloto maior: volte para Adaptar e mapeie o fluxo completo da equipe.",
        "Obter ajuda para implementar: solicite um seminário, agente educador ou agente instalador quando o fluxo afetar uma equipe ou tiver maior risco.",
      ],
      partial: ["Volte ao portal e complete o próximo passo do framework para manter o impulso."],
    },
  },
} as const;

export const defaultDraft: Required<PlanDraft> = {
  inspire: {
    userType: "worker",
    role: "",
    organization: "",
    motivation: "",
    desiredOutcome: "",
    humanStrengths: "",
    assessment: defaultAssessmentResult,
  },
  learn: {
    group: "worker",
    startingPoint: "new-to-ai",
    goal: "communicate-better",
    tool: "chatgpt",
    format: "practice",
    time: "30-minutes",
    reportSummary: "",
    nextAction: "",
  },
  adapt: {
    workCategory: "operations",
    workflowPain: "",
    mainSteps: "",
    delay: "",
    repetitiveWork: "",
    judgmentNeeds: "",
    desiredOutcome: "",
    own: "",
    become: "",
  },
  implement: {
    companyUrl: "",
    workflowName: "",
    pilotScope: "",
    humanGate: "",
    impactsPeople: false,
    usesSensitiveData: false,
    harmIfWrong: false,
    needsExplanation: false,
    hasAppealPath: true,
  },
};

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function hasAssessmentResult(input: InspirePlanInput | undefined) {
  return Boolean(input?.assessment?.pathwayId && input.assessment.matches.length > 0);
}

export function getPlanLevel(draft: PlanDraft): PlanLevel {
  if (draft.implement && hasText(draft.implement.workflowName) && hasText(draft.implement.humanGate)) {
    return 4;
  }
  if (draft.adapt && hasText(draft.adapt.workflowPain)) {
    return 3;
  }
  if (draft.learn) {
    return 2;
  }
  if (draft.inspire && (hasText(draft.inspire.role) || hasAssessmentResult(draft.inspire))) {
    return 1;
  }
  return 0;
}

export function getNextPlanStep(level: PlanLevel): FrameworkKey | undefined {
  if (level === 0) return "inspire";
  if (level === 1) return "learn";
  if (level === 2) return "adapt";
  if (level === 3) return "implement";
  return undefined;
}

function getRiskLevel(input?: ImplementPlanInput): RiskLevel | undefined {
  if (!input) return undefined;
  if (input.impactsPeople || input.harmIfWrong) return "high";
  if (input.usesSensitiveData || input.needsExplanation || !input.hasAppealPath) return "medium";
  return "low";
}

export function getPlanCopy(language: Language) {
  return planCopy[language] ?? planCopy.en;
}

function getLevelLabel(level: PlanLevel, language: Language) {
  return getPlanCopy(language).levels[level];
}

function getCompletedSteps(level: PlanLevel): FrameworkKey[] {
  return ["inspire", "learn", "adapt", "implement"].slice(0, level) as FrameworkKey[];
}

function getLearningPath(input: LearnPlanInput | undefined, language: Language) {
  const copy = getPlanCopy(language);

  if (!input) {
    return [copy.learning.incomplete];
  }

  const report = generateLearnReport({
    ...defaultDraft.learn,
    ...input,
  });

  return [
    ...report.path,
    `Recommended next action: ${input.nextAction || report.nextAction}`,
  ];
}

function getNextActions(level: PlanLevel, language: Language): string[] {
  const copy = getPlanCopy(language);

  if (level === 4) {
    return [...copy.nextActions.level4];
  }

  if (level === 3) {
    return [...copy.nextActions.level3];
  }

  if (level === 2) {
    return [...copy.nextActions.level2];
  }

  return [...copy.nextActions.level1];
}

function getAssessmentPlanSection(input: InspirePlanInput): GeneratedPlanSection | undefined {
  const assessment = input.assessment;
  const pathway = getPathway(assessment.pathwayId);

  if (!pathway || assessment.matches.length === 0) {
    return undefined;
  }

  const rankedMatches = getMatchOccupations(assessment.matches, occupations);
  const compared = getComparedOccupations(assessment.compareSlugs, occupations);
  const best = getBestActionOccupation(assessment.compareSlugs, assessment.matches, occupations);
  const recommendations =
    getRecommendations(best, assessment.pathwayId).length > 0
      ? getRecommendations(best, assessment.pathwayId)
      : assessment.recommendations;
  const topMatchItems = rankedMatches.map(({ occupation, score }, index) => {
    const pay = formatCurrency(occupation.pay);
    const jobs = formatNumber(occupation.jobs);
    const outlook = formatOutlook(occupation.outlook);
    return `#${index + 1}: ${occupation.title} (${getCategoryLabel(
      occupation.category,
    )}) - score ${score}, vulnerability ${occupation.vulnerability}/10, ${pay}, ${outlook} growth, ${jobs} jobs`;
  });
  const comparisonItems = compared.map(
    (occupation) =>
      `Compare: ${occupation.title} - exposure ${occupation.exposure}/10, education: ${occupation.education}`,
  );
  const recommendationItems = recommendations.map(
    (recommendation) => `${recommendation.title}: ${recommendation.body}`,
  );

  return {
    title: "Conversational IKIGAI Assessment",
    body: `${
      assessment.name ? `${assessment.name}, your` : "Your"
    } pathway is ${pathway.name}. ${
      best
        ? `The action plan is anchored on ${best.title}, selected from your ranked local assessment matches.`
        : "The action plan is based on your ranked local assessment matches."
    } ${assessmentCopy.sourceNote}`,
    items: [
      `Pathway: ${pathway.name} (${pathway.audience})`,
      `Current situation: ${assessment.currentSituation || "not specified"}`,
      `Feelings: ${assessment.feelings.join(", ") || "not specified"}`,
      `Human skills: ${assessment.humanSkills.join(", ") || "not specified"}`,
      `Interests: ${assessment.interests.join(", ") || "not specified"}`,
      `Work style: ${assessment.workStyle.join(", ") || "not specified"}`,
      ...topMatchItems,
      ...comparisonItems,
      ...recommendationItems,
    ],
  };
}

export function generateUpgradePlan(draft: PlanDraft, language: Language = "en"): GeneratedPlan {
  const level = getPlanLevel(draft);
  const riskLevel = getRiskLevel(draft.implement);
  const copy = getPlanCopy(language);
  const category = draft.adapt ? copy.workCategories[draft.adapt.workCategory] : undefined;
  const nextStep = getNextPlanStep(level);
  const sections: GeneratedPlanSection[] = [];

  if (draft.inspire) {
    const assessmentSection = getAssessmentPlanSection(draft.inspire);

    if (assessmentSection) {
      sections.push(assessmentSection);
    } else {
      sections.push({
        title: copy.plan.opportunityTitle,
        body: copy.plan.opportunity(
          draft.inspire.role || copy.defaults.learner,
          draft.inspire.desiredOutcome || copy.defaults.clearOutcome,
          draft.inspire.humanStrengths || copy.defaults.strengths,
        ),
        items: [
          copy.plan.context(draft.inspire.organization || copy.defaults.notSpecified),
          copy.plan.motivation(draft.inspire.motivation || copy.defaults.notSpecifiedYet),
          assessmentCopy.incompleteState,
        ],
      });
    }
  }

  if (level >= 2) {
    const learnReport = draft.learn ? generateLearnReport({ ...defaultDraft.learn, ...draft.learn }) : undefined;

    sections.push({
      title: copy.plan.learningTitle,
      body: draft.learn?.reportSummary || learnReport?.planSummary || copy.plan.learningBody,
      items: getLearningPath(draft.learn, language),
    });
  }

  if (draft.adapt) {
    sections.push({
      title: copy.plan.adaptationTitle,
      body: copy.plan.adaptation(
        draft.adapt.workflowPain || copy.defaults.painfulWorkflow,
        category || copy.defaults.selectedWorkArea,
      ),
      items: [
        copy.plan.currentSteps(draft.adapt.mainSteps || copy.defaults.mapBeforePilot),
        copy.plan.delay(draft.adapt.delay || copy.defaults.notSpecified),
        copy.plan.repetitive(draft.adapt.repetitiveWork || copy.defaults.notSpecified),
        copy.plan.judgment(draft.adapt.judgmentNeeds || copy.defaults.notSpecified),
        copy.plan.own(draft.adapt.own || copy.defaults.humanReview),
        copy.plan.become(draft.adapt.become || copy.defaults.workflowDesigner),
      ],
    });
  }

  if (draft.implement) {
    sections.push({
      title: copy.plan.pilotTitle,
      body: copy.plan.pilot(
        draft.implement.workflowName || copy.defaults.oneWorkflow,
        draft.implement.pilotScope || copy.defaults.smallTest,
      ),
      items: [
        copy.plan.humanGate(draft.implement.humanGate || copy.defaults.approver),
        copy.plan.riskLevel(riskLevel ? copy.risk[riskLevel] : copy.feedback.notAssessed),
        copy.plan.companyUrl(draft.implement.companyUrl || copy.defaults.noCompanyUrl),
      ],
    });
  }

  if (level === 0) {
    sections.push({
      title: copy.plan.startTitle,
      body: copy.plan.startBody,
    });
  }

  return {
    level,
    levelLabel: getLevelLabel(level, language),
    completedSteps: getCompletedSteps(level),
    nextStep,
    riskLevel,
    sections,
    nextActions: getNextActions(level, language),
    afterSevenDays:
      level === 4
        ? [...copy.afterSevenDays.complete]
        : [...copy.afterSevenDays.partial],
  };
}

export function planToText(plan: GeneratedPlan, language: Language = "en") {
  const copy = getPlanCopy(language);
  const sections = plan.sections
    .map((section) => {
      const items = section.items?.map((item) => `- ${item}`).join("\n");
      return `${section.title}\n${section.body}${items ? `\n${items}` : ""}`;
    })
    .join("\n\n");

  return [
    copy.plan.title,
    plan.levelLabel,
    "",
    sections,
    "",
    plan.level === 4 ? copy.headings.nextSevenDays : copy.headings.nextThreeDays,
    plan.nextActions.map((item) => `- ${item}`).join("\n"),
    "",
    copy.headings.afterSevenDays,
    plan.afterSevenDays.map((item) => `- ${item}`).join("\n"),
  ].join("\n");
}
