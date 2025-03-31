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
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [createTask] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-auto">
        <h2 className="text-xl mb-4">{parentId ? 'Add Subtask' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {!parentId && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subtasks</label>
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={subtask}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    placeholder={`Subtask ${index + 1}`}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubtask}
                className="text-sm text-blue-500 mt-1"
              >
                + Add another subtask
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {parentId ? 'Add Subtask' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
