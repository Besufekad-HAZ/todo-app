// src/features/collections/CollectionList.tsx
import { useGetCollectionsQuery, useToggleFavoriteMutation } from '../../services/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { ProgressBar } from '../ui/ProgressBar';

export function CollectionList({ onSelect }: { onSelect: (id: number) => void }) {
  const { data: collections } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Collections</h2>

        {/* Favorites Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Favorites</h3>
          <div className="space-y-1">
            {collections
              ?.filter((c) => c.isFavorite)
              .map((collection) => (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  onSelect={onSelect}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
          </div>
        </div>

        {/* All Collections Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            All Collections
          </h3>
          <div className="space-y-1">
            {collections?.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                onSelect={onSelect}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionItem({
  collection,
  onSelect,
  onToggleFavorite,
}: {
  collection: Collection;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}) {
  const completionPercentage = collection.taskCount
    ? Math.round(((collection.completedCount || 0) / collection.taskCount) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(collection.id)}
      className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium text-gray-800 dark:text-gray-200">{collection.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(collection.id);
          }}
          className="text-gray-400 hover:text-yellow-500"
        >
          <StarIcon
            className={`h-5 w-5 ${collection.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`}
          />
        </button>
      </div>

      {collection.taskCount ? (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {collection.completedCount || 0} of {collection.taskCount} tasks
        </div>
      ) : null}

      <ProgressBar percentage={completionPercentage} />
    </div>
  );
}

export default CollectionList;
