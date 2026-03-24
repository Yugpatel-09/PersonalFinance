import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiArrowUpLine, RiArrowDownLine, RiScales3Line,
  RiTrophyLine, RiArrowRightLine, RiRepeatLine,
} from 'react-icons/ri';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import TransactionCard from '../components/TransactionCard/TransactionCard';
import BudgetCard from '../components/BudgetCard/BudgetCard';
import SpendingPieChart from '../components/Charts/SpendingPieChart';
import './Dashboard.css';

function StatCard({ icon, label, value, color, bg, delay = 0 }) {
  return (
    <motion.div
      className="stat-card card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { allTransactions, totalIncome, totalExpenses, netBalance, byCategory, topCategory, deleteTransaction } = useTransactions();
  const { format } = useCurrency();

  const recent = allTransactions.slice(0, 5);
  const recurring = allTransactions.filter((t) => t.recurring);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning! 👋</h1>
          <p className="page-subtitle">Here's your financial overview</p>
        </div>
        <Link to="/transactions/new" className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={<RiArrowUpLine size={20} />}
          label="Total Income"
          value={format(totalIncome)}
          color="var(--success)"
          bg="var(--success-light)"
          delay={0}
        />
        <StatCard
          icon={<RiArrowDownLine size={20} />}
          label="Total Expenses"
          value={format(totalExpenses)}
          color="var(--danger)"
          bg="var(--danger-light)"
          delay={0.05}
        />
        <StatCard
          icon={<RiScales3Line size={20} />}
          label="Net Balance"
          value={format(netBalance)}
          color={netBalance >= 0 ? 'var(--success)' : 'var(--danger)'}
          bg={netBalance >= 0 ? 'var(--success-light)' : 'var(--danger-light)'}
          delay={0.1}
        />
        <StatCard
          icon={<RiTrophyLine size={20} />}
          label="Top Spending"
          value={topCategory}
          color="var(--warning)"
          bg="var(--warning-light)"
          delay={0.15}
        />
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left column */}
        <div className="dashboard-col">
          {/* Recent transactions */}
          <div className="card section-card">
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <Link to="/transactions" className="btn btn-ghost btn-sm">
                View all <RiArrowRightLine size={14} />
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="empty-state">
                <span>💸</span>
                <h3>No transactions yet</h3>
                <p>Add your first transaction to get started</p>
              </div>
            ) : (
              <div className="tx-list">
                {recent.map((t, i) => (
                  <TransactionCard key={t.id} transaction={t} onDelete={deleteTransaction} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Recurring */}
          {recurring.length > 0 && (
            <div className="card section-card">
              <div className="section-header">
                <h2 className="section-title">
                  <RiRepeatLine size={16} style={{ color: 'var(--primary)' }} />
                  Recurring ({recurring.length})
                </h2>
              </div>
              <div className="recurring-list">
                {recurring.slice(0, 4).map((t) => (
                  <div key={t.id} className="recurring-item">
                    <span className="recurring-title">{t.title}</span>
                    <span className={`recurring-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{format(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="dashboard-col">
          <div className="card section-card">
            <div className="section-header">
              <h2 className="section-title">Spending by Category</h2>
            </div>
            <SpendingPieChart data={byCategory} />
          </div>

          <BudgetCard />
        </div>
      </div>
    </div>
  );
}
