import { Response, NextFunction } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest, CreateTransactionRequest, UpdateTransactionRequest } from '../types';

export const createTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, category, amount, note, date } = req.body as CreateTransactionRequest;
    const transaction = await Transaction.create(
      req.user!.id,
      type,
      category,
      amount,
      note || null,
      date
    );
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const transactions = await Transaction.findByUserId(req.user!.id);
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTransactionRequest = {};

    const allowedFields: (keyof UpdateTransactionRequest)[] = ['type', 'category', 'amount', 'note', 'date'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const transaction = await Transaction.update(id, req.user!.id, updates);
    
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.delete(id, req.user!.id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};
