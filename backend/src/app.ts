import express from 'express';
import dotenv from 'dotenv';
import prisma from './db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
prisma
  .$connect()
  .then(() => {
    console.log('Connected to the database using Prisma!');
  })
  .catch((error) => {
    console.error('Error connecting to the database: ', error);
  });

// Define routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use('/user', userRoutes);
// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  },
);

export default app;
