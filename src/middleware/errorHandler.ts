import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.code === '23505') {
    res.status(400).json({ error: 'Duplicate entry' });
    return;
  }

  if (err.code === '23503') {
    res.status(400).json({ error: 'Referenced record not found' });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};
