import { Request, Response } from 'express';
import * as CollectionRepository from '../repositories/collection.repository';

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await CollectionRepository.getCollections();
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

export const createCollection = async (
  req: Request<object, unknown, { name: string }>,
  res: Response,
) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const newCollection = await CollectionRepository.createCollection(name);
    res.status(201).json(newCollection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

export const toggleFavorite = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await CollectionRepository.toggleFavorite(Number(id));
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

export const getCollectionStats = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const stats = await CollectionRepository.getCollectionStats(Number(id));
    res.json(stats);
  } catch (error) {
    if (error instanceof Error && error.message === 'Collection not found') {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch collection stats' });
    }
  }
};

export const updateCollectionStats = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    await CollectionRepository.updateCollectionStats(Number(id));
    res.json({ message: 'Collection stats updated successfully' });
  } catch (error) {
    console.error('Error updating collection stats:', error);
    res.status(500).json({ error: 'Failed to update collection stats' });
  }
};
