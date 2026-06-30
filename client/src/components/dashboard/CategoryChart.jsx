import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#64748b'];

export default function CategoryChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-12">No skill data yet — add some skills to see this chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
