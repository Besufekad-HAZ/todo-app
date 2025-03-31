import express from 'express';
import * as CollectionController from '../controllers/collection.controller';

const router = express.Router();

router.get('/', CollectionController.getCollections);
router.post('/', CollectionController.createCollection);
router.patch('/:id/favorite', CollectionController.toggleFavorite);

export default router;
