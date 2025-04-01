// src/features/tasks/SortableTaskItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Task } from '../../types/types';

export function SortableTaskItem({
  task,
  depth,
  onTaskUpdated,
}: {
  task: Task;
  depth?: number;
  onTaskUpdated?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskItem
        task={task}
        depth={depth}
        onTaskUpdated={onTaskUpdated}
        dragHandleProps={listeners}
      />
    </div>
  );
}
