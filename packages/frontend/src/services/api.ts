import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Collection, Task } from '../types/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Collection', 'Task'],
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

    // Complete a Task
    completeTask: builder.mutation<Task, number>({
      query: (id) => ({
        url: `tasks/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: (result) =>
        result?.collectionId ? [{ type: 'Task', id: result.collectionId }] : [],
    }),

    // Update a Task
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

    // Delete a Task
    deleteTask: builder.mutation<Task | { message: string }, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => {
        // If the server returns the deleted task with a collectionId, re-invalidate that collection’s tasks:
        if ((result as Task)?.collectionId) {
          return [{ type: 'Task', id: (result as Task).collectionId }];
        }
        // Otherwise just do a generic invalidation
        return [];
      },
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
} = api;
