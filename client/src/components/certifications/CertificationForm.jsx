import { useState } from 'react';

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function CertificationForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    issuer: initial?.issuer || '',
    issueDate: toInputDate(initial?.issueDate) || '',
    expiryDate: toInputDate(initial?.expiryDate) || '',
    credentialUrl: initial?.credentialUrl || '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.issuer.trim()) errs.issuer = 'Issuer is required';
    if (!form.issueDate) errs.issueDate = 'Issue date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, file: file || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g. AWS Certified Developer" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Issuer</label>
        <input name="issuer" value={form.issuer} onChange={handleChange} className="input" placeholder="e.g. Amazon Web Services" />
        {errors.issuer && <p className="text-xs text-red-500 mt-1">{errors.issuer}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Issue date</label>
          <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} className="input" />
          {errors.issueDate && <p className="text-xs text-red-500 mt-1">{errors.issueDate}</p>}
        </div>
        <div>
          <label className="label">Expiry date (optional)</label>
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Credential URL (optional)</label>
        <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange} className="input" placeholder="https://..." />
      </div>

      <div>
        <label className="label">Certificate file (PDF/Image, optional)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => setFile(e.target.files[0])}
          className="input file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-brand-700 dark:file:bg-brand-900/40 dark:file:text-brand-300"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initial ? 'Update Certification' : 'Add Certification'}
        </button>
      </div>
    </form>
  );
}
