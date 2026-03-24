import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { format as fmtDate, parseISO, startOfMonth } from 'date-fns';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  const { format } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontSize: 13, marginBottom: 2 }}>
          {p.name}: <strong>{format(p.value)}</strong>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyLineChart({ transactions }) {
  const { format } = useCurrency();

  const data = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const month = fmtDate(startOfMonth(parseISO(t.date)), 'MMM yyyy');
      if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
      if (t.type === 'income') map[month].income += t.amount;
      else map[month].expenses += t.amount;
    });
    return Object.values(map).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions]);

  if (!data.length) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <span>📈</span>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text2)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--text2)' }} tickFormatter={(v) => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
        <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 4 }} name="Income" />
        <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 4 }} name="Expenses" />
      </LineChart>
    </ResponsiveContainer>
  );
}
