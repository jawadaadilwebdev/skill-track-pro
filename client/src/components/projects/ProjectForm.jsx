import { useState } from 'react';

const statuses = ['Planned', 'In Progress', 'Completed'];

export default function ProjectForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    techStack: initial?.techStack?.join(', ') || '',
    repoUrl: initial?.repoUrl || '',
    liveUrl: initial?.liveUrl || '',
    status: initial?.status || 'In Progress',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Project title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. SkillTrack Pro" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input" />
      </div>

      <div>
        <label className="label">Tech stack (comma separated)</label>
        <input name="techStack" value={form.techStack} onChange={handleChange} className="input" placeholder="React, Node.js, MongoDB" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Repo URL</label>
          <input name="repoUrl" value={form.repoUrl} onChange={handleChange} className="input" placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="label">Live URL</label>
          <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="input" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="label">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="input">
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}
