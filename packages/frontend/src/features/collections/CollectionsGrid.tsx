import { useState } from 'react';
import {
  useGetCollectionsQuery,
  useToggleFavoriteMutation,
  useGetCollectionStatsQuery,
  useCompleteTaskMutation, // <-- import mutation
} from '../../services/api';
import { Collection } from '../../types/types';
import { FaSchool, FaUser, FaPaintBrush, FaShoppingCart, FaPlus, FaStar } from 'react-icons/fa';

interface CollectionsGridProps {
  onSelect: (id: number) => void;
}

interface CollectionCardProps {
  collection: Collection;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

function CollectionCard({ collection, onSelect, onToggleFavorite }: CollectionCardProps) {
  // Fetch real-time stats
  const { data: stats } = useGetCollectionStatsQuery(collection.id, {
    pollingInterval: 30000,
  });
  const taskCount = stats?.taskCount ?? collection.taskCount;
  const completedCount = stats?.completedCount ?? collection.completedCount;
  const completionPercentage = taskCount ? Math.round(((completedCount || 0) / taskCount) * 100) : 0;
  const normalizedCollectionName = collection.name.toLowerCase().trim();

  // Mutation for completing task
  const [completeTask] = useCompleteTaskMutation();
  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTask(taskId).unwrap();
      // RTK Query will handle cache invalidation automatically
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

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
            className="stroke-gray-700"
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
        <span className="absolute text-white text-xs font-medium">{percentage}%</span>
      </div>
    );
  };

  const getCompletionText = () => {
    if (collection.taskCount === 0) return 'No tasks yet';
    if (collection.completedCount === collection.taskCount)
      return `All ${collection.taskCount} done!`;
    return `${collection.completedCount}/${collection.taskCount} done`;
  };

  return (
    <div
      onClick={() => onSelect(collection.id)}
      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 h-52 flex flex-col"
    >
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg ${getIconBgColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(collection.id);
          }}
          className="text-gray-400 hover:text-yellow-400"
        >
          <FaStar className={`h-5 w-5 ${collection.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
        </button>
      </div>
      <div className="mt-4 flex-grow flex flex-col justify-center items-center">
        <h3 className="font-medium text-white text-xl sm:text-2xl mb-3">
          {collection.name.charAt(0).toLocaleUpperCase() + collection.name.slice(1)}
        </h3>
        <CircularProgress percentage={completionPercentage} color={getProgressColor()} />
        <div className="mt-3 text-xs sm:text-sm text-gray-300">{getCompletionText()}</div>
        {/* New button to complete a task (using collection.id as demo taskId)
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCompleteTask(collection.id);
          }}
          className="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
        >
          Complete Task
        </button> */}
      </div>
    </div>
  );
}

export function CollectionsGrid({ onSelect }: CollectionsGridProps) {
  const { data: collections, isLoading } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [activeTab, setActiveTab] = useState<'favorites' | 'all'>('all');

  if (isLoading) return <div className="text-center text-gray-400">Loading collections...</div>;

  const displayedCollections =
    activeTab === 'favorites' ? collections?.filter((c) => c.isFavorite) : collections;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Collections</h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'favorites' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
          />
        ))}
        {/* Add Collection Card */}
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors h-52">
          <div className="flex flex-col items-center text-gray-400 hover:text-gray-300">
            <FaPlus className="h-8 w-8" />
            <span className="mt-2 text-sm font-medium">Add Collection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
