// src/features/tasks/TaskList.tsx
import { useState } from 'react';
import { useGetTasksByCollectionQuery, useUpdateTaskMutation } from '../../services/api';
// import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Task } from '../../types/types';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';

export function TaskList({ collectionId }: { collectionId: number }) {
  const { data: tasks, isLoading, error, refetch } = useGetTasksByCollectionQuery(collectionId);
  const [updateTask] = useUpdateTaskMutation();
  const [expandedSection, setExpandedSection] = useState<'incomplete' | 'completed' | 'both'>(
    'both',
  );

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">Error loading tasks</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }


  if (!tasks?.length) {
    return (
      <EmptyState
        icon="task"
        title="No tasks yet"
        description="Add your first task to get started"
      />
    );
  }

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed && !task.parentId);
  const completedTasks = tasks.filter((task) => task.completed && !task.parentId);

  // Handle drag end for incomplete tasks
  const handleDragEnd = async (event: DragEndEvent, taskGroup: Task[]) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = taskGroup.findIndex((task) => task.id === active.id);
    const newIndex = taskGroup.findIndex((task) => task.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(taskGroup, oldIndex, newIndex);

      // Update the database with the new order
      try {
        const updatePromises = newOrder.map((task, index) => {
          return updateTask({
            id: task.id,
            order: index,
          }).unwrap();
        });

        await Promise.all(updatePromises);
        refetch(); // Refresh the task list after reordering
      } catch (error) {
        console.error('Failed to update task order:', error);
      }
    }
  };

  // Toggle task section expansion
  const toggleSection = (section: 'incomplete' | 'completed') => {
    if (expandedSection === section) {
      setExpandedSection('both');
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Active Tasks Section */}
      <div className="mb-8">
        <h3
          className="text-sm font-medium mb-4 flex items-center cursor-pointer"
          onClick={() => toggleSection('incomplete')}
          style={{ color: 'rgb(var(--color-text-muted))' }}
        >
          Tasks - {incompleteTasks.length}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 transition-transform ${expandedSection === 'incomplete' ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h3>

        {(expandedSection === 'both' || expandedSection === 'incomplete') && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, incompleteTasks)}
          >
            <SortableContext
              items={incompleteTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {incompleteTasks.map((task) => (
                  <SortableTaskItem key={task.id} task={task} onTaskUpdated={refetch} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <h3
            className="text-sm font-medium mb-4 flex items-center cursor-pointer"
            onClick={() => toggleSection('completed')}
            style={{ color: 'rgb(var(--color-text-muted))' }}
          >
            Completed - {completedTasks.length}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform ${expandedSection === 'completed' ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </h3>

          {(expandedSection === 'both' || expandedSection === 'completed') && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, completedTasks)}
            >
              <SortableContext
                items={completedTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <SortableTaskItem key={task.id} task={task} onTaskUpdated={refetch} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
}
