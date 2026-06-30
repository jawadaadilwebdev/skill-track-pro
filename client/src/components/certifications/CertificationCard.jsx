export default function CertificationCard({ cert, onEdit, onDelete }) {
  const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();

  return (
    <div className="card p-5 group flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-base">{cert.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button onClick={() => onEdit(cert)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">✏️</button>
          <button onClick={() => onDelete(cert)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">🗑️</button>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
        {cert.expiryDate && (
          <p className={isExpired ? 'text-red-500' : ''}>
            {isExpired ? 'Expired' : 'Expires'}: {new Date(cert.expiryDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-3 text-sm">
        {cert.credentialUrl && (
          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Credential ↗</a>
        )}
        {cert.fileUrl && (
          <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">View File ↗</a>
        )}
      </div>
    </div>
  );
}
