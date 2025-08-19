"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Tech", href: "/tech" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const accentColors = [
  { name: "Blue", value: "hsl(210, 100%, 50%)" },
  { name: "Purple", value: "hsl(270, 100%, 50%)" },
  { name: "Pink", value: "hsl(330, 100%, 50%)" },
  { name: "Orange", value: "hsl(30, 100%, 50%)" },
  { name: "Green", value: "hsl(150, 100%, 40%)" },
  { name: "Cyan", value: "hsl(180, 100%, 40%)" },
  { name: "Red", value: "hsl(0, 100%, 50%)" },
  { name: "Yellow", value: "hsl(60, 100%, 45%)" },
];

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Always call useTheme hook (required by Rules of Hooks)
  const {
    theme,
    accentColor,
    toggleTheme,
    setAccentColor,
    prefersReducedMotion,
  } = useTheme();

  // Get theme context after mount to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Portfolio
          </Link>

          {/* Navigation */}
          <nav
            id="navigation"
            className="hidden md:flex items-center space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                  {isActive && !prefersReducedMotion && mounted && (
                    <motion.div
                      className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {isActive && (prefersReducedMotion || !mounted) && (
                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Theme Controls */}
          <div className="flex items-center space-x-2">
            {/* Accent Color Picker */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Change accent color"
              >
                <Palette className="h-4 w-4" />
              </Button>

              <div className="absolute right-0 top-full mt-2 p-2 bg-popover border border-border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                <div className="grid grid-cols-4 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        accentColor === color.value
                          ? "border-foreground scale-110"
                          : "border-border hover:scale-105"
                      )}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Set accent color to ${color.name}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <nav
          className="container mx-auto px-4 py-2"
          role="navigation"
          aria-label="Mobile navigation"
          aria-describedby="mobile-nav-description"
        >
          <span id="mobile-nav-description" className="sr-only">
            Mobile navigation menu with the same links as the main navigation
          </span>
          <div className="flex justify-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-xs font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
