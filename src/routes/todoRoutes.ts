import { Router } from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController';
import { validateTodo } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, validateTodo, createTodo);
router.get('/', auth, getTodos);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;
