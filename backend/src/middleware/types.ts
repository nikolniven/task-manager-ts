import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  payload?: { id: string; email: string; name: string };
}
