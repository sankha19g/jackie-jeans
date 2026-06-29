"use client";

import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((val) => val !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Dropdown Input / Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-background border border-gray-300 rounded-lg shadow-sm cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
      >
        <span className="truncate text-foreground/90 font-medium">
          {selectedValues.length > 0
            ? selectedValues.join(", ")
            : placeholder}
        </span>
        <span
          className={`ml-2 text-foreground/50 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-1">
            {options.map((option) => {
              const isChecked = selectedValues.includes(option);
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 select-none ${
                    isChecked
                      ? "bg-amber-700/10 text-amber-900 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-foreground/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleOption(option)}
                    className="h-5 w-5 rounded border-gray-300 text-amber-700 focus:ring-amber-500 accent-amber-700 cursor-pointer"
                  />
                  <span className="text-base">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
