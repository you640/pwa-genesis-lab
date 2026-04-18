import React, { useState, FormEvent, useEffect } from 'react';
import { User, AuthModalType } from '../types';

interface AuthModalProps {
  modalType: AuthModalType;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
            {label}
        </label>
        <div className="mt-1">
            <input
                id={id}
                required
                className="py-3 px-4 block w-full shadow-sm bg-slate-800 border border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500 text-white"
                {...props}
            />
        </div>
    </div>
);


export const AuthModal: React.FC<AuthModalProps> = ({ modalType, onClose, onLogin, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Reset form state when modal type changes
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
  }, [modalType]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate login by creating a mock user. In a real app, you'd verify credentials.
    onLogin({ name: email.split('@')[0] || 'Forge User', email });
  };
  
  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRegister({ name, email });
  };
  
  if (!modalType) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 w-full max-w-md m-4 transform transition-all duration-300 ease-out animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            {modalType === 'login' && (
                <div>
                    <h2 id="auth-modal-title" className="font-teko text-4xl text-lime-400">Welcome Back</h2>
                    <p className="text-slate-400 mt-1">Log in to continue your journey.</p>
                    <form onSubmit={handleLoginSubmit} className="mt-6 space-y-6">
                        <FormInput label="Email address" id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <FormInput label="Password" id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
                        <div className="flex items-center justify-between">
                             <div className="text-sm">
                                <button type="button" className="font-medium text-lime-500 hover:text-lime-400">
                                    Forgot your password?
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn-3d primary w-full text-base py-3">
                            Login
                        </button>
                    </form>
                </div>
            )}

            {modalType === 'register' && (
                <div>
                    <h2 id="auth-modal-title" className="font-teko text-4xl text-lime-400">Join The Forge</h2>
                    <p className="text-slate-400 mt-1">Create an account to start your legend.</p>
                    <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-6">
                        <FormInput label="Full Name" id="register-name" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                        <FormInput label="Email address" id="register-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <FormInput label="Password" id="register-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="submit" className="btn-3d primary w-full text-base py-3">
                            Create Account
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
      `}</style>
    </div>
  );
};