import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shadow-md"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-blue-200" />
      )}
    </button>
  );
} 