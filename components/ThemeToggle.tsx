"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * ThemeToggle Component
 * Renders a button that allows the user to toggle between light and dark modes.
 * Displays a Moon icon in light mode and a Sun icon in dark mode.
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  // State to track if the component has mounted on the client to avoid SSR hydration mismatches
  const [mounted, setMounted] = useState(false);

  // set mounted to true after first client-side render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder placeholder div with same dimensions before mounting
  // to avoid layout shifts or hydration warnings
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-black dark:border-white transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-black" />
      ) : (
        <Sun className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

export default ThemeToggle;
