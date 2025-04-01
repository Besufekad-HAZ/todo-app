// src/features/tasks/TaskList.tsx
import { useGetTasksByCollectionQuery } from '../../services/api';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';

export function TaskList({ collectionId }: { collectionId: number }) {
  const { data: tasks, isLoading, error, refetch } = useGetTasksByCollectionQuery(collectionId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">Error loading tasks</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <EmptyState
        icon="task"
        title="No tasks yet"
        description="Add your first task to get started"
      />
    );
  }

  // Group tasks by date
  const today = new Date().toDateString();
  const taskGroups = tasks.reduce(
    (groups, task) => {
      const date = task.date ? new Date(task.date).toDateString() : 'No date';
      const groupKey = date === today ? 'Today' : date;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
      return groups;
    },
    {} as Record<string, Task[]>,
  );

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {Object.entries(taskGroups).map(([date, tasks]) => (
        <div key={date} className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {date} {date === 'Today' && '💬'}
          </h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onTaskUpdated={refetch} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
