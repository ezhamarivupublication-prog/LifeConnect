import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      // In a real app, you would use a secure token/cookie.
      onLogin('admin-authenticated');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-md bg-slate-800/60 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
        <p className="text-slate-400 mb-8">Enter your password to view records</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
