import { Response, NextFunction } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const monthlyStats = await Transaction.getMonthlyStats(req.user!.id, year, month);
    const expensesByCategory = await Transaction.getExpensesByCategory(req.user!.id, year, month);

    const stats = {
      income: 0,
      expense: 0,
      loan_given: 0,
      loan_taken: 0,
      savings: 0
    };

    monthlyStats.forEach(stat => {
      stats[stat.type] = parseFloat(stat.total);
    });

    const savingsBalance = stats.savings + stats.income - stats.expense - stats.loan_given + stats.loan_taken;

    res.json({
      currentMonth: {
        year,
        month
      },
      totalIncome: stats.income,
      totalExpenses: stats.expense,
      savingsBalance,
      loanGiven: stats.loan_given,
      loanTaken: stats.loan_taken,
      expensesByCategory: expensesByCategory.map(item => ({
        category: item.category,
        total: parseFloat(item.total)
      })),
      summary: {
        netBalance: stats.income - stats.expense
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyComparison = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

    const monthlyStats = await Transaction.getMonthlyStats(req.user!.id, targetYear, targetMonth);

    const stats = {
      income: 0,
      expense: 0
    };

    monthlyStats.forEach(stat => {
      if (stat.type === 'income') stats.income = parseFloat(stat.total);
      if (stat.type === 'expense') stats.expense = parseFloat(stat.total);
    });

    res.json({
      year: targetYear,
      month: targetMonth,
      income: stats.income,
      expense: stats.expense,
      difference: stats.income - stats.expense
    });
  } catch (error) {
    next(error);
  }
};
