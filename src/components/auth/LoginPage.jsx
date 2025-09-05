import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch, useAuth } from '../../store/hooks.js';
import { loginUser, clearError } from '../../store/slices/authSlice.js';
import bgImage from '../../assets/images/sky_mmt.jpg';
import logo from '../../assets/images/mmtlogo.svg';

/**
 * Modern login page with background image overlay and centered card.
 * For now, on submit just navigates to the dashboard route for testing.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already logged in (prevents accessing /login via back button)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setFieldErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const v = validate();
    setFieldErrors(v);
    if (Object.keys(v).length) return;
    // Clear previous slice error
    if (error) dispatch(clearError());

    try {
      const resultAction = await dispatch(
        loginUser({
          email: formData.email.trim(),
          password: formData.password,
        })
      );
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      // errors handled in slice
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Background */}
      <img
        src={bgImage}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="App Logo"
            className="h-16 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-white/40 p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4 tracking-tight">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/60 transition"
                placeholder="you@example.com"
              />
              <div className="min-h-[16px] mt-1">
                {fieldErrors.email && (
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200/60 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
              <div className="min-h-[16px] mt-1">
                {fieldErrors.password && (
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600 w-full">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && (
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </form>

          <div className="mt-4 text-[10px] text-center text-gray-400 leading-snug">
            Demo: admin@example.com / admin123 • user@example.com / user123
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] text-white/70 tracking-wide">
          © {new Date().getFullYear()} App. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
