// src/features/tasks/SortableSubtasksList.tsx
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import { Task } from '../../types/types';
import { useUpdateTaskMutation } from '../../services/api';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';

interface SortableSubtasksListProps {
  subtasks: Task[];
  depth: number;
  onTaskUpdated?: () => void;
}

export function SortableSubtasksList({
  subtasks,
  depth,
  onTaskUpdated,
}: SortableSubtasksListProps) {
  const [updateTask] = useUpdateTaskMutation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the indexes
    const oldIndex = subtasks.findIndex((task) => task.id === active.id);
    const newIndex = subtasks.findIndex((task) => task.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Create a new array with the updated order
      const updatedSubtasks = arrayMove(subtasks, oldIndex, newIndex);

      // Update all affected tasks in the database
      try {
        const updatePromises = updatedSubtasks.map((task, index) => {
          return updateTask({
            id: task.id,
            order: index,
          }).unwrap();
        });

        await Promise.all(updatePromises);
        onTaskUpdated?.();
      } catch (error) {
        console.error('Failed to update task order:', error);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={subtasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-2 space-y-2 pl-3 border-l border-gray-700">
          {subtasks.map((subtask) => (
            <SortableTaskItem
              key={subtask.id}
              task={subtask}
              depth={depth}
              onTaskUpdated={onTaskUpdated}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
