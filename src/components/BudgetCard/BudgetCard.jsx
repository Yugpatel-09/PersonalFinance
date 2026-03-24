import { motion } from 'framer-motion';
import { RiAlertLine, RiCheckLine } from 'react-icons/ri';
import { useBudget } from '../../hooks/useBudget';
import { useCurrency } from '../../hooks/useCurrency';
import './BudgetCard.css';

export default function BudgetCard() {
  const { budget, monthlyExpenses, remaining, percentUsed, status } = useBudget();
  const { format } = useCurrency();

  if (!budget.monthlyBudget) {
    return (
      <div className="budget-card card budget-empty">
        <div className="budget-empty-icon">🎯</div>
        <div>
          <div className="budget-empty-title">No budget set</div>
          <div className="budget-empty-sub">Set a monthly budget to track your spending</div>
        </div>
      </div>
    );
  }

  const barColor =
    status === 'over' ? 'var(--danger)' :
    status === 'warning' ? 'var(--warning)' :
    'var(--success)';

  return (
    <div className={`budget-card card budget-${status}`}>
      <div className="budget-header">
        <div>
          <div className="budget-label">Monthly Budget</div>
          <div className="budget-amount">{format(budget.monthlyBudget)}</div>
        </div>
        <div className={`budget-status-icon ${status}`}>
          {status === 'over' || status === 'warning'
            ? <RiAlertLine size={20} />
            : <RiCheckLine size={20} />}
        </div>
      </div>

      <div className="budget-bar-wrap">
        <div className="budget-bar-bg">
          <motion.div
            className="budget-bar-fill"
            style={{ background: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="budget-bar-label">
          <span>{percentUsed.toFixed(0)}% used</span>
          <span>{format(Math.abs(remaining))} {remaining >= 0 ? 'left' : 'over'}</span>
        </div>
      </div>

      <div className="budget-stats">
        <div className="budget-stat">
          <div className="budget-stat-label">Spent</div>
          <div className="budget-stat-value expense">{format(monthlyExpenses)}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">Remaining</div>
          <div className={`budget-stat-value ${remaining >= 0 ? 'income' : 'expense'}`}>
            {format(Math.abs(remaining))}
          </div>
        </div>
      </div>
    </div>
  );
}
