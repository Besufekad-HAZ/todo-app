import { useState } from 'react';
import { CollectionList } from './features/collections/CollectionList';
import { TaskList } from './features/tasks/TaskList';
import { TaskForm } from './features/tasks/TaskForm';
import { Toaster } from './components/ui/Toaster';

export function App() {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <CollectionList onSelect={setSelectedCollection} />

      <div className="flex-1 flex flex-col">
        {selectedCollection ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <button
                onClick={() => {
                  setSelectedParentTask(null);
                  setShowTaskForm(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Add Task
              </button>
            </div>
            <TaskList
              collectionId={selectedCollection}
              onAddSubtask={(parentId) => {
                setSelectedParentTask(parentId);
                setShowTaskForm(true);
              }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a collection to view tasks
          </div>
        )}
      </div>

      {showTaskForm && selectedCollection && (
        <TaskForm
          collectionId={selectedCollection}
          onClose={() => {
            setShowTaskForm(false);
            setSelectedParentTask(null);
          }}
          parentId={selectedParentTask || undefined}
        />
      )}

      <Toaster />
    </div>
  );
}


export default App;
