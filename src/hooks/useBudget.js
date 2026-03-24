import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';

export function useBudget() {
  const { transactions, budget, setBudget } = useFinance();

  const currentMonth = format(new Date(), 'yyyy-MM');

  const monthlyExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
        .reduce((s, t) => s + t.amount, 0),
    [transactions, currentMonth]
  );

  const remaining = budget.monthlyBudget - monthlyExpenses;
  const percentUsed =
    budget.monthlyBudget > 0
      ? Math.min((monthlyExpenses / budget.monthlyBudget) * 100, 100)
      : 0;

  const isOverBudget = monthlyExpenses > budget.monthlyBudget && budget.monthlyBudget > 0;

  const status =
    percentUsed >= 100
      ? 'over'
      : percentUsed >= 80
      ? 'warning'
      : 'good';

  return {
    budget,
    setBudget,
    monthlyExpenses,
    remaining,
    percentUsed,
    isOverBudget,
    status,
    currentMonth,
  };
}
