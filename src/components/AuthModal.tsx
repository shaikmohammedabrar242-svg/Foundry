import React, { useState } from 'react';
import { useStore } from '../services/store';
import { X, Sparkles, ArrowRight, Mail, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useStore();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleGoogleAuth = async () => {
    resetFormState();
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (error) {
      setErrorMessage(error);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      const { error, message } = await resetPassword(email.trim());
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
      } else {
        setSuccessMessage(message || 'Password reset link sent to your inbox.');
      }
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    if (mode === 'signup') {
      const name = fullName.trim() || email.split('@')[0];
      const uname = username.trim() || email.split('@')[0].toLowerCase();
      const { error, message } = await signUpWithEmail(email.trim(), password, name, uname);
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
      } else {
        setSuccessMessage(message || 'Account created successfully!');
        setTimeout(() => onClose(), 1200);
      }
    } else {
      // Login
      const { error } = await signInWithEmail(email.trim(), password);
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
      } else {
        onClose();
      }
    }
  };

  const handleQuickPersona = (persona: 'felix' | 'elena' | 'admin') => {
    if (persona === 'felix') {
      login({
        id: 'usr_felix_v',
        name: 'Felix Vance',
        email: 'felix@indielabs.io',
        handle: 'felixvance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'maker',
        bio: 'Indie hacker building minimalist tools for founders. 3x SaaS exits.',
        badges: ['Verified Maker', 'Serial Builder', 'Community Favourite'],
        followedMakers: ['mkr_elena_r', 'mkr_soren_k'],
        upvotedProductIds: ['prod_velo', 'prod_orbit'],
        waitlistedProductIds: ['prod_hyperbase'],
      });
    } else if (persona === 'elena') {
      login({
        id: 'usr_elena_r',
        name: 'Elena Rostova',
        email: 'elena@orbitci.dev',
        handle: 'erostova',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'maker',
        bio: 'DevOps engineer turned solo indie hacker. Distributed systems geek.',
        badges: ['Verified Maker', 'Serial Builder'],
        followedMakers: ['mkr_felix_v'],
        upvotedProductIds: ['prod_orbit'],
        waitlistedProductIds: [],
      });
    } else {
      login({
        id: 'usr_admin',
        name: 'Foundry Curator',
        email: 'curator@foundry.io',
        handle: 'foundryadmin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        bio: 'Lead curator at Foundry SaaS directory.',
        badges: ['Verified Maker'],
        followedMakers: [],
        upvotedProductIds: [],
        waitlistedProductIds: [],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close login dialog"
          className="absolute right-4 top-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Maker Account' : 'Reset Password'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {mode === 'login'
              ? 'Sign in to upvote launches, follow founders, and publish products.'
              : mode === 'signup'
              ? 'Join the independent maker collective and launch your software.'
              : 'Enter your email to receive password recovery instructions.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3 mb-4 text-xs rounded-xl bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 text-xs rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        {mode !== 'forgot' && (
          <>
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">or email</span>
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
            </div>
          </>
        )}

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name (e.g. Maya Lin)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Username / Handle (e.g. mayalin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs focus:outline-hidden"
                />
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              required
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs focus:outline-hidden"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <input
                type="password"
                required
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs focus:outline-hidden"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  resetFormState();
                  setMode('forgot');
                }}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In with Email'
                : mode === 'signup'
                ? 'Create Account'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-neutral-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetFormState();
                  setMode('signup');
                }}
                className="font-semibold text-neutral-900 dark:text-white underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetFormState();
                  setMode('login');
                }}
                className="font-semibold text-neutral-900 dark:text-white underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* 1-Click Demo Personas for test evaluation */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-850">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center mb-2">
            Instant 1-Click Evaluation Personas
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickPersona('felix')}
              className="px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-center truncate"
            >
              Felix (Maker)
            </button>
            <button
              onClick={() => handleQuickPersona('elena')}
              className="px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-center truncate"
            >
              Elena (DevOps)
            </button>
            <button
              onClick={() => handleQuickPersona('admin')}
              className="px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-center truncate"
            >
              Curator (Admin)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
