"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultDraft,
  planStorageKey,
  type AdaptPlanInput,
  type ImplementPlanInput,
  type InspirePlanInput,
  type LearnPlanInput,
  type PlanDraft,
} from "@/lib/plan";

type PlanContextValue = {
  draft: PlanDraft;
  updateInspire: (input: InspirePlanInput) => void;
  updateLearn: (input: LearnPlanInput) => void;
  updateAdapt: (input: AdaptPlanInput) => void;
  updateImplement: (input: ImplementPlanInput) => void;
  clearPlan: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function readStoredDraft(): PlanDraft {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(planStorageKey);
    if (!saved) return {};
    return JSON.parse(saved) as PlanDraft;
  } catch {
    return {};
  }
}

function writeStoredDraft(draft: PlanDraft) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(planStorageKey, JSON.stringify(draft));
  } catch {
    // Browser storage can be unavailable in private or locked-down contexts.
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PlanDraft>(() => readStoredDraft());

  useEffect(() => {
    writeStoredDraft(draft);
  }, [draft]);

  const updateInspire = useCallback((input: InspirePlanInput) => {
    setDraft((current) => ({ ...current, inspire: input }));
  }, []);

  const updateLearn = useCallback((input: LearnPlanInput) => {
    setDraft((current) => ({ ...current, learn: input }));
  }, []);

  const updateAdapt = useCallback((input: AdaptPlanInput) => {
    setDraft((current) => ({ ...current, adapt: input }));
  }, []);

  const updateImplement = useCallback((input: ImplementPlanInput) => {
    setDraft((current) => ({ ...current, implement: input }));
  }, []);

  const clearPlan = useCallback(() => {
    setDraft({});
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(planStorageKey);
      } catch {
        // No-op: clearing UI state is still useful if storage is unavailable.
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      draft,
      updateInspire,
      updateLearn,
      updateAdapt,
      updateImplement,
      clearPlan,
    }),
    [clearPlan, draft, updateAdapt, updateImplement, updateInspire, updateLearn],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlanDraft() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error("usePlanDraft must be used within PlanProvider");
  }

  return context;
}

export function mergeWithDefaults(draft: PlanDraft): Required<PlanDraft> {
  return {
    inspire: { ...defaultDraft.inspire, ...draft.inspire },
    learn: { ...defaultDraft.learn, ...draft.learn },
    adapt: { ...defaultDraft.adapt, ...draft.adapt },
    implement: { ...defaultDraft.implement, ...draft.implement },
  };
}
