import pool from '../config/database';
import { Todo } from '../types';

class TodoModel {
  async create(userId: string, title: string): Promise<Todo> {
    const result = await pool.query<Todo>(
      'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const result = await pool.query<Todo>(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async findById(id: string, userId: string): Promise<Todo | undefined> {
    const result = await pool.query<Todo>(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  async update(id: string, userId: string, updates: { title?: string; completed?: boolean }): Promise<Todo | undefined> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updates.title);
      paramCount++;
    }

    if (updates.completed !== undefined) {
      fields.push(`completed = $${paramCount}`);
      values.push(updates.completed);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add modified_at update
    fields.push(`modified_at = now()`);

    values.push(id, userId);
    const result = await pool.query<Todo>(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id: string, userId: string): Promise<{ id: string } | undefined> {
    const result = await pool.query<{ id: string }>(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

export default new TodoModel();
