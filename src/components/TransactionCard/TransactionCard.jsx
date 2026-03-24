import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiEditLine, RiDeleteBinLine, RiRepeatLine } from 'react-icons/ri';
import { formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/currencyFormatter';
import { useCurrency } from '../../hooks/useCurrency';
import './TransactionCard.css';

export default function TransactionCard({ transaction, onDelete, index = 0 }) {
  const { format } = useCurrency();
  const { id, title, amount, category, type, date, notes, recurring } = transaction;

  const color = CATEGORY_COLORS[category] || '#94a3b8';
  const icon = CATEGORY_ICONS[category] || '📦';

  return (
    <motion.div
      className="tx-card card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      layout
    >
      <div className="tx-card-left">
        <div className="tx-icon" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
        <div className="tx-info">
          <div className="tx-title">
            {title}
            {recurring && (
              <span className="badge badge-recurring" style={{ marginLeft: 6 }}>
                <RiRepeatLine size={11} /> Recurring
              </span>
            )}
          </div>
          <div className="tx-meta">
            <span className="tx-category" style={{ color }}>{category}</span>
            <span className="tx-dot">·</span>
            <span className="tx-date">{formatDate(date)}</span>
            {notes && (
              <>
                <span className="tx-dot">·</span>
                <span className="tx-notes">{notes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="tx-card-right">
        <div className={`tx-amount ${type}`}>
          {type === 'income' ? '+' : '-'}{format(amount)}
        </div>
        <span className={`badge badge-${type}`}>
          {type === 'income' ? '↑ Income' : '↓ Expense'}
        </span>
        <div className="tx-actions">
          <Link to={`/transactions/edit/${id}`} className="btn btn-ghost btn-sm" title="Edit">
            <RiEditLine size={16} />
          </Link>
          <button
            className="btn btn-ghost btn-sm tx-delete"
            onClick={() => onDelete(id)}
            title="Delete"
          >
            <RiDeleteBinLine size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
