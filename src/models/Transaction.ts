import pool from '../config/database';
import { Transaction, TransactionType, MonthlyStats, ExpenseByCategory, MostActiveUser } from '../types';

class TransactionModel {
  async create(
    userId: string,
    type: TransactionType,
    category: string,
    amount: number,
    note: string | null,
    date: string
  ): Promise<Transaction> {
    const result = await pool.query<Transaction>(
      'INSERT INTO transactions (user_id, type, category, amount, note, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, type, category, amount, note, date]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const result = await pool.query<Transaction>(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async findById(id: string, userId: string): Promise<Transaction | undefined> {
    const result = await pool.query<Transaction>(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  async update(
    id: string,
    userId: string,
    updates: {
      type?: TransactionType;
      category?: string;
      amount?: number;
      note?: string;
      date?: string;
    }
  ): Promise<Transaction | undefined> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const allowedFields: (keyof typeof updates)[] = ['type', 'category', 'amount', 'note', 'date'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add modified_at update
    fields.push(`modified_at = now()`);

    values.push(id, userId);
    const result = await pool.query<Transaction>(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id: string, userId: string): Promise<{ id: string } | undefined> {
    const result = await pool.query<{ id: string }>(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }

  async getMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats[]> {
    const result = await pool.query<MonthlyStats>(
      `SELECT 
        type,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM date) = $2 
        AND EXTRACT(MONTH FROM date) = $3
      GROUP BY type`,
      [userId, year, month]
    );
    return result.rows;
  }

  async getExpensesByCategory(userId: string, year: number, month: number): Promise<ExpenseByCategory[]> {
    const result = await pool.query<ExpenseByCategory>(
      `SELECT 
        category,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = $1 
        AND type = 'expense'
        AND EXTRACT(YEAR FROM date) = $2 
        AND EXTRACT(MONTH FROM date) = $3
      GROUP BY category
      ORDER BY total DESC`,
      [userId, year, month]
    );
    return result.rows;
  }

  async getTotalCount(): Promise<number> {
    const result = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM transactions');
    return parseInt(result.rows[0].count);
  }

  async getMostActiveUsers(limit: number = 5): Promise<MostActiveUser[]> {
    const result = await pool.query<MostActiveUser>(
      `SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(t.id) as transaction_count
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id, u.name, u.email
      ORDER BY transaction_count DESC
      LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}

export default new TransactionModel();
