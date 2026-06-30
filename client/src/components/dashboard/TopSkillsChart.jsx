import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TopSkillsChart({ skills }) {
  if (!skills || skills.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-12">No skills tracked yet.</p>;
  }

  const data = skills.map((s) => ({ name: s.name, proficiency: s.proficiency }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <Bar dataKey="proficiency" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
