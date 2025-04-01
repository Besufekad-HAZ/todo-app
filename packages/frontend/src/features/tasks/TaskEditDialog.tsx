// src/features/tasks/TaskEditDialog.tsx
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useGetCollectionsQuery } from '../../services/api';
import { Task } from '../../types/types';

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Partial<Task>) => Promise<void>;
}

export function TaskEditDialog({ task, isOpen, onClose, onSave }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date || '');
  const [collectionId, setCollectionId] = useState(task.collectionId);
  const { data: collections } = useGetCollectionsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      id: task.id,
      title,
      date: date || undefined,
      collectionId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>

      {/* Dialog Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-sm rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
          <Dialog.Title className="text-lg font-semibold mb-4">Edit Task</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="collection"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Collection
              </label>
              <select
                id="collection"
                value={collectionId}
                onChange={(e) => setCollectionId(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {collections?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
