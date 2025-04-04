import request from 'supertest';
import { createApp } from '../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = createApp();
import { Server } from 'http';
let server: Server;

describe('Collections API', () => {
  beforeAll(async () => {
    // Clear test data
    await prisma.task.deleteMany();
    await prisma.collection.deleteMany();

    // Seed test data
    await prisma.collection.createMany({
      data: [{ name: 'Test Collection 1', isFavorite: true }, { name: 'Test Collection 2' }],
    });

    // Start server on random port
    server = app.listen(0);
  });

  afterAll(async () => {
    // Close server and database connection
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
  });

  describe('GET /api/collections', () => {
    it('should return all collections with task counts', async () => {
      const response = await request(app).get('/api/collections');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2); // From our seed
      expect(response.body[0]).toHaveProperty('taskCount');
      expect(response.body[0]).toHaveProperty('completedCount');
    });
  });

  describe('POST /api/collections', () => {
    it('should create a new collection', async () => {
      const newCollection = { name: 'New Test Collection' };
      const response = await request(app).post('/api/collections').send(newCollection);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newCollection.name);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app).post('/api/collections').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });
  });

  describe('PATCH /api/collections/:id/favorite', () => {
    it('should toggle favorite status', async () => {
      // First get a collection to test with
      const collection = await prisma.collection.findFirst();
      const initialStatus = collection?.isFavorite;
      const response = await request(app)
        .patch(`/api/collections/${collection?.id}/favorite`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(!initialStatus);
    });
  });
});
