import { useState, useCallback } from 'react';
import { Task } from '../../types/types';
import {
  useCompleteTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '../../services/api';
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export function TaskItem({
  task,
  depth = 0,
  onTaskUpdated,
}: {
  task: Task;
  depth?: number;
  onTaskUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const [completeTask] = useCompleteTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  // Long-press handlers
  const handleTouchStart = useCallback(() => {
    const timer = setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 800); // Reduced from 1000ms for better UX
    setPressTimer(timer);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  }, [pressTimer]);

  const handleComplete = async () => {
    await completeTask(task.id);
    onTaskUpdated?.();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    setShowDeleteConfirm(false);
    onTaskUpdated?.();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      await updateTask({ id: task.id, title: editTitle });
      setIsEditing(false);
      onTaskUpdated?.();
    }
  };

  return (
    <div
      className={`group relative py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        depth > 0 ? 'border-l-2 border-gray-200 dark:border-gray-600 ml-3' : ''
      }`}
      style={{ paddingLeft: `${depth * 12}px` }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            onBlur={() => setIsEditing(false)}
          />
          <div className="flex gap-1">
            <button
              type="submit"
              className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
              title="Save"
            >
              <CheckCircleIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-full"
              title="Cancel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="flex items-start gap-3">
          <button
            onClick={handleComplete}
            className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-gray-300 dark:border-gray-500 hover:border-primary-300'
            }`}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && (
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div
              className={`flex items-center justify-between ${
                task.completed
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-800 dark:text-gray-100'
              }`}
              onDoubleClick={() => setIsEditing(true)}
            >
              <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
              {task.date && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(task.date).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Action buttons (visible on hover) */}
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Task</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task and all its subtasks?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtasks */}
      {task.subtasks?.map((subtask) => (
        <TaskItem key={subtask.id} task={subtask} depth={depth + 1} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  );
}
