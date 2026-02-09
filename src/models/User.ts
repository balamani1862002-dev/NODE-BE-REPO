import pool from '../config/database';
import bcrypt from 'bcrypt';
import { User, UserResponse } from '../types';

class UserModel {
  async create(name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query<UserResponse>(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, modified_at',
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findById(id: string): Promise<UserResponse | undefined> {
    const result = await pool.query<UserResponse>(
      'SELECT id, name, email, role, created_at, modified_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async getAll(): Promise<UserResponse[]> {
    const result = await pool.query<UserResponse>(
      'SELECT id, name, email, role, created_at, modified_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async delete(id: string): Promise<{ id: string } | undefined> {
    const result = await pool.query<{ id: string }>('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default new UserModel();
