// "pt" represents Brazilian Portuguese (pt-BR) in the MVP language selector.
export const languages = ["en", "es", "pt"] as const;

export type Language = (typeof languages)[number];

export type FrameworkKey = "inspire" | "learn" | "adapt" | "implement";

export type RoutePath = "/" | "/opportunity" | "/inspire" | "/learn" | "/adapt" | "/implement";

export type NavItem = {
  key: "overview" | "opportunity" | FrameworkKey;
  label: string;
  href: RoutePath;
};

export type FrameworkSummary = {
  key: FrameworkKey;
  tab: string;
  route: RoutePath;
  title: string;
  question: string;
  audience: string;
  summary: string;
  cta: string;
};

export type PageSection = {
  title: string;
  body: string;
  items?: string[];
};

export type DemoCopy = {
  label: string;
  emptyState: string;
  submit: string;
  resultTitle: string;
  commentsLabel?: string;
  notes?: string[];
  nextStep?: string;
};

export type PortalContent = {
  languageName: string;
  nav: NavItem[];
  brand: {
    name: string;
    lockup: string;
    tagline: string;
    promise: string;
    jfkLine: string;
    giBillLine: string;
  };
  overview: {
    eyebrow: string;
    title: string;
    intro: string;
    arc: string[];
    primaryCta: string;
    secondaryCta: string;
    metricNote: string;
    launcher: {
      companyUrlLabel: string;
      companyUrlPlaceholder: string;
      validationError: string;
      cta: string;
    };
  };
  frameworks: Record<FrameworkKey, FrameworkSummary>;
  pages: Record<
    FrameworkKey,
    {
      hero: string;
      sections: PageSection[];
      demo: DemoCopy;
    }
  >;
  forms: {
    ikigai: {
      love: string;
      skill: string;
      need: string;
      paid: string;
      purposeTemplate: string;
    };
    seminar: {
      name: string;
      organization: string;
      role: string;
      city: string;
      confirmation: string;
    };
    adaptationPlan: {
      role: string;
      automate: string;
      augment: string;
      own: string;
      become: string;
      summaryTemplate: string;
    };
    audit: {
      companyUrl: string;
      workflowName: string;
      humanGate: string;
      mockFinding: string;
      workflowTemplate: string;
    };
  };
  agents: {
    installer: string;
    educator: string;
  };
  ui: {
    commentsLabel: string;
    demoContentTitle: string;
    languageLabel: string;
    homeAriaLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    planLabel: string;
    watchDemoLabel: string;
    viewPlanCta: string;
    agents: { installerTitle: string; educatorTitle: string };
    learnDemo: {
      tracks: Record<"worker" | "professor" | "employer", { label: string; resources: string[] }>;
    };
  };
};

const sharedRoutes = {
  overview: "/",
  opportunity: "/opportunity",
  inspire: "/inspire",
  learn: "/learn",
  adapt: "/adapt",
  implement: "/implement",
} as const;

export const portalContent: Record<Language, PortalContent> = {
  en: {
    languageName: "English",
    nav: [
      { key: "overview", label: "Overview", href: sharedRoutes.overview },
      { key: "inspire", label: "Imagine", href: sharedRoutes.inspire },
      { key: "learn", label: "Learn", href: sharedRoutes.learn },
      { key: "adapt", label: "Seminar", href: sharedRoutes.adapt },
      { key: "implement", label: "Implement", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Find where AI can save time\nwithout replacing people.",
      tagline: "Imagine -> Learn -> Seminar -> Implement",
      promise: "We don't fire. We upgrade.",
      jfkLine: "Ask not what AI can do for you. Ask what you can do with AI.",
      giBillLine: "The G.I. Bill for the AI Age.",
    },
    overview: {
      eyebrow: "AI workforce upgrade portal",
      title: "Choose the path that fits where you are today.",
      intro:
        "Use UpSkill USA to find practical paths to learn AI, find business opportunities, redesign work, and launch human-reviewed pilots.",
      arc: ["Find your direction", "Build practical AI skills", "Prepare people and teams", "Find a first AI pilot"],
      primaryCta: "Map Your AI Opportunity",
      secondaryCta: "Explore the Four Steps",
      metricNote: "Source-note: use the DOCX-corrected figure of 22% of jobs disrupted by 2030.",
      launcher: {
        companyUrlLabel: "Company URL",
        companyUrlPlaceholder: "yourcompany.com",
        validationError: "Enter a valid company URL.",
        cta: "Get your free AI Opportunity Report",
      },
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "STEP 1",
        route: "/inspire",
        title: "Imagine",
        question: "What's your gift?",
        audience: "Students, workers, and anyone who needs a reason to care before learning.",
        summary:
          "A guided IKIGAI flow helps visitors connect what they love, what they do well, what the world needs, and what can become paid work.",
        cta: "Find your gift",
      },
      learn: {
        key: "learn",
        tab: "STEP 2",
        route: "/learn",
        title: "Education",
        question: "How do you learn?",
        audience: "Community colleges, professors, workers, employers, and the public.",
        summary: "",
        cta: "Learn AI for free",
      },
      adapt: {
        key: "adapt",
        tab: "STEP 3",
        route: "/adapt",
        title: "AI-Ready Seminar",
        question: "Build Your AI-Ready Action Plan",
        audience: "Workers, employees, business leaders, and owners preparing for practical AI adoption.",
        summary:
          "A focused seminar preview helps each participant choose a track, name the work to upgrade, and prepare a useful AI-Ready Action Plan artifact.",
        cta: "Build your action plan",
      },
      implement: {
        key: "implement",
        tab: "STEP 4",
        route: "/implement",
        title: "Implementation",
        question: "How do you innovate?",
        audience: "Companies ready to upgrade work from the bottom up.",
        summary:
          "Employees design workflows in their own domains, add human audit gates, and prove value through demo hours-saved and ROI summaries.",
        cta: "Implement at business",
      },
    },
    pages: {
      inspire: {
        hero:
          'A guided IKIGAI (Japanese concept of "reason for being"). The intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for.',
        sections: [],
        demo: {
          label: "IKIGAI demo",
          emptyState: "Complete the four prompts to draft a purpose statement.",
          submit: "Draft purpose",
          resultTitle: "Draft purpose statement",
          notes: [
            "IKIGAI self-discovery: Four prompts produce a short purpose statement grounded in love, skill, world need, and paid work.",
            "Dignity reframe: AI can extend reach, but empathy, judgment, care, and creativity remain human strengths.",
          ],
          nextStep: "NEXT STEP: Once visitors see their purpose, send them to Learn.",
        },
      },
      learn: {
        hero:
          "Education is the engine: colleges train deeply, public resources reach widely, and role preparation makes live learning faster.",
        sections: [],
        demo: {
          label: "Learning hub demo",
          emptyState: "Choose a track to preview suggested resources.",
          submit: "Preview resources",
          resultTitle: "Suggested learning path",
          notes: [
            "Community college channel: The AI Institute trains professors, who carry practical AI education through community colleges and credential pathways. Includes: 20-hour professor program, AI Agent classes, portable micro-credentials.",
            "Public channel: A free YouTube learning library and curated tool guides make the curriculum available beyond enrolled students.",
          ],
          nextStep:
            "NEXT STEP: Role-specific GPTs can be prepared before seminars so learners begin with a co-pilot shaped around their work.",
        },
      },
      adapt: {
        hero:
            "Turn learning into a personal-ready or company-ready AI plan for the seminar room.\nWe don't fire. We upgrade.",
        sections: [
          {
            title: "Overview",
            body: "Start with the shared goal: use AI to create more value while keeping people central to the work.",
            items: ["Pick a track", "Name one real workflow", "Prepare a practical action plan"],
          },
          {
            title: "Separate Tracks",
            body: "Workers prepare a Manifest of Saved Hours. Business leaders prepare a Company AI-Ready Action Plan.",
            items: ["Worker / Employee", "Business Leader / Owner"],
          },
          {
            title: "Practice",
            body: "Use one workflow or business problem to estimate value, identify proof, and decide what human judgment must stay in the loop.",
            items: ["Estimate saved time", "Capture evidence", "Keep human review"],
          },
          {
            title: "Reunion",
            body: "Bring both tracks back together around next actions that protect dignity, create value, and move toward implementation.",
            items: ["Share the plan", "Choose a pilot", "Continue to Implement"],
          },
        ],
        demo: {
          label: "AI-Ready Seminar prep",
          emptyState: "Choose a seminar track and add one workflow or business problem to preview your AI-Ready Action Plan.",
          submit: "Build action plan preview",
          resultTitle: "Draft AI-Ready Action Plan",
          notes: [
            "Worker track: Prepare a Manifest of Saved Hours that turns weekly time saved into a practical value story.",
            "Business track: Prepare a Company AI-Ready Action Plan that names the workflow, people affected, estimated value, and next pilot.",
          ],
          nextStep:
            "NEXT STEP: Save your Step 3 result to the AI-Ready Action Plan, then continue to Implement.",
        },
      },
      implement: {
        hero:
          "Turn AI opportunity into a first pilot that leaders can value and employees can review.",
        sections: [],
        demo: {
          label: "AI Implementation Lab",
          emptyState: "Choose Business Leader for a company AI Opportunity Report or Employee for a Task Transformation Report.",
          submit: "Generate report",
          resultTitle: "Implementation pilot summary",
          notes: [
            "Business Leader path: Enter a company URL and contact email to see a company AI Opportunity Report and first pilot options.",
            "Employee path: Choose a work area and tasks to see what AI can automate, augment, or leave under human ownership.",
            "Step 4 reports are saved locally to the AI-Ready Action Plan.",
          ],
        },
      },
    },
    forms: {
      ikigai: {
        love: "What do you love?",
        skill: "What are you good at?",
        need: "What does the world need?",
        paid: "What can you be paid for?",
        purposeTemplate:
          "I can use AI to connect {love} and {skill} with {need}, shaping work that can grow into {paid}.",
      },
      seminar: {
        name: "Participant name",
        organization: "Team or organization",
        role: "Seminar role",
        city: "City or community",
        confirmation: "Demo note: your seminar prep details are saved locally for this preview only.",
      },
      adaptationPlan: {
        role: "Current role",
        automate: "What should your action plan automate?",
        augment: "What should your action plan augment?",
        own: "What will you own with human judgment?",
        become: "What will you become ready to do?",
        summaryTemplate:
          "As {role}, I will automate {automate}, augment {augment}, own {own}, and grow toward {become}.",
      },
      audit: {
        companyUrl: "Company URL",
        workflowName: "Workflow name",
        humanGate: "Human review gate",
        mockFinding: "Demo finding: recoverable productivity appears in intake, reporting, and follow-up workflows.",
        workflowTemplate:
          "Demo workflow: {workflowName} routes AI-assisted work through {humanGate} before any final decision.",
      },
    },
    agents: {
      installer: "Installer Agents help companies install AI and run bottom-up implementation.",
      educator: "Educator Agents deliver the curriculum, AI Institute training, and Saturday sessions.",
    },
    ui: {
      commentsLabel: "Comments:",
      demoContentTitle: "Demo content",
      languageLabel: "Language",
      homeAriaLabel: "UpSkill USA home",
      openMenuLabel: "Open menu",
      closeMenuLabel: "Close menu",
      planLabel: "AI-Ready Action Plan",
      watchDemoLabel: "Watch Demo",
      viewPlanCta: "View Your AI-Ready Action Plan",
      agents: {
        installerTitle: "Installer Agents",
        educatorTitle: "Educator Agents",
      },
      learnDemo: {
        tracks: {
          worker: {
            label: "Worker",
            resources: ["AI basics", "Prompt practice", "Role-specific workflow ideas"],
          },
          professor: {
            label: "Professor",
            resources: ["AI Institute primer", "Classroom use cases", "Assessment patterns"],
          },
          employer: {
            label: "Employer",
            resources: ["Team readiness map", "Custom GPT preparation", "Seminar sponsorship"],
          },
        },
      },
    },
  },
  es: {
    languageName: "Español",
    nav: [
      { key: "overview", label: "Resumen", href: sharedRoutes.overview },
      { key: "inspire", label: "Imaginar", href: sharedRoutes.inspire },
      { key: "learn", label: "Aprender", href: sharedRoutes.learn },
      { key: "adapt", label: "Seminario", href: sharedRoutes.adapt },
      { key: "implement", label: "Implementar", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Mejora el trabajo. Conserva a las personas.",
      tagline: "Imaginar -> Aprender -> Seminario -> Implementar",
      promise: "No despedimos. Mejoramos capacidades.",
      jfkLine: "No preguntes qué puede hacer la IA por ti. Pregunta qué puedes hacer con la IA.",
      giBillLine: "El G.I. Bill para la era de la IA.",
    },
    overview: {
      eyebrow: "Portal para actualizar la fuerza laboral con IA",
      title: "Cuatro pasos para crear valor sin dejar atrás a los empleados.",
      intro:
        "Un portal práctico para líderes empresariales que necesitan encontrar oportunidades listas para IA, preparar equipos y lanzar flujos revisados por humanos que generen valor medible.",
      arc: ["Encuentra tu don", "Aprende IA gratis", "Crea tu plan de acción listo para IA", "Implementa en la empresa"],
      primaryCta: "Mapear oportunidad de IA",
      secondaryCta: "Explorar los cuatro pasos",
      metricNote: "Nota de fuente: usar la cifra corregida del DOCX de 22% de empleos afectados para 2030.",
      launcher: {
        companyUrlLabel: "URL de la empresa",
        companyUrlPlaceholder: "tuempresa.com",
        validationError: "Ingresa una URL de empresa válida.",
        cta: "Obtén gratis tu reporte de oportunidad con IA",
      },
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "PASO 1",
        route: "/inspire",
        title: "Imaginar",
        question: "¿Cuál es tu don?",
        audience: "Estudiantes, trabajadores y cualquier persona que necesite una razón para interesarse antes de aprender.",
        summary:
          "Un flujo IKIGAI conecta lo que amas, lo que haces bien, lo que el mundo necesita y lo que puede convertirse en trabajo remunerado.",
        cta: "Descubrir tu don",
      },
      learn: {
        key: "learn",
        tab: "PASO 2",
        route: "/learn",
        title: "Educación",
        question: "¿Cómo aprendes?",
        audience: "Community colleges, profesores, trabajadores, empleadores y público general.",
        summary:
          "Un canal universitario formal y un canal público gratuito hacen accesible el aprendizaje de IA, con herramientas listas por rol y preparación de GPTs personalizados.",
        cta: "Aprende IA gratis",
      },
      adapt: {
        key: "adapt",
        tab: "PASO 3",
        route: "/adapt",
        title: "Seminario listo para IA",
        question: "Crea tu plan de acción listo para IA",
        audience: "Trabajadores, empleados, líderes empresariales y dueños que se preparan para adoptar IA de forma práctica.",
        summary:
          "Una vista previa enfocada del seminario ayuda a cada participante a elegir una ruta, nombrar el trabajo que quiere mejorar y preparar un artefacto útil del plan de acción listo para IA.",
        cta: "Crear tu plan de acción",
      },
      implement: {
        key: "implement",
        tab: "PASO 4",
        route: "/implement",
        title: "Implementación",
        question: "¿Cómo innovas?",
        audience: "Empresas listas para mejorar el trabajo desde abajo hacia arriba.",
        summary:
          "Los empleados diseñan flujos de trabajo en sus propios dominios, agregan puntos de auditoría humana y demuestran valor con horas ahorradas en la demo y resúmenes de ROI.",
        cta: "Implementar en la empresa",
      },
    },
    pages: {
      inspire: {
        hero:
          "La puerta de entrada es un espejo: antes de aprender una herramienta, cada persona nombra el valor humano que aporta.",
        sections: [],
        demo: {
          label: "Demo IKIGAI",
          emptyState: "Completa las cuatro preguntas para crear un borrador de propósito.",
          submit: "Crear propósito",
          resultTitle: "Borrador de propósito",
          commentsLabel: "Comentarios:",
          notes: [
            "Autodescubrimiento IKIGAI: Cuatro preguntas crean una declaración breve de propósito basada en amor, habilidad, necesidad del mundo y trabajo remunerado.",
            "Dignidad: La IA puede ampliar el alcance, pero empatía, juicio, cuidado y creatividad siguen siendo fortalezas humanas.",
          ],
          nextStep: "SIGUIENTE PASO: Cuando la persona ve su propósito, el portal la guía hacia Aprender.",
        },
      },
      learn: {
        hero:
          "La educación es el motor: las universidades entrenan en profundidad, los recursos públicos llegan ampliamente y la preparación por rol acelera el aprendizaje.",
        sections: [],
        demo: {
          label: "Demo de aprendizaje",
          emptyState: "Elige una ruta para ver recursos sugeridos.",
          submit: "Ver recursos",
          resultTitle: "Ruta sugerida",
          commentsLabel: "Comentarios:",
          notes: [
            "Canal de community colleges: El AI Institute capacita a profesores, quienes llevan educación práctica en IA a los community colleges y a rutas de credenciales. Incluye: programa de 20 horas para profesores, clases de AI Agent y microcredenciales portátiles.",
            "Canal público: Una biblioteca gratuita de aprendizaje en YouTube y guías seleccionadas de herramientas hacen que el currículo esté disponible más allá de los estudiantes inscritos.",
          ],
          nextStep:
            "SIGUIENTE PASO: GPTs por rol pueden prepararse antes de los seminarios para que cada persona comience con un copiloto de su trabajo.",
        },
      },
      adapt: {
        hero:
          "El Paso 3 convierte el aprendizaje en un plan listo para trabajadores o empresas dentro del seminario. No despedimos. Mejoramos capacidades.",
        sections: [
          {
            title: "Resumen",
            body: "Empieza con la meta compartida: usar IA para crear más valor mientras las personas siguen en el centro del trabajo.",
            items: ["Elegir una ruta", "Nombrar un flujo real", "Preparar un plan de acción práctico"],
          },
          {
            title: "Rutas separadas",
            body: "Los trabajadores preparan un Manifiesto de Horas Ahorradas. Los líderes preparan un Plan de Acción de Empresa Listo para IA.",
            items: ["Trabajador / empleado", "Líder empresarial / dueño"],
          },
          {
            title: "Práctica",
            body: "Usa un flujo o problema de negocio para estimar valor, identificar evidencia y decidir qué juicio humano debe seguir en el proceso.",
            items: ["Estimar tiempo ahorrado", "Capturar evidencia", "Mantener revisión humana"],
          },
          {
            title: "Reunión",
            body: "Reúne ambas rutas alrededor de próximas acciones que protegen la dignidad, crean valor y avanzan hacia la implementación.",
            items: ["Compartir el plan", "Elegir un piloto", "Continuar a Implementar"],
          },
        ],
        demo: {
          label: "Preparación del seminario listo para IA",
          emptyState: "Elige una ruta del seminario y agrega un flujo o problema de negocio para ver tu plan de acción listo para IA.",
          submit: "Crear vista previa del plan",
          resultTitle: "Borrador del plan de acción listo para IA",
          commentsLabel: "Comentarios:",
          notes: [
            "Ruta de trabajador: Prepara un Manifiesto de Horas Ahorradas que convierte tiempo semanal ahorrado en una historia práctica de valor.",
            "Ruta de empresa: Prepara un Plan de Acción de Empresa Listo para IA que nombra el flujo, las personas afectadas, el valor estimado y el próximo piloto.",
          ],
          nextStep:
            "SIGUIENTE PASO: Guarda tu resultado del Paso 3 en el plan de acción listo para IA y continúa a Implementar.",
        },
      },
      implement: {
        hero:
          "Convierte la oportunidad de IA en un primer piloto que líderes puedan valorar y empleados puedan revisar.",
        sections: [],
        demo: {
          label: "Laboratorio de implementación de IA",
          emptyState: "Elige Líder de empresa para un reporte de oportunidad de IA de la empresa o Empleado para un reporte de transformación de tareas.",
          submit: "Generar reporte",
          resultTitle: "Resumen del piloto de implementación",
          commentsLabel: "Comentarios:",
          notes: [
            "Ruta de líderes: Ingresa una URL de empresa y un email de contacto para ver un reporte de oportunidad de IA de la empresa y opciones de primer piloto.",
            "Ruta de empleados: Elige un área y tareas para ver qué puede automatizar IA, qué puede aumentar y qué debe quedar bajo juicio humano.",
            "Los reportes del Paso 4 se guardan localmente en el plan de acción listo para IA.",
          ],
        },
      },
    },
    forms: {
      ikigai: {
        love: "¿Qué amas?",
        skill: "¿En qué eres bueno?",
        need: "¿Qué necesita el mundo?",
        paid: "¿Por qué trabajo te pueden pagar?",
        purposeTemplate:
          "Puedo usar IA para conectar {love} y {skill} con {need}, creando trabajo que puede crecer hacia {paid}.",
      },
      seminar: {
        name: "Nombre del participante",
        organization: "Equipo u organización",
        role: "Rol en el seminario",
        city: "Ciudad o comunidad",
        confirmation: "Nota demo: tus datos de preparación quedan guardados localmente solo para esta vista previa.",
      },
      adaptationPlan: {
        role: "Rol actual",
        automate: "¿Qué debería automatizar tu plan de acción?",
        augment: "¿Qué debería aumentar tu plan de acción?",
        own: "¿Qué asumirás con juicio humano?",
        become: "¿Para qué estarás listo?",
        summaryTemplate:
          "Como {role}, automatizaré {automate}, aumentaré {augment}, me haré responsable de {own} y creceré hacia {become}.",
      },
      audit: {
        companyUrl: "URL de empresa",
        workflowName: "Nombre del flujo",
        humanGate: "Revisión humana",
        mockFinding: "Hallazgo demo: hay productividad recuperable en entrada, reportes y seguimiento.",
        workflowTemplate:
          "Flujo demo: {workflowName} pasa trabajo asistido por IA por {humanGate} antes de cualquier decisión final.",
      },
    },
    agents: {
      installer: "Los agentes de instalación ayudan a las empresas a instalar IA y ejecutar una implementación desde abajo.",
      educator: "Los agentes educadores imparten el currículo, la capacitación del AI Institute y las sesiones sabatinas.",
    },
    ui: {
      commentsLabel: "Comentarios:",
      demoContentTitle: "Contenido de demo",
      languageLabel: "Idioma",
      homeAriaLabel: "Inicio de UpSkill USA",
      openMenuLabel: "Abrir menú",
      closeMenuLabel: "Cerrar menú",
      planLabel: "Plan de acción listo para IA",
      watchDemoLabel: "Ver demo",
      viewPlanCta: "Ver tu plan de acción listo para IA",
      agents: {
        installerTitle: "Agentes de instalación",
        educatorTitle: "Agentes educadores",
      },
      learnDemo: {
        tracks: {
          worker: {
            label: "Trabajador",
            resources: ["Conceptos básicos de IA", "Práctica de prompts", "Ideas de flujos de trabajo por rol"],
          },
          professor: {
            label: "Profesor",
            resources: ["Introducción al AI Institute", "Casos de uso en el aula", "Patrones de evaluación"],
          },
          employer: {
            label: "Empleador",
            resources: ["Mapa de preparación del equipo", "Preparación de GPT personalizado", "Patrocinio de seminarios"],
          },
        },
      },
    },
  },
  pt: {
    languageName: "Português",
    nav: [
      { key: "overview", label: "Visão geral", href: sharedRoutes.overview },
      { key: "inspire", label: "Imaginar", href: sharedRoutes.inspire },
      { key: "learn", label: "Aprender", href: sharedRoutes.learn },
      { key: "adapt", label: "Seminário", href: sharedRoutes.adapt },
      { key: "implement", label: "Implementar", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Atualize o trabalho. Mantenha as pessoas.",
      tagline: "Imaginar -> Aprender -> Seminário -> Implementar",
      promise: "Não demitimos. Requalificamos.",
      jfkLine: "Não pergunte o que a IA pode fazer por você. Pergunte o que você pode fazer com a IA.",
      giBillLine: "O G.I. Bill para a era da IA.",
    },
    overview: {
      eyebrow: "Portal de atualização da força de trabalho com IA",
      title: "Quatro passos para criar valor sem deixar os funcionários para trás.",
      intro:
        "Um portal prático para líderes empresariais identificarem oportunidades prontas para IA, prepararem equipes e lançarem fluxos revisados por humanos que criam valor mensurável.",
      arc: ["Encontre seu dom", "Aprenda IA de graça", "Crie seu plano de ação pronto para IA", "Implemente na empresa"],
      primaryCta: "Mapear oportunidade de IA",
      secondaryCta: "Explorar os quatro passos",
      metricNote: "Nota de fonte: use o número corrigido do DOCX de 22% dos empregos impactados até 2030.",
      launcher: {
        companyUrlLabel: "URL da empresa",
        companyUrlPlaceholder: "suaempresa.com",
        validationError: "Insira uma URL válida da empresa.",
        cta: "Obtenha gratuitamente seu relatório de oportunidade com IA",
      },
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "PASSO 1",
        route: "/inspire",
        title: "Imaginar",
        question: "Qual é o seu dom?",
        audience: "Estudantes, trabalhadores e qualquer pessoa que precise de um motivo para se importar antes de aprender.",
        summary:
          "Um fluxo IKIGAI conecta o que você ama, o que faz bem, o que o mundo precisa e o que pode se tornar trabalho remunerado.",
        cta: "Descobrir seu dom",
      },
      learn: {
        key: "learn",
        tab: "PASSO 2",
        route: "/learn",
        title: "Educação",
        question: "Como você aprende?",
        audience: "Community colleges, professores, trabalhadores, empregadores e o público.",
        summary:
          "Um canal formal de faculdades e um canal público gratuito tornam o aprendizado de IA acessível, com ferramentas prontas por função e preparação de GPTs personalizados.",
        cta: "Aprenda IA de graça",
      },
      adapt: {
        key: "adapt",
        tab: "PASSO 3",
        route: "/adapt",
        title: "Seminário pronto para IA",
        question: "Crie seu plano de ação pronto para IA",
        audience: "Trabalhadores, funcionários, líderes empresariais e donos se preparando para adotar IA de forma prática.",
        summary:
          "Uma prévia focada do seminário ajuda cada participante a escolher uma trilha, nomear o trabalho que quer melhorar e preparar um artefato útil do plano de ação pronto para IA.",
        cta: "Criar seu plano de ação",
      },
      implement: {
        key: "implement",
        tab: "PASSO 4",
        route: "/implement",
        title: "Implementação",
        question: "Como você inova?",
        audience: "Empresas prontas para atualizar o trabalho de baixo para cima.",
        summary:
          "Funcionários desenham fluxos de trabalho em seus próprios domínios, adicionam pontos de auditoria humana e comprovam valor com horas economizadas na demo e resumos de ROI.",
        cta: "Implementar na empresa",
      },
    },
    pages: {
      inspire: {
        hero:
          "A porta de entrada é um espelho: antes de aprender uma ferramenta, cada pessoa nomeia o valor humano que traz.",
        sections: [],
        demo: {
          label: "Demo IKIGAI",
          emptyState: "Complete as quatro perguntas para criar um rascunho de propósito.",
          submit: "Criar propósito",
          resultTitle: "Rascunho de propósito",
          commentsLabel: "Comentários:",
          notes: [
            "Autodescoberta IKIGAI: Quatro perguntas geram uma declaração curta de propósito baseada em amor, habilidade, necessidade do mundo e trabalho remunerado.",
            "Dignidade: A IA amplia alcance, mas empatia, julgamento, cuidado e criatividade continuam sendo forças humanas.",
          ],
          nextStep: "PRÓXIMO PASSO: Quando a pessoa enxerga seu propósito, o portal a guia para Aprender.",
        },
      },
      learn: {
        hero:
          "A educação é o motor: faculdades treinam em profundidade, recursos públicos chegam amplamente e preparo por função acelera o aprendizado.",
        sections: [],
        demo: {
          label: "Demo de aprendizagem",
          emptyState: "Escolha uma trilha para visualizar recursos sugeridos.",
          submit: "Ver recursos",
          resultTitle: "Trilha sugerida",
          commentsLabel: "Comentários:",
          notes: [
            "Canal de community colleges: O AI Institute treina professores, que levam educação prática em IA por meio de community colleges e trilhas de credenciais. Inclui: programa de 20 horas para professores, aulas de AI Agent e microcredenciais portáteis.",
            "Canal público: Uma biblioteca gratuita de aprendizagem no YouTube e guias selecionados de ferramentas tornam o currículo disponível além dos alunos matriculados.",
          ],
          nextStep:
            "PRÓXIMO PASSO: GPTs por função podem ser preparados antes dos seminários para que cada pessoa comece com um copiloto do seu trabalho.",
        },
      },
      adapt: {
        hero:
          "O Passo 3 transforma aprendizado em um plano pronto para trabalhadores ou empresas dentro do seminário. Não demitimos. Requalificamos.",
        sections: [
          {
            title: "Visão geral",
            body: "Comece com a meta compartilhada: usar IA para criar mais valor enquanto as pessoas continuam no centro do trabalho.",
            items: ["Escolher uma trilha", "Nomear um fluxo real", "Preparar um plano de ação prático"],
          },
          {
            title: "Trilhas separadas",
            body: "Trabalhadores preparam um Manifesto de Horas Economizadas. Líderes preparam um Plano de Ação da Empresa Pronto para IA.",
            items: ["Trabalhador / funcionário", "Líder empresarial / dono"],
          },
          {
            title: "Prática",
            body: "Use um fluxo ou problema de negócio para estimar valor, identificar evidências e decidir qual julgamento humano deve continuar no processo.",
            items: ["Estimar tempo economizado", "Capturar evidências", "Manter revisão humana"],
          },
          {
            title: "Reunião",
            body: "Reúna as duas trilhas em torno de próximas ações que protegem a dignidade, criam valor e avançam para a implementação.",
            items: ["Compartilhar o plano", "Escolher um piloto", "Continuar para Implementar"],
          },
        ],
        demo: {
          label: "Preparação do seminário pronto para IA",
          emptyState: "Escolha uma trilha do seminário e adicione um fluxo ou problema de negócio para ver seu plano de ação pronto para IA.",
          submit: "Criar prévia do plano",
          resultTitle: "Rascunho do plano de ação pronto para IA",
          commentsLabel: "Comentários:",
          notes: [
            "Trilha de trabalhador: Prepare um Manifesto de Horas Economizadas que transforma tempo semanal economizado em uma história prática de valor.",
            "Trilha de empresa: Prepare um Plano de Ação da Empresa Pronto para IA que nomeia o fluxo, as pessoas afetadas, o valor estimado e o próximo piloto.",
          ],
          nextStep:
            "PRÓXIMO PASSO: Salve o resultado do Passo 3 no plano de ação pronto para IA e continue para Implementar.",
        },
      },
      implement: {
        hero:
          "Transforme a oportunidade de IA em um primeiro piloto que líderes possam valorizar e funcionários possam revisar.",
        sections: [],
        demo: {
          label: "Laboratório de implementação de IA",
          emptyState: "Escolha Líder de empresa para um relatório de oportunidade de IA da empresa ou Funcionário para um relatório de transformação de tarefas.",
          submit: "Gerar relatório",
          resultTitle: "Resumo do piloto de implementação",
          commentsLabel: "Comentários:",
          notes: [
            "Trilha de líderes: Informe uma URL da empresa e um email de contato para ver um relatório de oportunidade de IA da empresa e opções de primeiro piloto.",
            "Trilha de funcionários: Escolha uma área e tarefas para ver o que a IA pode automatizar, ampliar ou deixar sob responsabilidade humana.",
            "Os relatórios do Passo 4 ficam salvos localmente no plano de ação pronto para IA.",
          ],
        },
      },
    },
    forms: {
      ikigai: {
        love: "O que você ama?",
        skill: "No que você é bom?",
        need: "O que o mundo precisa?",
        paid: "Pelo que você pode ser remunerado?",
        purposeTemplate:
          "Posso usar IA para conectar {love} e {skill} com {need}, criando trabalho que pode crescer em direção a {paid}.",
      },
      seminar: {
        name: "Nome do participante",
        organization: "Equipe ou organização",
        role: "Função no seminário",
        city: "Cidade ou comunidade",
        confirmation: "Nota demo: seus dados de preparação ficam salvos localmente apenas para esta prévia.",
      },
      adaptationPlan: {
        role: "Função atual",
        automate: "O que seu plano de ação deve automatizar?",
        augment: "O que seu plano de ação deve ampliar?",
        own: "O que você vai assumir com julgamento humano?",
        become: "Para o que você estará pronto?",
        summaryTemplate:
          "Como {role}, vou automatizar {automate}, ampliar {augment}, me responsabilizar por {own} e crescer em direção a {become}.",
      },
      audit: {
        companyUrl: "URL da empresa",
        workflowName: "Nome do fluxo",
        humanGate: "Revisão humana",
        mockFinding: "Achado demo: produtividade recuperável aparece em entrada, relatórios e acompanhamento.",
        workflowTemplate:
          "Fluxo demo: {workflowName} passa trabalho assistido por IA por {humanGate} antes de qualquer decisão final.",
      },
    },
    agents: {
      installer: "Os agentes de instalação ajudam empresas a instalar IA e executar uma implementação de baixo para cima.",
      educator: "Os agentes educadores conduzem o currículo, a formação do AI Institute e as sessões de sábado.",
    },
    ui: {
      commentsLabel: "Comentários:",
      demoContentTitle: "Conteúdo de demo",
      languageLabel: "Idioma",
      homeAriaLabel: "Início da UpSkill USA",
      openMenuLabel: "Abrir menu",
      closeMenuLabel: "Fechar menu",
      planLabel: "Plano de ação pronto para IA",
      watchDemoLabel: "Ver demo",
      viewPlanCta: "Ver seu plano de ação pronto para IA",
      agents: {
        installerTitle: "Agentes de instalação",
        educatorTitle: "Agentes educadores",
      },
      learnDemo: {
        tracks: {
          worker: {
            label: "Trabalhador",
            resources: ["Conceitos básicos de IA", "Prática de prompts", "Ideias de fluxos de trabalho por função"],
          },
          professor: {
            label: "Professor",
            resources: ["Introdução ao AI Institute", "Casos de uso em sala de aula", "Padrões de avaliação"],
          },
          employer: {
            label: "Empregador",
            resources: ["Mapa de prontidão da equipe", "Preparação de GPT personalizado", "Patrocínio de seminários"],
          },
        },
      },
    },
  },
};

export const defaultLanguage: Language = "en";

export const frameworkOrder: FrameworkKey[] = ["inspire", "learn", "adapt", "implement"];

export function getPortalContent(language: Language = defaultLanguage): PortalContent {
  return portalContent[language];
}
