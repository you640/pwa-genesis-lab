import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
            data: { display_name: displayName || email.split('@')[0] },
          },
        });
        if (err) throw err;
        setInfo('Check your email to confirm your account.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: `${window.location.origin}${redirect}`,
    });
    if (result.error) setError(result.error.message);
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Enter your email first.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setInfo('Password reset email sent.');
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8">
        <h1 className="font-teko text-4xl text-lime-400 uppercase text-center mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Join the Forge'}
        </h1>
        <p className="text-slate-400 text-center text-sm mb-6">
          {mode === 'login' ? 'Sign in to your account' : 'Create an account to get started'}
        </p>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold py-3 rounded-md hover:bg-slate-100 transition-colors mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-500 uppercase">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
          />

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {info && <div className="text-green-400 text-sm">{info}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 text-slate-900 font-bold py-3 rounded-md hover:bg-lime-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-lime-400 hover:underline"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
          {mode === 'login' && (
            <button type="button" onClick={handleForgot} className="text-slate-400 hover:text-lime-400">
              Forgot password?
            </button>
          )}
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          <Link to="/" className="hover:text-lime-400">← Back to home</Link>
        </div>
      </div>
    </main>
  );
}
