import { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';
import { fetchExchangeRates } from '../services/api';

export function useCurrency() {
  const { currency, setCurrency } = useFinance();
  const [rates, setRates] = useState({ USD: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchExchangeRates('USD')
      .then((data) => {
        if (!cancelled) setRates(data.conversion_rates || { USD: 1 });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load exchange rates');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const convert = useCallback(
    (amount, from = 'USD', to = currency) => {
      if (from === to) return amount;
      const inUSD = from === 'USD' ? amount : amount / (rates[from] || 1);
      return inUSD * (rates[to] || 1);
    },
    [rates, currency]
  );

  const format = useCallback(
    (amount) => {
      const converted = convert(amount);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
    },
    [convert, currency]
  );

  return { currency, setCurrency, rates, loading, error, convert, format };
}
