import { useState } from 'react';
import { CollectionList } from './features/collections/CollectionList';
import { TaskList } from './features/tasks/TaskList';
import { TaskForm } from './features/tasks/TaskForm';

export function App() {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <div className="flex h-screen">
      <CollectionList onSelect={setSelectedCollection} />

      <div className="flex-1 flex flex-col">
        {selectedCollection ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl">Tasks</h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Task
              </button>
            </div>
            <TaskList collectionId={selectedCollection} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a collection to view tasks
          </div>
        )}
      </div>

      {showTaskForm && selectedCollection && (
        <TaskForm collectionId={selectedCollection} onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}

export default App;
