import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        organization: '/organization-dashboard',
        university: '/university-dashboard',
        admin: '/admin-dashboard'
      };
      navigate(dashboardRoutes[user.role] || '/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(formData.email, formData.password);
    if (result.success) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        organization: '/organization-dashboard',
        university: '/university-dashboard',
        admin: '/admin-dashboard'
      };
      navigate(dashboardRoutes[result.user.role] || '/profile');
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-pink rounded-lg flex items-center justify-center">
            <span className="text-primary-white font-bold text-lg">IS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-primary-black">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-red hover:text-accent-dark-red"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-neutral-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-black">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-black">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div className={`text-sm ${message.includes('successful') ? 'text-primary-red' : 'text-accent-dark-red'}`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-white bg-gradient-to-r from-primary-red to-accent-pink hover:from-accent-dark-red hover:to-primary-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red disabled:opacity-50 transition-all duration-300"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-neutral-200 pt-6">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-4">Admin Login</p>
              <div className="bg-accent-soft-red p-4 rounded-lg">
                <p className="text-xs text-primary-black mb-2"><strong>Email:</strong> admin@islandscholars.com</p>
                <p className="text-xs text-primary-black"><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;