export type PathwayId = "explorer" | "market-ready" | "pivot" | "amplify";

export type Occupation = {
  title: string;
  slug: string;
  category: string;
  pay: number | null;
  jobs: number;
  outlook: number | null;
  outlook_desc: string;
  education: string;
  exposure: number;
  exposure_rationale: string;
  url: string;
  vulnerability: number;
  vulnerability_label: string;
};

export type ScoredOccupation = {
  slug: string;
  score: number;
};

export type IkigaiAssessmentResult = {
  pathwayId: PathwayId | "";
  name: string;
  currentSituation: string;
  feelings: string[];
  humanSkills: string[];
  interests: string[];
  workStyle: string[];
  matches: ScoredOccupation[];
  compareSlugs: string[];
  recommendations: Recommendation[];
  savedAt?: string;
};

export type Recommendation = {
  title: string;
  body: string;
};

export type IkigaiMatchingInput = Pick<
  IkigaiAssessmentResult,
  "pathwayId" | "humanSkills" | "interests" | "workStyle"
>;

export type AssessmentPathway = {
  id: PathwayId;
  icon: string;
  name: string;
  audience: string;
  desc: string;
  question: string;
  preamble: {
    title: string;
    message: string;
    prompt: string;
  };
  situationOptions: string[];
};

export type AssessmentMappedOption = {
  name: string;
  icon?: string;
  desc?: string;
  categories?: string[];
  boost?: string[];
};

export const defaultAssessmentResult: IkigaiAssessmentResult = {
  pathwayId: "",
  name: "",
  currentSituation: "",
  feelings: [],
  humanSkills: [],
  interests: [],
  workStyle: [],
  matches: [],
  compareSlugs: [],
  recommendations: [],
};

export const assessmentCopy = {
  label: "IKIGAI assessment",
  localDemoLabel: "Local MVP guidance",
  sourceNote:
    "Matches are generated locally from a copied occupation dataset and deterministic scoring rules. Use them as conversation starters, not employment guarantees.",
  storageNote:
    "Your assessment progress is saved only in this browser as part of the local AI Upgrade Plan draft.",
  ikigaiTitle: "The IKIGAI Process",
  ikigaiBody:
    'IKIGAI (生き甲斐) — The Japanese concept of "reason for being." The intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for.',
  tagline: '"Ask not what AI can do for You. Ask What You can Do with AI!"',
  firstNameLabel: "What's your name? (optional)",
  firstNamePlaceholder: "Your first name",
  maybeLaterLabel: "Maybe Later",
  beginLabel: "Let's Begin →",
  backLabel: "← Back",
  backToMatchesLabel: "← Back to Matches",
  continueLabel: "Continue →",
  seeMatchesLabel: "See My Matches →",
  compareSelectedLabel: "Compare Selected →",
  compareSideBySideLabel: "Compare Side-by-Side →",
  saveToPlanLabel: "Save assessment and view plan",
  saveToLearnLabel: "Save and continue to Learn",
  topMatchesTitle: "Here Are Your Top Career Matches",
  comparisonTitle: "Side-by-Side Comparison",
  actionPlanTitle: "Personalized action plan",
  reviewTitle: "Your assessment summary",
  startState:
    "Choose a pathway to begin. Use the buttons at the bottom of each step to move through the assessment.",
  incompleteState:
    "Complete the assessment on Step 1 Inspiration to add career matches to this plan.",
} as const;

export const pathways: AssessmentPathway[] = [
  {
    id: "explorer",
    icon: "🎓",
    name: "Career Explorer",
    audience: "High School Students",
    desc: "Discover AI-resilient careers that match your passions and strengths.",
    question: "What should I study if I want a career that lasts?",
    preamble: {
      title: "Welcome, Future Builders",
      message:
        "You're standing at the most important crossroads in modern history. AI is reshaping every career path — but that doesn't mean your future is uncertain. It means you have the chance to choose wisely. This journey will help you discover careers where your unique human abilities are the superpower, not the liability. Let's find where your passions meet the future.",
      prompt: "First, tell us about yourself:",
    },
    situationOptions: [
      "Still figuring out what I want to do",
      "I have a dream career in mind",
      "My parents want me to go one direction, I want another",
      "I just want a stable, good-paying career",
      "I love tech and want to work with AI",
      "I want to help people — healthcare, teaching, social work",
    ],
  },
  {
    id: "market-ready",
    icon: "📋",
    name: "Market Ready Check",
    audience: "College Students",
    desc: "Find out if your target career will still be there when you graduate.",
    question: "I'm finishing my degree — is my target job still going to be there?",
    preamble: {
      title: "The Truth About Your Degree",
      message:
        "You've invested years and thousands of dollars in your education. The honest truth? Some degrees are leading to careers that AI is already transforming. But knowledge is power — and knowing exactly where your field stands gives you time to adapt, specialize, and position yourself ahead of the curve. Let's look at the data together.",
      prompt: "Where are you right now?",
    },
    situationOptions: [
      "Freshman/Sophomore — still choosing my major",
      "Junior/Senior — locked into my major, worried about jobs",
      "About to graduate — job hunting now",
      "Recently graduated — struggling to find work in my field",
      "In a graduate/professional program",
      "Considering going back to school",
    ],
  },
  {
    id: "pivot",
    icon: "🔄",
    name: "Career Pivot Navigator",
    audience: "Displaced Workers",
    desc: "Map your transferable skills to new careers with lower AI risk.",
    question: "My job is gone or going. What can I do next?",
    preamble: {
      title: "Your Experience is Your Superpower",
      message:
        "If you're here, you may be facing one of the hardest moments in your working life. We want you to know: this is not your fault, and you are not alone. Millions of Americans are navigating the same disruption. What AI cannot replace is your years of experience, your human judgment, your relationships, and your adaptability. Let's map what you already know to careers with a future.",
      prompt: "Let's start with where you are:",
    },
    situationOptions: [
      "I was recently laid off — AI was cited as a reason",
      "My job still exists, but I can feel it shrinking",
      "I'm doing the same job but now AI does half of it",
      "I've been job hunting and everything requires AI skills I don't have",
      "I'm in a dying industry and need to switch fields entirely",
      "I want to pivot proactively before it's too late",
    ],
  },
  {
    id: "amplify",
    icon: "⚡",
    name: "AI Amplification Path",
    audience: "Upskilling Workers",
    desc: "Learn how to become MORE valuable by working WITH AI.",
    question: "How do I become more valuable by working with AI?",
    preamble: {
      title: "The Amplification Mindset",
      message:
        "You get it. AI isn't the enemy — it's the most powerful tool humans have ever built. The question isn't whether AI will change your job. It's whether YOU will be the one who leads that change. The workers who learn to combine deep human expertise with AI fluency will be the most valuable people in any organization. Let's build your amplification strategy.",
      prompt: "What's your current relationship with AI?",
    },
    situationOptions: [
      "I use ChatGPT/AI occasionally but want to go deeper",
      "My company is rolling out AI and I want to lead it",
      "I'm already using AI daily and want to become the expert",
      "I'm a manager trying to understand AI for my team",
      "I want to build AI tools, not just use them",
      "I'm curious but honestly overwhelmed by all the AI hype",
    ],
  },
];

export const humanSkills: AssessmentMappedOption[] = [
  {
    name: "Empathy & Emotional Intelligence",
    icon: "heart",
    desc: "Reading people, caring, connecting",
    categories: ["healthcare", "community-and-social-service", "education-training-and-library"],
  },
  {
    name: "Creative Problem Solving",
    icon: "lightbulb",
    desc: "Finding solutions nobody thought of",
    categories: ["arts-and-design", "architecture-and-engineering", "management"],
  },
  {
    name: "Physical Dexterity & Craftsmanship",
    icon: "wrench",
    desc: "Working with your hands, building things",
    categories: [
      "construction-and-extraction",
      "installation-maintenance-and-repair",
      "farming-fishing-and-forestry",
    ],
  },
  {
    name: "Leadership & Team Building",
    icon: "award",
    desc: "Inspiring others, making group decisions",
    categories: ["management", "business-and-financial", "military"],
  },
  {
    name: "Complex Judgment & Ethics",
    icon: "scale",
    desc: "Making decisions with incomplete info",
    categories: ["legal", "management", "community-and-social-service"],
  },
  {
    name: "Communication & Persuasion",
    icon: "mic",
    desc: "Explaining, teaching, convincing",
    categories: ["sales", "education-training-and-library", "media-and-communication"],
  },
  {
    name: "Scientific Curiosity",
    icon: "flask",
    desc: "Investigating, experimenting, discovering",
    categories: [
      "life-physical-and-social-science",
      "healthcare",
      "computer-and-information-technology",
    ],
  },
  {
    name: "Spatial & Visual Thinking",
    icon: "palette",
    desc: "Designing, visualizing, creating beauty",
    categories: ["arts-and-design", "architecture-and-engineering", "construction-and-extraction"],
  },
  {
    name: "Relationship Building & Trust",
    icon: "handshake",
    desc: "Long-term client/patient/student bonds",
    categories: ["healthcare", "business-and-financial", "community-and-social-service"],
  },
  {
    name: "Adaptability & Resilience",
    icon: "waves",
    desc: "Thriving in chaos, pivoting quickly",
    categories: ["protective-service", "entertainment-and-sports", "management"],
  },
  {
    name: "Analytical & Data Thinking",
    icon: "chart",
    desc: "Making sense of numbers and patterns",
    categories: ["computer-and-information-technology", "math", "business-and-financial"],
  },
  {
    name: "Teaching & Mentoring",
    icon: "book",
    desc: "Helping others grow and learn",
    categories: ["education-training-and-library", "healthcare", "community-and-social-service"],
  },
];

export const interestAreas: AssessmentMappedOption[] = [
  {
    name: "Technology & Innovation",
    categories: ["computer-and-information-technology", "math", "architecture-and-engineering"],
  },
  {
    name: "Health & Wellness",
    categories: ["healthcare", "life-physical-and-social-science", "community-and-social-service"],
  },
  {
    name: "Business & Finance",
    categories: ["business-and-financial", "management", "sales"],
  },
  {
    name: "Creative & Artistic",
    categories: ["arts-and-design", "media-and-communication", "entertainment-and-sports"],
  },
  {
    name: "Education & Mentoring",
    categories: ["education-training-and-library", "community-and-social-service"],
  },
  {
    name: "Trades & Building",
    categories: [
      "construction-and-extraction",
      "installation-maintenance-and-repair",
      "architecture-and-engineering",
    ],
  },
  {
    name: "Law & Public Service",
    categories: ["legal", "protective-service", "community-and-social-service"],
  },
  {
    name: "Science & Research",
    categories: ["life-physical-and-social-science", "math", "healthcare"],
  },
  {
    name: "Food & Hospitality",
    categories: [
      "food-preparation-and-serving",
      "building-and-grounds-cleaning",
      "entertainment-and-sports",
    ],
  },
  {
    name: "Nature & Agriculture",
    categories: [
      "farming-fishing-and-forestry",
      "life-physical-and-social-science",
      "building-and-grounds-cleaning",
    ],
  },
];

export const workStyleOptions: AssessmentMappedOption[] = [
  {
    name: "Working with my hands",
    boost: [
      "construction-and-extraction",
      "installation-maintenance-and-repair",
      "farming-fishing-and-forestry",
    ],
  },
  {
    name: "Working with people face-to-face",
    boost: ["healthcare", "education-training-and-library", "community-and-social-service", "sales"],
  },
  {
    name: "Working independently/remotely",
    boost: [
      "computer-and-information-technology",
      "arts-and-design",
      "math",
      "media-and-communication",
    ],
  },
  {
    name: "Being outdoors or on-the-move",
    boost: [
      "construction-and-extraction",
      "farming-fishing-and-forestry",
      "protective-service",
      "transportation",
    ],
  },
  {
    name: "Leading teams and making decisions",
    boost: ["management", "business-and-financial", "legal"],
  },
  {
    name: "Working in high-stakes/emergency situations",
    boost: ["healthcare", "protective-service"],
  },
  {
    name: "Creating things — art, code, buildings, food",
    boost: [
      "arts-and-design",
      "computer-and-information-technology",
      "construction-and-extraction",
      "food-preparation-and-serving",
    ],
  },
  {
    name: "Analyzing data and solving puzzles",
    boost: [
      "computer-and-information-technology",
      "math",
      "life-physical-and-social-science",
      "business-and-financial",
    ],
  },
];

export const feelingOptions: Record<PathwayId, string[]> = {
  explorer: [
    "Excited but overwhelmed by all the choices",
    "Worried AI will take all the good jobs before I get there",
    "Confident I can adapt to whatever comes",
    "Confused about which careers are actually safe",
    "Motivated to find something I love AND that pays well",
    'Pressured to choose the "right" thing immediately',
  ],
  "market-ready": [
    "Anxious — I see AI replacing roles I trained for",
    "Optimistic — I think AI will create new opportunities",
    "Frustrated — nobody told me this was coming when I started",
    "Determined — I'll adapt no matter what",
    "Uncertain — I don't know if my skills will transfer",
    "Proactive — I want to get ahead of this",
  ],
  pivot: [
    "Scared — I don't know what I can do",
    "Angry — I gave years to a career that just disappeared",
    "Hopeful — I believe I can reinvent myself",
    "Exhausted — the job search is demoralizing",
    "Determined — I'm going to come back stronger",
    "Lost — I don't even know where to start",
  ],
  amplify: [
    "Energized — AI is the most exciting tool I've ever used",
    "Strategic — I see AI as a career accelerator",
    "Cautious — I want to use AI without losing my edge",
    "Curious — I want to understand AI deeply, not just use it",
    "Competitive — I want to be the best AI-enabled pro in my field",
    "Collaborative — I want to help my team adopt AI",
  ],
};

export const categoryLabels: Record<string, string> = {
  "architecture-and-engineering": "Architecture & Engineering",
  "arts-and-design": "Arts & Design",
  "building-and-grounds-cleaning": "Building & Grounds",
  "business-and-financial": "Business & Financial",
  "community-and-social-service": "Community & Social Service",
  "computer-and-information-technology": "Computer & IT",
  "construction-and-extraction": "Construction & Extraction",
  "education-training-and-library": "Education & Library",
  "entertainment-and-sports": "Entertainment & Sports",
  "farming-fishing-and-forestry": "Farming & Forestry",
  "food-preparation-and-serving": "Food Preparation & Serving",
  healthcare: "Healthcare",
  "installation-maintenance-and-repair": "Installation & Repair",
  legal: "Legal",
  "life-physical-and-social-science": "Life & Physical Science",
  management: "Management",
  math: "Math",
  "media-and-communication": "Media & Communication",
  military: "Military",
  "office-and-administrative-support": "Office & Admin",
  "personal-care-and-service": "Personal Care & Service",
  production: "Production",
  "protective-service": "Protective Service",
  sales: "Sales",
  "transportation-and-material-moving": "Transportation",
};

export const vulnerabilityLabels: Record<number, string> = {
  1: "Fortified",
  2: "Very Safe",
  3: "Safe",
  4: "Mostly Safe",
  5: "Moderate",
  6: "Shifting",
  7: "Exposed",
  8: "Vulnerable",
  9: "High Risk",
  10: "Critical",
};

export function getPathway(pathwayId: string | undefined) {
  return pathways.find((pathway) => pathway.id === pathwayId);
}

export function getCategoryLabel(slug: string) {
  return categoryLabels[slug] ?? slug;
}

export function formatCurrency(value: number | null | undefined) {
  if (!value) return "N/A";
  return `$${value.toLocaleString()}`;
}

export function formatNumber(value: number | undefined) {
  if (!value) return "0";
  return value.toLocaleString();
}

export function formatOutlook(value: number | null | undefined) {
  if (value === undefined || value === null) return "N/A";
  return `${value > 0 ? "+" : ""}${value}%`;
}

export function getComparedOccupations(compareSlugs: string[], occupations: Occupation[]) {
  return compareSlugs
    .map((slug) => occupations.find((occupation) => occupation.slug === slug))
    .filter((occupation): occupation is Occupation => Boolean(occupation));
}

export function getMatchOccupations(matches: ScoredOccupation[], occupations: Occupation[]) {
  return matches
    .map((match) => {
      const occupation = occupations.find((item) => item.slug === match.slug);
      return occupation ? { occupation, score: match.score } : null;
    })
    .filter((item): item is { occupation: Occupation; score: number } => Boolean(item));
}

export function computeIkigaiMatches(
  input: IkigaiMatchingInput,
  occupations: Occupation[],
  limit = 12,
): ScoredOccupation[] {
  const scores = new Map<string, { occupation: Occupation; score: number }>();

  occupations.forEach((occupation) => {
    scores.set(occupation.slug, { occupation, score: 0 });
  });

  input.humanSkills.forEach((skillName) => {
    const skill = humanSkills.find((option) => option.name === skillName);
    skill?.categories?.forEach((category) => {
      occupations
        .filter((occupation) => occupation.category === category)
        .forEach((occupation) => {
          const current = scores.get(occupation.slug);
          if (current) current.score += 10;
        });
    });
  });

  input.interests.forEach((interestName) => {
    const area = interestAreas.find((option) => option.name === interestName);
    area?.categories?.forEach((category) => {
      occupations
        .filter((occupation) => occupation.category === category)
        .forEach((occupation) => {
          const current = scores.get(occupation.slug);
          if (current) current.score += 8;
        });
    });
  });

  input.workStyle.forEach((workStyleName) => {
    const style = workStyleOptions.find((option) => option.name === workStyleName);
    style?.boost?.forEach((category) => {
      occupations
        .filter((occupation) => occupation.category === category)
        .forEach((occupation) => {
          const current = scores.get(occupation.slug);
          if (current) current.score += 6;
        });
    });
  });

  occupations.forEach((occupation) => {
    const current = scores.get(occupation.slug);
    if (!current) return;

    if (occupation.vulnerability >= 7) current.score -= 8;
    else if (occupation.vulnerability >= 5 && occupation.vulnerability <= 6) current.score -= 3;

    if (occupation.vulnerability <= 4) current.score += 5;
    const outlook = occupation.outlook ?? 0;
    if (outlook >= 10) current.score += 4;
    if (outlook >= 20) current.score += 3;

    if (input.pathwayId === "amplify" && occupation.exposure >= 7) {
      current.score += 5;
    }
  });

  return [...scores.values()]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.occupation.title.localeCompare(b.occupation.title);
    })
    .slice(0, limit)
    .map(({ occupation, score }) => ({ slug: occupation.slug, score }));
}

export function getBestActionOccupation(
  compareSlugs: string[],
  matches: ScoredOccupation[],
  occupations: Occupation[],
) {
  const compared = getComparedOccupations(compareSlugs, occupations);

  if (compared.length > 0) {
    return [...compared].sort((a, b) => {
      if (a.vulnerability !== b.vulnerability) return a.vulnerability - b.vulnerability;
      return (b.outlook ?? 0) - (a.outlook ?? 0);
    })[0];
  }

  const firstMatch = matches[0];
  return firstMatch ? occupations.find((occupation) => occupation.slug === firstMatch.slug) : undefined;
}

export function getRecommendations(
  occupation: Occupation | undefined,
  pathwayId: PathwayId | "",
): Recommendation[] {
  if (!occupation || !pathwayId) return [];

  const category = getCategoryLabel(occupation.category);

  if (pathwayId === "explorer") {
    if (occupation.vulnerability >= 7) {
      return [
        {
          title: "Consider adjacent careers",
          body: `${occupation.title} scores ${occupation.vulnerability}/10 on AI vulnerability. Look into related roles that involve more hands-on, human-centric, or supervisory work.`,
        },
        {
          title: "Build AI literacy early",
          body: `Understanding how AI tools work in ${category} will help you choose stronger classes, internships, and projects.`,
        },
        {
          title: "Focus on uniquely human skills",
          body: "Develop creative problem-solving, emotional intelligence, physical dexterity, ethical judgment, and communication.",
        },
      ];
    }

    return [
      {
        title: "Strong career direction",
        body: `${occupation.title} scores ${occupation.vulnerability}/10 on AI vulnerability. This path has more durable signals than many digital-only roles.`,
      },
      {
        title: "Stay AI-augmented",
        body: "Even in resilient careers, learning to use AI tools well can multiply your effectiveness.",
      },
      {
        title: "Build your foundation",
        body: `${occupation.education} is typically required. Start building relevant experience through classes, projects, internships, or volunteering.`,
      },
    ];
  }

  if (pathwayId === "market-ready") {
    if (occupation.vulnerability >= 7) {
      return [
        {
          title: "Specialize urgently",
          body: `${occupation.title} has high AI exposure (${occupation.exposure}/10). Identify niches that require human judgment, relationships, or field context.`,
        },
        {
          title: "Add a second skill",
          body: `Combine your degree with AI literacy. "AI plus ${category}" may grow even when general roles change.`,
        },
        {
          title: "Network strategically",
          body: `Talk with professionals who have adapted inside ${category} and ask which skills are now hiring signals.`,
        },
      ];
    }

    return [
      {
        title: "You are well-positioned",
        body: `${occupation.title} has ${formatOutlook(occupation.outlook)} growth and ${formatNumber(occupation.jobs)} current positions in this dataset.`,
      },
      {
        title: "Differentiate with AI",
        body: `Learn AI tools specific to ${category}. Employers increasingly value candidates who can use AI responsibly.`,
      },
      {
        title: "Target growth areas",
        body: `Within ${occupation.title}, identify faster-growing specialties and align coursework or projects to them.`,
      },
    ];
  }

  if (pathwayId === "pivot") {
    const base = [
      {
        title: "Map your transferable skills",
        body: "Your experience already includes communication, problem-solving, domain knowledge, reliability, and judgment that can transfer across industries.",
      },
    ];

    if (occupation.vulnerability >= 7) {
      return [
        ...base,
        {
          title: "Target lower-vulnerability roles",
          body: "Look for careers scoring 1-4 on vulnerability that use similar skills. Healthcare, trades, education, and management often value lived experience.",
        },
        {
          title: "Explore training programs",
          body: "Use O*NET, BLS, CareerOneStop, community colleges, and local workforce boards to find short reskilling paths.",
        },
      ];
    }

    return [
      ...base,
      {
        title: "Leverage your experience",
        body: `At ${occupation.vulnerability}/10 vulnerability, ${occupation.title} has more stable signals. Consider supervisory, consulting, training, or operations-adjacent roles.`,
      },
      {
        title: "Upskill inside the field",
        body: "A focused credential or AI-tool fluency can help you compete quickly without starting from zero.",
      },
    ];
  }

  return [
    {
      title: "Become the AI expert in your role",
      body: `Learn the specific AI tools being adopted in ${category}. The person who can train others becomes more valuable.`,
    },
    {
      title: "Document productivity gains",
      body: "Track how much faster or better you work with AI, and turn that evidence into a stronger role conversation.",
    },
    {
      title: "Build your AI plus experience brand",
      body: `${occupation.title} expertise combined with AI fluency can become a rare and valuable skill set.`,
    },
  ];
}
