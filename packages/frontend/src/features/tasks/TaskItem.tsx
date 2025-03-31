import { useState } from 'react';
import { Task } from '../../types/task';
import { useCompleteTaskMutation } from '../../services/api';

export function TaskItem({ task, depth = 0 }: { task: Task; depth?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditing, setIsEditing] = useState(false);
  const [completeTask] = useCompleteTaskMutation();

  const handleDoubleClick = () => setIsEditing(true);
  const handleComplete = () => completeTask(task.id);

  return (
    <div
      className={`py-2 pl-${depth * 4} border-b border-gray-200`}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleComplete}
          className="mr-2"
        />
        <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
        {task.date && (
          <span className="ml-2 text-sm text-gray-500">
            {new Date(task.date).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.subtasks?.map((subtask) => (
        <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
      ))}
    </div>
  );
}
