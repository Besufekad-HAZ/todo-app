import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Toaster } from './components/ui/Toaster';
import { CollectionsPage } from './features/collections/CollectionsPage';
import { DashboardPage } from './components/layout/DashboardPage';

export function App() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/collections" replace />} />
          <Route
            path="/collections"
            element={
              <CollectionsPage
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
              />
            }
          />
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
    </Router>
  );
}

export default App;
