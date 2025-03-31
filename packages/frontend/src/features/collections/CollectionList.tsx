import { useGetCollectionsQuery, useToggleFavoriteMutation } from '../../services/api';

export function CollectionList({ onSelect }: { onSelect: (id: number) => void }) {
  const { data: collections } = useGetCollectionsQuery();
  const [toggleFavorite] = useToggleFavoriteMutation();

  return (
    <div className="w-64 border-r border-gray-200 h-full overflow-auto">
      <div className="p-4 font-semibold border-b">Collections</div>
      {collections?.map((collection) => (
        <div
          key={collection.id}
          className="p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between"
          onClick={() => onSelect(collection.id)}
        >
          <span>{collection.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(collection.id);
            }}
            className={collection.isFavorite ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </button>
        </div>
      ))}
    </div>
  );
}
