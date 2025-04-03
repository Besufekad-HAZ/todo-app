import { useNavigate, Link } from 'react-router-dom';
import { CollectionsGrid } from './CollectionsGrid';
import { MobileSidebar } from '../../components/layout/MobileSidebar';

interface CollectionsPageProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export function CollectionsPage({ mobileSidebarOpen, setMobileSidebarOpen }: CollectionsPageProps) {
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded-md hover:bg-sidebar-hover"
              onClick={() => setMobileSidebarOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/collections"
              className="block px-4 py-2 rounded-md hover:bg-sidebar-hover"
              onClick={() => setMobileSidebarOpen(false)}
            >
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
