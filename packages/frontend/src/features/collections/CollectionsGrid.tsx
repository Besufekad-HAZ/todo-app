// src/features/collections/CollectionsGrid.tsx
import { useState } from 'react';
import { useGetCollectionsQuery, useToggleFavoriteMutation } from '../../services/api';
import { Collection } from '../../types/types';

interface CollectionsGridProps {
  onSelect: (id: number) => void;
}

export function CollectionsGrid({ onSelect }: CollectionsGridProps) {
  const { data: collections, isLoading } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [activeTab, setActiveTab] = useState<'favorites' | 'all'>('all');

  if (isLoading) return <div className="text-center">Loading collections...</div>;

  const displayedCollections =
    activeTab === 'favorites' ? collections?.filter((c) => c.isFavorite) : collections;

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'favorites' ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          Favourites
        </button>
        <button
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all' ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Collections
        </button>
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
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors h-48">
          <div className="flex flex-col items-center text-gray-400 hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="mt-2 text-sm font-medium">Add Collection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CollectionCardProps {
  collection: Collection;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

function CollectionCard({ collection, onSelect, onToggleFavorite }: CollectionCardProps) {
  const completionPercentage = collection.taskCount
    ? Math.round(((collection.completedCount || 0) / collection.taskCount) * 100)
    : 0;

  // Get color based on collection name
  const getIconBgColor = (name: string) => {
    const colors = ['bg-pink-500', 'bg-teal-500', 'bg-purple-500', 'bg-yellow-500'];

    // Simple hash function to get consistent colors for the same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      School: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
      Personal: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
          className="h-6 w-6"
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
          className="h-6 w-6"
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
          className="h-6 w-6"
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
      onClick={() => onSelect(collection.id)}
      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
    >
      <div className="flex flex-col h-40">
        <div className="flex justify-between items-start">
          <div
            className={`w-10 h-10 rounded-lg ${getIconBgColor(collection.name)} flex items-center justify-center text-white`}
          >
            {getIcon(collection.name)}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(collection.id);
            }}
            className="text-gray-400 hover:text-yellow-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${collection.isFavorite ? 'text-yellow-400 fill-current' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        <div className="mt-3 mb-2">
          <h3 className="font-medium text-white">{collection.name}</h3>
          <div className="text-xs text-gray-400 mt-1">
            {collection.taskCount > 0
              ? `${collection.completedCount || 0}/${collection.taskCount} done`
              : 'No tasks yet'}
          </div>
        </div>

        <div className="mt-auto">
          <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
            <div
              className={`h-1 rounded-full ${
                completionPercentage === 100
                  ? 'bg-green-500'
                  : collection.name === 'School'
                    ? 'bg-pink-500'
                    : collection.name === 'Personal'
                      ? 'bg-teal-500'
                      : collection.name === 'Design'
                        ? 'bg-purple-500'
                        : 'bg-yellow-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
