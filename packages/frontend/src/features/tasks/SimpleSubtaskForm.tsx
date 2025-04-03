import { useState } from 'react';
import { useCreateTaskMutation } from '../../services/api';
import { FaPlus } from 'react-icons/fa';

export function SimpleSubtaskForm({
  parentId,
  collectionId,
  onSuccess,
  onCancel,
}: {
  parentId: number;
  collectionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [createTask] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        collectionId,
        parentId,
      }).unwrap();
      onSuccess();
      setTitle('');
    } catch (error) {
      console.error('Failed to create subtask:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 pl-8 flex items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Subtask name"
        className="flex-1 px-3 py-1 rounded-md text-sm"
        style={{
          backgroundColor: 'rgb(var(--color-input-bg))',
          borderColor: 'rgb(var(--color-input-border))',
          color: 'rgb(var(--color-text-base))',
        }}
        autoFocus
      />
      <button type="submit" className="p-1 text-green-500 hover:text-green-400" title="Add">
        <FaPlus />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 text-gray-400 hover:text-gray-300"
        title="Cancel"
      >
        ×
      </button>
    </form>
  );
}
