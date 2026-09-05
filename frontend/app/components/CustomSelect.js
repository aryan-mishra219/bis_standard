"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "left",
  size = "md", // "sm", "md", "lg"
  icon = null,
  disabled = false,
  ariaLabel = "Select dropdown",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label, subtitle, badge }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-3 py-2 text-xs sm:text-sm rounded-xl gap-2",
    lg: "px-4 py-2.5 text-sm rounded-xl gap-2.5",
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between text-left font-medium transition-all duration-150 border select-none cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-[#111827]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-slate-400 dark:hover:border-slate-600"
        } text-slate-900 dark:text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>}
          <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <svg
          className={`w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600 dark:text-sky-400" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 mt-1.5 max-h-64 w-full min-w-45 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700/90 bg-white dark:bg-[#111827] p-1 shadow-xl ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-md ${
              align === "right" ? "right-0" : "left-0"
            } ${menuClassName}`}
            role="listbox"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-medium"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.subtitle && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate mt-0.5">
                        {opt.subtitle}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <svg
                      className="w-4 h-4 shrink-0 text-blue-600 dark:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
