import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { AuthCardholder } from './AuthCardholder';
import type { User } from 'firebase/auth';

interface AuthLandingProps {
  user?: User | null;
  onSignIn: () => void;
  onSignOut?: () => void;
  loading: boolean;
  error?: string | null;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({
  user = null,
  onSignIn,
  onSignOut = () => {},
  loading,
  error,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Autonomous Career Strategist</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
        Navigate your technical career with <span className="text-indigo-600 dark:text-indigo-400">rigorous precision</span>
      </h1>

      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
        Mentra analyzes your skills against your target role, diagnoses critical technical gaps,
        and constructs an actionable 4-week execution roadmap powered by Gemini and secured with Firestore.
      </p>

      {/* Dedicated High-Visibility Authentication Cardholder */}
      <div className="mb-12 flex justify-center">
        <AuthCardholder
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          loading={loading}
          error={error}
        />
      </div>

      {/* Feature Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-4">
            01
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Rigorous Match Score</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Evaluates your skills against modern industry standards and returns a 0-100% technical benchmark rating.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-4">
            02
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Critical Technical Gaps</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Diagnoses architectural, infrastructure, and toolchain vulnerabilities blocking your target role.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-4">
            03
          </div>
          <h3 className="font-bold text-slate-900 mb-2">4-Week Execution Plan</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Actionable modular curriculum with tangible milestone projects and daily study checklists.
          </p>
        </div>
      </div>
    </div>
  );
};
