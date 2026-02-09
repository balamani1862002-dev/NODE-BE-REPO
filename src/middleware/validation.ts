import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest, CreateTodoRequest, CreateTransactionRequest } from '../types';

export const validateRegister = (req: Request<{}, {}, RegisterRequest>, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  next();
};

export const validateLogin = (req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  next();
};

export const validateTodo = (req: Request<{}, {}, CreateTodoRequest>, res: Response, next: NextFunction): void => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  next();
};

export const validateTransaction = (req: Request<{}, {}, CreateTransactionRequest>, res: Response, next: NextFunction): void => {
  const { type, category, amount, date } = req.body;

  if (!type || !category || !amount || !date) {
    res.status(400).json({ error: 'Type, category, amount, and date are required' });
    return;
  }

  const validTypes = ['income', 'expense', 'loan_given', 'loan_taken', 'savings'];
  if (!validTypes.includes(type)) {
    res.status(400).json({ error: 'Invalid transaction type' });
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    res.status(400).json({ error: 'Amount must be a positive number' });
    return;
  }

  next();
};
