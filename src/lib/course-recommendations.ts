import type { Language } from "@/lib/content";
import { aiCourses, type AiCourse } from "@/lib/data/ai-courses";
import type { LearnGoal, LearnGroup, LearnPlanInput, LearnTool } from "@/lib/plan";

export type CourseRecommendationSlot = "understand-ai" | "learn-tool" | "use-role" | "use-responsibly";

export type CourseRecommendation = {
  slot: CourseRecommendationSlot;
  course: AiCourse;
};

type SlotProfile = {
  slot: CourseRecommendationSlot;
  targetPathOrders: number[];
  keywords: string[];
  preferredLevels: string[];
};

const slotProfiles: Record<CourseRecommendationSlot, SlotProfile> = {
  "understand-ai": {
    slot: "understand-ai",
    targetPathOrders: [1],
    keywords: ["ai literacy", "generative ai", "foundation", "foundations", "what is ai", "how ai works", "capabilities"],
    preferredLevels: ["beginner"],
  },
  "learn-tool": {
    slot: "learn-tool",
    targetPathOrders: [2],
    keywords: ["prompt", "prompting", "productivity", "practical", "tool", "workflow"],
    preferredLevels: ["practical", "beginner"],
  },
  "use-role": {
    slot: "use-role",
    targetPathOrders: [3, 4],
    keywords: ["work", "role", "career", "education", "business", "workflow", "productivity"],
    preferredLevels: ["practical", "business / leadership", "beginner"],
  },
  "use-responsibly": {
    slot: "use-responsibly",
    targetPathOrders: [4, 5],
    keywords: ["responsible", "ethics", "privacy", "safety", "governance", "bias", "trust", "human review"],
    preferredLevels: ["beginner", "practical", "business / leadership"],
  },
};

const groupKeywords: Record<LearnGroup, string[]> = {
  student: ["student", "students", "career changer", "career changers", "community college", "community colleges", "study", "research"],
  educator: ["educator", "educators", "teacher", "teachers", "teaching", "student guidance", "feedback", "classroom", "education"],
  worker: ["employee", "employees", "worker", "workers", "career changer", "career changers", "productivity", "workplace"],
  entrepreneur: ["entrepreneur", "entrepreneurs", "small business", "business owner", "business owners", "marketing", "sales", "operations"],
};

const goalKeywords: Record<LearnGoal, string[]> = {
  "study-faster": ["study", "students", "learning", "understand", "academic"],
  "research-sources": ["research", "sources", "summarize", "reading", "readings", "documents", "notebooklm"],
  "prepare-projects": ["career", "resume", "presentation", "projects", "students"],
  "create-materials": ["teaching materials", "lesson", "lessons", "quiz", "educators", "education"],
  "responsible-use": ["responsible", "ethics", "privacy", "safety", "student guidance", "teaching"],
  "planning-feedback": ["planning", "feedback", "teaching", "educators", "save time"],
  "communicate-better": ["writing", "communication", "email", "documents", "productivity"],
  "summarize-docs": ["summarize", "documents", "meetings", "notes", "notebooklm", "sources"],
  "routine-tasks": ["routine", "tasks", "workflow", "automation", "productivity", "repeatable"],
  "plan-offer": ["business", "offer", "entrepreneur", "small business", "strategy"],
  "marketing-sales": ["marketing", "sales", "content", "customer", "campaign"],
  "operations-follow-up": ["operations", "follow-up", "workflow", "tasks", "customers", "systems"],
};

const toolKeywords: Record<LearnTool, string[]> = {
  chatgpt: ["chatgpt", "openai", "prompting", "prompt"],
  claude: ["claude", "anthropic"],
  gemini: ["gemini", "google"],
  copilot: ["copilot", "microsoft"],
  notebooklm: ["notebooklm", "google", "gemini", "source", "sources", "reading", "readings", "documents"],
};

function haystack(course: AiCourse) {
  return [
    course.title,
    course.provider,
    course.languages,
    course.accessModel,
    course.bestAudience,
    course.level,
    course.technicalIntensity,
    course.mainTopic,
    course.pathOrderLabel,
    course.fitReason,
  ]
    .join(" ")
    .toLowerCase();
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => (text.includes(keyword) ? score + 1 : score), 0);
}

function scoreLanguage(course: AiCourse, language: Language) {
  const languages = course.languages.toLowerCase();

  if (language === "es") {
    if (languages.includes("spanish")) return 8;
    if (languages.includes("english")) return 2;
  }

  if (language === "pt") {
    if (languages.includes("portuguese")) return 8;
    if (languages.includes("english")) return 2;
  }

  return languages.includes("english") ? 5 : 1;
}

function scoreAccess(course: AiCourse) {
  const access = course.accessModel.toLowerCase();
  if (access.includes("free")) return 4;
  if (access.includes("audit")) return 3;
  return 0;
}

function scorePathOrder(course: AiCourse, targetPathOrders: number[]) {
  if (!course.pathOrder) return 0;
  if (targetPathOrders.includes(course.pathOrder)) return 10;
  const closest = Math.min(...targetPathOrders.map((target) => Math.abs(target - course.pathOrder!)));
  return Math.max(0, 5 - closest * 2);
}

function scoreLevel(course: AiCourse, preferredLevels: string[]) {
  const level = course.level.toLowerCase();
  const index = preferredLevels.indexOf(level);
  if (index >= 0) return 6 - index * 2;
  if (level === "intermediate") return -2;
  return 0;
}

function scoreTechnicalIntensity(course: AiCourse) {
  const intensity = course.technicalIntensity.toLowerCase();
  if (!intensity) return 2;
  if (intensity === "low") return 3;
  if (intensity === "none") return 4;
  if (intensity === "moderate") return -1;
  return 0;
}

function scoreCourse(course: AiCourse, slot: CourseRecommendationSlot, input: LearnPlanInput, language: Language) {
  const profile = slotProfiles[slot];
  const text = haystack(course);
  let score = 0;

  score += scoreLanguage(course, language);
  score += scoreAccess(course);
  score += scorePathOrder(course, profile.targetPathOrders);
  score += scoreLevel(course, profile.preferredLevels);
  score += scoreTechnicalIntensity(course);
  score += countMatches(text, profile.keywords) * 3;
  score += countMatches(text, groupKeywords[input.group]) * 4;
  score += countMatches(text, goalKeywords[input.goal]) * 3;

  if (slot === "learn-tool") {
    score += countMatches(text, toolKeywords[input.tool]) * 8;
    if (input.tool === "notebooklm" && (text.includes("google") || text.includes("gemini"))) {
      score += 6;
    }
  } else {
    score += countMatches(text, toolKeywords[input.tool]) * 1;
  }

  if (slot === "understand-ai" && course.pathOrder && course.pathOrder > 2) {
    score -= 6;
  }

  if (slot === "use-role" && input.group === "educator") {
    score += countMatches(text, ["educator", "educators", "teaching", "student", "classroom", "feedback"]) * 5;
  }

  if (slot === "use-responsibly") {
    score += countMatches(text, ["responsible ai", "ethics", "privacy", "governance", "bias", "safety"]) * 8;
  }

  return score;
}

function rankCourses(slot: CourseRecommendationSlot, input: LearnPlanInput, language: Language, usedUrls: Set<string>) {
  return aiCourses
    .filter((course) => !usedUrls.has(course.url))
    .map((course) => ({ course, score: scoreCourse(course, slot, input, language) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((a.course.pathOrder ?? 99) !== (b.course.pathOrder ?? 99)) {
        return (a.course.pathOrder ?? 99) - (b.course.pathOrder ?? 99);
      }
      return a.course.title.localeCompare(b.course.title);
    });
}

export function getLearnCourseRecommendations(input: LearnPlanInput, language: Language = "en"): CourseRecommendation[] {
  const slots: CourseRecommendationSlot[] = ["understand-ai", "learn-tool", "use-role", "use-responsibly"];
  const usedUrls = new Set<string>();

  return slots.map((slot) => {
    const [best] = rankCourses(slot, input, language, usedUrls);
    usedUrls.add(best.course.url);
    return { slot, course: best.course };
  });
}
