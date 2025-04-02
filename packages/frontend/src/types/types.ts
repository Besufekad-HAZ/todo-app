// src/types/dnd.ts
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { ReactNode } from 'react';

export interface Collection {
  title: ReactNode;
  id: number;
  name: string;
  isFavorite: boolean;
  taskCount?: number;
  completedCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// src/types/types.ts
export interface Task {
  id: number;
  title: string;
  date?: string;
  completed: boolean;
  collectionId: number;
  parentId?: number;
  subtasks?: Task[];
  order?: number;
  isExpanded?: boolean; // For UI toggling
}

export type DragHandleProps = {
  attributes: {
    role: string;
    tabIndex: number;
    'aria-describedby': string;
    'aria-pressed': boolean | undefined;
    'aria-roledescription': string;
    'aria-label': string;
  };
  listeners: DraggableSyntheticListeners | undefined;
};
