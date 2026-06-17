import type { FrameworkKey, Language } from "@/lib/content";
import {
  formatLabNumber,
  formatShortUsd,
  type BusinessOpportunityReport,
  ImplementAudience,
  ImplementPilot,
  ImplementReport,
  ImplementWorkAreaKey,
} from "@/lib/implementation-lab";
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
export type SeminarTrack = "worker" | "business";
export type SeminarReadinessKey =
  | "bringWorkflow"
  | "knowTimeSpent"
  | "haveSample"
  | "canExplainReview";

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

export type SeminarReadinessState = Record<SeminarReadinessKey, boolean>;

export type WorkerSeminarPrep = {
  weeklyHoursSaved: number;
  hourlyValue: number;
  proofPoint: string;
};

export type BusinessSeminarPrep = {
  workersAffected: number;
  weeklyHoursSavedPerWorker: number;
  blendedHourlyValue: number;
};

export type SeminarResult = {
  track: SeminarTrack;
  title: string;
  summary: string;
  annualValue: number;
  annualValueLabel: string;
  weeklyHoursSaved: number;
  multiplier: number;
  items: string[];
  text: string;
  filename: string;
};

export type LegacyAdaptPlanFields = {
  workflowPain?: string;
  mainSteps?: string;
  delay?: string;
  repetitiveWork?: string;
  judgmentNeeds?: string;
  desiredOutcome?: string;
  own?: string;
  become?: string;
};

export type AdaptPlanInput = LegacyAdaptPlanFields & {
  track: SeminarTrack;
  readiness: SeminarReadinessState;
  workCategory: WorkCategoryKey;
  workflow: string;
  multiplier: number;
  worker: WorkerSeminarPrep;
  business: BusinessSeminarPrep;
  resultText?: string;
  savedAt?: string;
};

export type ImplementPlanInput = {
  companyUrl: string;
  email: string;
  workflowName: string;
  pilotScope: string;
  humanGate: string;
  audience?: ImplementAudience;
  workArea?: ImplementWorkAreaKey;
  selectedTasks: string[];
  customTasks: string[];
  report?: ImplementReport;
  selectedPilot?: ImplementPilot;
  savedAt?: string;
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

const learnLocalization: Record<
  Language,
  {
    groups: Record<LearnGroup, Omit<LearnOption<LearnGroup>, "id">>;
    goals: Record<LearnGoal, Omit<LearnOption<LearnGoal>, "id">>;
    formats: Record<LearnFormat, Omit<LearnOption<LearnFormat>, "id">>;
    tools: Record<LearnTool, Omit<LearnOption<LearnTool>, "id">>;
    report: {
      title: string;
      demoLabel: string;
      selectedPath: string;
      profile: string;
      recommendedPath: string;
      starterGuide: string;
      practicePrompt: string;
      nextAction: string;
      group: string;
      goal: string;
      tool: string;
      format: string;
      learningVerb: Record<LearnFormat, string>;
      timeAction: Record<LearnTime, string>;
      reviewAction: Record<AiStartingPoint, string>;
      profileSummary: (group: string, goal: string, tool: string) => string;
      prompt: (group: string, goal: string, tool: string) => string;
      planSummary: (group: string, goal: string, tool: string, format: string) => string;
      learningPath: (goal: string, tool: string, reviewAction: string) => string[];
      starterGuideItems: (tool: string) => string[];
    };
  }
> = {
  en: {
    groups: {
      student: learnGroupOptions[0],
      educator: learnGroupOptions[1],
      worker: learnGroupOptions[2],
      entrepreneur: learnGroupOptions[3],
    },
    goals: Object.fromEntries(
      Object.values(learnGoalsByGroup).flat().map((option) => [option.id, option]),
    ) as unknown as Record<LearnGoal, Omit<LearnOption<LearnGoal>, "id">>,
    formats: {
      watch: learnFormatOptions[0],
      read: learnFormatOptions[1],
      practice: learnFormatOptions[2],
    },
    tools: learnToolOptions,
    report: {
      title: "Your LEARN Report",
      demoLabel: "Demo content - generated locally",
      selectedPath: "Selected Path",
      profile: "AI Learning Profile",
      recommendedPath: "Recommended Learning Path",
      starterGuide: "Tool Starter Guide",
      practicePrompt: "Practice Prompt",
      nextAction: "Next Action",
      group: "Group",
      goal: "Goal",
      tool: "Tool",
      format: "Format",
      learningVerb: {
        watch: "Watch one short demo",
        read: "Read one quick guide",
        practice: "Practice with one real prompt",
      },
      timeAction: {
        "10-minutes": "Use one low-risk task today and stop after the first useful result.",
        "30-minutes": "Complete the starter practice, revise once, and save the best prompt.",
        "1-hour": "Run the practice on a real example, review the output, and write your repeatable next step.",
      },
      reviewAction: {
        "new-to-ai": "Review the output like a draft, not a final answer.",
        "tried-ai": "Review the output like a draft, not a final answer.",
        "ready-for-work":
          "Add a human review gate before the output affects a real person, customer, grade, or business decision.",
      },
      profileSummary: (group, goal, tool) => `You are a ${group.toLowerCase()} who wants to ${goal.toLowerCase()} with ${tool}.`,
      prompt: (group, goal, tool) =>
        `Act as a practical AI learning coach for a ${group.toLowerCase()}. Help me ${goal.toLowerCase()} using ${tool}. Give me a simple first draft, explain what I should check, and end with three ways I can improve the result.`,
      planSummary: (group, goal, tool, format) =>
        `${group}: Focus on "${goal}" with ${tool} using a ${format.toLowerCase()} path.`,
      learningPath: (goal, tool, reviewAction) => [
        `Start with the smallest useful version of "${goal}" before trying advanced workflows.`,
        `Use ${tool} for draft support, explanation, comparison, and practice - not as the final authority.`,
        reviewAction,
      ],
      starterGuideItems: (tool) => [
        `${tool} fits this path because it can help turn unclear work into a structured first draft.`,
        "Begin with context, desired output, constraints, and what a good answer should include.",
        "Ask for a revision after you review the first output; the second pass is usually where the value appears.",
      ],
    },
  },
  es: {
    groups: {
      student: { label: "Estudiante", description: "Quiero usar IA para estudiar, investigar y prepararme para trabajar." },
      educator: { label: "Educador", description: "Quiero usar IA para enseñar, guiar estudiantes y ahorrar tiempo." },
      worker: { label: "Trabajador", description: "Quiero usar IA para mejorar tareas diarias y seguir siendo valioso en el trabajo." },
      entrepreneur: { label: "Emprendedor", description: "Quiero usar IA para planear, vender, promocionar y operar mejor." },
    },
    goals: {
      "study-faster": { label: "Estudiar y entender más rápido", description: "Convierte material confuso en explicaciones y pasos de estudio más claros." },
      "research-sources": { label: "Investigar y resumir fuentes", description: "Trabaja mejor con lecturas, notas y material fuente." },
      "prepare-projects": { label: "Preparar currículos, proyectos o presentaciones", description: "Redacta mejores materiales escolares y laborales con revisión humana." },
      "create-materials": { label: "Crear materiales de enseñanza", description: "Redacta clases, ejemplos, cuestionarios y actividades más rápido." },
      "responsible-use": { label: "Guiar el uso responsable de IA", description: "Define límites claros y modela un uso ético." },
      "planning-feedback": { label: "Ahorrar tiempo en planeación y retroalimentación", description: "Usa IA para borradores manteniendo el juicio del educador." },
      "communicate-better": { label: "Escribir y comunicar mejor", description: "Redacta, revisa y aclara comunicación diaria de trabajo." },
      "summarize-docs": { label: "Resumir documentos o reuniones", description: "Convierte notas y documentos largos en acciones claras." },
      "routine-tasks": { label: "Ahorrar tiempo en tareas rutinarias", description: "Crea prompts repetibles para trabajo frecuente." },
      "plan-offer": { label: "Planear mi negocio u oferta", description: "Aclara el cliente, la promesa, la oferta y los primeros pasos." },
      "marketing-sales": { label: "Crear contenido de marketing y ventas", description: "Redacta mensajes, publicaciones, páginas y seguimientos." },
      "operations-follow-up": { label: "Organizar operaciones y seguimiento", description: "Crea sistemas simples para tareas, clientes y próximas acciones." },
    },
    formats: {
      watch: { label: "Ver", description: "Lecciones cortas y ejemplos." },
      read: { label: "Leer", description: "Guías rápidas y listas de verificación." },
      practice: { label: "Practicar", description: "Prompts, ejercicios y plantillas." },
    },
    tools: {
      chatgpt: { label: "ChatGPT", description: "Un asistente flexible para escritura, planeación y práctica." },
      claude: { label: "Claude", description: "Un asistente fuerte para escritura, razonamiento y documentos largos." },
      gemini: { label: "Gemini", description: "El asistente de Google para ayuda general y trabajo conectado a Google." },
      copilot: { label: "Microsoft Copilot", description: "Apoyo de IA para documentos, reuniones, email y tareas de Microsoft." },
      notebooklm: { label: "NotebookLM", description: "Una herramienta basada en fuentes para notas, documentos y lecturas." },
    },
    report: {
      title: "Tu reporte LEARN",
      demoLabel: "Contenido demo - generado localmente",
      selectedPath: "Ruta seleccionada",
      profile: "Perfil de aprendizaje con IA",
      recommendedPath: "Ruta de aprendizaje recomendada",
      starterGuide: "Guía inicial de la herramienta",
      practicePrompt: "Prompt de práctica",
      nextAction: "Próxima acción",
      group: "Grupo",
      goal: "Meta",
      tool: "Herramienta",
      format: "Formato",
      learningVerb: {
        watch: "Mira una demostración corta",
        read: "Lee una guía rápida",
        practice: "Practica con un prompt real",
      },
      timeAction: {
        "10-minutes": "Usa hoy una tarea de bajo riesgo y detente después del primer resultado útil.",
        "30-minutes": "Completa la práctica inicial, revisa una vez y guarda el mejor prompt.",
        "1-hour": "Prueba con un ejemplo real, revisa el resultado y escribe tu próximo paso repetible.",
      },
      reviewAction: {
        "new-to-ai": "Revisa el resultado como borrador, no como respuesta final.",
        "tried-ai": "Revisa el resultado como borrador, no como respuesta final.",
        "ready-for-work": "Agrega una revisión humana antes de que el resultado afecte a una persona, cliente, calificación o decisión empresarial.",
      },
      profileSummary: (group, goal, tool) => `Eres ${group.toLowerCase()} y quieres ${goal.toLowerCase()} con ${tool}.`,
      prompt: (group, goal, tool) =>
        `Actúa como un coach práctico de aprendizaje con IA para ${group.toLowerCase()}. Ayúdame a ${goal.toLowerCase()} usando ${tool}. Dame un primer borrador simple, explica qué debo revisar y termina con tres formas de mejorar el resultado.`,
      planSummary: (group, goal, tool, format) =>
        `${group}: Enfócate en "${goal}" con ${tool} usando una ruta de ${format.toLowerCase()}.`,
      learningPath: (goal, tool, reviewAction) => [
        `Empieza con la versión útil más pequeña de "${goal}" antes de probar flujos avanzados.`,
        `Usa ${tool} para apoyo de borradores, explicación, comparación y práctica; no como autoridad final.`,
        reviewAction,
      ],
      starterGuideItems: (tool) => [
        `${tool} encaja con esta ruta porque ayuda a convertir trabajo poco claro en un primer borrador estructurado.`,
        "Comienza con contexto, resultado deseado, límites y lo que debe incluir una buena respuesta.",
        "Pide una revisión después de evaluar el primer resultado; normalmente el valor aparece en la segunda pasada.",
      ],
    },
  },
  pt: {
    groups: {
      student: { label: "Estudante", description: "Quero usar IA para estudar, pesquisar e me preparar para o trabalho." },
      educator: { label: "Educador", description: "Quero usar IA para ensinar, orientar estudantes e economizar tempo." },
      worker: { label: "Trabalhador", description: "Quero usar IA para melhorar tarefas diárias e seguir valioso no trabalho." },
      entrepreneur: { label: "Empreendedor", description: "Quero usar IA para planejar, vender, divulgar e operar melhor." },
    },
    goals: {
      "study-faster": { label: "Estudar e entender mais rápido", description: "Transforme material confuso em explicações e passos de estudo mais claros." },
      "research-sources": { label: "Pesquisar e resumir fontes", description: "Trabalhe melhor com leituras, notas e materiais de referência." },
      "prepare-projects": { label: "Preparar currículos, projetos ou apresentações", description: "Crie materiais escolares e profissionais melhores com revisão humana." },
      "create-materials": { label: "Criar materiais de ensino", description: "Rascunhe aulas, exemplos, questionários e atividades mais rápido." },
      "responsible-use": { label: "Orientar o uso responsável de IA", description: "Defina limites claros e modele uso ético." },
      "planning-feedback": { label: "Economizar tempo em planejamento e feedback", description: "Use IA para rascunhos mantendo o julgamento do educador." },
      "communicate-better": { label: "Escrever e comunicar melhor", description: "Rascunhe, revise e esclareça a comunicação diária de trabalho." },
      "summarize-docs": { label: "Resumir documentos ou reuniões", description: "Transforme notas e documentos longos em ações claras." },
      "routine-tasks": { label: "Economizar tempo em tarefas rotineiras", description: "Crie prompts repetíveis para trabalho frequente." },
      "plan-offer": { label: "Planejar meu negócio ou oferta", description: "Esclareça o cliente, a promessa, a oferta e os primeiros passos." },
      "marketing-sales": { label: "Criar conteúdo de marketing e vendas", description: "Rascunhe mensagens, posts, páginas e sequências de acompanhamento." },
      "operations-follow-up": { label: "Organizar operações e acompanhamento", description: "Crie sistemas simples para tarefas, clientes e próximas ações." },
    },
    formats: {
      watch: { label: "Assistir", description: "Aulas curtas e exemplos." },
      read: { label: "Ler", description: "Guias rápidos e listas de verificação." },
      practice: { label: "Praticar", description: "Prompts, exercícios e modelos." },
    },
    tools: {
      chatgpt: { label: "ChatGPT", description: "Um assistente flexível para escrita, planejamento e prática." },
      claude: { label: "Claude", description: "Um assistente forte para escrita, raciocínio e documentos longos." },
      gemini: { label: "Gemini", description: "O assistente do Google para ajuda geral e trabalho conectado ao Google." },
      copilot: { label: "Microsoft Copilot", description: "Apoio de IA para documentos, reuniões, email e tarefas da Microsoft." },
      notebooklm: { label: "NotebookLM", description: "Uma ferramenta baseada em fontes para notas, documentos e leituras." },
    },
    report: {
      title: "Seu relatório LEARN",
      demoLabel: "Conteúdo demo - gerado localmente",
      selectedPath: "Trilha selecionada",
      profile: "Perfil de aprendizagem com IA",
      recommendedPath: "Trilha de aprendizagem recomendada",
      starterGuide: "Guia inicial da ferramenta",
      practicePrompt: "Prompt de prática",
      nextAction: "Próxima ação",
      group: "Grupo",
      goal: "Meta",
      tool: "Ferramenta",
      format: "Formato",
      learningVerb: {
        watch: "Assista a uma demonstração curta",
        read: "Leia um guia rápido",
        practice: "Pratique com um prompt real",
      },
      timeAction: {
        "10-minutes": "Use hoje uma tarefa de baixo risco e pare depois do primeiro resultado útil.",
        "30-minutes": "Complete a prática inicial, revise uma vez e salve o melhor prompt.",
        "1-hour": "Teste em um exemplo real, revise o resultado e escreva seu próximo passo repetível.",
      },
      reviewAction: {
        "new-to-ai": "Revise o resultado como rascunho, não como resposta final.",
        "tried-ai": "Revise o resultado como rascunho, não como resposta final.",
        "ready-for-work": "Adicione revisão humana antes que o resultado afete uma pessoa, cliente, nota ou decisão empresarial.",
      },
      profileSummary: (group, goal, tool) => `Você é ${group.toLowerCase()} e quer ${goal.toLowerCase()} com ${tool}.`,
      prompt: (group, goal, tool) =>
        `Atue como um coach prático de aprendizagem com IA para ${group.toLowerCase()}. Ajude-me a ${goal.toLowerCase()} usando ${tool}. Dê um primeiro rascunho simples, explique o que devo revisar e termine com três formas de melhorar o resultado.`,
      planSummary: (group, goal, tool, format) =>
        `${group}: Foque em "${goal}" com ${tool} usando uma trilha de ${format.toLowerCase()}.`,
      learningPath: (goal, tool, reviewAction) => [
        `Comece pela menor versão útil de "${goal}" antes de tentar fluxos avançados.`,
        `Use ${tool} para apoio em rascunhos, explicação, comparação e prática; não como autoridade final.`,
        reviewAction,
      ],
      starterGuideItems: (tool) => [
        `${tool} combina com esta trilha porque ajuda a transformar trabalho pouco claro em um primeiro rascunho estruturado.`,
        "Comece com contexto, resultado desejado, limites e o que uma boa resposta deve incluir.",
        "Peça uma revisão depois de avaliar o primeiro resultado; geralmente o valor aparece na segunda passada.",
      ],
    },
  },
};

const documentHeavyGoals = new Set<LearnGoal>(["research-sources", "summarize-docs"]);
const generalToolIds: LearnTool[] = ["chatgpt", "claude", "gemini", "copilot"];
const documentToolIds: LearnTool[] = ["notebooklm", "chatgpt", "claude", "copilot"];

function localizeLearnOption<T extends string>(
  option: LearnOption<T>,
  copy: Record<T, Omit<LearnOption<T>, "id">>,
): LearnOption<T> {
  return { id: option.id, ...copy[option.id] };
}

export function getLearnGroupOptions(language: Language = "en"): LearnOption<LearnGroup>[] {
  return learnGroupOptions.map((option) => localizeLearnOption(option, learnLocalization[language].groups));
}

export function getLearnGoalsByGroup(group: LearnGroup, language: Language = "en"): LearnOption<LearnGoal>[] {
  return learnGoalsByGroup[group].map((option) => localizeLearnOption(option, learnLocalization[language].goals));
}

export function getLearnFormatOptions(language: Language = "en"): LearnOption<LearnFormat>[] {
  return learnFormatOptions.map((option) => localizeLearnOption(option, learnLocalization[language].formats));
}

export function getLearnReportCopy(language: Language = "en") {
  return learnLocalization[language].report;
}

export function getLearnToolOptions(goal: LearnGoal | undefined, language: Language = "en"): LearnOption<LearnTool>[] {
  const ids = goal && documentHeavyGoals.has(goal) ? documentToolIds : generalToolIds;
  return ids.map((id) => localizeLearnOption(learnToolOptions[id], learnLocalization[language].tools));
}

function findLearnOption<T extends string>(options: LearnOption<T>[], id: T) {
  return options.find((option) => option.id === id) ?? options[0];
}

export function getLearnLabels(input: LearnPlanInput, language: Language = "en") {
  const groupOptions = getLearnGroupOptions(language);
  const goalOptions = getLearnGoalsByGroup(input.group, language);
  const formatOptions = getLearnFormatOptions(language);
  const toolOptions = learnLocalization[language].tools;

  const group = findLearnOption(groupOptions, input.group);
  const startingPoint = findLearnOption(aiStartingPointOptions, input.startingPoint);
  const goal = findLearnOption(goalOptions, input.goal);
  const tool = { id: input.tool, ...toolOptions[input.tool] };
  const format = findLearnOption(formatOptions, input.format);
  const time = findLearnOption(learnTimeOptions, input.time);

  return { group, startingPoint, goal, tool, format, time };
}

export function generateLearnReport(input: LearnPlanInput, language: Language = "en"): LearnReport {
  const labels = getLearnLabels(input, language);
  const copy = getLearnReportCopy(language);
  const learningVerb = copy.learningVerb[input.format];
  const timeAction = copy.timeAction[input.time];
  const reviewAction = copy.reviewAction[input.startingPoint];

  const profileSummary = copy.profileSummary(labels.group.label, labels.goal.label, labels.tool.label);
  const practicePrompt = copy.prompt(labels.group.label, labels.goal.label, labels.tool.label);
  const nextAction = `${learningVerb} ${labels.time.label.toLowerCase()}. ${timeAction}`;
  const planSummary = copy.planSummary(labels.group.label, labels.goal.label, labels.tool.label, labels.format.label);

  return {
    title: copy.title,
    demoLabel: copy.demoLabel,
    path: [
      `${copy.group}: ${labels.group.label}`,
      `${copy.goal}: ${labels.goal.label}`,
      `${copy.tool}: ${labels.tool.label}`,
      `${copy.format}: ${labels.format.label}`,
    ],
    profileSummary,
    learningPath: copy.learningPath(labels.goal.label, labels.tool.label, reviewAction),
    toolStarterGuide: copy.starterGuideItems(labels.tool.label),
    practicePrompt,
    nextAction,
    planSummary,
  };
}

export function learnReportToText(report: LearnReport, language: Language = "en") {
  const copy = getLearnReportCopy(language);

  return [
    report.title,
    report.demoLabel,
    "",
    copy.selectedPath,
    ...report.path.map((item) => `- ${item}`),
    "",
    copy.profile,
    report.profileSummary,
    "",
    copy.recommendedPath,
    ...report.learningPath.map((item) => `- ${item}`),
    "",
    copy.starterGuide,
    ...report.toolStarterGuide.map((item) => `- ${item}`),
    "",
    copy.practicePrompt,
    report.practicePrompt,
    "",
    copy.nextAction,
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

export const seminarValueMultiplierDefault = 3.7;

export const seminarTrackOptions: Record<SeminarTrack, string> = {
  worker: "Worker / Employee",
  business: "Business Leader / Owner",
};

export const seminarReadinessDefaults: SeminarReadinessState = {
  bringWorkflow: false,
  knowTimeSpent: false,
  haveSample: false,
  canExplainReview: false,
};

export const seminarReadinessItems: { id: SeminarReadinessKey; label: string }[] = [
  { id: "bringWorkflow", label: "I can name one workflow or task to improve." },
  { id: "knowTimeSpent", label: "I know roughly how much time it takes each week." },
  { id: "haveSample", label: "I can bring one safe sample, note, form, or message." },
  { id: "canExplainReview", label: "I can explain who should review the AI-assisted work." },
];

export const planCopy = {
  en: {
    headings: {
      opportunitySeed: "Opportunity Seed",
      learningPath: "Build your AI Learning Path Report",
      opportunityDraft: "AI Opportunity Draft",
      completePlan: "Complete AI-Ready Action Plan",
      pageEyebrow: "AI-READY ACTION PLAN",
      pageTitle: "Your plan so far",
      pageIntro:
        "This local MVP plan is generated from the four UpSkill USA steps you have completed: Inspire, Learn, Seminar, and Implement.",
      nextThreeDays: "Next 3 Days",
      nextSevenDays: "Next 7 Days",
      afterSevenDays: "After 7 Days",
    },
    actions: {
      saveAndContinue: "Save and continue",
      viewPlanSoFar: "View plan so far",
      saveToLearn: "Save and continue to Learn",
      saveToAdapt: "Save and continue to Seminar",
      saveToImplement: "Save and continue to Implement",
      saveAndViewComplete: "Save and view AI-Ready Action Plan",
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
      clearConfirm: "Clear your locally saved AI-Ready Action Plan?",
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
      0: "Start your AI-Ready Action Plan",
      1: "Level 1: Opportunity Seed",
      2: "Level 2: Learning Path",
      3: "Level 3: AI-Ready Seminar Result",
      4: "Level 4: Complete AI-Ready Action Plan",
    },
    plan: {
      title: "UpSkill USA AI-Ready Action Plan",
      opportunityTitle: "Your AI Opportunity",
      learningTitle: "Recommended Learning Path",
      adaptationTitle: "AI-Ready Seminar Result",
      workerSeminarTitle: "Manifest of Saved Hours",
      businessSeminarTitle: "Company AI-Ready Action Plan",
      pilotTitle: "First Workflow Pilot",
      startTitle: "Start With Inspire",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `As ${role}, your opportunity is to use AI to move toward ${outcome} while protecting the human strengths that matter most: ${strengths}.`,
      context: (value: string) => `Context: ${value}`,
      motivation: (value: string) => `Motivation: ${value}`,
      learningBody: "Use this path to build confidence before changing real workflows.",
      adaptation: (workflow: string, category: string) =>
        `Bring ${workflow} in ${category} to the seminar. AI should assist the repetitive and delayed parts first, while humans keep ownership of judgment-heavy work.`,
      workerSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `This manifest focuses on ${workflow} in ${category}. The current estimate is ${annualValue} in annual value created when saved hours are upgraded into better work.`,
      businessSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `This company plan focuses on ${workflow} in ${category}. The current estimate is ${annualValue} in annual value created across the affected team.`,
      currentSteps: (value: string) => `Current steps: ${value}`,
      delay: (value: string) => `Delay or friction: ${value}`,
      repetitive: (value: string) => `Repetitive work: ${value}`,
      judgment: (value: string) => `Human judgment: ${value}`,
      own: (value: string) => `Own: ${value}`,
      become: (value: string) => `Become: ${value}`,
      track: (value: string) => `Seminar track: ${value}`,
      workArea: (value: string) => `Work area: ${value}`,
      workflow: (value: string) => `Workflow/problem: ${value}`,
      readiness: (ready: number, total: number) => `Readiness checklist: ${ready}/${total} prepared`,
      weeklyHours: (value: string) => `Weekly hours saved: ${value}`,
      hourlyValue: (value: string) => `Hourly value: ${value}`,
      proofPoint: (value: string) => `Proof point to bring: ${value}`,
      workersAffected: (value: string) => `Workers affected: ${value}`,
      multiplier: (value: string) => `Value multiplier: ${value}x`,
      annualValue: (value: string) => `Estimated annual value created: ${value}`,
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
      painfulWorkflow: "one workflow or problem",
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
        "Day 3: Pick one workflow or problem and continue to Seminar.",
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
        "Run A Bigger Pilot: return to Seminar and map the full team workflow.",
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
      completePlan: "Plan de acción listo para IA completo",
      pageEyebrow: "PLAN DE ACCIÓN LISTO PARA IA",
      pageTitle: "Tu plan hasta ahora",
      pageIntro:
        "Este plan MVP local se genera con los pasos de UpSkill USA que completaste: Inspirar, Aprender, Seminario e Implementar.",
      nextThreeDays: "Próximos 3 días",
      nextSevenDays: "Próximos 7 días",
      afterSevenDays: "Después de 7 días",
    },
    actions: {
      saveAndContinue: "Guardar y continuar",
      viewPlanSoFar: "Ver plan hasta ahora",
      saveToLearn: "Guardar y continuar a Aprender",
      saveToAdapt: "Guardar y continuar al Seminario",
      saveToImplement: "Guardar y continuar a Implementar",
      saveAndViewComplete: "Guardar y ver Plan de acción listo para IA",
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
      clearConfirm: "¿Borrar tu Plan de acción listo para IA guardado localmente?",
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
      0: "Comienza tu Plan de acción listo para IA",
      1: "Nivel 1: Semilla de oportunidad",
      2: "Nivel 2: Ruta de aprendizaje",
      3: "Nivel 3: Resultado del seminario listo para IA",
      4: "Nivel 4: Plan de acción listo para IA completo",
    },
    plan: {
      title: "Plan de acción listo para IA de UpSkill USA",
      opportunityTitle: "Tu oportunidad con IA",
      learningTitle: "Ruta de aprendizaje recomendada",
      adaptationTitle: "Resultado del seminario listo para IA",
      workerSeminarTitle: "Manifiesto de horas ahorradas",
      businessSeminarTitle: "Plan de acción empresarial listo para IA",
      pilotTitle: "Primer piloto de flujo de trabajo",
      startTitle: "Empieza con Inspirar",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `Como ${role}, tu oportunidad es usar IA para avanzar hacia ${outcome} mientras proteges las fortalezas humanas más importantes: ${strengths}.`,
      context: (value: string) => `Contexto: ${value}`,
      motivation: (value: string) => `Motivación: ${value}`,
      learningBody: "Usa esta ruta para ganar confianza antes de cambiar flujos reales.",
      adaptation: (workflow: string, category: string) =>
        `Trae ${workflow} dentro de ${category} al seminario. La IA debe asistir primero las partes repetitivas y demoradas, mientras las personas mantienen la responsabilidad del trabajo que exige juicio.`,
      workerSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `Este manifiesto se enfoca en ${workflow} dentro de ${category}. La estimación actual es ${annualValue} en valor anual creado cuando las horas ahorradas se convierten en mejor trabajo.`,
      businessSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `Este plan de empresa se enfoca en ${workflow} dentro de ${category}. La estimación actual es ${annualValue} en valor anual creado en el equipo afectado.`,
      currentSteps: (value: string) => `Pasos actuales: ${value}`,
      delay: (value: string) => `Demora o fricción: ${value}`,
      repetitive: (value: string) => `Trabajo repetitivo: ${value}`,
      judgment: (value: string) => `Juicio humano: ${value}`,
      own: (value: string) => `Asumirás: ${value}`,
      become: (value: string) => `Te convertirás en: ${value}`,
      track: (value: string) => `Ruta del seminario: ${value}`,
      workArea: (value: string) => `Área de trabajo: ${value}`,
      workflow: (value: string) => `Flujo/problema: ${value}`,
      readiness: (ready: number, total: number) => `Lista de preparación: ${ready}/${total} preparado`,
      weeklyHours: (value: string) => `Horas semanales ahorradas: ${value}`,
      hourlyValue: (value: string) => `Valor por hora: ${value}`,
      proofPoint: (value: string) => `Prueba para traer: ${value}`,
      workersAffected: (value: string) => `Trabajadores afectados: ${value}`,
      multiplier: (value: string) => `Multiplicador de valor: ${value}x`,
      annualValue: (value: string) => `Valor anual estimado creado: ${value}`,
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
      painfulWorkflow: "un flujo de trabajo o problema",
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
        "Día 3: Elige un flujo de trabajo o problema y continúa al Seminario.",
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
        "Ejecutar un piloto más grande: vuelve al Seminario y mapea el flujo completo del equipo.",
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
      completePlan: "Plano de ação pronto para IA completo",
      pageEyebrow: "PLANO DE AÇÃO PRONTO PARA IA",
      pageTitle: "Seu plano até agora",
      pageIntro:
        "Este plano MVP local é gerado a partir dos passos da UpSkill USA que você completou: Inspirar, Aprender, Seminário e Implementar.",
      nextThreeDays: "Próximos 3 dias",
      nextSevenDays: "Próximos 7 dias",
      afterSevenDays: "Depois de 7 dias",
    },
    actions: {
      saveAndContinue: "Salvar e continuar",
      viewPlanSoFar: "Ver plano até agora",
      saveToLearn: "Salvar e continuar para Aprender",
      saveToAdapt: "Salvar e continuar para Seminário",
      saveToImplement: "Salvar e continuar para Implementar",
      saveAndViewComplete: "Salvar e ver Plano de ação pronto para IA",
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
      clearConfirm: "Limpar seu Plano de ação pronto para IA salvo localmente?",
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
      0: "Comece seu Plano de ação pronto para IA",
      1: "Nível 1: Semente de oportunidade",
      2: "Nível 2: Trilha de aprendizagem",
      3: "Nível 3: Resultado do seminário pronto para IA",
      4: "Nível 4: Plano de ação pronto para IA completo",
    },
    plan: {
      title: "Plano de ação pronto para IA da UpSkill USA",
      opportunityTitle: "Sua oportunidade com IA",
      learningTitle: "Trilha de aprendizagem recomendada",
      adaptationTitle: "Resultado do seminário pronto para IA",
      workerSeminarTitle: "Manifesto de horas economizadas",
      businessSeminarTitle: "Plano de ação da empresa pronto para IA",
      pilotTitle: "Primeiro piloto de fluxo de trabalho",
      startTitle: "Comece por Inspirar",
      opportunity: (role: string, outcome: string, strengths: string) =>
        `Como ${role}, sua oportunidade é usar IA para avançar em direção a ${outcome}, protegendo as forças humanas mais importantes: ${strengths}.`,
      context: (value: string) => `Contexto: ${value}`,
      motivation: (value: string) => `Motivação: ${value}`,
      learningBody: "Use esta trilha para ganhar confiança antes de mudar fluxos reais.",
      adaptation: (workflow: string, category: string) =>
        `Leve ${workflow} em ${category} para o seminário. A IA deve ajudar primeiro nas partes repetitivas e demoradas, enquanto humanos mantêm a responsabilidade pelo trabalho que exige julgamento.`,
      workerSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `Este manifesto foca em ${workflow} em ${category}. A estimativa atual é ${annualValue} em valor anual criado quando horas economizadas viram trabalho melhor.`,
      businessSeminarBody: (workflow: string, category: string, annualValue: string) =>
        `Este plano da empresa foca em ${workflow} em ${category}. A estimativa atual é ${annualValue} em valor anual criado na equipe afetada.`,
      currentSteps: (value: string) => `Passos atuais: ${value}`,
      delay: (value: string) => `Demora ou fricção: ${value}`,
      repetitive: (value: string) => `Trabalho repetitivo: ${value}`,
      judgment: (value: string) => `Julgamento humano: ${value}`,
      own: (value: string) => `Você vai assumir: ${value}`,
      become: (value: string) => `Você vai se tornar: ${value}`,
      track: (value: string) => `Trilha do seminário: ${value}`,
      workArea: (value: string) => `Área de trabalho: ${value}`,
      workflow: (value: string) => `Fluxo/problema: ${value}`,
      readiness: (ready: number, total: number) => `Lista de preparação: ${ready}/${total} pronto`,
      weeklyHours: (value: string) => `Horas semanais economizadas: ${value}`,
      hourlyValue: (value: string) => `Valor por hora: ${value}`,
      proofPoint: (value: string) => `Prova para levar: ${value}`,
      workersAffected: (value: string) => `Trabalhadores afetados: ${value}`,
      multiplier: (value: string) => `Multiplicador de valor: ${value}x`,
      annualValue: (value: string) => `Valor anual estimado criado: ${value}`,
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
      painfulWorkflow: "um fluxo de trabalho ou problema",
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
        "Dia 3: Escolha um fluxo de trabalho ou problema e continue para Seminário.",
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
        "Rodar um piloto maior: volte para Seminário e mapeie o fluxo completo da equipe.",
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
    track: "worker",
    readiness: seminarReadinessDefaults,
    workCategory: "operations",
    workflow: "",
    multiplier: seminarValueMultiplierDefault,
    worker: {
      weeklyHoursSaved: 0,
      hourlyValue: 0,
      proofPoint: "",
    },
    business: {
      workersAffected: 0,
      weeklyHoursSavedPerWorker: 0,
      blendedHourlyValue: 0,
    },
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
    email: "",
    workflowName: "",
    pilotScope: "",
    humanGate: "",
    audience: undefined,
    workArea: undefined,
    selectedTasks: [],
    customTasks: [],
    report: undefined,
    selectedPilot: undefined,
    savedAt: undefined,
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

function toPositiveNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

function formatSeminarCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatSeminarNumber(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatMultiplier(value: number) {
  return Number(value.toFixed(2)).toString();
}

function isSeminarTrack(value: unknown): value is SeminarTrack {
  return value === "worker" || value === "business";
}

export function getSeminarMultiplier(input: Pick<AdaptPlanInput, "multiplier"> | undefined) {
  const multiplier = toPositiveNumber(input?.multiplier);
  return multiplier || seminarValueMultiplierDefault;
}

export function getSeminarReadinessCount(input: Pick<AdaptPlanInput, "readiness"> | undefined) {
  const readiness = input?.readiness ?? seminarReadinessDefaults;
  const ready = seminarReadinessItems.filter((item) => readiness[item.id]).length;

  return {
    ready,
    total: seminarReadinessItems.length,
  };
}

export function calculateSeminarAnnualValue(input: AdaptPlanInput) {
  const multiplier = getSeminarMultiplier(input);

  if (input.track === "business") {
    const workersAffected = toPositiveNumber(input.business?.workersAffected);
    const weeklyHoursSavedPerWorker = toPositiveNumber(input.business?.weeklyHoursSavedPerWorker);
    const blendedHourlyValue = toPositiveNumber(input.business?.blendedHourlyValue);
    const weeklyHoursSaved = workersAffected * weeklyHoursSavedPerWorker;

    return {
      annualValue: weeklyHoursSaved * blendedHourlyValue * 52 * multiplier,
      weeklyHoursSaved,
      multiplier,
      workersAffected,
      weeklyHoursSavedPerWorker,
      blendedHourlyValue,
      hourlyValue: 0,
    };
  }

  const weeklyHoursSaved = toPositiveNumber(input.worker?.weeklyHoursSaved);
  const hourlyValue = toPositiveNumber(input.worker?.hourlyValue);

  return {
    annualValue: weeklyHoursSaved * hourlyValue * 52 * multiplier,
    weeklyHoursSaved,
    multiplier,
    hourlyValue,
    workersAffected: 0,
    weeklyHoursSavedPerWorker: 0,
    blendedHourlyValue: 0,
  };
}

export function isSeminarPrepComplete(input: AdaptPlanInput | undefined) {
  if (!input || !isSeminarTrack(input.track) || !hasText(input.workflow)) {
    return false;
  }

  if (!Object.hasOwn(workCategories, input.workCategory)) {
    return false;
  }

  const calculation = calculateSeminarAnnualValue(input);

  if (input.track === "business") {
    return (
      calculation.workersAffected > 0 &&
      calculation.weeklyHoursSavedPerWorker > 0 &&
      calculation.blendedHourlyValue > 0 &&
      calculation.multiplier > 0
    );
  }

  return (
    calculation.weeklyHoursSaved > 0 &&
    calculation.hourlyValue > 0 &&
    calculation.multiplier > 0 &&
    hasText(input.worker?.proofPoint)
  );
}

export function generateSeminarResult(input: AdaptPlanInput, language: Language = "en"): SeminarResult | undefined {
  if (!isSeminarPrepComplete(input)) {
    return undefined;
  }

  const copy = getPlanCopy(language);
  const calculation = calculateSeminarAnnualValue(input);
  const category = copy.workCategories[input.workCategory];
  const annualValueLabel = formatSeminarCurrency(calculation.annualValue);
  const multiplierLabel = formatMultiplier(calculation.multiplier);
  const trackLabel = seminarTrackOptions[input.track];
  const title = input.track === "business" ? copy.plan.businessSeminarTitle : copy.plan.workerSeminarTitle;
  const summary =
    input.track === "business"
      ? copy.plan.businessSeminarBody(input.workflow, category, annualValueLabel)
      : copy.plan.workerSeminarBody(input.workflow, category, annualValueLabel);
  const items =
    input.track === "business"
      ? [
          copy.plan.track(trackLabel),
          copy.plan.workArea(category),
          copy.plan.workflow(input.workflow),
          copy.plan.workersAffected(formatSeminarNumber(calculation.workersAffected)),
          copy.plan.weeklyHours(formatSeminarNumber(calculation.weeklyHoursSaved)),
          copy.plan.hourlyValue(formatSeminarCurrency(calculation.blendedHourlyValue)),
          copy.plan.multiplier(multiplierLabel),
          copy.plan.annualValue(annualValueLabel),
        ]
      : [
          copy.plan.track(trackLabel),
          copy.plan.workArea(category),
          copy.plan.workflow(input.workflow),
          copy.plan.weeklyHours(formatSeminarNumber(calculation.weeklyHoursSaved)),
          copy.plan.hourlyValue(formatSeminarCurrency(calculation.hourlyValue)),
          copy.plan.proofPoint(input.worker.proofPoint),
          copy.plan.multiplier(multiplierLabel),
          copy.plan.annualValue(annualValueLabel),
        ];
  const text = [title, summary, "", "Seminar Prep", ...items.map((item) => `- ${item}`)].join("\n");

  return {
    track: input.track,
    title,
    summary,
    annualValue: calculation.annualValue,
    annualValueLabel,
    weeklyHoursSaved: calculation.weeklyHoursSaved,
    multiplier: calculation.multiplier,
    items,
    text: input.resultText?.trim() || text,
    filename: input.track === "business" ? "company-ai-ready-action-plan.md" : "manifest-of-saved-hours.md",
  };
}

function hasSavedSeminarResult(input: AdaptPlanInput | undefined) {
  return isSeminarPrepComplete(input) && hasText(input?.savedAt);
}

function hasSavedImplementation(input: ImplementPlanInput | undefined) {
  return Boolean(input?.report && input.selectedPilot && hasText(input.savedAt));
}

export function getPlanLevel(draft: PlanDraft): PlanLevel {
  const hasSeminarResult = hasSavedSeminarResult(draft.adapt);

  if (hasSavedImplementation(draft.implement)) {
    return 4;
  }
  if (hasSeminarResult) {
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

function getImplementationPlanSection(input: ImplementPlanInput, language: Language): GeneratedPlanSection {
  const copy = getPlanCopy(language);
  const pilot = input.selectedPilot;

  if (input.report?.kind === "business") {
    const report = input.report as BusinessOpportunityReport;

    return {
      title: "Company AI Opportunity Report",
      body: `${report.companyName} has a Step 4 opportunity score of ${Math.round(
        report.opportunityScore,
      )}/100. The selected first pilot is ${pilot?.label || copy.defaults.smallTest}.`,
      items: [
        `Report type: Business Leader`,
        `Contact: ${report.email || input.email || "not specified"}`,
        `Annual value opportunity: ${formatShortUsd(report.annualValueAtRisk)}`,
        `Recoverable work: ${formatLabNumber(report.weeklyHoursReclaimable)} hours/week (${report.fteEquivalent.toFixed(
          1,
        )} FTE equivalent/year)`,
        `Selected pilot: ${pilot?.label || copy.defaults.smallTest}`,
        `AI does: ${pilot?.aiAction || "not specified"}`,
        `Human review: ${pilot?.humanReview || input.humanGate || copy.defaults.approver}`,
        copy.plan.riskLevel(copy.risk[getRiskLevel(input) ?? "low"]),
      ],
    };
  }

  if (input.report?.kind === "employee") {
    const report = input.report;
    const isLeader = input.audience === "business";

    return {
      title: isLeader ? "Personal AI Readiness Report" : "Task Transformation Report",
      body: `${report.workArea} ${isLeader ? "responsibilities were" : "work was"} analyzed across ${report.skillsAnalyzed} selected ${
        isLeader ? "responsibility" : "task"
      } areas. The selected first pilot is ${
        pilot?.label || copy.defaults.smallTest
      }.`,
      items: [
        `Report type: ${isLeader ? "Business Leader personal readiness" : "Employee task transformation"}`,
        `Monthly hours saved estimate: ${report.summary.estimated_monthly_hours_saved.toFixed(1)}`,
        `FTE equivalent: ${report.summary.estimated_fte_equivalent_saved.toFixed(2)}`,
        `Buckets: ${report.summary.automate_count} automate, ${report.summary.augment_count} augment, ${report.summary.own_count} own`,
        `Selected pilot: ${pilot?.label || copy.defaults.smallTest}`,
        `AI does: ${pilot?.aiAction || "not specified"}`,
        `Human ownership: ${pilot?.humanReview || input.humanGate || copy.defaults.approver}`,
        `Suggested tools: ${report.tools.join(", ") || "not specified"}`,
        copy.plan.riskLevel(copy.risk[getRiskLevel(input) ?? "low"]),
      ],
    };
  }

  return {
    title: copy.plan.pilotTitle,
    body: copy.plan.pilot(
      input.workflowName || copy.defaults.oneWorkflow,
      input.pilotScope || copy.defaults.smallTest,
    ),
    items: [
      copy.plan.humanGate(input.humanGate || copy.defaults.approver),
      copy.plan.riskLevel(copy.risk[getRiskLevel(input) ?? "low"]),
      copy.plan.companyUrl(input.companyUrl || copy.defaults.noCompanyUrl),
    ],
  };
}

export function generateUpgradePlan(draft: PlanDraft, language: Language = "en"): GeneratedPlan {
  const level = getPlanLevel(draft);
  const riskLevel = getRiskLevel(draft.implement);
  const copy = getPlanCopy(language);
  const savedAdapt = hasSavedSeminarResult(draft.adapt) ? draft.adapt : undefined;
  const seminarResult = savedAdapt ? generateSeminarResult(savedAdapt, language) : undefined;
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

  if (seminarResult) {
    sections.push({
      title: seminarResult.title,
      body: seminarResult.summary,
      items: seminarResult.items,
    });
  }

  if (draft.implement) {
    sections.push(getImplementationPlanSection(draft.implement, language));
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
