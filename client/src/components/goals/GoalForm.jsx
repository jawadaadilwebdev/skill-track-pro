import { useState } from 'react';

const statuses = ['Not Started', 'In Progress', 'Completed'];
const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function GoalForm({ initial, skills = [], onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    targetDate: toInputDate(initial?.targetDate) || '',
    progress: initial?.progress ?? 0,
    status: initial?.status || 'Not Started',
    relatedSkill: initial?.relatedSkill?._id || initial?.relatedSkill || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Keep status and progress in sync for a more intuitive UX.
      if (name === 'progress') {
        const num = Number(value);
        if (num === 100) next.status = 'Completed';
        else if (num > 0) next.status = 'In Progress';
        else next.status = 'Not Started';
      }
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Goal title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, progress: Number(form.progress) };
    if (!payload.relatedSkill) delete payload.relatedSkill;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Goal title</label>
        <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. Master TypeScript" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input" />
      </div>

      {skills.length > 0 && (
        <div>
          <label className="label">Related skill (optional)</label>
          <select name="relatedSkill" value={form.relatedSkill} onChange={handleChange} className="input">
            <option value="">None</option>
            {skills.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="label">Target date (optional)</label>
        <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} className="input" />
      </div>

      <div>
        <label className="label">Progress: {form.progress}%</label>
        <input type="range" name="progress" min="0" max="100" value={form.progress} onChange={handleChange} className="w-full accent-emerald-600" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Update Goal' : 'Add Goal'}
        </button>
      </div>
    </form>
  );
}
