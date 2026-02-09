import { Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import { AuthRequest, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title } = req.body as CreateTodoRequest;
    const todo = await Todo.create(req.user!.id, title);
    res.status(201).json({ message: 'Todo created successfully', todo });
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todos = await Todo.findByUserId(req.user!.id);
    res.json({ todos });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTodoRequest = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    const todo = await Todo.update(parseInt(id), req.user!.id, updates);
    
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo updated successfully', todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Todo.delete(parseInt(id), req.user!.id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};
