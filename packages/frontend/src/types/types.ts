export interface Collection {
  id: number;
  name: string;
  isFavorite: boolean;
  taskCount?: number;
  completedCount?: number;
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
}
