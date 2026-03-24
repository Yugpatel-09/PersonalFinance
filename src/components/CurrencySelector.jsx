import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES } from '../utils/currencyFormatter';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="form-input"
      style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
      title="Select currency"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}
