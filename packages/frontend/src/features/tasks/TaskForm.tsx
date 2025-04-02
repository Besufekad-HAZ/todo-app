import { useState } from 'react';
import { useCreateTaskMutation } from '../../services/api';

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
  const [selectedCollection, setSelectedCollection] = useState<string>('Design');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Today']);
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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-700">
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Finish hero section"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white text-base mb-4"
              required
              autoFocus
            />

            {/* Collection & Tags Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Collection */}
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-900/50 text-purple-300 rounded-md text-sm"
              >
                <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                Design
              </button>

              {/* Today */}
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm ${
                  selectedTags.includes('Today')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-green-400 hover:bg-gray-600'
                }`}
                onClick={() => toggleTag('Today')}
              >
                Today
              </button>

              {/* Flag */}
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm ${
                  selectedTags.includes('Flag')
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-red-400 hover:bg-gray-600'
                }`}
                onClick={() => toggleTag('Flag')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              className="flex-1 py-3 font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-medium text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
