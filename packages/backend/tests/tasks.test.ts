import request from 'supertest';
import { createApp } from '../src/index';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';

const prisma = new PrismaClient();
const app = createApp();
let server: Server;
let testCollectionId: number;

describe('Tasks API', () => {
  beforeAll(async () => {
    // Clear test data
    await prisma.task.deleteMany();
    await prisma.collection.deleteMany();

    // Create test collection
    const collection = await prisma.collection.create({
      data: { name: 'Task Test Collection' },
    });
    testCollectionId = collection.id;

    // Start server on a random port
    server = app.listen(0);
  });

  afterAll(async () => {
    // Close server and database connection
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        collectionId: testCollectionId,
      };

      const response = await request(app).post('/api/tasks').send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/api/tasks').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/required/);
    });
  });

  describe('GET /api/tasks/collection/:collectionId', () => {
    it('should return tasks for a collection', async () => {
      // First create a task
      await prisma.task.create({
        data: {
          title: 'Test Task for GET',
          collectionId: testCollectionId,
        },
      });

      const response = await request(app).get(`/api/tasks/collection/${testCollectionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/tasks/:id/complete-with-subtasks', () => {
    it('should complete a task and its subtasks', async () => {
      // Create a task with a subtask
      const parentTask = await prisma.task.create({
        data: {
          title: 'Parent Task',
          collectionId: testCollectionId,
        },
      });

      const subtask = await prisma.task.create({
        data: {
          title: 'Subtask',
          collectionId: testCollectionId,
          parentId: parentTask.id,
        },
      });

      const response = await request(app)
        .patch(`/api/tasks/${parentTask.id}/complete-with-subtasks`)
        .send({ complete: true });

      expect(response.status).toBe(200);

      // Verify both tasks were completed
      const updatedParent = await prisma.task.findUnique({
        where: { id: parentTask.id },
      });
      const updatedSubtask = await prisma.task.findUnique({
        where: { id: subtask.id },
      });

      expect(updatedParent?.completed).toBe(true);
      expect(updatedSubtask?.completed).toBe(true);
    });
  });
});
