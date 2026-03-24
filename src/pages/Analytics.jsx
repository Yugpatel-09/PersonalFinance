import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RiArrowUpLine, RiArrowDownLine, RiScales3Line,
  RiTrophyLine, RiRefreshLine, RiLoader4Line,
} from 'react-icons/ri';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import SpendingPieChart from '../components/Charts/SpendingPieChart';
import MonthlyLineChart from '../components/Charts/MonthlyLineChart';
import IncomeExpenseBarChart from '../components/Charts/IncomeExpenseBarChart';
import CurrencySelector from '../components/CurrencySelector';
import './Analytics.css';

function KpiCard({ icon, label, value, sub, color, bg, delay }) {
  return (
    <motion.div
      className="kpi-card card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="kpi-icon" style={{ background: bg, color }}>{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color }}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </motion.div>
  );
}

export default function Analytics() {
  const { allTransactions, totalIncome, totalExpenses, netBalance, byCategory, topCategory } = useTransactions();
  const { format, loading: ratesLoading } = useCurrency();

  const savingsRate = totalIncome > 0
    ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your financial data</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {ratesLoading && <RiLoader4Line size={18} className="spin" style={{ color: 'var(--text3)' }} />}
          <CurrencySelector />
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        <KpiCard
          icon={<RiArrowUpLine size={22} />}
          label="Total Income"
          value={format(totalIncome)}
          sub={`${allTransactions.filter((t) => t.type === 'income').length} transactions`}
          color="var(--success)"
          bg="var(--success-light)"
          delay={0}
        />
        <KpiCard
          icon={<RiArrowDownLine size={22} />}
          label="Total Expenses"
          value={format(totalExpenses)}
          sub={`${allTransactions.filter((t) => t.type === 'expense').length} transactions`}
          color="var(--danger)"
          bg="var(--danger-light)"
          delay={0.05}
        />
        <KpiCard
          icon={<RiScales3Line size={22} />}
          label="Net Balance"
          value={format(netBalance)}
          sub={`${savingsRate}% savings rate`}
          color={netBalance >= 0 ? 'var(--success)' : 'var(--danger)'}
          bg={netBalance >= 0 ? 'var(--success-light)' : 'var(--danger-light)'}
          delay={0.1}
        />
        <KpiCard
          icon={<RiTrophyLine size={22} />}
          label="Top Spending"
          value={topCategory}
          sub={byCategory[0] ? format(byCategory[0].value) : '—'}
          color="var(--warning)"
          bg="var(--warning-light)"
          delay={0.15}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="chart-title">Spending by Category</h2>
          <SpendingPieChart data={byCategory} />
        </motion.div>

        <motion.div
          className="card chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="chart-title">Monthly Trend</h2>
          <MonthlyLineChart transactions={allTransactions} />
        </motion.div>

        <motion.div
          className="card chart-card chart-card-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="chart-title">Income vs Expenses (Last 6 Months)</h2>
          <IncomeExpenseBarChart transactions={allTransactions} />
        </motion.div>
      </div>

      {/* Category table */}
      {byCategory.length > 0 && (
        <motion.div
          className="card"
          style={{ padding: 20, marginTop: 20 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="chart-title" style={{ marginBottom: 16 }}>Category Breakdown</h2>
          <div className="cat-table">
            <div className="cat-table-header">
              <span>Category</span>
              <span>Amount</span>
              <span>% of Expenses</span>
              <span>Transactions</span>
            </div>
            {byCategory.map((cat) => {
              const pct = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(1) : 0;
              const count = allTransactions.filter((t) => t.category === cat.name && t.type === 'expense').length;
              return (
                <div key={cat.name} className="cat-table-row">
                  <span className="cat-table-name">{cat.name}</span>
                  <span className="cat-table-amount">{format(cat.value)}</span>
                  <span className="cat-table-pct">
                    <div className="inline-bar">
                      <div className="inline-bar-fill" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
                    </div>
                    {pct}%
                  </span>
                  <span className="cat-table-count">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
