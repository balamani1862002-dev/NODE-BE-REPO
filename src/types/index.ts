import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
  modified_at: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: Date;
  modified_at: Date;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: Date;
  modified_at: Date;
}

export type TransactionType = 'income' | 'expense' | 'loan_given' | 'loan_taken' | 'savings';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  note: string | null;
  date: Date;
  created_at: Date;
  modified_at: Date;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  category: string;
  amount: number;
  note?: string;
  date: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  category?: string;
  amount?: number;
  note?: string;
  date?: string;
}

export interface MonthlyStats {
  type: TransactionType;
  total: string;
}

export interface ExpenseByCategory {
  category: string;
  total: string;
}

export interface MostActiveUser {
  id: string;
  name: string;
  email: string;
  transaction_count: string;
}
