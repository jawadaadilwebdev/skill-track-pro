import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import CertificationCard from '../components/certifications/CertificationCard';
import CertificationForm from '../components/certifications/CertificationForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { certificationService } from '../services/certificationService';

export default function Certifications() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => certificationService.getAll({ search: debouncedSearch, page, limit: 9 }),
    [debouncedSearch, page]
  );

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (cert) => { setEditing(cert); setModalOpen(true); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await certificationService.update(editing._id, payload);
        toast.success('Certification updated');
      } else {
        await certificationService.create(payload);
        toast.success('Certification added');
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
      await certificationService.remove(deleteTarget._id);
      toast.success('Certification deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep your credentials in one place.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Add Certification</button>
      </div>

      <input
        className="input sm:max-w-xs mb-6"
        placeholder="Search certifications..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {loading ? (
        <Spinner size="lg" />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="No certifications yet"
          message="Add a certification to build your credibility."
          action={<button className="btn-primary" onClick={openCreate}>+ Add Certification</button>}
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((cert) => (
              <CertificationCard key={cert._id} cert={cert} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certification' : 'Add Certification'}>
        <CertificationForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
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
