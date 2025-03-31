import { useGetTasksByCollectionQuery } from '../../services/api';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TaskList({ collectionId }: { collectionId: number }) {
  const { data: tasks, isLoading, error, refetch } = useGetTasksByCollectionQuery(collectionId);

  if (isLoading)
    return (
      <div className="flex-1 overflow-auto p-4 space-y-2">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">Error loading tasks</div>
        <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );

  return (
    <div className="flex-1 overflow-auto">
      {tasks?.length ? (
        tasks.map((task) => <TaskItem key={task.id} task={task} onTaskUpdated={refetch} />)
      ) : (
        <div className="text-center py-8 text-gray-500">No tasks in this collection</div>
      )}
    </div>
  );
}
