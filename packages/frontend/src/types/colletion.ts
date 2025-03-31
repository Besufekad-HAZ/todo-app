export interface Collection {
  id: number;
  name: string;
  isFavorite: boolean;
  taskCount?: number;
  completedCount?: number;
}
