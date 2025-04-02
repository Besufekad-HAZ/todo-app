import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import { Task } from '../../types/types';
import { useUpdateTaskMutation } from '../../services/api';
import { arrayMove } from '@dnd-kit/sortable';

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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find the indexes
      const oldIndex = subtasks.findIndex((task) => task.id === active.id);
      const newIndex = subtasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a new array with the updated order
        const updatedSubtasks = arrayMove(subtasks, oldIndex, newIndex);

        // Update all affected tasks in the database
        try {
          const updatePromises = updatedSubtasks.map((task, index) => {
            // Only update if the position changed
            if (task.order !== index) {
              return updateTask({
                id: task.id,
                order: index,
              }).unwrap();
            }
            return Promise.resolve();
          });

          await Promise.all(updatePromises);
          onTaskUpdated?.();
        } catch (error) {
          console.error('Failed to update task order:', error);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={subtasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-1 space-y-1">
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

function sortableKeyboardCoordinates(e: any) {
  const { currentCoordinates } = e;

  switch (e.key) {
    case 'ArrowLeft':
      return {
        ...currentCoordinates,
        x: currentCoordinates.x - 10,
      };
    case 'ArrowRight':
      return {
        ...currentCoordinates,
        x: currentCoordinates.x + 10,
      };
    case 'ArrowDown':
      return {
        ...currentCoordinates,
        y: currentCoordinates.y + 10,
      };
    case 'ArrowUp':
      return {
        ...currentCoordinates,
        y: currentCoordinates.y - 10,
      };
    default:
      return currentCoordinates;
  }
}
