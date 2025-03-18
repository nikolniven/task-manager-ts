import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../middleware/jwt.middleware';
import { AuthenticatedRequest } from '../middleware/types';
import prisma from '../db';

const router = express.Router();

// GET /user/profile - Fetches the user profile
router.get(
  '/profile',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.payload?.id); // Extract user ID from JWT payload and convert to number

      if (!userId) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Exclude the password from the response
      const { password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

// PUT /user/profile - Updates the user profile
router.put(
  '/profile',
  isAuthenticated,
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.payload?.id); // Extract user ID from JWT payload
      const { name, email } = req.body;

      if (!userId) {
        res.status(400).json({ message: 'User ID not found in token payload' });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });

      // Exclude the password from the response
      const { password, ...userWithoutPassword } = updatedUser;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user profile:', error);
      next(error); // Pass the error to the next middleware
    }
  },
);

export default router;
