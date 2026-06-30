import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export default function Profile() {
  const { user, updateLocalUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await userService.updateProfile(fd);
      updateLocalUser(res.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your public-facing details.</p>
      </div>

      <div className="card p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center overflow-hidden text-brand-700 dark:text-brand-300 text-xl font-semibold">
              {preview ? <img src={preview} alt="Avatar" className="h-full w-full object-cover" /> : name?.[0]?.toUpperCase()}
            </div>
            <div>
              <label className="btn-secondary cursor-pointer">
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input bg-slate-50 dark:bg-slate-800" value={user?.email} disabled />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea className="input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={300} />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
