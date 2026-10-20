import { useState, useEffect } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "ssma_theme_preference";

function getSystemColorScheme(): ResolvedTheme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function useThemeMode() {
  // 1. Preferencia Inicial: estrictamente en Modo Claro ("light") al iniciar por primera vez
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(
    () => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "system" || stored === "light" || stored === "dark") {
          return stored;
        }
        // Primera ejecución: establecer estrictamente en Modo Claro y persistir
        localStorage.setItem(THEME_STORAGE_KEY, "light");
        return "light";
      } catch {
        return "light";
      }
    }
  );

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemColorScheme()
  );

  // 2. Sincronización Automática con la preferencia del sistema operativo
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Set initial system state
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older mobile WebViews
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const resolvedTheme: ResolvedTheme =
    themePreference === "system" ? systemTheme : themePreference;

  // Apply classes (.dark / .light) to <html> root element
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
  }, [resolvedTheme]);

  function setThemePreference(nextPref: ThemePreference) {
    setThemePreferenceState(nextPref);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextPref);
    } catch (e) {
      console.warn("No se pudo guardar la preferencia de tema:", e);
    }
  }

  return {
    themePreference,
    resolvedTheme,
    systemTheme,
    setThemePreference,
  };
}
