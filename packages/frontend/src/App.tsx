import { useState } from 'react';
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
import { CollectionsPage } from './features/collections/CollectionsPage';

export function App() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="min-h-screen flex flex-col transition-colors duration-200">
          <Header onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

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
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedCollectionId ? (
          <>
            <div
              className="p-4 border-b flex justify-between items-center"
              style={{ borderColor: 'rgb(var(--color-border))' }}
            >
              <div className="flex items-center">
                <button
                  className="mr-2 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => navigate('/collections')}
                  style={{ color: 'rgb(var(--color-text-muted))' }}
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
                <h2 className="text-xl font-semibold">School</h2>
                <button className="ml-2" style={{ color: 'rgb(var(--color-text-muted))' }}>
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
                className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md shadow-sm transition-colors hover:bg-primary-hover"
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
            description="Select a collection from the menu to view tasks"
          />
        )}
      </main>

      {showTaskForm && selectedCollectionId && (
        <TaskForm collectionId={selectedCollectionId} onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}

export default App;
