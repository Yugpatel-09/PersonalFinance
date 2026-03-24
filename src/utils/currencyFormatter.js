export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export const CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Subscriptions', 'Income', 'Other',
];

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Rent: '#8b5cf6',
  Shopping: '#ec4899',
  Entertainment: '#06b6d4',
  Health: '#10b981',
  Utilities: '#64748b',
  Subscriptions: '#6366f1',
  Income: '#22c55e',
  Other: '#94a3b8',
};

export const CATEGORY_ICONS = {
  Food: '🍔',
  Travel: '✈️',
  Rent: '🏠',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Health: '💊',
  Utilities: '⚡',
  Subscriptions: '📱',
  Income: '💰',
  Other: '📦',
};

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
