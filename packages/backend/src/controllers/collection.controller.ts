import { Request, Response } from 'express';
import * as CollectionRepository from '../repositories/collection.repository';

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await CollectionRepository.getCollections();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

export const createCollection = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const collection = await CollectionRepository.createCollection(name);
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await CollectionRepository.toggleFavorite(Number(id));
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};
