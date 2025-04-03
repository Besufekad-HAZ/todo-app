import { useGetCollectionsQuery } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Collection } from '../../types/types';
import { FaSchool, FaUser, FaPaintBrush, FaShoppingCart, FaPlus } from 'react-icons/fa';

interface CollectionListProps {
  onSelect: (id: number) => void;
  viewMode?: 'sidebar' | 'grid';
}

interface SidebarCollectionItemProps {
  collection: Collection;
  isActive: boolean;
  onSelect: () => void;
}

export function CollectionList({ onSelect }: CollectionListProps) {
  const { data: collections } = useGetCollectionsQuery();
  // const [toggleFavorite] = useToggleFavoriteMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const getCollectionIdFromPath = () => {
    const pathParts = location.pathname.split('/');
    const idPart = pathParts[pathParts.length - 1];
    return !isNaN(Number(idPart)) ? Number(idPart) : null;
  };

  const currentCollectionId = getCollectionIdFromPath();

  // Custom CSS variables for sidebar colors that change with theme
  const sidebarStyle = {
    '--sidebar-bg': 'var(--color-sidebar-bg)',
    '--sidebar-text': 'var(--color-sidebar-text)',
    '--sidebar-hover': 'var(--color-sidebar-hover)',
    '--sidebar-active': 'var(--color-primary)',
  } as React.CSSProperties;

  return (
    <div
      className="w-full h-full overflow-y-auto transition-colors duration-300"
      style={sidebarStyle}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6 text-white dark:text-gray-100">Collections</h2>
        <div className="space-y-2">
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

function SidebarCollectionItem({ collection, isActive, onSelect }: SidebarCollectionItemProps) {
  // Normalize name for matching
  const normalizedName = collection.name.toLowerCase().trim();

  const getIcon = () => {
    switch (normalizedName) {
      case 'school':
        return <FaSchool className="h-5 w-5 text-white" />;
      case 'personal':
        return <FaUser className="h-5 w-5 text-white" />;
      case 'design':
        return <FaPaintBrush className="h-5 w-5 text-white" />;
      case 'groceries':
        return <FaShoppingCart className="h-5 w-5 text-white" />;
      default:
        return <FaPlus className="h-5 w-5 text-white" />;
    }
  };

  const getIconBgColor = (name: string) => {
    const mapping: Record<string, string> = {
      school: 'bg-pink-500',
      personal: 'bg-teal-500',
      design: 'bg-purple-500',
      groceries: 'bg-yellow-500',
    };
    return mapping[name.toLowerCase().trim()] || 'bg-pink-500';
  };

  return (
    <div
      onClick={onSelect}
      className={`relative py-2.5 px-3 rounded-md flex items-center cursor-pointer transition-all duration-200
        ${isActive ? 'bg-primary/20 border-l-4 border-white translate-x-2' : 'hover:bg-sidebar-hover/20'}`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${getIconBgColor(collection.name)} flex items-center justify-center text-white mr-3`}
      >
        {getIcon()}
      </div>
      <span className="font-medium text-white dark:text-white">{collection.name}</span>
      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
    </div>
  );
}
