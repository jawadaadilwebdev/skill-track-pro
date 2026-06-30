import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { userService } from '../services/userService';

export default function AdminPanel() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: stats, loading: statsLoading } = useFetch(() => userService.getPlatformStats(), []);
  const { data: users, loading: usersLoading, refetch } = useFetch(
    () => userService.getAllUsers({ search: debouncedSearch, page, limit: 8 }),
    [debouncedSearch, page]
  );

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteTarget._id);
      toast.success('User deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform-wide overview and user management.</p>
      </div>

      {statsLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Users" value={stats.data.userCount} icon="👥" />
          <StatCard label="Skills" value={stats.data.skillCount} icon="🧠" accent="text-purple-600" />
          <StatCard label="Projects" value={stats.data.projectCount} icon="🚀" accent="text-emerald-600" />
          <StatCard label="Certifications" value={stats.data.certCount} icon="🎓" accent="text-amber-600" />
          <StatCard label="Goals" value={stats.data.goalCount} icon="🎯" accent="text-pink-600" />
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">All Users</h2>
          <input
            className="input max-w-xs"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {usersLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Role</th>
                    <th className="py-2 pr-4 font-medium">Joined</th>
                    <th className="py-2 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.data.map((u) => (
                    <tr key={u._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pr-4 font-medium">{u.name}</td>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${u.role === 'admin' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-right">
                        {u.role !== 'admin' && (
                          <button onClick={() => setDeleteTarget(u)} className="text-red-500 hover:underline text-xs font-medium">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={users.page} pages={users.pages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete user "${deleteTarget?.name}"? This will remove all their data permanently.`}
      />
    </DashboardLayout>
  );
}
