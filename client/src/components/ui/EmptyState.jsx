export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      {message && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
