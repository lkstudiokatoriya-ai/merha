import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useVillage } from '../context/VillageContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginRouteActive, loginAdmin, closeLoginPrompt } = useVillage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoginRouteActive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(email, password);
    if (!ok) {
      setError('Invalid administrator email or password.');
    } else {
      setError('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-stone-200 dark:border-white/15 bg-[#FAF7F0] dark:bg-[#0D1E25] p-6 sm:p-8 shadow-2xl text-stone-900 dark:text-stone-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="admin-login-title" className="text-xl font-bold font-display">
                Merha Village Admin Login
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Authorized village administrator access only
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLoginPrompt}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close login modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeLoginPrompt}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs cursor-pointer"
            >
              Login to Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
