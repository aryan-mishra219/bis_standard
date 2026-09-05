"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "", showLabel = false, compact = false }) {
  const { theme, toggleTheme, mounted } = useTheme();

  // If not yet mounted on client, default to displaying light mode state so it matches SSR
  const isDark = mounted ? theme === "dark" : false;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      type="button"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative inline-flex items-center gap-2 rounded-lg border transition-all duration-200 btn-press cursor-pointer select-none ${
        isDark
          ? "bg-slate-900/90 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(251,191,36,0.15)]"
          : "bg-white/90 border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-blue-400/50 hover:text-blue-600 hover:shadow-xs"
      } ${compact ? "w-8 h-8 justify-center p-0" : "px-3 py-1.5 text-xs font-semibold"} ${className}`}
    >
      {isDark ? (
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-45 text-amber-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-rotate-12 text-slate-600 group-hover:text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}

      {showLabel && (
        <span className="tracking-wide">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
