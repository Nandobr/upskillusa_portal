import type { FrameworkKey } from "@/lib/content";

export type UserTrack = "worker" | "educator" | "employer" | "partner";
export type AiComfort = "beginner" | "some" | "advanced";
export type TimeCommitment = "30-minutes" | "2-hours" | "saturday";
export type LearningPreference = "watch" | "read" | "practice" | "seminar";
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
};

export type LearnPlanInput = {
  track: UserTrack;
  aiComfort: AiComfort;
  timeCommitment: TimeCommitment;
  learningPreference: LearningPreference;
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

export const defaultDraft: Required<PlanDraft> = {
  inspire: {
    userType: "worker",
    role: "",
    organization: "",
    motivation: "",
    desiredOutcome: "",
    humanStrengths: "",
  },
  learn: {
    track: "worker",
    aiComfort: "beginner",
    timeCommitment: "30-minutes",
    learningPreference: "practice",
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
  if (draft.inspire && hasText(draft.inspire.role)) {
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

function getLevelLabel(level: PlanLevel) {
  if (level === 4) return "Level 4: Complete AI Upgrade Plan";
  if (level === 3) return "Level 3: AI Opportunity Draft";
  if (level === 2) return "Level 2: Learning Path";
  if (level === 1) return "Level 1: Opportunity Seed";
  return "Start your AI Upgrade Plan";
}

function getCompletedSteps(level: PlanLevel): FrameworkKey[] {
  return ["inspire", "learn", "adapt", "implement"].slice(0, level) as FrameworkKey[];
}

function getLearningPath(input?: LearnPlanInput) {
  if (!input) {
    return ["Complete the Learn step to receive a learning path matched to your readiness."];
  }

  const base =
    input.aiComfort === "beginner"
      ? "Start with AI basics and prompt practice before changing live workflows."
      : input.aiComfort === "some"
        ? "Practice role-specific AI prompts and learn how to review AI-generated work."
        : "Focus on workflow design, team enablement, and responsible AI review patterns.";

  return [
    base,
    `Use a ${timeOptions[input.timeCommitment].toLowerCase()} learning block and a ${learningPreferenceOptions[
      input.learningPreference
    ].toLowerCase()} format.`,
    `Recommended track: ${trackOptions[input.track]}.`,
  ];
}

function getNextActions(level: PlanLevel): string[] {
  if (level === 4) {
    return [
      "Day 1: Map the current workflow and choose one low-risk sample.",
      "Day 2: Create one AI prompt or template for the repetitive part of the work.",
      "Day 3: Test the prompt on sample cases and record what works.",
      "Day 4: Add the human review gate and decide who approves output.",
      "Day 5: Run the pilot on a small real example.",
      "Day 6: Measure time saved, quality, and risks found.",
      "Day 7: Decide whether to expand, revise, or stop the pilot.",
    ];
  }

  if (level === 3) {
    return [
      "Day 1: Write the workflow steps in order.",
      "Day 2: Mark which steps are repetitive, delayed, or judgment-heavy.",
      "Day 3: Choose one small pilot and continue to Implement.",
    ];
  }

  if (level === 2) {
    return [
      "Day 1: Complete one short learning resource.",
      "Day 2: Practice three prompts related to your role.",
      "Day 3: Pick one workflow pain and continue to Adapt.",
    ];
  }

  return [
    "Day 1: Write your role and three tasks you repeat weekly.",
    "Day 2: Choose one task that feels low-risk to improve.",
    "Day 3: Continue to Learn and pick your AI readiness path.",
  ];
}

export function generateUpgradePlan(draft: PlanDraft): GeneratedPlan {
  const level = getPlanLevel(draft);
  const riskLevel = getRiskLevel(draft.implement);
  const category = draft.adapt ? workCategories[draft.adapt.workCategory] : undefined;
  const nextStep = getNextPlanStep(level);
  const sections: GeneratedPlanSection[] = [];

  if (draft.inspire) {
    sections.push({
      title: "Your AI Opportunity",
      body: `As ${draft.inspire.role || "a learner"}, your opportunity is to use AI to move toward ${
        draft.inspire.desiredOutcome || "a clearer work outcome"
      } while protecting the human strengths that matter most: ${
        draft.inspire.humanStrengths || "judgment, care, creativity, and domain knowledge"
      }.`,
      items: [
        `Context: ${draft.inspire.organization || "not specified"}`,
        `Motivation: ${draft.inspire.motivation || "not specified yet"}`,
      ],
    });
  }

  if (level >= 2) {
    sections.push({
      title: "Recommended Learning Path",
      body: "Use this path to build confidence before changing real workflows.",
      items: getLearningPath(draft.learn),
    });
  }

  if (draft.adapt) {
    sections.push({
      title: "Workflow Adaptation Plan",
      body: `Focus on ${draft.adapt.workflowPain || "one painful workflow"} in ${
        category?.label || "the selected work area"
      }. AI should assist the repetitive and delayed parts first, while humans keep ownership of judgment-heavy work.`,
      items: [
        `Current steps: ${draft.adapt.mainSteps || "map these before the pilot"}`,
        `Delay or friction: ${draft.adapt.delay || "not specified"}`,
        `Repetitive work: ${draft.adapt.repetitiveWork || "not specified"}`,
        `Human judgment: ${draft.adapt.judgmentNeeds || "not specified"}`,
        `Own: ${draft.adapt.own || "the human review and final decision"}`,
        `Become: ${draft.adapt.become || "an AI-assisted workflow designer"}`,
      ],
    });
  }

  if (draft.implement) {
    sections.push({
      title: "First Workflow Pilot",
      body: `Pilot ${draft.implement.workflowName || "one workflow"} with a narrow scope: ${
        draft.implement.pilotScope || "a small, reversible test"
      }.`,
      items: [
        `Human review gate: ${draft.implement.humanGate || "assign a human approver before launch"}`,
        `Risk level: ${riskLevel ? riskLevel.toUpperCase() : "not assessed"}`,
        `Company URL: ${draft.implement.companyUrl || "not required for MVP"}`,
      ],
    });
  }

  if (level === 0) {
    sections.push({
      title: "Start With Inspire",
      body: "Complete the Inspire step first so the plan can connect AI adoption to a real role, motivation, and human strength.",
    });
  }

  return {
    level,
    levelLabel: getLevelLabel(level),
    completedSteps: getCompletedSteps(level),
    nextStep,
    riskLevel,
    sections,
    nextActions: getNextActions(level),
    afterSevenDays:
      level === 4
        ? [
            "Learn More: return to Learn if confidence or skills still feel thin.",
            "Run A Bigger Pilot: return to Adapt and map the full team workflow.",
            "Get Help Implementing: request a seminar, educator agent, or installer agent when the workflow affects a team or has higher risk.",
          ]
        : ["Return to the portal and complete the next framework step to keep building momentum."],
  };
}

export function planToText(plan: GeneratedPlan) {
  const sections = plan.sections
    .map((section) => {
      const items = section.items?.map((item) => `- ${item}`).join("\n");
      return `${section.title}\n${section.body}${items ? `\n${items}` : ""}`;
    })
    .join("\n\n");

  return [
    "UpSkill USA AI Upgrade Plan",
    plan.levelLabel,
    "",
    sections,
    "",
    plan.level === 4 ? "Next 7 Days" : "Next 3 Days",
    plan.nextActions.map((item) => `- ${item}`).join("\n"),
    "",
    "After 7 Days",
    plan.afterSevenDays.map((item) => `- ${item}`).join("\n"),
  ].join("\n");
}
