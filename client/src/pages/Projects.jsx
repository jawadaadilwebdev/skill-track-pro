import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { projectService } from '../services/projectService';

const statuses = ['Planned', 'In Progress', 'Completed'];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => projectService.getAll({ search: debouncedSearch, status, page, limit: 9 }),
    [debouncedSearch, status, page]
  );

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (project) => { setEditing(project); setModalOpen(true); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await projectService.update(editing._id, payload);
        toast.success('Project updated');
      } else {
        await projectService.create(payload);
        toast.success('Project added');
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
      await projectService.remove(deleteTarget._id);
      toast.success('Project deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Showcase what you've built.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Project</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input sm:max-w-xs"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className="input sm:max-w-xs" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects yet"
          message="Add a project to showcase your work."
          action={<button className="btn-primary" onClick={openCreate}>+ Add Project</button>}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((project) => (
              <ProjectCard key={project._id} project={project} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <ProjectForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
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
