import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskControllers.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Get all tasks
router.get('/', authMiddleware, getTasks);

// Create a new task
router.post('/', authMiddleware, createTask);

// Update a task by ID
router.put('/:id', authMiddleware, updateTask);

// Delete a task by ID
router.delete('/:id', authMiddleware, deleteTask);

export default router;