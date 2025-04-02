import { useState, useEffect } from 'react';
import { useCreateTaskMutation, useGetCollectionsQuery } from '../../services/api';
import { FaPlus, FaMinus, FaCalendarAlt, FaFlag } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MiddlewareReturn } from '@floating-ui/core';
import { MiddlewareState } from '@floating-ui/dom';

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
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([{ title: '' }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [createTask] = useCreateTaskMutation();
  const { data: collectionsData } = useGetCollectionsQuery();
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(collectionId);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  // Map collections for dropdown
  const collections = collectionsData || [
    { id: 1, name: 'School', color: 'bg-pink-500' },
    { id: 2, name: 'Personal', color: 'bg-teal-500' },
    { id: 3, name: 'Design', color: 'bg-purple-500' },
    { id: 4, name: 'Groceries', color: 'bg-yellow-500' },
  ];

  // Get the selected collection
  const selectedCollection =
    collections.find((c) => c.id === selectedCollectionId) || collections[0];

  // Set the date to today if Today tag is selected
  useEffect(() => {
    if (selectedTags.includes('Today') && !dueDate) {
      setDueDate(new Date());
    }
  }, [selectedTags, dueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create main task
      const task = await createTask({
        title,
        collectionId: selectedCollectionId,
        date: dueDate?.toISOString(),
        parentId,
        tags: selectedTags,
      }).unwrap();

      // Create subtasks if they exist
      if (subtasks.some((st) => st.title.trim())) {
        await Promise.all(
          subtasks
            .filter((st) => st.title.trim())
            .map((subtask) =>
              createTask({
                title: subtask.title,
                collectionId: selectedCollectionId,
                parentId: task.id,
                tags: selectedTags,
              }),
            ),
        );
      }

      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: '' }]);
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));

      // If Today tag is removed, clear the date only if it's set to today
      if (tag === 'Today' && dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDate = new Date(dueDate);
        currentDate.setHours(0, 0, 0, 0);

        if (today.getTime() === currentDate.getTime()) {
          setDueDate(null);
        }
      }
    } else {
      setSelectedTags([...selectedTags, tag]);

      // If Today tag is added, set date to today
      if (tag === 'Today') {
        setDueDate(new Date());
      }
    }
  };

  // Get color class for a collection
  const getCollectionColor = (name: string) => {
    const colors: Record<string, string> = {
      School: 'bg-pink-500',
      Personal: 'bg-teal-500',
      Design: 'bg-purple-500',
      Groceries: 'bg-yellow-500',
    };
    return colors[name] || 'bg-gray-500';
  };

  // Get text color for a collection
  const getCollectionTextColor = (name: string) => {
    const colors: Record<string, string> = {
      School: 'text-pink-300',
      Personal: 'text-teal-300',
      Design: 'text-purple-300',
      Groceries: 'text-yellow-300',
    };
    return colors[name] || 'text-gray-300';
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
              placeholder="Task title"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white text-base mb-4"
              required
              autoFocus
            />

            {/* Collection & Tags Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Collection Selector */}
              <div className="relative">
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-1.5 bg-opacity-20 rounded-md text-sm ${getCollectionTextColor(selectedCollection.name)}`}
                  onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                >
                  <span
                    className={`w-3 h-3 rounded-sm ${getCollectionColor(selectedCollection.name)}`}
                  ></span>
                  {selectedCollection.name}
                </button>

                {/* Collection Dropdown */}
                {showCollectionDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 w-40">
                    {collections.map((collection) => (
                      <button
                        key={collection.id}
                        type="button"
                        className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-700 ${
                          collection.id === selectedCollectionId ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => {
                          setSelectedCollectionId(collection.id);
                          setShowCollectionDropdown(false);
                        }}
                      >
                        <span
                          className={`w-3 h-3 rounded-sm ${getCollectionColor(collection.name)}`}
                        ></span>
                        <span className="text-white text-sm">{collection.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Today Tag */}
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

              {/* Flag Tag */}
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  selectedTags.includes('Flag')
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-red-400 hover:bg-gray-600'
                }`}
                onClick={() => toggleTag('Flag')}
              >
                <FaFlag className="mr-1" />
                Flag
              </button>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Due Date</label>
              <div className="relative">
                <DatePicker
                  withPortal
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  minDate={new Date()}
                  placeholderText="Select a date"
                  className="w-full px-3 py-2 bg-pink-500 border border-pink-700 rounded-md focus:ring-pink-600 focus:border-pink-600 text-white text-sm"
                  dateFormat="MMMM d, yyyy"
                  popperClassName="react-datepicker-popper z-50"
                  popperPlacement="bottom"
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: document.body,
                      },
                      fn: function (
                        state: MiddlewareState,
                      ): MiddlewareReturn | Promise<MiddlewareReturn> {
                        throw new Error('Function not implemented.');
                      },
                    },
                  ]}
                  calendarClassName="bg-gray-900 text-white border border-gray-700 rounded-lg shadow-lg p-4"
                  dayClassName={() =>
                    'hover:bg-pink-500 transition-colors rounded-full w-9 h-9 flex items-center justify-center font-semibold'
                  }
                  monthClassName={() => 'text-white font-bold'}
                  weekDayClassName={() => 'text-gray-400 font-light uppercase text-xs'}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-300">Subtasks</label>
                <button
                  type="button"
                  onClick={addSubtask}
                  className="text-xs text-pink-500 hover:text-pink-400 flex items-center"
                >
                  <FaPlus className="mr-1" /> Add Subtask
                </button>
              </div>

              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => updateSubtask(index, e.target.value)}
                    placeholder={`Subtask ${index + 1}`}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white text-sm"
                  />
                  {subtasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="ml-2 text-gray-400 hover:text-red-400 p-1"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              className="flex-1 py-3 font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              {parentId ? 'Add Subtask' : 'Add Task'}
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
