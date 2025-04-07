import { useState, useEffect, useMemo } from 'react';
import {
  useGetCollectionsQuery,
  useToggleFavoriteMutation,
  useGetCollectionStatsQuery,
  useCreateCollectionMutation, // <-- NEW hook
  useDeleteCollectionMutation, // <-- NEW hook (ensure you've added this endpoint in your API slice)
} from '../../services/api';
import { Collection } from '../../types/types';
import {
  FaSchool,
  FaUser,
  FaPaintBrush,
  FaShoppingCart,
  FaPlus,
  FaStar,
  FaTrash, // <-- NEW icon for delete
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CollectionsGridProps {
  onSelect: (id: number) => void;
}

interface CollectionCardProps {
  collection: Collection;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void; // <-- NEW prop for deletion
}

function CollectionCard({ collection, onSelect, onToggleFavorite, onDelete }: CollectionCardProps) {
  const {
    data: stats,
    isFetching,
    refetch,
  } = useGetCollectionStatsQuery(collection.id, {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => refetch(), 500);
    return () => clearTimeout(timer);
  }, [collection.taskCount, collection.completedCount, refetch]);

  const taskCount = stats?.taskCount ?? 0;
  const completedCount = stats?.completedCount ?? 0;

  const completionPercentage = useMemo(() => {
    if (taskCount <= 0) return 0;
    const calculated = (completedCount / taskCount) * 100;
    return Math.min(100, Math.max(0, Math.round(calculated)));
  }, [taskCount, completedCount]);

  const normalizedCollectionName = collection.name.toLowerCase().trim();

  const getIcon = () => {
    switch (normalizedCollectionName) {
      case 'school':
        return <FaSchool className="text-white text-xl" />;
      case 'personal':
        return <FaUser className="text-white text-xl" />;
      case 'design':
        return <FaPaintBrush className="text-white text-xl" />;
      case 'groceries':
        return <FaShoppingCart className="text-white text-xl" />;
      default:
        return <FaPlus className="text-white text-xl" />;
    }
  };

  const getIconBgColor = () => {
    switch (normalizedCollectionName) {
      case 'school':
        return 'bg-pink-500';
      case 'personal':
        return 'bg-teal-500';
      case 'design':
        return 'bg-purple-500';
      case 'groceries':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressColor = () => {
    switch (normalizedCollectionName) {
      case 'school':
        return 'text-pink-500';
      case 'personal':
        return 'text-teal-500';
      case 'design':
        return 'text-purple-500';
      case 'groceries':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="dark:stroke-gray-700 stroke-gray-200"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            className={`stroke-current ${color}`}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>
        <span className="absolute text-xs font-medium" style={{ color: 'rgb(var(--color-text-base))' }}>
          {isFetching ? '...' : `${percentage.toFixed(0)}%`}
        </span>
      </div>
    );
  };

  const getCompletionText = () => {
    if (taskCount === 0) return 'No tasks yet';
    if (completedCount === taskCount) return `All ${taskCount} done!`;
    return `${completedCount}/${taskCount} done`;
  };

  // Determine if the collection is deletable (only allow deleting non-protected ones)
  const protectedCollections = ['school', 'personal', 'design', 'groceries'];
  const isDeletable = !protectedCollections.includes(normalizedCollectionName);

  return (
    <div
      onClick={() => onSelect(collection.id)}
      className="rounded-lg p-4 cursor-pointer transition-all duration-200 border h-52 flex flex-col shadow-sm transform"
      style={{
        backgroundColor: 'rgb(var(--color-card-bg))',
        borderColor: 'rgb(var(--color-card-border))',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgb(var(--color-card-hover))';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow =
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgb(var(--color-card-bg))';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg ${getIconBgColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(collection.id);
            }}
            className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
          >
            <FaStar className={`h-5 w-5 ${collection.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
          </button>
          {isDeletable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(collection.id);
              }}
              className="text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 flex-grow flex flex-col justify-center items-center">
        <h3 className="font-medium text-xl sm:text-2xl mb-3" style={{ color: 'rgb(var(--color-text-base))' }}>
          {collection.name.charAt(0).toUpperCase() + collection.name.slice(1)}
        </h3>
        <CircularProgress percentage={completionPercentage} color={getProgressColor()} />
        <div className="mt-3 text-xs sm:text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
          {getCompletionText()}
        </div>
      </div>
    </div>
  );
}

export function CollectionsGrid({ onSelect }: CollectionsGridProps) {
  const { data: collections, isLoading } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [createCollection] = useCreateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation(); // <-- NEW hook for deletion
  const [activeTab, setActiveTab] = useState<'favorites' | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  if (isLoading)
    return (
      <div className="text-center" style={{ color: 'rgb(var(--color-text-muted))' }}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2">Loading collections...</p>
      </div>
    );

  const displayedCollections =
    activeTab === 'favorites' ? collections?.filter((c) => c.isFavorite) : collections;

  const handleSaveNewCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await createCollection(newCollectionName).unwrap();
      setIsAdding(false);
      setNewCollectionName('');
    } catch (err) {
      console.error('Failed to create collection:', err);
    }
  };

  const handleDeleteCollection = async (id: number) => {
    try {
      await deleteCollection(id).unwrap();
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(var(--color-text-base))' }}>
          Collections
        </h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'favorites' ? 'bg-primary text-white' : 'bg-card-bg text-text-base hover:bg-card-hover'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'all' ? 'bg-primary text-white' : 'bg-card-bg text-text-base hover:bg-card-hover'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedCollections?.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onSelect={onSelect}
            onToggleFavorite={toggleFavorite}
            onDelete={handleDeleteCollection}
          />
        ))}
        {isAdding ? (
          <div
            className="rounded-lg p-4 flex flex-col justify-center border shadow-sm transform h-52"
            style={{
              backgroundColor: 'rgb(var(--color-card-bg))',
              borderColor: 'rgb(var(--color-card-border))',
            }}
          >
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection Name"
              className="mb-4 px-3 py-2 border rounded focus:outline-none"
            />
            <div className="flex justify-around">
              <button
                onClick={handleSaveNewCollection}
                className="px-4 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewCollectionName('');
                }}
                className="px-4 py-1 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg p-4 flex items-center justify-center border cursor-pointer transition-all duration-200 h-52 shadow-sm transform hover-card-effect"
            style={{
              backgroundColor: 'rgb(var(--color-card-bg))',
              borderColor: 'rgb(var(--color-card-border))',
            }}
            onClick={() => setIsAdding(true)}
          >
            <motion.div
              className="flex flex-col items-center"
              style={{ color: 'rgb(var(--color-text-muted))' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              >
                <FaPlus className="h-8 w-8" />
              </motion.div>
              <span className="mt-2 text-sm font-medium">Add Collection</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
