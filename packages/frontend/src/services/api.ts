//// filepath: /home/bese/All projects/todo-app/packages/frontend/src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Collection, Task } from '../types/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Collection', 'Task', 'CollectionStats'],
  endpoints: (builder) => ({
    // Collections
    getCollections: builder.query<Collection[], void>({
      query: () => 'collections',
      providesTags: ['Collection'],
    }),
    toggleFavorite: builder.mutation<Collection, number>({
      query: (id) => ({
        url: `collections/${id}/favorite`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Collection'],
    }),

    // Tasks
    getTasksByCollection: builder.query<Task[], number>({
      query: (collectionId) => `tasks/collection/${collectionId}`,
      providesTags: (result, error, arg) => [{ type: 'Task', id: arg }],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.collectionId ? [{ type: 'Task', id: arg.collectionId }] : [],
    }),
    // Example for completeTask mutation
    completeTask: builder.mutation<Task, number>({
      query: (id) => ({
        url: `tasks/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: (result) => [
        { type: 'Task', id: result?.collectionId },
        { type: 'Collection', id: result?.collectionId },
      ],
    }),
    updateTask: builder.mutation<Task, Partial<Task>>({
      query: (updatedTask) => {
        if (!updatedTask.id) throw new Error('Task ID is required for update');
        return {
          url: `tasks/${updatedTask.id}`,
          method: 'PUT',
          body: updatedTask,
        };
      },
      invalidatesTags: (result) =>
        result?.collectionId ? [{ type: 'Task', id: result.collectionId }] : [],
    }),
    deleteTask: builder.mutation<Task | { message: string }, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => {
        if ((result as Task)?.collectionId) {
          return [{ type: 'Task', id: (result as Task).collectionId }];
        }
        return [];
      },
    }),

    // New endpoint: complete task + subtasks
    // In api.ts
    completeTaskWithSubtasks: builder.mutation<Task, { id: number; complete: boolean }>({
      query: ({ id, complete }) => ({
        url: `tasks/${id}/complete-with-subtasks`,
        method: 'PATCH',
        body: { complete },
      }),
      invalidatesTags: (result) => [
        { type: 'Task', id: result?.collectionId },
        { type: 'Collection', id: result?.collectionId },
        { type: 'CollectionStats', id: result?.collectionId },
      ],
    }),
    // In your api.ts file, add these endpoints
    // In api.ts

    getCollectionStats: builder.query<{ taskCount: number; completedCount: number }, number>({
      query: (collectionId) => `collections/${collectionId}/stats`,
      providesTags: (result, error, arg) => [
        { type: 'CollectionStats', id: arg },
        { type: 'Collection', id: arg },
      ],
    }),
    updateCollectionStats: builder.mutation<void, number>({
      query: (collectionId) => ({
        url: `collections/${collectionId}/stats`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Collection', id: arg }],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useToggleFavoriteMutation,
  useGetTasksByCollectionQuery,
  useCreateTaskMutation,
  useCompleteTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCompleteTaskWithSubtasksMutation,
  useGetCollectionStatsQuery,
  useUpdateCollectionStatsMutation,
} = api;
