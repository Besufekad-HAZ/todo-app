import { Request, RequestHandler, Response } from 'express';
import * as TaskRepository from '../repositories/task.repository';

export const getTasksByCollection: RequestHandler<{ collectionId: string }> = async (
  req: Request,
  res: Response,
) => {
  const { collectionId } = req.params;
  try {
    const tasks = await TaskRepository.getTasksByCollection(Number(collectionId));
    res.json(tasks || []); // Always return an array, even if empty
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {}, // No URL parameters
  unknown, // Response type (unknown lets you infer later)
  {
    title: string;
    collectionId: number;
    date?: string;
    parentId?: number;
  }
> = async (req: Request, res: Response) => {
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
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const completeTask: RequestHandler<{ id: string }> = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Pass "true" as the second argument
    await TaskRepository.completeTaskWithSubtasks(Number(id), true);
    res.json({ message: 'Task and subtasks marked as completed' });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

export const updateTask: RequestHandler<
  { id: string },
  unknown,
  {
    title?: string;
    date?: string;
    completed?: boolean;
    parentId?: number;
    order?: number;
  }
> = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, date, completed, parentId, order } = req.body;
  try {
    const updatedTask = await TaskRepository.updateTask(Number(id), {
      title,
      date: date ? new Date(date) : undefined,
      completed,
      parentId,
      order,
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask: RequestHandler<{ id: string }> = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await TaskRepository.deleteTaskWithSubtasks(Number(id));
    res.json({ message: 'Task and subtasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const toggleTask: RequestHandler<{ id: string }> = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const toggledTask = await TaskRepository.toggleTask(Number(id));
    res.json(toggledTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
};

export const completeTaskWithSubtasks: RequestHandler<
  { id: string },
  unknown,
  { complete: boolean }
> = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { complete } = req.body;
  try {
    await TaskRepository.completeTaskWithSubtasks(Number(id), !!complete);
    res.json({ message: 'Task and subtasks updated successfully' });
  } catch (error) {
    console.error('Error completing task and subtasks:', error);
    res.status(500).json({ error: 'Failed to update task and subtasks' });
  }
};
