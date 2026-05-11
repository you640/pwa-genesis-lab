import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setInfo('Password updated. Redirecting…');
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8">
        <h1 className="font-teko text-4xl text-lime-400 uppercase text-center mb-2">Reset Password</h1>
        <p className="text-slate-400 text-center text-sm mb-6">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
          <input type="password" placeholder="Confirm new password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {info && <div className="text-green-400 text-sm">{info}</div>}
          <button type="submit" disabled={loading} className="w-full bg-lime-500 text-slate-900 font-bold py-3 rounded-md hover:bg-lime-400 transition-colors disabled:opacity-50">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
