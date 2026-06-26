import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';

export default function LoginPage() {
  const { user, login, isAdminOrAgent } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Already logged in হলে dashboard এ পাঠাও
  if (user && isAdminOrAgent()) return <Navigate to="/admin/dashboard" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      login(res.data);
      toast.success(`Welcome back, ${res.data.fullName}!`);
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-sky-500
      flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center
            justify-center text-white font-bold text-2xl mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold text-gray-800">The Friendship Tours & Travels</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@skyjourneybd.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3
              rounded-lg hover:bg-blue-700 transition disabled:opacity-60 mt-2">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}