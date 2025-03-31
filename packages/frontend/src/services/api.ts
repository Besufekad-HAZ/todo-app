import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Collection, Task } from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
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
      invalidatesTags: (result, error, arg) => [{ type: 'Task', id: arg.collectionId }],
    }),
    // Add more endpoints for update/delete/toggle
  }),
});

export const {
  useGetCollectionsQuery,
  useToggleFavoriteMutation,
  useGetTasksByCollectionQuery,
  useCreateTaskMutation,
} = api;
