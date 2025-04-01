export interface Collection {
  title: ReactNode;
  id: number;
  name: string;
  isFavorite: boolean;
  taskCount?: number;
  completedCount?: number;
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
