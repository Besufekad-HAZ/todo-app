import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { CollectionList } from './features/collections/CollectionList';
import { TaskList } from './features/tasks/TaskList';
import { TaskForm } from './features/tasks/TaskForm';
import { Toaster } from './components/ui/Toaster';
import { Header } from './components/layout/Header';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { EmptyState } from './components/ui/EmptyState';
import { CollectionsGrid } from './features/collections/CollectionsGrid';

export function App() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-200">
          <Header
            onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeChange}
          />

          <Routes>
            <Route path="/" element={<Navigate to="/collections" replace />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route
              path="/dashboard/:collectionId?"
              element={
                <DashboardPage
                  showTaskForm={showTaskForm}
                  setShowTaskForm={setShowTaskForm}
                  mobileSidebarOpen={mobileSidebarOpen}
                  setMobileSidebarOpen={setMobileSidebarOpen}
                />
              }
            />
          </Routes>

          <Toaster />
        </div>
      </div>
    </Router>
  );
}

// Dashboard page component
function DashboardPage({
  showTaskForm,
  setShowTaskForm,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: {
  showTaskForm: boolean;
  setShowTaskForm: (show: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}) {
  const { collectionId } = useParams<{ collectionId?: string }>();
  const navigate = useNavigate();
  const selectedCollectionId = collectionId ? parseInt(collectionId) : null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
        <CollectionList onSelect={(id) => navigate(`/dashboard/${id}`)} viewMode="sidebar" />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
        <CollectionList
          onSelect={(id) => {
            navigate(`/dashboard/${id}`);
            setMobileSidebarOpen(false);
          }}
          viewMode="sidebar"
        />
      </MobileSidebar>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-900 text-white">
        {selectedCollectionId ? (
          <>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <button
                  className="mr-2 text-gray-400 hover:text-gray-300"
                  onClick={() => navigate('/collections')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-white">School</h2>
                <button className="ml-2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center px-3 py-1.5 bg-pink-500 text-white rounded-md shadow-sm transition-colors hover:bg-pink-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Add a task</span>
              </button>
            </div>
            <TaskList collectionId={selectedCollectionId} />
          </>
        ) : (
          <EmptyState
            icon="collection"
            title="No collection selected"
            description="Select a collection to view tasks"
          />
        )}
      </main>

      {showTaskForm && selectedCollectionId && (
        <TaskForm collectionId={selectedCollectionId} onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}

// Collections page component
function CollectionsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 overflow-auto bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <button className="text-gray-400 hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <CollectionsGrid onSelect={(id) => navigate(`/dashboard/${id}`)} />
      </div>
    </div>
  );
}

export default App;
