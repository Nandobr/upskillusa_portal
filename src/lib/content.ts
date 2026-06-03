export const languages = ["en", "es", "pt"] as const;

export type Language = (typeof languages)[number];

export type FrameworkKey = "inspire" | "learn" | "adapt" | "implement";

export type RoutePath = "/" | "/inspire" | "/learn" | "/adapt" | "/implement";

export type NavItem = {
  key: "overview" | FrameworkKey;
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
    agents: { installerTitle: string; educatorTitle: string };
    learnDemo: {
      tracks: Record<"worker" | "professor" | "employer", { label: string; resources: string[] }>;
    };
  };
};

const sharedRoutes = {
  overview: "/",
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
      { key: "inspire", label: "Inspire", href: sharedRoutes.inspire },
      { key: "learn", label: "Learn", href: sharedRoutes.learn },
      { key: "adapt", label: "Adapt", href: sharedRoutes.adapt },
      { key: "implement", label: "Implement", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Upgrade the work. Keep the people.",
      tagline: "Inspire -> Learn -> Adapt -> Implement",
      promise: "We don't fire. We upgrade.",
      jfkLine: "Ask not what AI can do for you. Ask what you can do with AI.",
      giBillLine: "The G.I. Bill for the AI Age.",
    },
    overview: {
      eyebrow: "AI workforce upgrade portal",
      title: "Four steps to create value for your Business without leaving employees behind.",
      intro:
        "A practical portal for business leaders to find AI-ready opportunities, prepare teams, and launch human-reviewed workflows that create measurable value.",
      arc: ["Find your gift", "Learn AI for free", "Build a plan", "Implement at business"],
      primaryCta: "Map Your AI Opportunity",
      secondaryCta: "Explore the Four Steps",
      metricNote: "Source-note: use the DOCX-corrected figure of 22% of jobs disrupted by 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "STEP 1",
        route: "/inspire",
        title: "Inspiration",
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
        summary:
          "A formal college channel and a free public channel make AI learning accessible, supported by role-ready tools and custom GPT preparation.",
        cta: "Learn AI for free",
      },
      adapt: {
        key: "adapt",
        tab: "STEP 3",
        route: "/adapt",
        title: "Adaptation",
        question: "How do you adapt?",
        audience: "Employees, employers, Chambers of Commerce, City Halls, and trained educators.",
        summary:
          "Six-hour Saturday sessions bring people into one room to learn, practice, align, and leave with a practical action plan.",
        cta: "Build a plan",
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
          "The front door is a mirror: before anyone learns a tool, they name the human value they bring.",
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
          "Knowledge becomes change when employees and employers sit together and turn learning into a practical action plan.",
        sections: [],
        demo: {
          label: "Seminar and plan demo",
          emptyState: "Add seminar interest or plan inputs to see a local preview.",
          submit: "Create preview",
          resultTitle: "Draft action plan",
          notes: [
            "Saturday session: A six-hour format: learn the basics, practice with real tools, align around shared change, and define next actions.",
            "Where it happens: Trained educators can deliver sessions through Chambers of Commerce, City Halls, colleges, and employer groups.",
          ],
          nextStep:
            "NEXT STEP: Each participant names what to automate, what to augment, what to own, and what to become.",
        },
      },
      implement: {
        hero:
          "Implementation starts with the person who knows the work: each employee designs the upgrade in their own domain.",
        sections: [],
        demo: {
          label: "Mock implementation demo",
          emptyState: "Enter a company URL or workflow idea to generate demo-only findings.",
          submit: "Generate mock output",
          resultTitle: "Demo workflow summary",
          notes: [
            "Bottom-up process: Audit, invite, build, and prove. The workflow starts with recoverable value and ends with human-reviewed deployment. Includes: audit the opportunity, invite every employee, build with human gates, prove hours saved.",
            "Installer Agents: Installer Agents help businesses install AI, educate teams, and coordinate the four-step implementation process.",
            "Demo boundaries: Audit findings, ROI, and hours-saved values are mock outputs in this MVP.",
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
        name: "Name",
        organization: "Organization",
        role: "Role",
        city: "City",
        confirmation: "Demo confirmation: your interest is recorded locally for this preview only.",
      },
      adaptationPlan: {
        role: "Current role",
        automate: "What should be automated?",
        augment: "What should be augmented?",
        own: "What will you own?",
        become: "What will you become?",
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
      { key: "inspire", label: "Inspirar", href: sharedRoutes.inspire },
      { key: "learn", label: "Aprender", href: sharedRoutes.learn },
      { key: "adapt", label: "Adaptar", href: sharedRoutes.adapt },
      { key: "implement", label: "Implementar", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Mejora el trabajo. Conserva a las personas.",
      tagline: "Inspirar -> Aprender -> Adaptar -> Implementar",
      promise: "No despedimos. Mejoramos capacidades.",
      jfkLine: "No preguntes qué puede hacer la IA por ti. Pregunta qué puedes hacer con la IA.",
      giBillLine: "El G.I. Bill para la era de la IA.",
    },
    overview: {
      eyebrow: "Portal para actualizar la fuerza laboral con IA",
      title: "Cuatro pasos para crear valor para tu empresa sin dejar atrás a los empleados.",
      intro:
        "Un portal práctico para líderes empresariales que necesitan encontrar oportunidades listas para IA, preparar equipos y lanzar flujos revisados por humanos que generen valor medible.",
      arc: ["Encuentra tu don", "Aprende IA gratis", "Crea un plan", "Implementa en la empresa"],
      primaryCta: "Mapear oportunidad de IA",
      secondaryCta: "Explorar los cuatro pasos",
      metricNote: "Nota de fuente: usar la cifra corregida del DOCX de 22% de empleos afectados para 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "PASO 1",
        route: "/inspire",
        title: "Inspiración",
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
        title: "Adaptación",
        question: "¿Cómo te adaptas?",
        audience: "Empleados, empleadores, Cámaras de Comercio, alcaldías y educadores capacitados.",
        summary:
          "Sesiones sabatinas de seis horas reúnen a las personas para aprender, practicar, alinearse y salir con un plan de acción práctico.",
        cta: "Crear un plan",
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
          "El conocimiento cambia la realidad cuando empleados y empleadores se sientan juntos y lo convierten en un plan de acción práctico.",
        sections: [],
        demo: {
          label: "Demo de seminario y plan",
          emptyState: "Agrega interés o datos del plan para ver una vista previa local.",
          submit: "Crear vista previa",
          resultTitle: "Borrador de plan de acción",
          commentsLabel: "Comentarios:",
          notes: [
            "Sesión sabatina: Seis horas para aprender, practicar con herramientas reales, alinear expectativas y definir próximas acciones.",
            "Dónde ocurre: Educadores capacitados pueden facilitar sesiones en Cámaras de Comercio, alcaldías, colleges y grupos de empleadores.",
          ],
          nextStep:
            "SIGUIENTE PASO: Cada participante define qué automatizar, qué aumentar, qué asumir como propio y en qué convertirse.",
        },
      },
      implement: {
        hero:
          "La implementación empieza con quien conoce el trabajo: cada empleado diseña la mejora en su propio dominio.",
        sections: [],
        demo: {
          label: "Demo de implementación simulada",
          emptyState: "Ingresa una URL o idea de flujo para generar hallazgos solo de demo.",
          submit: "Generar demo",
          resultTitle: "Resumen de flujo demo",
          commentsLabel: "Comentarios:",
          notes: [
            "Proceso desde abajo: Auditar, invitar, construir y demostrar. El flujo comienza con valor recuperable y termina con una implementación revisada por humanos. Incluye: auditar la oportunidad, invitar a todos los empleados, construir con puntos de revisión humana y demostrar horas ahorradas.",
            "Agentes de instalación: Los agentes de instalación ayudan a las empresas a instalar IA, educar equipos y coordinar la implementación.",
            "Límites de demo: Hallazgos, ROI y horas ahorradas son resultados simulados en este MVP.",
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
        name: "Nombre",
        organization: "Organización",
        role: "Rol",
        city: "Ciudad",
        confirmation: "Confirmación demo: tu interés queda guardado localmente solo para esta vista previa.",
      },
      adaptationPlan: {
        role: "Rol actual",
        automate: "¿Qué debería automatizarse?",
        augment: "¿Qué debería aumentarse?",
        own: "¿De qué te harás responsable?",
        become: "¿En qué te convertirás?",
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
      { key: "inspire", label: "Inspirar", href: sharedRoutes.inspire },
      { key: "learn", label: "Aprender", href: sharedRoutes.learn },
      { key: "adapt", label: "Adaptar", href: sharedRoutes.adapt },
      { key: "implement", label: "Implementar", href: sharedRoutes.implement },
    ],
    brand: {
      name: "UpSkill USA",
      lockup: "Atualize o trabalho. Mantenha as pessoas.",
      tagline: "Inspirar -> Aprender -> Adaptar -> Implementar",
      promise: "Não demitimos. Requalificamos.",
      jfkLine: "Não pergunte o que a IA pode fazer por você. Pergunte o que você pode fazer com a IA.",
      giBillLine: "O G.I. Bill para a era da IA.",
    },
    overview: {
      eyebrow: "Portal de atualização da força de trabalho com IA",
      title: "Quatro passos para criar valor para sua empresa sem deixar os funcionários para trás.",
      intro:
        "Um portal prático para líderes empresariais identificarem oportunidades prontas para IA, prepararem equipes e lançarem fluxos revisados por humanos que criam valor mensurável.",
      arc: ["Encontre seu dom", "Aprenda IA de graça", "Crie um plano", "Implemente na empresa"],
      primaryCta: "Mapear oportunidade de IA",
      secondaryCta: "Explorar os quatro passos",
      metricNote: "Nota de fonte: use o número corrigido do DOCX de 22% dos empregos impactados até 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "PASSO 1",
        route: "/inspire",
        title: "Inspiração",
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
        title: "Adaptação",
        question: "Como você se adapta?",
        audience: "Funcionários, empregadores, Câmaras de Comércio, prefeituras e educadores treinados.",
        summary:
          "Sessões de sábado com seis horas reúnem pessoas para aprender, praticar, alinhar e sair com um plano de ação prático.",
        cta: "Criar um plano",
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
          "Conhecimento vira mudança quando empregados e empregadores sentam juntos e transformam aprendizado em um plano de ação prático.",
        sections: [],
        demo: {
          label: "Demo de seminário e plano",
          emptyState: "Adicione interesse ou dados do plano para ver uma prévia local.",
          submit: "Criar prévia",
          resultTitle: "Rascunho do plano de ação",
          commentsLabel: "Comentários:",
          notes: [
            "Sessão de sábado: Seis horas para aprender, praticar com ferramentas reais, alinhar expectativas e definir próximas ações.",
            "Onde acontece: Educadores treinados podem facilitar sessões em Câmaras de Comércio, prefeituras, colleges e grupos de empregadores.",
          ],
          nextStep:
            "PRÓXIMO PASSO: Cada participante define o que automatizar, o que ampliar, o que assumir como seu e no que se tornar.",
        },
      },
      implement: {
        hero:
          "A implementação começa com quem conhece o trabalho: cada funcionário desenha a melhoria em seu próprio domínio.",
        sections: [],
        demo: {
          label: "Demo de implementação simulada",
          emptyState: "Insira uma URL ou ideia de fluxo para gerar achados apenas de demo.",
          submit: "Gerar demo",
          resultTitle: "Resumo de fluxo demo",
          commentsLabel: "Comentários:",
          notes: [
            "Processo de baixo para cima: Auditar, convidar, construir e comprovar. O fluxo começa com valor recuperável e termina com uma implantação revisada por humanos. Inclui: auditar a oportunidade, convidar todos os funcionários, construir com pontos de revisão humana e comprovar horas economizadas.",
            "Agentes de instalação: Os agentes de instalação ajudam empresas a instalar IA, educar equipes e coordenar a implementação.",
            "Limites de demo: Achados, ROI e horas economizadas são resultados simulados neste MVP.",
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
        name: "Nome",
        organization: "Organização",
        role: "Função",
        city: "Cidade",
        confirmation: "Confirmação demo: seu interesse fica salvo localmente apenas para esta prévia.",
      },
      adaptationPlan: {
        role: "Função atual",
        automate: "O que deve ser automatizado?",
        augment: "O que deve ser ampliado?",
        own: "Pelo que você vai se responsabilizar?",
        become: "No que você vai se tornar?",
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
