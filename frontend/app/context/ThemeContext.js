"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (targetTheme) => {
    if (typeof document !== "undefined") {
      const isDark = targetTheme === "dark";
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        if (document.body) document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        if (document.body) document.body.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("pramaan_theme");
      if (savedTheme === "dark") {
        setThemeState("dark");
        applyTheme("dark");
      } else {
        setThemeState("light");
        applyTheme("light");
        if (!savedTheme) {
          localStorage.setItem("pramaan_theme", "light");
        }
      }
    } catch {
      applyTheme("light");
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("pramaan_theme", nextTheme);
      } catch {
        // Ignore
      }
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("pramaan_theme", newTheme);
    } catch {
      // Ignore
    }
    applyTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
