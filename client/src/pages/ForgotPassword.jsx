import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState(null); // demo-only: real app would email this

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message);
      if (res.resetToken) setDevToken(res.resetToken);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email to reset your password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      {devToken && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs">
          <p className="font-medium text-amber-800 dark:text-amber-300">Demo mode (no email service configured)</p>
          <p className="mt-1 text-amber-700 dark:text-amber-400 break-all">
            Reset link: <Link className="underline" to={`/reset-password/${devToken}`}>/reset-password/{devToken}</Link>
          </p>
        </div>
      )}

      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
        <Link to="/login" className="text-brand-600 font-medium hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
