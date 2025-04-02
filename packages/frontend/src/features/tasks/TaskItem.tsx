import { useState, useCallback } from 'react';
import { Task } from '../../types/types';
import {
  useCompleteTaskWithSubtasksMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '../../services/api';
import { toast } from 'react-toastify';
import { SortableSubtasksList } from './SortableSubtaskList';
import { TaskForm } from './TaskForm';

export function TaskItem({
  task,
  depth = 0,
  onTaskUpdated,
  dragHandleProps,
}: {
  task: Task;
  depth?: number;
  onTaskUpdated?: () => void;
  dragHandleProps?: any;
}) {
  const [isExpanded, setIsExpanded] = useState(task.isExpanded ?? true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);

  const [completeTask] = useCompleteTaskWithSubtasksMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleComplete = async () => {
    try {
      await completeTask({ id: task.id, complete: !task.completed }).unwrap();
      onTaskUpdated?.();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
      toast.success('Task deleted successfully');
      onTaskUpdated?.();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      await updateTask({ id: task.id, title: editTitle }).unwrap();
      setIsEditing(false);
      onTaskUpdated?.();
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  // Get task date label
  const getDateLabel = () => {
    if (!task.date) return null;

    const taskDate = new Date(task.date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Reset hours to compare just the date
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      // Check if it's within the current week
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayDiff = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff > 0 && dayDiff < 7) {
        return dayNames[taskDate.getDay()];
      } else {
        return taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    }
  };

  // Determine date label color
  const getDateLabelColor = () => {
    if (!task.date) return '';

    const dateLabel = getDateLabel();

    switch (dateLabel) {
      case 'Today':
        return 'bg-green-500';
      case 'Tomorrow':
        return 'bg-blue-500';
      case 'Monday':
      case 'Tuesday':
      case 'Wednesday':
      case 'Thursday':
      case 'Friday':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div
      className={`group relative py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
        depth > 0 ? 'border-l-2 border-gray-700 ml-3' : ''
      }`}
      style={{ paddingLeft: depth ? `${depth * 12 + 16}px` : '16px' }}
    >
      {/* Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white text-sm"
            onBlur={() => setIsEditing(false)}
          />
          <div className="flex gap-1">
            <button
              type="submit"
              className="p-1.5 text-green-500 hover:bg-green-900/20 rounded-full"
              title="Save"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-gray-400 hover:bg-gray-600 rounded-full"
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
          {/* Completion checkbox */}
          <button
            onClick={handleComplete}
            className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-pink-500 border-pink-500 text-white'
                : 'border-gray-500 hover:border-pink-300'
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

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className={`flex-1 text-white ${task.completed ? 'line-through text-gray-400' : ''}`}
                onDoubleClick={() => setIsEditing(true)}
              >
                {task.title}
              </span>

              {task.date && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-md text-white ${getDateLabelColor()}`}
                >
                  {getDateLabel()}
                </span>
              )}

              {/* Expand/Collapse for tasks with subtasks */}
              {hasSubtasks && (
                <button onClick={toggleExpand} className="ml-2 text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
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
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 px-2 py-1 rounded-md shadow-sm border border-gray-600">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white p-1"
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-gray-400 hover:text-red-400 p-1"
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {depth === 0 && (
                <button
                  onClick={() => setShowAddSubtaskForm(true)}
                  className="text-gray-400 hover:text-green-400 p-1"
                  title="Add Subtask"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Delete Task</h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete this task and all its subtasks?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md border border-gray-600"
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

      {/* Add Subtask Form */}
      {showAddSubtaskForm && (
        <TaskForm
          collectionId={task.collectionId}
          parentId={task.id}
          onClose={() => setShowAddSubtaskForm(false)}
        />
      )}

      {/* Subtasks */}
      {isExpanded && hasSubtasks && (
        <SortableSubtasksList
          subtasks={task.subtasks || []}
          depth={depth + 1}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </div>
  );
}
