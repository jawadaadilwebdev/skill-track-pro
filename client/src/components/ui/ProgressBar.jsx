export default function ProgressBar({ value = 0, colorClass = 'bg-brand-600' }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
