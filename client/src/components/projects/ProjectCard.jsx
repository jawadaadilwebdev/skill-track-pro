const statusColors = {
  Planned: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="card p-5 group flex flex-col">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-base">{project.title}</h3>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button onClick={() => onEdit(project)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✏️</button>
          <button onClick={() => onDelete(project)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">🗑️</button>
        </div>
      </div>

      <span className={`badge mt-2 w-fit ${statusColors[project.status]}`}>{project.status}</span>

      {project.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-3">{project.description}</p>
      )}

      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.techStack.map((t) => (
            <span key={t} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-3 text-sm">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Repo ↗</a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Live ↗</a>
        )}
      </div>
    </div>
  );
}
