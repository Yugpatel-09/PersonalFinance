import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiEditLine, RiSaveLine, RiPieChartLine } from 'react-icons/ri';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { useTransactions } from '../hooks/useTransactions';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/currencyFormatter';
import BudgetCard from '../components/BudgetCard/BudgetCard';
import './Budget.css';

export default function Budget() {
  const { budget, setBudget, monthlyExpenses, currentMonth } = useBudget();
  const { format } = useCurrency();
  const { byCategory } = useTransactions();
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(budget.monthlyBudget || '');

  const handleSave = () => {
    const val = parseFloat(inputVal);
    if (!isNaN(val) && val >= 0) {
      setBudget({ monthlyBudget: val });
      setEditing(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Tracker</h1>
          <p className="page-subtitle">Monitor your monthly spending limits</p>
        </div>
      </div>

      <div className="budget-page-grid">
        {/* Left */}
        <div className="budget-page-col">
          {/* Set budget */}
          <motion.div
            className="card budget-set-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="budget-set-header">
              <div>
                <h2 className="section-title">
                  <RiPieChartLine size={16} style={{ color: 'var(--primary)' }} />
                  Monthly Budget
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
                  Set your spending limit for {currentMonth}
                </p>
              </div>
              {!editing && (
                <button className="btn btn-secondary btn-sm" onClick={() => { setInputVal(budget.monthlyBudget); setEditing(true); }}>
                  <RiEditLine size={14} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="budget-edit-form">
                <div className="form-group">
                  <label className="form-label">Monthly Budget Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="form-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="e.g. 3000"
                    autoFocus
                  />
                </div>
                <div className="budget-edit-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>
                    <RiSaveLine size={14} /> Save Budget
                  </button>
                </div>
              </div>
            ) : (
              <div className="budget-display">
                <div className="budget-display-amount">{format(budget.monthlyBudget || 0)}</div>
                <div className="budget-display-label">per month</div>
              </div>
            )}
          </motion.div>

          <BudgetCard />

          {/* Quick presets */}
          <div className="card budget-presets">
            <h3 className="section-title" style={{ marginBottom: 12 }}>Quick Presets</h3>
            <div className="presets-grid">
              {[1000, 1500, 2000, 2500, 3000, 5000].map((v) => (
                <button
                  key={v}
                  className={`preset-btn ${budget.monthlyBudget === v ? 'active' : ''}`}
                  onClick={() => { setBudget({ monthlyBudget: v }); setEditing(false); }}
                >
                  {format(v)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — category breakdown */}
        <div className="budget-page-col">
          <div className="card" style={{ padding: 20 }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Spending by Category</h2>
            {byCategory.length === 0 ? (
              <div className="empty-state">
                <span>📊</span>
                <p>No expense data yet</p>
              </div>
            ) : (
              <div className="category-breakdown">
                {byCategory.map((cat) => {
                  const pct = budget.monthlyBudget > 0
                    ? Math.min((cat.value / budget.monthlyBudget) * 100, 100)
                    : 0;
                  const color = CATEGORY_COLORS[cat.name] || '#94a3b8';
                  return (
                    <div key={cat.name} className="cat-row">
                      <div className="cat-row-header">
                        <div className="cat-row-left">
                          <span className="cat-icon">{CATEGORY_ICONS[cat.name] || '📦'}</span>
                          <span className="cat-name">{cat.name}</span>
                        </div>
                        <div className="cat-row-right">
                          <span className="cat-amount">{format(cat.value)}</span>
                          <span className="cat-pct">{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="cat-bar-bg">
                        <motion.div
                          className="cat-bar-fill"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
