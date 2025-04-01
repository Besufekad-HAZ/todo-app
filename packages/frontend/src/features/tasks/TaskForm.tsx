// src/features/tasks/TaskForm.tsx
import { useState } from 'react';
import { useCreateTaskMutation } from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function TaskForm({
  collectionId,
  onClose,
  parentId,
}: {
  collectionId: number;
  onClose: () => void;
  parentId?: number;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [createTask] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create main task
      const task = await createTask({
        title,
        collectionId,
        date: date || undefined,
        parentId,
      }).unwrap();

      // Create subtasks if they exist
      if (subtasks.some((st) => st.trim())) {
        await Promise.all(
          subtasks
            .filter((st) => st.trim())
            .map((subtask) =>
              createTask({
                title: subtask,
                collectionId,
                parentId: task.id,
              }),
            ),
        );
      }

      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{parentId ? 'Add Subtask' : 'Add New Task'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {!parentId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtasks
              </label>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subtask}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      placeholder={`Subtask ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {subtasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubtask(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                + Add another subtask
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm transition-colors"
            >
              {parentId ? 'Add Subtask' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
