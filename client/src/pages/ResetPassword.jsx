import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      // Reuse login persistence so the user lands authenticated.
      localStorage.setItem('st_token', data.token);
      localStorage.setItem('st_user', JSON.stringify(data.user));
      toast.success('Password reset! You are now logged in.');
      navigate('/dashboard');
      window.location.reload(); // ensure AuthContext picks up the new session cleanly
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed — link may have expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Choose a new password below">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">New password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>
        <div>
          <label className="label">Confirm new password</label>
          <input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
        <Link to="/login" className="text-brand-600 font-medium hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
