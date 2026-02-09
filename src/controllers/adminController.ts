import { Response, NextFunction } from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../types';

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.getAll();
    res.json({ users, count: users.length });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user!.id) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const deleted = await User.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTotalTransactions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await Transaction.getTotalCount();
    res.json({ totalTransactions: count });
  } catch (error) {
    next(error);
  }
};

export const getMostActiveUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const users = await Transaction.getMostActiveUsers(limit);
    res.json({ mostActiveUsers: users });
  } catch (error) {
    next(error);
  }
};
