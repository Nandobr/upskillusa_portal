"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLanguage,
  getPortalContent,
  type Language,
  type PortalContent,
} from "@/lib/content";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  content: PortalContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      content: getPortalContent(language),
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function usePortalContent() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("usePortalContent must be used within LanguageProvider");
  }

  return context;
}
