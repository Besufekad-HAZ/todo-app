// src/features/tasks/TaskList.tsx
import { useGetTasksByCollectionQuery } from '../../services/api';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Task } from '../../types/types';

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
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
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

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed && !task.parentId);
  const completedTasks = tasks.filter((task) => task.completed && !task.parentId);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Active Tasks Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Tasks - {incompleteTasks.length}</h3>
        <div className="space-y-2">
          {incompleteTasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdated={refetch} />
          ))}
        </div>
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center">
            Completed - {completedTasks.length}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onTaskUpdated={refetch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
