import type { Language } from "@/lib/content";

export type ImplementationLabCopy = {
  title: string;
  subtitle: string;
  startOver: string;
  resetConfirm: string;
  errors: {
    companyUrl: string;
    email: string;
    opportunityAudit: string;
    audit: string;
    taskReport: string;
    report: string;
    choosePilot: string;
  };
  saved: string;
  audience: {
    eyebrow: string;
    title: string;
    businessLabel: string;
    businessDescription: string;
    employeeLabel: string;
    employeeDescription: string;
  };
  business: {
    eyebrow: string;
    title: string;
    companyUrl: string;
    contactEmail: string;
    companyPlaceholder: string;
    emailPlaceholder: string;
    analyzing: string;
    generate: string;
  };
  employee: {
    areaEyebrow: string;
    areaTitle: string;
    taskTitle: string;
    selected: (count: number) => string;
    addTask: string;
    taskPlaceholder: string;
    add: string;
    analyzing: string;
    generate: string;
  };
  loading: {
    businessTitle: string;
    employeeTitle: string;
    businessItems: string[];
    employeeItems: string[];
    opportunityTitle: string;
    opportunityItems: string[];
  };
  actions: {
    copy: string;
    downloadPdf: string;
    regenerate: string;
    sampleData: string;
    liveAudit: string;
  };
  businessReport: {
    eyebrow: string;
    annualCost: string;
    laborValue: (company: string) => string;
    employeePlanningAssumption: string;
    reportedEmployeeCount: string;
    conservativeEstimate: string;
    lowerBoundRange: (range: string) => string;
    publicInformationReason: string;
    sampleEstimateReason: string;
    sampleSource: string;
    inactiveReason: string;
    companySizeUnavailable: string;
    notEstimated: string;
    source: string;
    confidence: string;
    confidenceHigh: string;
    confidenceMedium: string;
    confidenceNone: string;
    observed: string;
    addressableRoles: string;
    recoverableWeek: string;
    hoursShort: string;
    hoursYear: string;
    annualRecoverable: string;
    fteEquivalent: string;
    gap: string;
    gapDescription: string;
    workforceScore: string;
    executiveSummary: string;
    hiddenTitle: string;
    hiddenSubtitle: string;
    trapped: string;
    methodology: string;
  };
  employeeReport: {
    personalTitle: string;
    actionPlanTitle: string;
    skillsSummary: (skills: number, tasks: number, isLeader: boolean, band: string) => string;
    hoursRecovered: string;
    hoursRecoveredSub: string;
    readinessScore: string;
    readinessSub: string;
    pathway: string;
    pathwayValue: string;
    pathwaySub: string;
    automate: string;
    augment: string;
    own: string;
    breakdown: string;
    breakdownLeader: string;
    breakdownEmployee: string;
    tools: string;
    aiDoes: string;
    ctaLabel: string;
    ctaTitleLeader: string;
    ctaTitleEmployee: string;
    customizePrefix: string;
    more: (count: number) => string;
    reclaim: (hours: string, fte: string) => string;
    keepOwning: (count: number, isLeader: boolean) => string;
    usePilot: string;
    pdfTitle: (workArea: string) => string;
  };
  guardrails: {
    eyebrow: string;
    title: string;
    selectedPilot: string;
    estimate: (hours: number | null, threshold: number) => string;
    inScope: string;
    outOfScope: string;
    viewPlan: string;
  };
};

export const implementationLabCopy: Record<Language, ImplementationLabCopy> = {
  en: {
    title: "Build My First AI Pilot",
    subtitle: "Choose the path that fits you. Leaders audit company opportunity; employees see how daily tasks transform.",
    startOver: "Start over",
    resetConfirm: "Start the AI Implementation Lab over? This will clear your current Step 4 selections and saved report.",
    errors: {
      companyUrl: "Enter a valid company URL.",
      email: "Enter a valid contact email.",
      opportunityAudit: "Could not generate the opportunity audit.",
      audit: "Could not generate audit.",
      taskReport: "Could not generate the Task Transformation Report.",
      report: "Could not generate report.",
      choosePilot: "Choose a first pilot before saving Step 4.",
    },
    saved: "Saved to your AI-Ready Action Plan.",
    audience: {
      eyebrow: "Audience",
      title: "Who are you exploring AI for?",
      businessLabel: "Business Leader",
      businessDescription: "Audit your company website, capture contact email, and choose a first AI pilot.",
      employeeLabel: "Employee / Worker",
      employeeDescription: "See which daily tasks AI can automate, augment, or leave human-owned.",
    },
    business: {
      eyebrow: "Company audit",
      title: "Start with your company website",
      companyUrl: "Company URL",
      contactEmail: "Contact email",
      companyPlaceholder: "yourcompany.com",
      emailPlaceholder: "name@company.com",
      analyzing: "Analyzing...",
      generate: "Generate AI Opportunity Report",
    },
    employee: {
      areaEyebrow: "Work area",
      areaTitle: "Choose where your work sits",
      taskTitle: "Select what fills your calendar",
      selected: (count) => `${count} tasks selected`,
      addTask: "Add a task you do not see",
      taskPlaceholder: "Type a task and press Add",
      add: "Add",
      analyzing: "Analyzing...",
      generate: "Generate Task Transformation Report",
    },
    loading: {
      businessTitle: "Building your Personal AI Readiness Report...",
      employeeTitle: "Building your Task Transformation Report...",
      businessItems: [
        "Mapping selected responsibilities...",
        "Classifying Automate / Augment / Own...",
        "Estimating personal AI readiness...",
        "Preparing first pilot options...",
      ],
      employeeItems: [
        "Mapping selected work tasks...",
        "Classifying Automate / Augment / Own...",
        "Calculating monthly hours saved...",
        "Preparing first pilot options...",
      ],
      opportunityTitle: "Building your Company Opportunity Audit...",
      opportunityItems: [
        "Scanning your website...",
        "Enriching company context...",
        "Calculating addressable workforce...",
        "Modeling first opportunity areas...",
      ],
    },
    actions: {
      copy: "Copy",
      downloadPdf: "Download PDF",
      regenerate: "Regenerate",
      sampleData: "Sample data",
      liveAudit: "Live audit",
    },
    businessReport: {
      eyebrow: "AI Readiness Diagnostic",
      annualCost: "Annual Cost of Inaction",
      laborValue: (company) => `in fully loaded labor value locked inside repeatable, addressable work at ${company}.`,
      employeePlanningAssumption: "Employee planning assumption",
      reportedEmployeeCount: "Reported employee count",
      conservativeEstimate: "Conservative estimate",
      lowerBoundRange: (range) => `Lower bound of the reported ${range} range.`,
      publicInformationReason: "Based on public company-size information found online.",
      sampleEstimateReason: "Sample planning assumption for this demo report.",
      sampleSource: "Sample report",
      inactiveReason: "The company domain was identified as inactive; no employee estimate was used.",
      companySizeUnavailable: "Company size unavailable",
      notEstimated: "Not estimated",
      source: "Source",
      confidence: "Confidence",
      confidenceHigh: "High",
      confidenceMedium: "Medium",
      confidenceNone: "Unavailable",
      observed: "Observed",
      addressableRoles: "Addressable roles",
      recoverableWeek: "Recoverable / week",
      hoursShort: "hrs",
      hoursYear: "hrs/year",
      annualRecoverable: "Recoverable / year",
      fteEquivalent: "FTE equivalent",
      gap: "5-Year Competitive Gap",
      gapDescription: "Cumulative value lost if competitors deploy AI before you do.",
      workforceScore: "Workforce Score",
      executiveSummary: "Executive Summary",
      hiddenTitle: "What's hiding in your operations",
      hiddenSubtitle: "High-volume manual work surfaced from company signals and common workflow patterns.",
      trapped: "Trapped",
      methodology:
        "Methodology: directional figures combine company context, common addressable workflow patterns, and conservative labor-value assumptions. Use this as a first-pilot planning estimate.",
    },
    employeeReport: {
      personalTitle: "Personal AI Readiness Report",
      actionPlanTitle: "AI-Ready Action Plan",
      skillsSummary: (skills, tasks, isLeader, band) =>
        `${skills} skills analyzed · ${tasks} ${isLeader ? "responsibilities generated" : "tasks generated"} · readiness band: ${band}`,
      hoursRecovered: "Hours recovered / week",
      hoursRecoveredSub: "From automated and augmented work",
      readinessScore: "AI readiness score",
      readinessSub: "Task-level confidence",
      pathway: "Recommended pathway",
      pathwayValue: "3 tracks",
      pathwaySub: "Personalized",
      automate: "Automate",
      augment: "Augment",
      own: "OWN",
      breakdown: "Task-by-task breakdown",
      breakdownLeader: "Hours per month across leadership work, before vs. after AI deployment.",
      breakdownEmployee: "Hours per month, before vs. after AI deployment.",
      tools: "Recommended AI tools",
      aiDoes: "AI does:",
      ctaLabel: "Your skill roadmap is ready",
      ctaTitleLeader: "Turn this into your leadership AI workflow.",
      ctaTitleEmployee: "Turn this into your daily AI workflow.",
      customizePrefix: "Customize",
      more: (count) => `(and ${count} more)`,
      reclaim: (hours, fte) => `Reclaim ${hours}h/month - that is ${fte} FTE of your week back`,
      keepOwning: (count, isLeader) => `Keep owning the ${count} ${isLeader ? "responsibilities only you can lead" : "tasks only you can do"}`,
      usePilot: "Use this as my first pilot",
      pdfTitle: (workArea) => `${workArea} AI-Ready Action Plan`,
    },
    guardrails: {
      eyebrow: "First pilot",
      title: "Add guardrails and save",
      selectedPilot: "Selected pilot",
      estimate: (hours, threshold) =>
        `${hours == null ? "Not estimated" : `${hours} hrs/week estimate`} · threshold ${threshold}%`,
      inScope: "In scope",
      outOfScope: "Out of scope",
      viewPlan: "View AI-Ready Action Plan",
    },
  },
  es: {
    title: "Construir mi primer piloto de IA",
    subtitle: "Elige la ruta que encaja contigo. Los líderes auditan oportunidades; los empleados ven cómo se transforma el trabajo diario.",
    startOver: "Empezar de nuevo",
    resetConfirm: "¿Empezar de nuevo el Laboratorio de implementación? Esto borrará tus selecciones del Paso 4 y el reporte guardado.",
    errors: {
      companyUrl: "Ingresa una URL de empresa válida.",
      email: "Ingresa un email de contacto válido.",
      opportunityAudit: "No se pudo generar la auditoría de oportunidad.",
      audit: "No se pudo generar la auditoría.",
      taskReport: "No se pudo generar el Reporte de transformación de tareas.",
      report: "No se pudo generar el reporte.",
      choosePilot: "Elige un primer piloto antes de guardar el Paso 4.",
    },
    saved: "Guardado en tu Plan de acción listo para IA.",
    audience: {
      eyebrow: "Audiencia",
      title: "¿Para quién estás explorando IA?",
      businessLabel: "Líder empresarial",
      businessDescription: "Audita el sitio de tu empresa, captura un email de contacto y elige un primer piloto de IA.",
      employeeLabel: "Empleado / trabajador",
      employeeDescription: "Ve qué tareas diarias la IA puede automatizar, aumentar o dejar bajo propiedad humana.",
    },
    business: {
      eyebrow: "Auditoría de empresa",
      title: "Empieza con el sitio web de tu empresa",
      companyUrl: "URL de empresa",
      contactEmail: "Email de contacto",
      companyPlaceholder: "tuempresa.com",
      emailPlaceholder: "nombre@empresa.com",
      analyzing: "Analizando...",
      generate: "Generar reporte de oportunidad con IA",
    },
    employee: {
      areaEyebrow: "Área de trabajo",
      areaTitle: "Elige dónde se ubica tu trabajo",
      taskTitle: "Selecciona lo que ocupa tu calendario",
      selected: (count) => `${count} tareas seleccionadas`,
      addTask: "Agrega una tarea que no ves",
      taskPlaceholder: "Escribe una tarea y presiona Agregar",
      add: "Agregar",
      analyzing: "Analizando...",
      generate: "Generar Reporte de transformación de tareas",
    },
    loading: {
      businessTitle: "Construyendo tu Reporte personal de preparación para IA...",
      employeeTitle: "Construyendo tu Reporte de transformación de tareas...",
      businessItems: [
        "Mapeando responsabilidades seleccionadas...",
        "Clasificando Automatizar / Aumentar / Asumir...",
        "Estimando preparación personal para IA...",
        "Preparando primeras opciones de piloto...",
      ],
      employeeItems: [
        "Mapeando tareas seleccionadas...",
        "Clasificando Automatizar / Aumentar / Asumir...",
        "Calculando horas mensuales ahorradas...",
        "Preparando primeras opciones de piloto...",
      ],
      opportunityTitle: "Construyendo tu auditoría de oportunidad de empresa...",
      opportunityItems: [
        "Escaneando tu sitio web...",
        "Enriqueciendo contexto de empresa...",
        "Calculando fuerza laboral direccionable...",
        "Modelando primeras áreas de oportunidad...",
      ],
    },
    actions: {
      copy: "Copiar",
      downloadPdf: "Descargar PDF",
      regenerate: "Regenerar",
      sampleData: "Datos de muestra",
      liveAudit: "Auditoría en vivo",
    },
    businessReport: {
      eyebrow: "Diagnóstico de preparación para IA",
      annualCost: "Costo anual de inacción",
      laborValue: (company) => `en valor laboral completo atrapado en trabajo repetible y direccionable en ${company}.`,
      employeePlanningAssumption: "Supuesto de empleados para la planificación",
      reportedEmployeeCount: "Número de empleados reportado",
      conservativeEstimate: "Estimación conservadora",
      lowerBoundRange: (range) => `Límite inferior del rango reportado de ${range}.`,
      publicInformationReason: "Basado en información pública sobre el tamaño de la empresa encontrada en línea.",
      sampleEstimateReason: "Supuesto de planificación de muestra para este reporte de demostración.",
      sampleSource: "Reporte de muestra",
      inactiveReason: "El dominio de la empresa fue identificado como inactivo; no se usó una estimación de empleados.",
      companySizeUnavailable: "Tamaño de la empresa no disponible",
      notEstimated: "No estimado",
      source: "Fuente",
      confidence: "Confianza",
      confidenceHigh: "Alta",
      confidenceMedium: "Media",
      confidenceNone: "No disponible",
      observed: "Observado",
      addressableRoles: "Roles direccionables",
      recoverableWeek: "Recuperable / semana",
      hoursShort: "hrs",
      hoursYear: "hrs/año",
      annualRecoverable: "Recuperable / año",
      fteEquivalent: "Equivalente FTE",
      gap: "Brecha competitiva a 5 años",
      gapDescription: "Valor acumulado perdido si los competidores despliegan IA antes que tú.",
      workforceScore: "Puntaje de fuerza laboral",
      executiveSummary: "Resumen ejecutivo",
      hiddenTitle: "Qué está oculto en tus operaciones",
      hiddenSubtitle: "Trabajo manual de alto volumen detectado con señales de empresa y patrones comunes.",
      trapped: "Atrapado",
      methodology:
        "Metodología: las cifras direccionales combinan contexto de empresa, patrones comunes de trabajo direccionable y supuestos conservadores de valor laboral. Úsalo como estimación para planear un primer piloto.",
    },
    employeeReport: {
      personalTitle: "Reporte personal de preparación para IA",
      actionPlanTitle: "Plan de acción listo para IA",
      skillsSummary: (skills, tasks, isLeader, band) =>
        `${skills} habilidades analizadas · ${tasks} ${isLeader ? "responsabilidades generadas" : "tareas generadas"} · banda de preparación: ${band}`,
      hoursRecovered: "Horas recuperadas / semana",
      hoursRecoveredSub: "De trabajo automatizado y aumentado",
      readinessScore: "Puntaje de preparación para IA",
      readinessSub: "Confianza a nivel de tarea",
      pathway: "Ruta recomendada",
      pathwayValue: "3 rutas",
      pathwaySub: "Personalizado",
      automate: "Automatizar",
      augment: "Aumentar",
      own: "ASUMIR",
      breakdown: "Desglose tarea por tarea",
      breakdownLeader: "Horas por mes en trabajo de liderazgo, antes vs. después de IA.",
      breakdownEmployee: "Horas por mes, antes vs. después de IA.",
      tools: "Herramientas de IA recomendadas",
      aiDoes: "La IA hace:",
      ctaLabel: "Tu mapa de habilidades está listo",
      ctaTitleLeader: "Convierte esto en tu flujo de liderazgo con IA.",
      ctaTitleEmployee: "Convierte esto en tu flujo diario con IA.",
      customizePrefix: "Personaliza",
      more: (count) => `(y ${count} más)`,
      reclaim: (hours, fte) => `Recupera ${hours}h/mes - eso equivale a ${fte} FTE de tu semana`,
      keepOwning: (count, isLeader) => `Sigue asumiendo ${count} ${isLeader ? "responsabilidades que solo tú puedes liderar" : "tareas que solo tú puedes hacer"}`,
      usePilot: "Usar esto como mi primer piloto",
      pdfTitle: (workArea) => `${workArea} Plan de acción listo para IA`,
    },
    guardrails: {
      eyebrow: "Primer piloto",
      title: "Agrega controles y guarda",
      selectedPilot: "Piloto seleccionado",
      estimate: (hours, threshold) =>
        `${hours == null ? "No estimado" : `${hours} hrs/semana estimadas`} · umbral ${threshold}%`,
      inScope: "Dentro del alcance",
      outOfScope: "Fuera del alcance",
      viewPlan: "Ver Plan de acción listo para IA",
    },
  },
  pt: {
    title: "Construir meu primeiro piloto de IA",
    subtitle: "Escolha a trilha que combina com você. Líderes auditam oportunidades; empregados veem como o trabalho diário se transforma.",
    startOver: "Começar de novo",
    resetConfirm: "Começar o Laboratório de implementação de novo? Isso limpará suas seleções do Passo 4 e o relatório salvo.",
    errors: {
      companyUrl: "Insira uma URL de empresa válida.",
      email: "Insira um email de contato válido.",
      opportunityAudit: "Não foi possível gerar a auditoria de oportunidade.",
      audit: "Não foi possível gerar a auditoria.",
      taskReport: "Não foi possível gerar o Relatório de transformação de tarefas.",
      report: "Não foi possível gerar o relatório.",
      choosePilot: "Escolha um primeiro piloto antes de salvar o Passo 4.",
    },
    saved: "Salvo no seu Plano de ação pronto para IA.",
    audience: {
      eyebrow: "Público",
      title: "Para quem você está explorando IA?",
      businessLabel: "Líder empresarial",
      businessDescription: "Audite o site da empresa, informe email de contato e escolha um primeiro piloto de IA.",
      employeeLabel: "Empregado / trabalhador",
      employeeDescription: "Veja quais tarefas diárias a IA pode automatizar, aumentar ou deixar sob responsabilidade humana.",
    },
    business: {
      eyebrow: "Auditoria da empresa",
      title: "Comece pelo site da sua empresa",
      companyUrl: "URL da empresa",
      contactEmail: "Email de contato",
      companyPlaceholder: "suaempresa.com",
      emailPlaceholder: "nome@empresa.com",
      analyzing: "Analisando...",
      generate: "Gerar relatório de oportunidade com IA",
    },
    employee: {
      areaEyebrow: "Área de trabalho",
      areaTitle: "Escolha onde seu trabalho fica",
      taskTitle: "Selecione o que ocupa sua agenda",
      selected: (count) => `${count} tarefas selecionadas`,
      addTask: "Adicione uma tarefa que você não vê",
      taskPlaceholder: "Digite uma tarefa e pressione Adicionar",
      add: "Adicionar",
      analyzing: "Analisando...",
      generate: "Gerar Relatório de transformação de tarefas",
    },
    loading: {
      businessTitle: "Construindo seu Relatório pessoal de prontidão para IA...",
      employeeTitle: "Construindo seu Relatório de transformação de tarefas...",
      businessItems: [
        "Mapeando responsabilidades selecionadas...",
        "Classificando Automatizar / Aumentar / Assumir...",
        "Estimando prontidão pessoal para IA...",
        "Preparando primeiras opções de piloto...",
      ],
      employeeItems: [
        "Mapeando tarefas selecionadas...",
        "Classificando Automatizar / Aumentar / Assumir...",
        "Calculando horas mensais economizadas...",
        "Preparando primeiras opções de piloto...",
      ],
      opportunityTitle: "Construindo sua auditoria de oportunidade da empresa...",
      opportunityItems: [
        "Escaneando seu site...",
        "Enriquecendo contexto da empresa...",
        "Calculando força de trabalho endereçável...",
        "Modelando primeiras áreas de oportunidade...",
      ],
    },
    actions: {
      copy: "Copiar",
      downloadPdf: "Baixar PDF",
      regenerate: "Regenerar",
      sampleData: "Dados de exemplo",
      liveAudit: "Auditoria ao vivo",
    },
    businessReport: {
      eyebrow: "Diagnóstico de prontidão para IA",
      annualCost: "Custo anual da inação",
      laborValue: (company) => `em valor de trabalho totalmente carregado preso em trabalho repetível e endereçável na ${company}.`,
      employeePlanningAssumption: "Premissa de empregados para planejamento",
      reportedEmployeeCount: "Número de empregados informado",
      conservativeEstimate: "Estimativa conservadora",
      lowerBoundRange: (range) => `Limite inferior da faixa informada de ${range}.`,
      publicInformationReason: "Com base em informações públicas sobre o porte da empresa encontradas online.",
      sampleEstimateReason: "Premissa de planejamento de exemplo para este relatório demonstrativo.",
      sampleSource: "Relatório de exemplo",
      inactiveReason: "O domínio da empresa foi identificado como inativo; nenhuma estimativa de empregados foi usada.",
      companySizeUnavailable: "Porte da empresa indisponível",
      notEstimated: "Não estimado",
      source: "Fonte",
      confidence: "Confiança",
      confidenceHigh: "Alta",
      confidenceMedium: "Média",
      confidenceNone: "Indisponível",
      observed: "Observado",
      addressableRoles: "Funções endereçáveis",
      recoverableWeek: "Recuperável / semana",
      hoursShort: "hrs",
      hoursYear: "hrs/ano",
      annualRecoverable: "Recuperável / ano",
      fteEquivalent: "Equivalente FTE",
      gap: "Lacuna competitiva de 5 anos",
      gapDescription: "Valor acumulado perdido se concorrentes implantarem IA antes de você.",
      workforceScore: "Pontuação da força de trabalho",
      executiveSummary: "Resumo executivo",
      hiddenTitle: "O que está escondido nas suas operações",
      hiddenSubtitle: "Trabalho manual de alto volume identificado por sinais da empresa e padrões comuns.",
      trapped: "Preso",
      methodology:
        "Metodologia: números direcionais combinam contexto da empresa, padrões comuns de trabalho endereçável e premissas conservadoras de valor do trabalho. Use como estimativa para planejar o primeiro piloto.",
    },
    employeeReport: {
      personalTitle: "Relatório pessoal de prontidão para IA",
      actionPlanTitle: "Plano de ação pronto para IA",
      skillsSummary: (skills, tasks, isLeader, band) =>
        `${skills} habilidades analisadas · ${tasks} ${isLeader ? "responsabilidades geradas" : "tarefas geradas"} · faixa de prontidão: ${band}`,
      hoursRecovered: "Horas recuperadas / semana",
      hoursRecoveredSub: "De trabalho automatizado e aumentado",
      readinessScore: "Pontuação de prontidão para IA",
      readinessSub: "Confiança no nível da tarefa",
      pathway: "Trilha recomendada",
      pathwayValue: "3 trilhas",
      pathwaySub: "Personalizado",
      automate: "Automatizar",
      augment: "Aumentar",
      own: "ASSUMIR",
      breakdown: "Detalhamento tarefa por tarefa",
      breakdownLeader: "Horas por mês em trabalho de liderança, antes vs. depois da IA.",
      breakdownEmployee: "Horas por mês, antes vs. depois da IA.",
      tools: "Ferramentas de IA recomendadas",
      aiDoes: "A IA faz:",
      ctaLabel: "Seu roteiro de habilidades está pronto",
      ctaTitleLeader: "Transforme isso no seu fluxo de liderança com IA.",
      ctaTitleEmployee: "Transforme isso no seu fluxo diário com IA.",
      customizePrefix: "Personalize",
      more: (count) => `(e mais ${count})`,
      reclaim: (hours, fte) => `Recupere ${hours}h/mês - isso equivale a ${fte} FTE da sua semana`,
      keepOwning: (count, isLeader) => `Continue assumindo ${count} ${isLeader ? "responsabilidades que só você pode liderar" : "tarefas que só você pode fazer"}`,
      usePilot: "Usar isto como meu primeiro piloto",
      pdfTitle: (workArea) => `${workArea} Plano de ação pronto para IA`,
    },
    guardrails: {
      eyebrow: "Primeiro piloto",
      title: "Adicione controles e salve",
      selectedPilot: "Piloto selecionado",
      estimate: (hours, threshold) =>
        `${hours == null ? "Não estimado" : `${hours} hrs/semana estimadas`} · limite ${threshold}%`,
      inScope: "Dentro do escopo",
      outOfScope: "Fora do escopo",
      viewPlan: "Ver Plano de ação pronto para IA",
    },
  },
};
