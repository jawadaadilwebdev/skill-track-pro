import ProgressBar from '../ui/ProgressBar';

const categoryColors = {
  Frontend: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Backend: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  DevOps: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Database: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Mobile: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Design: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  'Soft Skill': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <div className="card p-5 group">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-base">{skill.name}</h3>
          <span className={`badge mt-1 ${categoryColors[skill.category] || categoryColors.Other}`}>
            {skill.category}
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button onClick={() => onEdit(skill)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit">✏️</button>
          <button onClick={() => onDelete(skill)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete">🗑️</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>{skill.level}</span>
          <span>{skill.proficiency}%</span>
        </div>
        <ProgressBar value={skill.proficiency} />
      </div>

      {skill.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">{skill.notes}</p>
      )}
    </div>
  );
}
