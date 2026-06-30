import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          className="lg:hidden text-slate-600 dark:text-slate-300 text-xl"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
