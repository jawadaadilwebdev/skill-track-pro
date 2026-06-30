import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-xl">SkillTrack Pro</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-center">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
