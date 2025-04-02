// src/features/tasks/SortableTaskItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Task } from '../../types/types';

export function SortableTaskItem({
  task,
  depth = 0,
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
    zIndex: isDragging ? 1000 : 1,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'relative z-10' : ''}
      {...attributes}
    >
      <TaskItem
        task={task}
        depth={depth}
        onTaskUpdated={onTaskUpdated}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}
