import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import {
  ShieldCheck,
  Lock,
  Zap,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  User as UserIcon,
} from 'lucide-react';

interface AuthCardholderProps {
  user: User | null;
  onSignIn: () => Promise<void> | void;
  onSignOut: () => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export const AuthCardholder: React.FC<AuthCardholderProps> = ({
  user,
  onSignIn,
  onSignOut,
  loading = false,
  error = null,
}) => {
  const [copiedUid, setCopiedUid] = useState(false);

  const handleCopyUid = () => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div
      id="authentication-cardholder"
      className="w-full max-w-xl mx-auto rounded-2xl bg-[#111827] border border-white/10 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-slate-100 transition-all relative overflow-hidden"
    >
      {/* Subtle Lunar Chrome Ambient Gradient Accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {user ? (
        /* ========================================================================= */
        /* AUTHENTICATED STATE: "Active Session" Badge                               */
        /* ========================================================================= */
        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-black tracking-wider uppercase text-slate-300">
                Active Session
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Authenticated via Firebase UID</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1e293b]/70 border border-white/5">
            <div className="flex items-center gap-3.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Profile'}
                  className="w-12 h-12 rounded-full border-2 border-emerald-500/40 object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-base font-extrabold text-white truncate">
                  {user.displayName || 'Authenticated Explorer'}
                </h4>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-500">
                  <span className="truncate max-w-[180px]">UID: {user.uid}</span>
                  <button
                    type="button"
                    onClick={handleCopyUid}
                    title="Copy full UID"
                    className="hover:text-slate-300 p-0.5 rounded transition cursor-pointer"
                  >
                    {copiedUid ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Minimal Sign Out Button */}
            <button
              type="button"
              onClick={onSignOut}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/15 border border-slate-700/70 hover:border-rose-500/40 text-xs font-bold text-slate-300 hover:text-rose-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Repository Status Note */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Database isolation verified. All roadmaps and chats are strictly scoped to your UID.</span>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* UNAUTHENTICATED STATE: Prominent Google Sign-In Cardholder               */
        /* ========================================================================= */
        <div className="relative z-10 space-y-6">
          {/* Architecture & Security Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300 shadow-sm">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>🔒 Enterprise Auth</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>⚡ Powered by Firebase</span>
            </div>
          </div>

          {/* Header & Subtext */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Secure Profile Isolation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
              Sign in with your Google account to access your personal AI career agent and isolated roadmap repository.
            </p>
          </div>

          {/* Error Notice if any */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Prominent Google Sign-In Button */}
          <div>
            <button
              type="button"
              onClick={onSignIn}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-white text-slate-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                  <span>Connecting to Google Auth...</span>
                </>
              ) : (
                <>
                  {/* Official Full-Color Google 'G' SVG Icon */}
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2.5">
              Strict passwordless federated authentication. Zero passwords stored.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
