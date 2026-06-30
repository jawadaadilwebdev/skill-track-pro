import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="text-xl font-semibold mt-3">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Go home</Link>
    </div>
  );
}
