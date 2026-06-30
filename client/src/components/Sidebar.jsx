import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/skills', label: 'Skills', icon: '🧠' },
  { to: '/projects', label: 'Projects', icon: '🚀' },
  { to: '/certifications', label: 'Certifications', icon: '🎓' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">SkillTrack Pro</span>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses} onClick={onClose}>
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-slate-400">Admin</div>
              <NavLink to="/admin" className={linkClasses} onClick={onClose}>
                <span>🛠️</span>
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
