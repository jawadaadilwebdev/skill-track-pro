export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="btn-secondary !px-3 !py-1.5"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Page {page} of {pages}
      </span>
      <button
        className="btn-secondary !px-3 !py-1.5"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
