// src/App.tsx
import { useState } from 'react';
import { CollectionList } from './features/collections/CollectionList';
import { TaskList } from './features/tasks/TaskList';
import { TaskForm } from './features/tasks/TaskForm';
import { Toaster } from './components/ui/Toaster';
import { Header } from './components/layout/Header';
import { ThemeToggle } from './components/ThemeToogle';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { EmptyState } from './components/ui/EmptyState';

export function App() {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors"
                >
                  Add Task
                </button>
              </div>
              <TaskList collectionId={selectedCollection} />
            </>
          ) : (
            <EmptyState
              icon="collection"
              title="No collection selected"
              description="Select a collection from the sidebar to view tasks"
            />
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

export default App;
