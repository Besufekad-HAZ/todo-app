import { useGetCollectionsQuery, useToggleFavoriteMutation } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Collection } from '../../types/types';

interface CollectionListProps {
  onSelect: (id: number) => void;
  viewMode?: 'sidebar' | 'grid';
}

export function CollectionList({ onSelect, viewMode = 'sidebar' }: CollectionListProps) {
  const { data: collections } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const getCollectionIdFromPath = () => {
    const pathParts = location.pathname.split('/');
    const idPart = pathParts[pathParts.length - 1];
    return !isNaN(Number(idPart)) ? Number(idPart) : null;
  };

  const currentCollectionId = getCollectionIdFromPath();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Collections</h2>

        {/* Collections */}
        <div className="space-y-1">
          {collections?.map((collection) => (
            <SidebarCollectionItem
              key={collection.id}
              collection={collection}
              isActive={collection.id === currentCollectionId}
              onSelect={() => {
                onSelect(collection.id);
                navigate(`/dashboard/${collection.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SidebarCollectionItemProps {
  collection: Collection;
  isActive: boolean;
  onSelect: () => void;
}

function SidebarCollectionItem({ collection, isActive, onSelect }: SidebarCollectionItemProps) {
  // Get color based on collection name
  const getIconBgColor = (name: string) => {
    const colors: Record<string, string> = {
      School: 'bg-pink-500',
      Personal: 'bg-teal-500',
      Design: 'bg-purple-500',
      Groceries: 'bg-yellow-500',
    };

    return colors[name] || 'bg-gray-500';
  };

  const getIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      School: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
      Personal: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      Design: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      Groceries: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    };

    return (
      icons[name] || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`py-2.5 px-3 rounded-md flex items-center cursor-pointer transition-colors ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${getIconBgColor(collection.name)} flex items-center justify-center text-white mr-3`}
      >
        {getIcon(collection.name)}
      </div>
      <span className="text-white font-medium">{collection.name}</span>
    </div>
  );
}

