import { useNavigate, Link } from 'react-router-dom';
import { CollectionsGrid } from './CollectionsGrid';
import { MobileSidebar } from '../../components/layout/MobileSidebar';

interface CollectionsPageProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export function CollectionsPage({ mobileSidebarOpen, setMobileSidebarOpen }: CollectionsPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 overflow-hidden">
      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 text-sidebar-text">Menu</h2>
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="mobile-sidebar-link"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/collections"
              className="mobile-sidebar-link"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Collections
            </Link>
          </nav>
        </div>
      </MobileSidebar>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <CollectionsGrid onSelect={(id) => navigate(`/dashboard/${id}`)} />
          </div>
        </div>
      </main>
    </div>
  );
}
