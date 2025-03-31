import { useState } from 'react';
import { CollectionList } from './features/collections/CollectionList';
import { TaskList } from './features/tasks/TaskList';
import { TaskForm } from './features/tasks/TaskForm';
import { Toaster } from './components/ui/Toaster';
import { Header } from './components/layout/Header';
import { ThemeToggle } from './components/ThemeToogle';
import { MobileSidebar } from './components/layout/MobileSidebar';

export function App() {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        rightContent={<ThemeToggle />}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto">
          <CollectionList
            onSelect={(id) => {
              setSelectedCollection(id);
              setMobileSidebarOpen(false);
            }}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
          <CollectionList
            onSelect={(id) => {
              setSelectedCollection(id);
              setMobileSidebarOpen(false);
            }}
          />
        </MobileSidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
          {selectedCollection ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <button onClick={() => setShowTaskForm(true)} className="btn-primary">
                  Add Task
                </button>
              </div>
              <TaskList collectionId={selectedCollection} />
            </>
          ) : (
            <EmptyState onAddCollection={() => {}} />
          )}
        </main>
      </div>

      {showTaskForm && selectedCollection && (
        <TaskForm collectionId={selectedCollection} onClose={() => setShowTaskForm(false)} />
      )}

      <Toaster />
    </div>
  );
}

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-12 h-12 text-primary-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No collection selected</h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Select a collection from the sidebar to view tasks
    </p>
  </div>
);

export default App;
