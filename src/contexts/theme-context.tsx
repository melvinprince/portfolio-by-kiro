"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  accentColor: string;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
  prefersReducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Generate a unique accent color based on a seed
function generateAccentColor(seed?: string): string {
  const colors = [
    "hsl(210, 100%, 50%)", // Blue
    "hsl(270, 100%, 50%)", // Purple
    "hsl(330, 100%, 50%)", // Pink
    "hsl(30, 100%, 50%)", // Orange
    "hsl(150, 100%, 40%)", // Green
    "hsl(180, 100%, 40%)", // Cyan
    "hsl(0, 100%, 50%)", // Red
    "hsl(60, 100%, 45%)", // Yellow
  ];

  if (seed) {
    const hash = seed.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }

  return colors[Math.floor(Math.random() * colors.length)];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [accentColor, setAccentColorState] = useState<string>("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("portfolio-theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    }

    // Load or generate accent color
    const savedAccent = localStorage.getItem("portfolio-accent");
    if (savedAccent) {
      setAccentColorState(savedAccent);
    } else {
      const generatedColor = generateAccentColor(
        typeof navigator !== "undefined" ? navigator.userAgent : "default"
      );
      setAccentColorState(generatedColor);
      localStorage.setItem("portfolio-accent", generatedColor);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || !accentColor) return;

    // Convert HSL to CSS custom property
    const hslMatch = accentColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      document.documentElement.style.setProperty("--accent-h", h);
      document.documentElement.style.setProperty("--accent-s", `${s}%`);
      document.documentElement.style.setProperty("--accent-l", `${l}%`);
      document.documentElement.style.setProperty(
        "--accent",
        `${h} ${s}% ${l}%`
      );
    }

    localStorage.setItem("portfolio-accent", accentColor);
  }, [accentColor, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  // Provide default values during SSR/initial render
  const contextValue = {
    theme: mounted ? theme : ("light" as const),
    accentColor: mounted ? accentColor : "hsl(210, 100%, 50%)",
    toggleTheme,
    setAccentColor,
    prefersReducedMotion: mounted ? prefersReducedMotion : false,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
