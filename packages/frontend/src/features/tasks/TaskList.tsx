import { useGetTasksByCollectionQuery } from '../../services/api';
import { TaskItem } from './TaskItem';

export function TaskList({ collectionId }: { collectionId: number }) {
  const { data: tasks, isLoading, error } = useGetTasksByCollectionQuery(collectionId);

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="flex-1 overflow-auto">
      {tasks?.length ? (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <div className="text-center py-8 text-gray-500">No tasks in this collection</div>
      )}
    </div>
  );
}
