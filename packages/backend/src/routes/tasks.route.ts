import express from 'express';
import * as TaskController from '../controllers/task.controller';

const router = express.Router();

router.get('/collection/:collectionId', TaskController.getTasksByCollection);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.patch('/:id/toggle', TaskController.toggleTask);

export default router;
