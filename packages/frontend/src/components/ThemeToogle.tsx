// src/components/ThemeToggle.tsx
import { useState, useRef, useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme, resetTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine if the current theme is system-based
  const isSystemTheme = (() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('theme');
  })();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Theme settings"
      >
        {isDarkMode ? (
          <MoonIcon className="size-5 text-yellow-300" />
        ) : (
          <SunIcon className="size-5 text-yellow-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Theme
          </div>

          <button
            className={`px-4 py-2 text-sm w-full text-left flex items-center space-x-2 ${
              !isDarkMode && !isSystemTheme
                ? 'text-pink-500 dark:text-pink-400 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => {
              localStorage.setItem('theme', 'light');
              setIsOpen(false);
              if (isDarkMode) toggleTheme();
            }}
          >
            <SunIcon className="size-4" />
            <span>Light</span>
          </button>

          <button
            className={`px-4 py-2 text-sm w-full text-left flex items-center space-x-2 ${
              isDarkMode && !isSystemTheme
                ? 'text-pink-500 dark:text-pink-400 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => {
              localStorage.setItem('theme', 'dark');
              setIsOpen(false);
              if (!isDarkMode) toggleTheme();
            }}
          >
            <MoonIcon className="size-4" />
            <span>Dark</span>
          </button>

          <button
            className={`px-4 py-2 text-sm w-full text-left flex items-center space-x-2 ${
              isSystemTheme
                ? 'text-pink-500 dark:text-pink-400 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => {
              resetTheme();
              setIsOpen(false);
            }}
          >
            <ComputerDesktopIcon className="size-4" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
