import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/currencyFormatter';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload }) => {
  const { format } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].name}</div>
      <div style={{ color: payload[0].payload.fill, fontWeight: 700 }}>{format(payload[0].value)}</div>
    </div>
  );
};

export default function SpendingPieChart({ data }) {
  if (!data?.length) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <span>🥧</span>
        <p>No expense data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
