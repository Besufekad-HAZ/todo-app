import { Request, RequestHandler, Response } from 'express';
import * as CollectionRepository from '../repositories/collection.repository';

export const getCollections: RequestHandler = async (req: Request, res: Response) => {
  try {
    const collections = await CollectionRepository.getCollections();
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const createCollection: RequestHandler<{}, unknown, { name: string }> = async (
  req: Request,
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

export const toggleFavorite: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const collection = await CollectionRepository.toggleFavorite(Number(id));
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

export const getCollectionStats: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const stats = await CollectionRepository.getCollectionStats(Number(id));
    res.json(stats);
    return;
  } catch (error) {
    if (error instanceof Error && error.message === 'Collection not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch collection stats' });
    return;
  }
};

export const updateCollectionStats: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    await CollectionRepository.updateCollectionStats(Number(id));
    res.json({ message: 'Collection stats updated successfully' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating collection stats:', error);
    // Send a generic error message to the client
    res.status(500).json({ error: 'Failed to update collection stats' });
  }
};
