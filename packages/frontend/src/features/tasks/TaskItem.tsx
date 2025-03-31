import { useState, useCallback } from 'react';
import { Task } from '../../types/types';
import {
  useCompleteTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '../../services/api';

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
    }, 1000);
    setPressTimer(timer);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  }, [pressTimer]);

  // Task actions
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
    await updateTask({ id: task.id, title: editTitle });
    setIsEditing(false);
    onTaskUpdated?.();
  };

  // Calculate dynamic padding for subtasks
  const paddingClass = `pl-${depth * 4}`;

  return (
    <div
      className={`group py-3 px-4 hover:bg-surface-100 dark:hover:bg-gray-700 transition-colors ${depth > 0 ? 'border-l-2 border-primary-200 dark:border-primary-800' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex items-center">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1 p-1 border rounded mr-2"
          />
          <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 ml-1 bg-gray-200 rounded text-sm"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex items-center group">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleComplete}
            className="mr-2 h-4 w-4"
          />
          <span
            className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
          {task.date && (
            <span className="ml-2 text-xs text-gray-500">
              {new Date(task.date).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-sm">
            <p className="mb-4">Delete this task and all subtasks?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">
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
