"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLanguage,
  getPortalContent,
  languages,
  type Language,
  type PortalContent,
} from "@/lib/content";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  content: PortalContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const languageStorageKey = "upskillusa.language.v1";

const documentLanguage: Record<Language, string> = {
  en: "en",
  es: "es",
  pt: "pt-BR",
};

function parseLanguage(value: unknown): Language | undefined {
  return typeof value === "string" && languages.includes(value as Language)
    ? (value as Language)
    : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const hydratedLanguage = useRef(false);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(languageStorageKey, nextLanguage);
    } catch {
      /* Ignore unavailable storage. */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        const storedLanguage = parseLanguage(window.localStorage.getItem(languageStorageKey));
        if (storedLanguage) {
          setLanguageState(storedLanguage);
        }
      } catch {
        /* Ignore unavailable storage. */
      } finally {
        hydratedLanguage.current = true;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedLanguage.current) return;

    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      /* Ignore unavailable storage. */
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = documentLanguage[language];
  }, [language]);

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
