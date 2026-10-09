import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean;
  onRegister: (fullName: string, email: string, pass: string, phone: string, role: UserRole) => boolean;
  onQuickDemoLogin: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onLogin,
  onRegister,
  onQuickDemoLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('ATTENDEE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const ok = onLogin(email, password);
      if (!ok) {
        setErrorMessage('Invalid credentials. Check email or password.');
      } else {
        onClose();
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage('Full name is required.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      const ok = onRegister(fullName, email, password, phone, role);
      if (!ok) {
        setErrorMessage('An account with this email already exists.');
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-xs">
            F
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back to Festora' : 'Create Your Festora Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Enter your credentials or choose a quick demo account.'
              : 'Join attendees and organizers across world-class events.'}
          </p>
        </div>

        {/* Quick Demo Logins for Fast Testing */}
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onQuickDemoLogin('admin@festora.com');
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold border border-purple-200 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Persona</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onQuickDemoLogin('sarah.chen@example.com');
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold border border-indigo-200 transition-colors flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Attendee Persona</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1-555-0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('ATTENDEE')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      role === 'ATTENDEE'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Attendee
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ORGANIZER')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      role === 'ORGANIZER'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Organizer
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <div>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign Up Free
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
