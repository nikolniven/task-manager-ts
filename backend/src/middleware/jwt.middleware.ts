import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './types';

// Define a custom type for the request object to include the payload
// const sumNumbers = (a,b) => a + b;
// const sumNumbers = (a: number,b: number) : number => a + b;
// Instantiate the JWT token validation middleware
const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get the token string from the authorization header - "Bearer eyJh5kp9..."
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Failed to authenticate token' });
        return;
      }

      // Ensure the decoded payload is of the correct type
      if (
        typeof decoded === 'object' &&
        'id' in decoded &&
        'email' in decoded &&
        'name' in decoded
      ) {
        req.payload = decoded as { id: string; email: string; name: string };
        next();
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

// Export the middleware so that we can use it to create protected routes
export { isAuthenticated };
