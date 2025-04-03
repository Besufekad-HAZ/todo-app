import { useNavigate, Link } from 'react-router-dom';
import { CollectionsGrid } from './CollectionsGrid';
import { useState } from 'react';
import { MobileSidebar } from '../../components/layout/MobileSidebar';
// import { CollectionList } from './CollectionList';

export function CollectionsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 overflow-auto bg-bg-primary text-text-base">
      {/* Mobile Menu */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <nav className="space-y-2">
            <Link to="/dashboard" className="block px-4 py-2 rounded-md hover:bg-sidebar-hover">
              Dashboard
            </Link>
            <Link to="/collections" className="block px-4 py-2 rounded-md hover:bg-sidebar-hover">
              Collections
            </Link>
          </nav>
        </div>
      </MobileSidebar>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-text-muted hover:text-primary"
          >
            {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <button style={{ color: 'rgb(var(--color-text-muted))' }} className="hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div> */}
          </button>
        </div>
        <CollectionsGrid onSelect={(id) => navigate(`/dashboard/${id}`)} />
      </div>
    </div>
  );
}
