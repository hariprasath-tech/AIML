import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(username, password);
    setSubmitting(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-5 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            Retail Intelligence Platform
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Project No: 60 | Code: 25CS062
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-700">Demo Credentials:</p>
          <p className="font-mono mt-0.5">Username: <span className="text-slate-900 font-semibold">admin</span> | Password: <span className="text-slate-900 font-semibold">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
