import express from 'express';
import * as CollectionController from '../controllers/collection.controller';

const router = express.Router();

router.get('/', CollectionController.getCollections);
router.post('/', CollectionController.createCollection);
router.patch('/:id/favorite', CollectionController.toggleFavorite);
// Add these new routes
router.get('/:id/stats', CollectionController.getCollectionStats);
router.put('/:id/stats', CollectionController.updateCollectionStats);

export default router;
