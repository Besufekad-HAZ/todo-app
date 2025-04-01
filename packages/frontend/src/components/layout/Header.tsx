import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Lucide icons

interface HeaderProps {
  onMenuToggle: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ onMenuToggle, rightContent }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button and logo */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onMenuToggle();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              {/* Your logo */}
              <svg
                className="h-8 w-8 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                TaskMaster
              </span>
            </div>
          </div>

          {/* Right content area */}
          <div className="flex items-center">
            {rightContent && <div className="ml-4 flex items-center md:ml-6">{rightContent}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
