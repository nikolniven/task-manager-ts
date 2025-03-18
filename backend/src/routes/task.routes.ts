import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../middleware/jwt.middleware';
import { AuthenticatedRequest } from '../middleware/types';
import prisma from '../db';

const router = express.Router();

// POST /tasks - Create a new task
router.post(
  '/',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.payload?.id) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }
      const userId = parseInt(req.payload.id, 10); // Extract user ID from JWT payload
      const { title, content, priority } = req.body;

      const newTask = await prisma.task.create({
        data: {
          title,
          content,
          priority: priority || 1, // Default to 1 if not provided
          userId,
        },
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

// GET /tasks - Fetch all tasks for the authenticated user
router.get(
  '/',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.payload?.id) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }
      const userId = parseInt(req.payload.id, 10); // Extract user ID from JWT payload

      const tasks = await prisma.task.findMany({
        where: { userId },
      });

      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

// GET /tasks/:id - Fetch a single task by ID
router.get(
  '/:id',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.payload?.id) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }
      const userId = parseInt(req.payload.id, 10); // Extract user ID from JWT payload
      const taskId = parseInt(req.params.id, 10);

      const task = await prisma.task.findUnique({
        where: { id: taskId, userId },
      });

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

// PUT /tasks/:id - Update a task by ID
router.put(
  '/:id',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.payload?.id) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }
      const userId = parseInt(req.payload.id, 10); // Extract user ID from JWT payload
      const taskId = parseInt(req.params.id, 10);
      const { title, content, priority } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id: taskId, userId },
        data: { title, content, priority },
      });

      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

// DELETE /tasks/:id - Delete a task by ID
router.delete(
  '/:id',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.payload?.id) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }
      const userId = parseInt(req.payload.id, 10); // Extract user ID from JWT payload
      const taskId = parseInt(req.params.id, 10);

      await prisma.task.delete({
        where: { id: taskId, userId },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

export default router;
