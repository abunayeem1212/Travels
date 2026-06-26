import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';
import { usePageTitle } from '../hooks/usePageTitle';

export default function RegisterPage() {
  usePageTitle('Register');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim())
      newErrors.fullName = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = 'Valid email is required';
    if (!form.phone.match(/^(\+880|880|0)?1[3-9]\d{8}$/))
      newErrors.phone = 'Valid BD phone number required';
    if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(res.data);
      toast.success(`Welcome, ${res.data.fullName}!`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    icon: Icon, name, label, type = 'text', placeholder
  }: any) => (
    <div>
      <label className="text-sm font-medium text-gray-700
        dark:text-gray-300 mb-1 block">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2
          text-gray-400" />
        <input
          type={name === 'password' || name === 'confirmPassword'
            ? (showPass ? 'text' : 'password') : type}
          value={form[name as keyof typeof form]}
          onChange={e => {
            setForm({ ...form, [name]: e.target.value });
            if (errors[name])
              setErrors({ ...errors, [name]: '' });
          }}
          placeholder={placeholder}
          className={`w-full pl-9 pr-10 py-3 border rounded-xl text-sm
            focus:outline-none focus:ring-2 transition
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            ${errors[name]
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
            }`}
        />
        {(name === 'password' || name === 'confirmPassword') && (
          <button type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700
      to-sky-500 flex items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
        w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex
            items-center justify-center text-white font-bold text-xl
            mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Join SkyJourneyBD today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={User} name="fullName" label="Full Name"
            placeholder="Mohammad Rahman" />
          <InputField
            icon={Mail} name="email" label="Email"
            type="email" placeholder="your@email.com" />
          <InputField
            icon={Phone} name="phone" label="Phone Number"
            placeholder="01XXXXXXXXX" />
          <InputField
            icon={Lock} name="password" label="Password"
            placeholder="Min 6 characters" />
          <InputField
            icon={Lock} name="confirmPassword" label="Confirm Password"
            placeholder="Repeat password" />

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold
              py-3 rounded-xl hover:bg-blue-700 transition
              disabled:opacity-60 mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500
          dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login"
            className="text-blue-600 dark:text-blue-400 font-medium
              hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}