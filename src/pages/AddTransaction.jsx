import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { RiSaveLine, RiArrowLeftLine, RiErrorWarningLine } from 'react-icons/ri';
import { useTransactions } from '../hooks/useTransactions';
import { CATEGORIES, CATEGORY_ICONS, CURRENCIES } from '../utils/currencyFormatter';
import { useFinance } from '../context/FinanceContext';
import './AddTransaction.css';

const schema = yup.object({
  title: yup.string().trim().min(2, 'Title must be at least 2 characters').required('Title is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.string().required('Date is required'),
  notes: yup.string().max(200, 'Notes max 200 characters'),
  recurring: yup.boolean(),
});

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== 'Income');

export default function AddTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTransactions, addTransaction, updateTransaction } = useTransactions();
  const { currency } = useFinance();
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '$';

  const existing = id ? allTransactions.find((t) => t.id === id) : null;
  const isEdit = Boolean(existing);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      recurring: false,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        amount: existing.amount,
        category: existing.category,
        type: existing.type,
        date: existing.date,
        notes: existing.notes || '',
        recurring: existing.recurring || false,
      });
    }
  }, [existing, reset]);

  const txType = watch('type');
  const selectedCategory = watch('category');

  const onSubmit = (data) => {
    const payload = { ...data, amount: parseFloat(data.amount) };
    if (isEdit) {
      updateTransaction({ ...existing, ...payload });
    } else {
      addTransaction(payload);
    }
    navigate('/transactions');
  };

  const categories = txType === 'income' ? ['Income', 'Other'] : EXPENSE_CATEGORIES;

  return (
    <div className="add-tx-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update the details below' : 'Fill in the details below'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <RiArrowLeftLine size={16} /> Back
        </button>
      </div>

      <motion.div
        className="card add-tx-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="add-tx-form">
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`type-btn ${field.value === 'expense' ? 'active expense' : ''}`}
                    onClick={() => field.onChange('expense')}
                  >
                    ↓ Expense
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${field.value === 'income' ? 'active income' : ''}`}
                    onClick={() => field.onChange('income')}
                  >
                    ↑ Income
                  </button>
                </div>
              )}
            />
          </div>

          <div className="form-row">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                {...register('title')}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Netflix Subscription"
              />
              {errors.title && (
                <span className="form-error">
                  <RiErrorWarningLine size={13} /> {errors.title.message}
                </span>
              )}
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <div className="amount-input-wrap">
                <span className="amount-currency-symbol">{currencySymbol}</span>
                <input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input amount-input ${errors.amount ? 'error' : ''}`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <span className="form-error">
                  <RiErrorWarningLine size={13} /> {errors.amount.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                {...register('category')}
                className={`form-input ${errors.category ? 'error' : ''}`}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_ICONS[c]} {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="form-error">
                  <RiErrorWarningLine size={13} /> {errors.category.message}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                {...register('date')}
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && (
                <span className="form-error">
                  <RiErrorWarningLine size={13} /> {errors.date.message}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              {...register('notes')}
              className={`form-input ${errors.notes ? 'error' : ''}`}
              placeholder="Optional notes..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
            {errors.notes && (
              <span className="form-error">
                <RiErrorWarningLine size={13} /> {errors.notes.message}
              </span>
            )}
          </div>

          {/* Recurring */}
          <div className="form-group">
            <label className="recurring-label">
              <input type="checkbox" {...register('recurring')} className="recurring-checkbox" />
              <span className="recurring-text">
                <span className="recurring-title">Mark as Recurring</span>
                <span className="recurring-sub">This transaction repeats monthly (e.g. rent, subscriptions)</span>
              </span>
            </label>
          </div>

          {/* Preview */}
          <div className="tx-preview">
            <div className="tx-preview-label">Preview</div>
            <div className="tx-preview-content">
              <span className="tx-preview-icon">{CATEGORY_ICONS[selectedCategory] || '📦'}</span>
              <span className="tx-preview-type" data-type={txType}>
                {txType === 'income' ? 'Income' : 'Expense'}
              </span>
              <span className="tx-preview-cat">{selectedCategory}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              <RiSaveLine size={18} />
              {isEdit ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
