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
    fiveYearPlan: {
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
      lockup: "One Portal. Four Frameworks.",
      tagline: "Gift -> Learn -> Adapt -> Innovate",
      promise: "We don't fire. We upgrade.",
      jfkLine: "Ask not what AI can do for you. Ask what you can do with AI.",
      giBillLine: "The G.I. Bill for the AI Age.",
    },
    overview: {
      eyebrow: "Public MVP portal",
      title: "One sequence for workers, companies, and the country.",
      intro:
        "UpSkill USA turns AI anxiety into a practical four-step journey: discover your gift, learn AI for free, adapt with a five-year plan, and implement bottom-up workflows that keep people in the loop.",
      arc: ["Find your gift", "Learn AI", "Build a plan", "Upgrade the work"],
      primaryCta: "Start with Inspire",
      secondaryCta: "Explore the framework",
      metricNote: "Source-note: use the DOCX-corrected figure of 22% of jobs disrupted by 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "Tab 1",
        route: "/inspire",
        title: "Inspiration & IKIGAI",
        question: "What's your gift?",
        audience: "Students, workers, and anyone who needs a reason to care before learning.",
        summary:
          "A guided IKIGAI flow helps visitors connect what they love, what they do well, what the world needs, and what can become paid work.",
        cta: "Discover your gift",
      },
      learn: {
        key: "learn",
        tab: "Tab 2",
        route: "/learn",
        title: "Education for Everybody",
        question: "How do you learn?",
        audience: "Community colleges, professors, workers, employers, and the public.",
        summary:
          "A formal college channel and a free public channel make AI learning accessible, supported by role-ready tools and custom GPT preparation.",
        cta: "Open the learning hub",
      },
      adapt: {
        key: "adapt",
        tab: "Tab 3",
        route: "/adapt",
        title: "Seminars & Events",
        question: "How do you adapt?",
        audience: "Employees, employers, Chambers of Commerce, City Halls, and trained educators.",
        summary:
          "Six-hour Saturday sessions bring people into one room to learn, practice, align, and leave with a personal five-year plan.",
        cta: "Build a plan",
      },
      implement: {
        key: "implement",
        tab: "Tab 4",
        route: "/implement",
        title: "Implementation",
        question: "How do you innovate?",
        audience: "Companies ready to upgrade work from the bottom up.",
        summary:
          "Employees design workflows in their own domains, add human audit gates, and prove value through demo hours-saved and ROI summaries.",
        cta: "Mock an implementation",
      },
    },
    pages: {
      inspire: {
        hero:
          "The front door is a mirror: before anyone learns a tool, they name the human value they bring.",
        sections: [
          {
            title: "IKIGAI self-discovery",
            body: "Four prompts produce a short purpose statement grounded in love, skill, world need, and paid work.",
          },
          {
            title: "Dignity reframe",
            body: "AI can extend reach, but empathy, judgment, care, and creativity remain human strengths.",
          },
          {
            title: "On-ramp",
            body: "The next step is simple: once visitors see their purpose, send them to Learn.",
          },
        ],
        demo: {
          label: "IKIGAI demo",
          emptyState: "Complete the four prompts to draft a purpose statement.",
          submit: "Draft purpose",
          resultTitle: "Draft purpose statement",
        },
      },
      learn: {
        hero:
          "Education is the engine: colleges train deeply, public resources reach widely, and role preparation makes live learning faster.",
        sections: [
          {
            title: "Community college channel",
            body: "The AI Institute trains professors, who carry practical AI education through community colleges and credential pathways.",
            items: ["20-hour professor program", "AI Agent classes", "Portable micro-credentials"],
          },
          {
            title: "Public channel",
            body: "A free YouTube learning library and curated tool guides make the curriculum available beyond enrolled students.",
          },
          {
            title: "Custom GPT preparation",
            body: "Role-specific GPTs can be prepared before seminars so learners begin with a co-pilot shaped around their work.",
          },
        ],
        demo: {
          label: "Learning hub demo",
          emptyState: "Choose a track to preview suggested resources.",
          submit: "Preview resources",
          resultTitle: "Suggested learning path",
        },
      },
      adapt: {
        hero:
          "Knowledge becomes change when employees and employers sit together and turn learning into a five-year plan.",
        sections: [
          {
            title: "Saturday session",
            body: "A six-hour format: learn the basics, practice with real tools, align around shared change, and plan the next five years.",
          },
          {
            title: "Where it happens",
            body: "Trained educators can deliver sessions through Chambers of Commerce, City Halls, colleges, and employer groups.",
          },
          {
            title: "What people leave with",
            body: "Each participant names what to automate, what to augment, what to own, and what to become.",
          },
        ],
        demo: {
          label: "Seminar and plan demo",
          emptyState: "Add seminar interest or plan inputs to see a local preview.",
          submit: "Create preview",
          resultTitle: "Draft five-year plan",
        },
      },
      implement: {
        hero:
          "Implementation starts with the person who knows the work: each employee designs the upgrade in their own domain.",
        sections: [
          {
            title: "Bottom-up process",
            body: "Audit, invite, build, and prove. The workflow starts with recoverable value and ends with human-reviewed deployment.",
            items: ["Audit the opportunity", "Invite every employee", "Build with human gates", "Prove hours saved"],
          },
          {
            title: "Installer Agents",
            body: "Installer Agents help businesses install AI, educate teams, and coordinate the four-step implementation process.",
          },
          {
            title: "Demo boundaries",
            body: "Audit findings, ROI, and hours-saved values are mock outputs in this MVP.",
          },
        ],
        demo: {
          label: "Mock implementation demo",
          emptyState: "Enter a company URL or workflow idea to generate demo-only findings.",
          submit: "Generate mock output",
          resultTitle: "Demo workflow summary",
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
      fiveYearPlan: {
        role: "Current role",
        automate: "What should be automated?",
        augment: "What should be augmented?",
        own: "What will you own?",
        become: "What will you become?",
        summaryTemplate:
          "In five years as {role}, I will automate {automate}, augment {augment}, own {own}, and grow toward {become}.",
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
      lockup: "Un portal. Cuatro marcos.",
      tagline: "Don -> Aprender -> Adaptar -> Innovar",
      promise: "No despedimos. Mejoramos capacidades.",
      jfkLine: "No preguntes qué puede hacer la IA por ti. Pregunta qué puedes hacer con la IA.",
      giBillLine: "El G.I. Bill para la era de la IA.",
    },
    overview: {
      eyebrow: "Portal MVP público",
      title: "Una secuencia para trabajadores, empresas y el país.",
      intro:
        "UpSkill USA convierte la ansiedad por la IA en un recorrido práctico: descubrir tu don, aprender IA gratis, adaptarte con un plan de cinco años e implementar flujos desde abajo hacia arriba.",
      arc: ["Encuentra tu don", "Aprende IA", "Crea un plan", "Mejora el trabajo"],
      primaryCta: "Comenzar con Inspirar",
      secondaryCta: "Explorar el marco",
      metricNote: "Nota de fuente: usar la cifra corregida del DOCX de 22% de empleos afectados para 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "Pestaña 1",
        route: "/inspire",
        title: "Inspiración e IKIGAI",
        question: "¿Cuál es tu don?",
        audience: "Estudiantes, trabajadores y personas que necesitan una razón para aprender.",
        summary:
          "Un flujo IKIGAI conecta lo que amas, lo que haces bien, lo que el mundo necesita y lo que puede convertirse en trabajo pagado.",
        cta: "Descubrir tu don",
      },
      learn: {
        key: "learn",
        tab: "Pestaña 2",
        route: "/learn",
        title: "Educación para todos",
        question: "¿Cómo aprendes?",
        audience: "Community colleges, profesores, trabajadores, empleadores y público general.",
        summary:
          "Un canal universitario formal y un canal público gratuito hacen accesible el aprendizaje de IA, con herramientas y preparación por rol.",
        cta: "Abrir recursos",
      },
      adapt: {
        key: "adapt",
        tab: "Pestaña 3",
        route: "/adapt",
        title: "Seminarios y eventos",
        question: "¿Cómo te adaptas?",
        audience: "Empleados, empleadores, Cámaras de Comercio, alcaldías y educadores.",
        summary:
          "Sesiones sabatinas de seis horas reúnen a las personas para aprender, practicar, alinearse y salir con un plan personal de cinco años.",
        cta: "Crear un plan",
      },
      implement: {
        key: "implement",
        tab: "Pestaña 4",
        route: "/implement",
        title: "Implementación",
        question: "¿Cómo innovas?",
        audience: "Empresas listas para mejorar el trabajo desde abajo hacia arriba.",
        summary:
          "Los empleados diseñan flujos en sus propios dominios, agregan revisiones humanas y demuestran valor con resultados de demo.",
        cta: "Probar implementación",
      },
    },
    pages: {
      inspire: {
        hero:
          "La puerta de entrada es un espejo: antes de aprender una herramienta, cada persona nombra el valor humano que aporta.",
        sections: [
          {
            title: "Autodescubrimiento IKIGAI",
            body: "Cuatro preguntas crean una declaración breve de propósito basada en amor, habilidad, necesidad y trabajo pagado.",
          },
          {
            title: "Dignidad",
            body: "La IA puede ampliar el alcance, pero empatía, juicio, cuidado y creatividad siguen siendo fortalezas humanas.",
          },
          {
            title: "Siguiente paso",
            body: "Cuando la persona ve su propósito, el portal la guía hacia Aprender.",
          },
        ],
        demo: {
          label: "Demo IKIGAI",
          emptyState: "Completa las cuatro preguntas para crear un borrador de propósito.",
          submit: "Crear propósito",
          resultTitle: "Borrador de propósito",
        },
      },
      learn: {
        hero:
          "La educación es el motor: las universidades entrenan en profundidad, los recursos públicos llegan ampliamente y la preparación por rol acelera el aprendizaje.",
        sections: [
          {
            title: "Canal de community colleges",
            body: "El AI Institute entrena profesores que llevan educación práctica en IA a programas y credenciales.",
            items: ["Programa de 20 horas", "Clases de AI Agent", "Microcredenciales portables"],
          },
          {
            title: "Canal público",
            body: "Una biblioteca gratuita en YouTube y guías de herramientas abren el currículo al público.",
          },
          {
            title: "Preparación con GPTs",
            body: "GPTs por rol pueden prepararse antes de los seminarios para que cada persona comience con un copiloto de su trabajo.",
          },
        ],
        demo: {
          label: "Demo de aprendizaje",
          emptyState: "Elige una ruta para ver recursos sugeridos.",
          submit: "Ver recursos",
          resultTitle: "Ruta sugerida",
        },
      },
      adapt: {
        hero:
          "El conocimiento cambia la realidad cuando empleados y empleadores se sientan juntos y lo convierten en un plan de cinco años.",
        sections: [
          {
            title: "Sesión sabatina",
            body: "Seis horas para aprender, practicar con herramientas reales, alinear expectativas y planear los próximos cinco años.",
          },
          {
            title: "Dónde ocurre",
            body: "Educadores entrenados pueden facilitar sesiones en Cámaras de Comercio, alcaldías, universidades y empresas.",
          },
          {
            title: "Resultado",
            body: "Cada participante define qué automatizar, qué aumentar, qué poseer y en qué convertirse.",
          },
        ],
        demo: {
          label: "Demo de seminario y plan",
          emptyState: "Agrega interés o datos del plan para ver una vista previa local.",
          submit: "Crear vista previa",
          resultTitle: "Borrador de plan de cinco años",
        },
      },
      implement: {
        hero:
          "La implementación empieza con quien conoce el trabajo: cada empleado diseña la mejora en su propio dominio.",
        sections: [
          {
            title: "Proceso desde abajo",
            body: "Auditar, invitar, construir y demostrar. El flujo termina con revisión humana y valor visible.",
            items: ["Auditar oportunidad", "Invitar empleados", "Construir con controles humanos", "Demostrar horas ahorradas"],
          },
          {
            title: "Installer Agents",
            body: "Los Installer Agents ayudan a empresas a instalar IA, educar equipos y coordinar la implementación.",
          },
          {
            title: "Límites de demo",
            body: "Hallazgos, ROI y horas ahorradas son resultados simulados en este MVP.",
          },
        ],
        demo: {
          label: "Demo de implementación simulada",
          emptyState: "Ingresa una URL o idea de flujo para generar hallazgos solo de demo.",
          submit: "Generar demo",
          resultTitle: "Resumen de flujo demo",
        },
      },
    },
    forms: {
      ikigai: {
        love: "¿Qué amas?",
        skill: "¿En qué eres bueno?",
        need: "¿Qué necesita el mundo?",
        paid: "¿Por qué te pueden pagar?",
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
      fiveYearPlan: {
        role: "Rol actual",
        automate: "¿Qué debería automatizarse?",
        augment: "¿Qué debería aumentarse?",
        own: "¿Qué vas a poseer?",
        become: "¿En qué te convertirás?",
        summaryTemplate:
          "En cinco años como {role}, automatizaré {automate}, aumentaré {augment}, poseeré {own} y creceré hacia {become}.",
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
      installer: "Installer Agents ayudan a empresas a instalar IA y ejecutar implementación desde abajo.",
      educator: "Educator Agents entregan el currículo, el AI Institute y las sesiones sabatinas.",
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
      lockup: "Um portal. Quatro estruturas.",
      tagline: "Dom -> Aprender -> Adaptar -> Inovar",
      promise: "Não demitimos. Requalificamos.",
      jfkLine: "Não pergunte o que a IA pode fazer por você. Pergunte o que você pode fazer com a IA.",
      giBillLine: "O G.I. Bill para a era da IA.",
    },
    overview: {
      eyebrow: "Portal MVP público",
      title: "Uma sequência para trabalhadores, empresas e o país.",
      intro:
        "UpSkill USA transforma ansiedade com IA em uma jornada prática: descobrir seu dom, aprender IA de graça, adaptar-se com um plano de cinco anos e implementar fluxos de baixo para cima.",
      arc: ["Encontre seu dom", "Aprenda IA", "Crie um plano", "Atualize o trabalho"],
      primaryCta: "Começar por Inspirar",
      secondaryCta: "Explorar a estrutura",
      metricNote: "Nota de fonte: use o número corrigido do DOCX de 22% dos empregos impactados até 2030.",
    },
    frameworks: {
      inspire: {
        key: "inspire",
        tab: "Aba 1",
        route: "/inspire",
        title: "Inspiração e IKIGAI",
        question: "Qual é o seu dom?",
        audience: "Estudantes, trabalhadores e qualquer pessoa que precise de motivo para aprender.",
        summary:
          "Um fluxo IKIGAI conecta o que você ama, o que faz bem, o que o mundo precisa e o que pode virar trabalho remunerado.",
        cta: "Descobrir seu dom",
      },
      learn: {
        key: "learn",
        tab: "Aba 2",
        route: "/learn",
        title: "Educação para todos",
        question: "Como você aprende?",
        audience: "Community colleges, professores, trabalhadores, empregadores e o público.",
        summary:
          "Um canal formal de faculdades e um canal público gratuito tornam o aprendizado de IA acessível, com ferramentas e preparo por função.",
        cta: "Abrir hub de aprendizado",
      },
      adapt: {
        key: "adapt",
        tab: "Aba 3",
        route: "/adapt",
        title: "Seminários e eventos",
        question: "Como você se adapta?",
        audience: "Empregados, empregadores, Câmaras de Comércio, prefeituras e educadores.",
        summary:
          "Sessões de sábado com seis horas reúnem pessoas para aprender, praticar, alinhar e sair com um plano pessoal de cinco anos.",
        cta: "Criar um plano",
      },
      implement: {
        key: "implement",
        tab: "Aba 4",
        route: "/implement",
        title: "Implementação",
        question: "Como você inova?",
        audience: "Empresas prontas para atualizar o trabalho de baixo para cima.",
        summary:
          "Funcionários desenham fluxos em seus próprios domínios, adicionam revisões humanas e demonstram valor com resultados de demo.",
        cta: "Simular implementação",
      },
    },
    pages: {
      inspire: {
        hero:
          "A porta de entrada é um espelho: antes de aprender uma ferramenta, cada pessoa nomeia o valor humano que traz.",
        sections: [
          {
            title: "Autodescoberta IKIGAI",
            body: "Quatro perguntas geram uma declaração curta de propósito baseada em amor, habilidade, necessidade e trabalho remunerado.",
          },
          {
            title: "Dignidade",
            body: "A IA amplia alcance, mas empatia, julgamento, cuidado e criatividade continuam sendo forças humanas.",
          },
          {
            title: "Próximo passo",
            body: "Quando a pessoa enxerga seu propósito, o portal a guia para Aprender.",
          },
        ],
        demo: {
          label: "Demo IKIGAI",
          emptyState: "Complete as quatro perguntas para criar um rascunho de propósito.",
          submit: "Criar propósito",
          resultTitle: "Rascunho de propósito",
        },
      },
      learn: {
        hero:
          "A educação é o motor: faculdades treinam em profundidade, recursos públicos chegam amplamente e preparo por função acelera o aprendizado.",
        sections: [
          {
            title: "Canal de community colleges",
            body: "O AI Institute treina professores que levam educação prática em IA para programas e credenciais.",
            items: ["Programa de 20 horas", "Aulas de AI Agent", "Microcredenciais portáteis"],
          },
          {
            title: "Canal público",
            body: "Uma biblioteca gratuita no YouTube e guias de ferramentas abrem o currículo para todos.",
          },
          {
            title: "Preparo com GPTs",
            body: "GPTs por função podem ser preparados antes dos seminários para que cada pessoa comece com um copiloto do seu trabalho.",
          },
        ],
        demo: {
          label: "Demo de aprendizagem",
          emptyState: "Escolha uma trilha para visualizar recursos sugeridos.",
          submit: "Ver recursos",
          resultTitle: "Trilha sugerida",
        },
      },
      adapt: {
        hero:
          "Conhecimento vira mudança quando empregados e empregadores sentam juntos e transformam aprendizado em um plano de cinco anos.",
        sections: [
          {
            title: "Sessão de sábado",
            body: "Seis horas para aprender, praticar com ferramentas reais, alinhar expectativas e planejar os próximos cinco anos.",
          },
          {
            title: "Onde acontece",
            body: "Educadores treinados podem facilitar sessões em Câmaras de Comércio, prefeituras, faculdades e empresas.",
          },
          {
            title: "Resultado",
            body: "Cada participante define o que automatizar, o que aumentar, o que possuir e no que se tornar.",
          },
        ],
        demo: {
          label: "Demo de seminário e plano",
          emptyState: "Adicione interesse ou dados do plano para ver uma prévia local.",
          submit: "Criar prévia",
          resultTitle: "Rascunho do plano de cinco anos",
        },
      },
      implement: {
        hero:
          "A implementação começa com quem conhece o trabalho: cada funcionário desenha a melhoria em seu próprio domínio.",
        sections: [
          {
            title: "Processo de baixo para cima",
            body: "Auditar, convidar, construir e provar. O fluxo termina com revisão humana e valor visível.",
            items: ["Auditar oportunidade", "Convidar funcionários", "Construir com controles humanos", "Provar horas economizadas"],
          },
          {
            title: "Installer Agents",
            body: "Installer Agents ajudam empresas a instalar IA, educar equipes e coordenar a implementação.",
          },
          {
            title: "Limites de demo",
            body: "Achados, ROI e horas economizadas são resultados simulados neste MVP.",
          },
        ],
        demo: {
          label: "Demo de implementação simulada",
          emptyState: "Insira uma URL ou ideia de fluxo para gerar achados apenas de demo.",
          submit: "Gerar demo",
          resultTitle: "Resumo de fluxo demo",
        },
      },
    },
    forms: {
      ikigai: {
        love: "O que você ama?",
        skill: "No que você é bom?",
        need: "O que o mundo precisa?",
        paid: "Pelo que podem pagar você?",
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
      fiveYearPlan: {
        role: "Função atual",
        automate: "O que deve ser automatizado?",
        augment: "O que deve ser aumentado?",
        own: "O que você vai possuir?",
        become: "No que você vai se tornar?",
        summaryTemplate:
          "Em cinco anos como {role}, vou automatizar {automate}, aumentar {augment}, possuir {own} e crescer em direção a {become}.",
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
      installer: "Installer Agents ajudam empresas a instalar IA e executar implementação de baixo para cima.",
      educator: "Educator Agents entregam o currículo, o AI Institute e as sessões de sábado.",
    },
  },
};

export const defaultLanguage: Language = "en";

export const frameworkOrder: FrameworkKey[] = ["inspire", "learn", "adapt", "implement"];

export function getPortalContent(language: Language = defaultLanguage): PortalContent {
  return portalContent[language];
}
