import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RiAddLine, RiFileListLine } from 'react-icons/ri';
import { useTransactions } from '../hooks/useTransactions';
import { useDebounce } from '../hooks/useDebounce';
import TransactionCard from '../components/TransactionCard/TransactionCard';
import SearchBar from '../components/SearchBar/SearchBar';
import Filters from '../components/Filters/Filters';
import './Transactions.css';

export default function Transactions() {
  const [searchRaw, setSearchRaw] = useState('');
  const [filters, setFilters] = useState({ sortBy: 'date', sortDir: 'desc' });
  const search = useDebounce(searchRaw, 300);

  const { transactions, deleteTransaction, totalIncome, totalExpenses } = useTransactions({
    ...filters,
    search,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/transactions/new" className="btn btn-primary">
          <RiAddLine size={16} /> Add New
        </Link>
      </div>

      {/* Summary bar */}
      <div className="tx-summary card">
        <div className="tx-summary-item">
          <span className="tx-summary-label">Showing</span>
          <span className="tx-summary-value">{transactions.length} results</span>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <span className="tx-summary-label">Income</span>
          <span className="tx-summary-value income">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="tx-summary-divider" />
        <div className="tx-summary-item">
          <span className="tx-summary-label">Expenses</span>
          <span className="tx-summary-value expense">-${totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      {/* Search */}
      <div className="tx-search-row">
        <SearchBar value={searchRaw} onChange={setSearchRaw} />
      </div>

      {/* Filters */}
      <Filters filters={filters} onChange={setFilters} />

      {/* List */}
      {transactions.length === 0 ? (
        <motion.div
          className="card empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <RiFileListLine size={48} />
          <h3>No transactions found</h3>
          <p>Try adjusting your search or filters</p>
          <Link to="/transactions/new" className="btn btn-primary" style={{ marginTop: 12 }}>
            Add Transaction
          </Link>
        </motion.div>
      ) : (
        <div className="tx-list-page">
          <AnimatePresence>
            {transactions.map((t, i) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onDelete={deleteTransaction}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
