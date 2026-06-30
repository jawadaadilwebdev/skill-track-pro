import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import SkillCard from '../components/skills/SkillCard';
import SkillForm from '../components/skills/SkillForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { skillService } from '../services/skillService';

const categories = ['Frontend', 'Backend', 'DevOps', 'Database', 'Mobile', 'Design', 'Soft Skill', 'Other'];

export default function Skills() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => skillService.getAll({ search: debouncedSearch, category, page, limit: 9 }),
    [debouncedSearch, category, page]
  );

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (skill) => { setEditing(skill); setModalOpen(true); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await skillService.update(editing._id, payload);
        toast.success('Skill updated');
      } else {
        await skillService.create(payload);
        toast.success('Skill added');
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
      await skillService.remove(deleteTarget._id);
      toast.success('Skill deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and grow your technical skill set.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Skill</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input sm:max-w-xs"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="input sm:max-w-xs" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon="🧠"
          title="No skills yet"
          message="Add your first skill to start tracking your progress."
          action={<button className="btn-primary" onClick={openCreate}>+ Add Skill</button>}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((skill) => (
              <SkillCard key={skill._id} skill={skill} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <SkillForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </DashboardLayout>
  );
}
