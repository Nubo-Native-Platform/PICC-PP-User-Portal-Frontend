import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/theme.context";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      style={{
        color: "var(--text-color-tertiary)",
      }}
      className="inline-flex items-center justify-center p-2 rounded hover:text-[var(--text-color-secondary)] hover:bg-transparent focus:outline-none focus:ring transition-colors"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
