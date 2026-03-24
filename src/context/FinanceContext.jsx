import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'financeiq_data';

const initialState = {
  transactions: [],
  budget: { monthlyBudget: 0 },
  currency: 'USD',
};

// Seed sample data on first load
const seedTransactions = () => [
  { id: uuidv4(), title: 'Monthly Salary', amount: 4500, category: 'Income', type: 'income', date: '2024-03-01', notes: 'March salary', recurring: true },
  { id: uuidv4(), title: 'Netflix Subscription', amount: 15.99, category: 'Subscriptions', type: 'expense', date: '2024-03-02', notes: 'Monthly plan', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 120, category: 'Food', type: 'expense', date: '2024-03-05', notes: 'Weekly groceries', recurring: false },
  { id: uuidv4(), title: 'Gym Membership', amount: 45, category: 'Health', type: 'expense', date: '2024-03-06', notes: 'Monthly gym', recurring: true },
  { id: uuidv4(), title: 'Rent Payment', amount: 1200, category: 'Rent', type: 'expense', date: '2024-03-07', notes: 'March rent', recurring: true },
  { id: uuidv4(), title: 'Freelance Project', amount: 800, category: 'Income', type: 'income', date: '2024-03-10', notes: 'Web design project', recurring: false },
  { id: uuidv4(), title: 'Electricity Bill', amount: 85, category: 'Utilities', type: 'expense', date: '2024-03-12', notes: '', recurring: false },
  { id: uuidv4(), title: 'Dinner Out', amount: 65, category: 'Food', type: 'expense', date: '2024-03-14', notes: 'Birthday dinner', recurring: false },
  { id: uuidv4(), title: 'Flight Tickets', amount: 320, category: 'Travel', type: 'expense', date: '2024-03-16', notes: 'Weekend trip', recurring: false },
  { id: uuidv4(), title: 'Amazon Shopping', amount: 95, category: 'Shopping', type: 'expense', date: '2024-03-18', notes: 'Home essentials', recurring: false },
  { id: uuidv4(), title: 'Spotify', amount: 9.99, category: 'Subscriptions', type: 'expense', date: '2024-03-20', notes: '', recurring: true },
  { id: uuidv4(), title: 'Movie Tickets', amount: 30, category: 'Entertainment', type: 'expense', date: '2024-03-22', notes: 'Weekend movie', recurring: false },
  { id: uuidv4(), title: 'Bonus', amount: 500, category: 'Income', type: 'income', date: '2024-02-15', notes: 'Performance bonus', recurring: false },
  { id: uuidv4(), title: 'Monthly Salary', amount: 4500, category: 'Income', type: 'income', date: '2024-02-01', notes: 'Feb salary', recurring: true },
  { id: uuidv4(), title: 'Rent Payment', amount: 1200, category: 'Rent', type: 'expense', date: '2024-02-07', notes: 'Feb rent', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 110, category: 'Food', type: 'expense', date: '2024-02-10', notes: '', recurring: false },
  { id: uuidv4(), title: 'Doctor Visit', amount: 150, category: 'Health', type: 'expense', date: '2024-02-20', notes: 'Annual checkup', recurring: false },
  { id: uuidv4(), title: 'Internet Bill', amount: 60, category: 'Utilities', type: 'expense', date: '2024-01-15', notes: '', recurring: true },
  { id: uuidv4(), title: 'Monthly Salary', amount: 4500, category: 'Income', type: 'income', date: '2024-01-01', notes: 'Jan salary', recurring: true },
  { id: uuidv4(), title: 'New Shoes', amount: 180, category: 'Shopping', type: 'expense', date: '2024-01-25', notes: 'Running shoes', recurring: false },
];

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'RESET_ALL':
      return { ...initialState };
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
      } else {
        // Seed sample data
        const seeded = { ...initialState, transactions: seedTransactions(), budget: { monthlyBudget: 3000 } };
        dispatch({ type: 'LOAD', payload: seeded });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.transactions.length > 0 || state.budget.monthlyBudget > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addTransaction = (data) => {
    const tx = { ...data, id: uuidv4() };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    toast.success(`Transaction "${data.title}" added!`);
    return tx;
  };

  const updateTransaction = (data) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: data });
    toast.success(`Transaction updated!`);
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    toast.error('Transaction deleted');
  };

  const setBudget = (budget) => {
    dispatch({ type: 'SET_BUDGET', payload: budget });
    toast.success('Budget updated!');
  };

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_ALL' });
    toast.info('All data cleared');
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        budget: state.budget,
        currency: state.currency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudget,
        setCurrency,
        resetAll,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
