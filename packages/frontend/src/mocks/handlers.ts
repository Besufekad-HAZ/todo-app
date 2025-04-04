import { http, HttpResponse } from 'msw';
import { Task } from '../types/types';

export const handlers = [
  http.get('/api/collections', () => {
    return HttpResponse.json([
      { id: 1, name: 'School', color: 'bg-pink-500' },
      { id: 2, name: 'Personal', color: 'bg-teal-500' },
    ]);
  }),
  http.post('/api/tasks', async ({ request }) => {
    const task = (await request.json()) as Task;
    return HttpResponse.json({
      id: 1,
      title: task.title,
      collectionId: task.collectionId,
    });
  }),
];
