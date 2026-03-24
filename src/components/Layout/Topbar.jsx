import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { RiMenuLine, RiAddLine, RiDeleteBin2Line } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencySelector from '../CurrencySelector';
import { useFinance } from '../../context/FinanceContext';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/transactions/new': 'Add Transaction',
  '/budget': 'Budget Tracker',
  '/analytics': 'Analytics',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { resetAll } = useFinance();
  const [showConfirm, setShowConfirm] = useState(false);
  const isEdit = pathname.includes('/edit/');
  const title = isEdit ? 'Edit Transaction' : (TITLES[pathname] || 'FinanceIQ');

  const handleReset = () => {
    resetAll();
    setShowConfirm(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button className="btn btn-ghost topbar-menu" onClick={onMenuClick}>
            <RiMenuLine size={22} />
          </button>
          <h1 className="topbar-title">{title}</h1>
        </div>
        <div className="topbar-right">
          <CurrencySelector />
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowConfirm(true)}
            title="Reset all data"
          >
            <RiDeleteBin2Line size={15} /> Reset
          </button>
          <Link to="/transactions/new" className="btn btn-primary btn-sm">
            <RiAddLine size={16} /> Add
          </Link>
        </div>
      </header>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="reset-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="reset-modal card"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reset-modal-icon">🗑️</div>
              <h2 className="reset-modal-title">Reset All Data?</h2>
              <p className="reset-modal-desc">
                This will permanently delete all transactions, budgets, and settings.
                This action <strong>cannot be undone</strong>.
              </p>
              <div className="reset-modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleReset}>
                  <RiDeleteBin2Line size={15} /> Yes, Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
