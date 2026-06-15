"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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
  clearLearn: () => void;
  clearAdapt: () => void;
  clearImplement: () => void;
  clearPlan: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);
const emptyDraft: PlanDraft = {};
const storageSubscribers = new Set<() => void>();
let cachedRawDraft: string | null | undefined;
let cachedDraft: PlanDraft = emptyDraft;

function parseStoredDraft(rawDraft: string | null): PlanDraft {
  if (!rawDraft) return emptyDraft;

  try {
    return JSON.parse(rawDraft) as PlanDraft;
  } catch {
    return emptyDraft;
  }
}

function readStoredDraftSnapshot(): PlanDraft {
  if (typeof window === "undefined") return {};

  try {
    const rawDraft = window.localStorage.getItem(planStorageKey);
    if (rawDraft === cachedRawDraft) return cachedDraft;

    cachedRawDraft = rawDraft;
    cachedDraft = parseStoredDraft(rawDraft);
    return cachedDraft;
  } catch {
    return emptyDraft;
  }
}

function writeStoredDraft(draft: PlanDraft) {
  if (typeof window === "undefined") return;

  try {
    const rawDraft = JSON.stringify(draft);
    window.localStorage.setItem(planStorageKey, rawDraft);
    cachedRawDraft = rawDraft;
    cachedDraft = draft;
  } catch {
    // Browser storage can be unavailable in private or locked-down contexts.
  }
}

function removeStoredDraft() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(planStorageKey);
    cachedRawDraft = null;
    cachedDraft = emptyDraft;
  } catch {
    // No-op: clearing UI state is still useful if storage is unavailable.
  }
}

function emitStoredDraftChange() {
  storageSubscribers.forEach((callback) => callback());
}

function subscribeToStoredDraft(callback: () => void) {
  storageSubscribers.add(callback);

  if (typeof window !== "undefined") {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === planStorageKey) callback();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      storageSubscribers.delete(callback);
      window.removeEventListener("storage", handleStorage);
    };
  }

  return () => {
    storageSubscribers.delete(callback);
  };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const draft = useSyncExternalStore(
    subscribeToStoredDraft,
    readStoredDraftSnapshot,
    () => emptyDraft,
  );

  const updateInspire = useCallback((input: InspirePlanInput) => {
    writeStoredDraft({ ...readStoredDraftSnapshot(), inspire: input });
    emitStoredDraftChange();
  }, []);

  const updateLearn = useCallback((input: LearnPlanInput) => {
    writeStoredDraft({ ...readStoredDraftSnapshot(), learn: input });
    emitStoredDraftChange();
  }, []);

  const clearLearn = useCallback(() => {
    const nextDraft = { ...readStoredDraftSnapshot() };
    delete nextDraft.learn;
    writeStoredDraft(nextDraft);
    emitStoredDraftChange();
  }, []);

  const updateAdapt = useCallback((input: AdaptPlanInput) => {
    writeStoredDraft({ ...readStoredDraftSnapshot(), adapt: input });
    emitStoredDraftChange();
  }, []);

  const clearAdapt = useCallback(() => {
    const nextDraft = { ...readStoredDraftSnapshot() };
    delete nextDraft.adapt;
    writeStoredDraft(nextDraft);
    emitStoredDraftChange();
  }, []);

  const updateImplement = useCallback((input: ImplementPlanInput) => {
    writeStoredDraft({ ...readStoredDraftSnapshot(), implement: input });
    emitStoredDraftChange();
  }, []);

  const clearImplement = useCallback(() => {
    const nextDraft = { ...readStoredDraftSnapshot() };
    delete nextDraft.implement;
    writeStoredDraft(nextDraft);
    emitStoredDraftChange();
  }, []);

  const clearPlan = useCallback(() => {
    removeStoredDraft();
    emitStoredDraftChange();
  }, []);

  const value = useMemo(
    () => ({
      draft,
      updateInspire,
      updateLearn,
      updateAdapt,
      updateImplement,
      clearLearn,
      clearAdapt,
      clearImplement,
      clearPlan,
    }),
    [
      clearAdapt,
      clearImplement,
      clearLearn,
      clearPlan,
      draft,
      updateAdapt,
      updateImplement,
      updateInspire,
      updateLearn,
    ],
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
    inspire: {
      ...defaultDraft.inspire,
      ...draft.inspire,
      assessment: {
        ...defaultDraft.inspire.assessment,
        ...draft.inspire?.assessment,
      },
    },
    learn: { ...defaultDraft.learn, ...draft.learn },
    adapt: { ...defaultDraft.adapt, ...draft.adapt },
    implement: { ...defaultDraft.implement, ...draft.implement },
  };
}
