import { RiFilterLine, RiArrowUpDownLine } from 'react-icons/ri';
import { CATEGORIES } from '../../utils/currencyFormatter';
import './Filters.css';

export default function Filters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="filters-bar">
      <div className="filters-group">
        <RiFilterLine size={16} className="filters-icon" />

        <select
          className="form-input filter-select"
          value={filters.category || 'all'}
          onChange={(e) => set('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="form-input filter-select"
          value={filters.type || 'all'}
          onChange={(e) => set('type', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          className="form-input filter-select"
          value={filters.dateFrom || ''}
          onChange={(e) => set('dateFrom', e.target.value)}
          title="From date"
        />
        <input
          type="date"
          className="form-input filter-select"
          value={filters.dateTo || ''}
          onChange={(e) => set('dateTo', e.target.value)}
          title="To date"
        />
      </div>

      <div className="filters-group">
        <RiArrowUpDownLine size={16} className="filters-icon" />
        <select
          className="form-input filter-select"
          value={filters.sortBy || 'date'}
          onChange={(e) => set('sortBy', e.target.value)}
        >
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="category">Sort: Category</option>
        </select>
        <select
          className="form-input filter-select"
          value={filters.sortDir || 'desc'}
          onChange={(e) => set('sortDir', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onChange({ sortBy: 'date', sortDir: 'desc' })}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
