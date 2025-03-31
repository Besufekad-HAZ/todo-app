import { Request, Response } from 'express';
import * as TaskRepository from '../repositories/task.repository';

export const getTasksByCollection = async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  try {
    const tasks = await TaskRepository.getTasksByCollection(Number(collectionId));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, collectionId, date, parentId } = req.body;
  if (!title || !collectionId) {
    return res.status(400).json({ error: 'Title and collectionId are required' });
  }

  try {
    const task = await TaskRepository.createTask({
      title,
      collectionId: Number(collectionId),
      date: date ? new Date(date) : undefined,
      parentId: parentId ? Number(parentId) : undefined,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Add more controller methods for update, delete, toggle
