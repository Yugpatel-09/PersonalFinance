import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useTransactions(filters = {}) {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.dateFrom) {
      result = result.filter((t) => new Date(t.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      result = result.filter((t) => new Date(t.date) <= new Date(filters.dateTo));
    }

    // Sorting
    const sortBy = filters.sortBy || 'date';
    const sortDir = filters.sortDir || 'desc';

    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'date') {
        valA = new Date(a.date);
        valB = new Date(b.date);
      } else if (sortBy === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else if (sortBy === 'category') {
        valA = a.category;
        valB = b.category;
      } else {
        valA = a[sortBy];
        valB = b[sortBy];
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const netBalance = totalIncome - totalExpenses;

  const byCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const topCategory = byCategory[0]?.name || '—';

  return {
    transactions: filtered,
    allTransactions: transactions,
    totalIncome,
    totalExpenses,
    netBalance,
    byCategory,
    topCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
