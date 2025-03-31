export interface Task {
  id: number;
  title: string;
  date?: string;
  completed: boolean;
  collectionId: number;
  parentId?: number;
  subtasks?: Task[];
}
