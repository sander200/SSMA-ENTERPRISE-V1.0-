import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, translations, TranslationDictionary } from "./translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary) => string;
  dict: TranslationDictionary;
  languages: {
    code: SupportedLanguage;
    label: string;
    flag: string;
    nativeName: string;
    description: string;
  }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const AVAILABLE_LANGUAGES: {
  code: SupportedLanguage;
  label: string;
  flag: string;
  nativeName: string;
  description: string;
}[] = [
  {
    code: "pt",
    label: "Português",
    nativeName: "Português (Brasil)",
    flag: "🇧🇷",
    description: "Normas Regulamentadoras MTE (NR-1 a NR-38, CIPA, PGR e PCMSO)",
  },
  {
    code: "es",
    label: "Español",
    nativeName: "Español",
    flag: "🇪🇸",
    description: "Seguridad y Salud en el Trabajo, prevención de riesgos y bienestar",
  },
  {
    code: "en",
    label: "English",
    nativeName: "English (US/UK)",
    flag: "🇺🇸",
    description: "Occupational Safety & Health Administration (OSHA / ISO 45001)",
  },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("ssma_locale");
    if (saved === "pt" || saved === "es" || saved === "en") {
      return saved;
    }
    // Check browser language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith("es")) return "es";
    if (navLang.startsWith("en")) return "en";
    return "pt";
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("ssma_locale", lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dict = translations[language];

  const t = (key: keyof TranslationDictionary): string => {
    return dict[key] || translations.pt[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dict,
        languages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
