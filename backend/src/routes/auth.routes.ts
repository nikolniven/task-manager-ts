import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import prisma from '../db';
import { isAuthenticated } from '../middleware/jwt.middleware';
import { AuthenticatedRequest } from '../middleware/types';

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, name } = req.body;
    console.log('Received signup request:', { email, password, name });
    // Check if email, password, or name are provided as empty strings
    if (
      validator.isEmpty(email) ||
      validator.isEmpty(password) ||
      validator.isEmpty(name)
    ) {
      console.log('Received signup request:', { email, password, name });
      res.status(400).json({ message: 'Provide email, password, and name' });
      return;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      console.error('Validation error: Invalid email format');
      res.status(400).json({ message: 'Provide a valid email address.' });
      return;
    }

    // Validate password strength
    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      console.log(
        'Password validation result:',
        validator.isStrongPassword(password, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
      );
      res.status(400).json({
        message:
          'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
      });
      return;
    }

    try {
      // Check if a user with the same email already exists
      const foundUser = await prisma.user.findUnique({ where: { email } });

      if (foundUser) {
        console.error('User already exists:', email);
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      const createdUser = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      // Deconstruct the newly created user object to omit the password
      const { id, email: userEmail, name: userName } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { id, email: userEmail, name: userName };

      // Send a json response containing the user object
      console.log('User created successfully:', user);
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/login - Verifies email and password and returns a JWT
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    console.log('Received login request:', { email, password });

    // Check if email or password are provided as empty strings
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      res.status(400).json({ message: 'Provide email and password.' });
      return;
    }

    try {
      // Check if a user with the same email exists
      const foundUser = await prisma.user.findUnique({ where: { email } });

      if (!foundUser) {
        console.error('User not found:', email);
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { id, email: userEmail, name: userName } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { id, email: userEmail, name: userName };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET as string,
          {
            algorithm: 'HS256',
            expiresIn: '6h',
          },
        );

        // Send the token as the response

        console.log('User authenticated successfully:', payload);
        res.status(200).json({ authToken });
      } else {
        console.error('Authentication failed: Incorrect password');
        res.status(401).json({ message: 'Unable to authenticate the user' });
      }
    } catch (err) {
      console.error('Error logging in user:', err);
      next(err);
    }
  },
);

// GET /auth/verify - Used to verify JWT stored on the client
router.get(
  '/verify',
  isAuthenticated,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // If JWT token is valid the payload gets decoded by the isAuthenticated middleware and is made available on `req.payload`
    console.log('req.payload', req.payload);

    // Send back the token payload object containing the user data
    res.status(200).json(req.payload);
  },
);

export default router;
