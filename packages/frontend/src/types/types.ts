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

export interface Task {
  id: number;
  title: string;
  date?: string;
  completed: boolean;
  collectionId: number;
  parentId?: number;
  subtasks?: Task[];
  order?: number;
  isExpanded?: boolean;
  tags?: string[];
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

export interface ApiError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
  };
  error?: string;
  message?: string;
}
