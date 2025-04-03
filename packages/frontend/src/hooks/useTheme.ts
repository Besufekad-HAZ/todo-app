// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export function useTheme() {
  // Initialize from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't set a manual preference
      const userTheme = localStorage.getItem('theme');
      if (!userTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Reset to system preference
  const resetTheme = () => {
    localStorage.removeItem('theme');
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  return { isDarkMode, toggleTheme, resetTheme };
}
