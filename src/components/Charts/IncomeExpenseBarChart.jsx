import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

export default function IncomeExpenseBarChart({ transactions }) {
  const data = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const month = fmtDate(startOfMonth(parseISO(t.date)), 'MMM yy');
      if (!map[month]) map[month] = { month, Income: 0, Expenses: 0 };
      if (t.type === 'income') map[month].Income += t.amount;
      else map[month].Expenses += t.amount;
    });
    return Object.values(map).sort((a, b) => new Date(a.month) - new Date(b.month)).slice(-6);
  }, [transactions]);

  if (!data.length) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <span>📊</span>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text2)' }} />
        <YAxis tick={{ fontSize: 12, fill: 'var(--text2)' }} tickFormatter={(v) => `$${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
        <Bar dataKey="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expenses" fill="var(--danger)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
