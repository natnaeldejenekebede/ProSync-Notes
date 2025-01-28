import { Request } from "express";

/**
 * Interface for an authenticated request
 *
 * @property user The user object containing user information
 * @property user.id The user's ID
 * @property user.username The user's username
 * @property user.email The user's email
 * @property user.sub The user's subscription status
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    sub?: number;
  };
}
