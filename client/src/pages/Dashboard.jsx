import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import CategoryChart from '../components/dashboard/CategoryChart';
import TopSkillsChart from '../components/dashboard/TopSkillsChart';
import useFetch from '../hooks/useFetch';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading } = useFetch(() => userService.getDashboard(), []);
  const stats = data?.data;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's a snapshot of your progress.</p>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Skills" value={stats.totalSkills} icon="🧠" />
            <StatCard label="Avg. Proficiency" value={`${stats.avgProficiency}%`} icon="📈" accent="text-emerald-600" />
            <StatCard label="Projects" value={stats.totalProjects} icon="🚀" accent="text-purple-600" />
            <StatCard label="Certifications" value={stats.totalCertifications} icon="🎓" accent="text-amber-600" />
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Skills by Category</h2>
              <CategoryChart data={stats.skillsByCategory} />
            </div>
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Top Skills</h2>
              <TopSkillsChart skills={stats.topSkills} />
            </div>
          </div>

          <div className="card p-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Learning Goals</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {stats.goalsCompleted} of {stats.totalGoals} completed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalGoals ? (stats.goalsCompleted / stats.totalGoals) * 100 : 0}%` }}
              />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
