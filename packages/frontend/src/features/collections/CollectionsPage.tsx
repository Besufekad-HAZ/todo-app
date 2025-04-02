import { useNavigate } from 'react-router-dom';
import { CollectionsGrid } from './CollectionsGrid';

export function CollectionsPage() {
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
