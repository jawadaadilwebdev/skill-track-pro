import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import useFetch from '../hooks/useFetch';
import { goalService } from '../services/goalService';
import { skillService } from '../services/skillService';

const statuses = ['Not Started', 'In Progress', 'Completed'];

export default function Goals() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => goalService.getAll({ status, page, limit: 9 }),
    [status, page]
  );

  // Fetch user's skills so the goal form can optionally link a related skill.
  const { data: skillsData } = useFetch(() => skillService.getAll({ limit: 100 }), []);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (goal) => { setEditing(goal); setModalOpen(true); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await goalService.update(editing._id, payload);
        toast.success('Goal updated');
      } else {
        await goalService.create(payload);
        toast.success('Goal added');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await goalService.remove(deleteTarget._id);
      toast.success('Goal deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Learning Goals</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Set goals and track your follow-through.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Goal</button>
      </div>

      <select className="input sm:max-w-xs mb-6" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
        <option value="">All statuses</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {loading ? (
        <Spinner size="lg" />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          message="Set a learning goal to stay focused and accountable."
          action={<button className="btn-primary" onClick={openCreate}>+ Add Goal</button>}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Goal' : 'Add Goal'}>
        <GoalForm
          initial={editing}
          skills={skillsData?.data || []}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </DashboardLayout>
  );
}
