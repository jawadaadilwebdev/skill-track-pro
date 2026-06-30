import ProgressBar from '../ui/ProgressBar';

const statusColors = {
  'Not Started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export default function GoalCard({ goal, onEdit, onDelete }) {
  return (
    <div className="card p-5 group">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-base">{goal.title}</h3>
          <span className={`badge mt-1 ${statusColors[goal.status]}`}>{goal.status}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button onClick={() => onEdit(goal)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✏️</button>
          <button onClick={() => onDelete(goal)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">🗑️</button>
        </div>
      </div>

      {goal.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{goal.description}</p>}

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} colorClass="bg-emerald-500" />
      </div>

      {goal.targetDate && (
        <p className="text-xs text-slate-400 mt-3">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
      )}
    </div>
  );
}
