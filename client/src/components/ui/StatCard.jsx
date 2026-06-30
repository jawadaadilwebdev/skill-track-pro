export default function StatCard({ label, value, icon, accent = 'text-brand-600' }) {
  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
}
