import { Request, RequestHandler, Response } from 'express';
import * as TaskRepository from '../repositories/task.repository';

export const getTasksByCollection = async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  try {
    const tasks = await TaskRepository.getTasksByCollection(Number(collectionId));
    if (!tasks || tasks.length === 0) {
      res.status(404).json({ message: 'No tasks available for this collection' });
      return;
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// createTask
export const createTask: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  unknown,
  {
    title: string;
    collectionId: number;
    date?: string;
    parentId?: number;
  }
> = async (req, res) => {
  const { title, collectionId, date, parentId } = req.body;
  if (!title || !collectionId) {
    res.status(400).json({ error: 'Title and collectionId are required' });
    return;
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

export const completeTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await TaskRepository.completeTaskWithSubtasks(Number(id));
    res.json({ message: 'Task and subtasks marked as completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

// updateTask
export const updateTask = async (req: Request, res: Response) => {
  // Implement the update logic
  res.status(501).json({ error: 'Not implemented' });
};

export const deleteTask = async (req: Request, res: Response) => {
  // Implement the delete logic
  res.status(501).json({ error: 'Not implemented' });
};

export const toggleTask = async (req: Request, res: Response) => {
  // Implement the toggle logic
  res.status(501).json({ error: 'Not implemented' });
};
