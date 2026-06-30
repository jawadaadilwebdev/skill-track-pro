import { useState } from 'react';

const categories = ['Frontend', 'Backend', 'DevOps', 'Database', 'Mobile', 'Design', 'Soft Skill', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || 'Frontend',
    level: initial?.level || 'Beginner',
    proficiency: initial?.proficiency ?? 50,
    notes: initial?.notes || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Skill name is required';
    if (form.proficiency < 0 || form.proficiency > 100) errs.proficiency = 'Must be between 0 and 100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, proficiency: Number(form.proficiency) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Skill name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="e.g. React.js" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Level</label>
          <select name="level" value={form.level} onChange={handleChange} className="input">
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Proficiency: {form.proficiency}%</label>
        <input
          type="range"
          name="proficiency"
          min="0"
          max="100"
          value={form.proficiency}
          onChange={handleChange}
          className="w-full accent-brand-600"
        />
        {errors.proficiency && <p className="text-xs text-red-500 mt-1">{errors.proficiency}</p>}
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input" placeholder="What have you built with this skill?" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Update Skill' : 'Add Skill'}
        </button>
      </div>
    </form>
  );
}
