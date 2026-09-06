import React, { useState } from 'react';
import { X, Moon, Sun, Sparkles, Shield, Bell, Check, Zap, Cpu, Database } from 'lucide-react';
import { useTheme } from '../lib/theme';
import type { ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  userId?: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userId,
}) => {
  const { theme, setTheme, isBlack, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'agent' | 'privacy'>('appearance');

  // Agent settings state
  const [scanVelocity, setScanVelocity] = useState<'12' | '24' | '48'>('24');
  const [matchThreshold, setMatchThreshold] = useState<'90' | '95' | '98'>('95');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="settings-modal-backdrop"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
          isBlack
            ? 'bg-[#000000] border-[#1F2937] text-white'
            : isDark
            ? 'bg-[#0F172A] border-[#334155] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
        id="settings-modal-container"
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${
            isBlack
              ? 'border-[#1F2937] bg-[#0A0D14]'
              : isDark
              ? 'border-[#1E293B] bg-[#141E30]'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Mentra Preferences</h2>
              <p
                className={`text-xs ${
                  isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Configure theme appearance, autonomous dispatch, and data isolation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isBlack || isDark
                ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
            title="Close Settings"
            id="close-settings-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex border-b px-6 gap-6 text-sm font-medium ${
            isBlack
              ? 'border-[#1F2937] bg-black'
              : isDark
              ? 'border-[#1E293B] bg-[#0F172A]'
              : 'border-slate-200 bg-white'
          }`}
        >
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3.5 border-b-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-500'
                : isBlack || isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Theme & Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('agent')}
            className={`py-3.5 border-b-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'agent'
                ? 'border-indigo-600 text-indigo-500'
                : isBlack || isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Autonomous Agent</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3.5 border-b-2 font-semibold transition flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'border-indigo-600 text-indigo-500'
                : isBlack || isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Isolation</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-1">
                  Interface Theme
                </h3>
                <p
                  className={`text-xs mb-4 ${
                    isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Select your preferred aesthetic. Switch to Black Theme for true OLED pitch-black contrast.
                </p>

                {/* 3 Theme Options Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Mode */}
                  <div
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-left relative ${
                      theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20'
                        : isBlack || isDark
                        ? 'border-[#1F2937] hover:border-slate-600 bg-white/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                    id="select-theme-light"
                  >
                    {theme === 'light' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 flex items-center justify-center mb-3 shadow-sm">
                      <Sun className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="font-bold text-sm">Light Executive</div>
                    <div
                      className={`text-xs mt-1 ${
                        isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Crisp Slate &amp; clean high-contrast off-white
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-left relative ${
                      theme === 'dark'
                        ? 'border-indigo-600 bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                        : isBlack || isDark
                        ? 'border-[#1F2937] hover:border-slate-600 bg-white/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                    id="select-theme-dark"
                  >
                    {theme === 'dark' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-slate-700 text-white flex items-center justify-center mb-3 shadow-sm">
                      <Moon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="font-bold text-sm">Dark Slate</div>
                    <div
                      className={`text-xs mt-1 ${
                        isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Deep charcoal navy &amp; muted borders
                    </div>
                  </div>

                  {/* OLED Black Theme - Highlighted */}
                  <div
                    onClick={() => setTheme('black')}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-left relative ${
                      theme === 'black'
                        ? 'border-indigo-500 bg-[#050505] shadow-lg ring-2 ring-indigo-500/30'
                        : isBlack || isDark
                        ? 'border-[#1F2937] hover:border-slate-600 bg-white/5'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                    id="select-theme-black"
                  >
                    <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      Pure Black
                    </span>
                    {theme === 'black' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-[#000000] border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3 shadow-sm">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <span>Black Theme</span>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Pitch black #000000, high contrast neon accents
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual preview box */}
              <div
                className={`p-4 rounded-xl border ${
                  isBlack
                    ? 'bg-[#0A0D14] border-[#1F2937]'
                    : isDark
                    ? 'bg-[#151D2A] border-[#222F3E]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Current Active Palette:</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-bold uppercase text-[10px]">
                    {theme.toUpperCase()} MODE
                  </span>
                </div>
                <p
                  className={`text-xs mt-2 ${
                    isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {theme === 'black'
                    ? 'True OLED pitch-black background with subtle high-contrast border definition and vivid indigo action states.'
                    : theme === 'dark'
                    ? 'Refined dark mode balanced with cool slate tones to reduce eye strain in low-light environments.'
                    : 'Clean executive light theme pairing slate neutrals with structured typography and generous padding.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'agent' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-1">
                  Scanning Velocity
                </h3>
                <p
                  className={`text-xs mb-3 ${
                    isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Determines how aggressively Mentra evaluates active job listings against your profile.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: '12', label: '12 Scans/day', desc: 'Standard frequency' },
                    { val: '24', label: '24 Scans/day', desc: 'Recommended (Active)' },
                    { val: '48', label: '48 Scans/day', desc: 'High-velocity blitz' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setScanVelocity(item.val as any)}
                      className={`p-3 rounded-xl border text-left transition ${
                        scanVelocity === item.val
                          ? 'border-indigo-600 bg-indigo-600/10 font-bold'
                          : isBlack || isDark
                          ? 'border-[#1F2937] hover:border-slate-700 bg-white/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-1">
                  Auto-Apply Match Threshold
                </h3>
                <p
                  className={`text-xs mb-3 ${
                    isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Only dispatch autonomous handshake protocols when match score exceeds:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: '90', label: '> 90% Match', desc: 'Broad candidate pool' },
                    { val: '95', label: '> 95% Match', desc: 'Recommended strict' },
                    { val: '98', label: '> 98% Match', desc: 'Elite top 1% only' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setMatchThreshold(item.val as any)}
                      className={`p-3 rounded-xl border text-left transition ${
                        matchThreshold === item.val
                          ? 'border-indigo-600 bg-indigo-600/10 font-bold'
                          : isBlack || isDark
                          ? 'border-[#1F2937] hover:border-slate-700 bg-white/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-xs font-bold">Real-time Fast-Track Alerts</div>
                  <div
                    className={`text-[11px] ${
                      isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Notify immediately when VP/Leadership requests architecture sync.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={instantAlerts}
                  onChange={(e) => setInstantAlerts(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  isBlack
                    ? 'bg-[#0A0D14] border-[#1F2937]'
                    : isDark
                    ? 'bg-[#151D2A] border-[#222F3E]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 font-bold text-xs text-indigo-500 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Strict UID Database Isolation Active</span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isBlack || isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  All generated roadmaps, career benchmarks, and profile data are partitioned strictly by your Firebase Authentication user ID. No cross-tenant reads or unauthenticated requests are permitted.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700/30 flex flex-col gap-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authenticated UID:</span>
                    <span className="font-semibold truncate max-w-[240px]">
                      {userId || 'Unauthenticated'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Google Email:</span>
                    <span className="font-semibold">{userEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Firestore Rules:</span>
                    <span className="text-emerald-500 font-bold">ENFORCED (request.auth.uid)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gemini Strategy Engine:</span>
                    <span className="text-indigo-400 font-bold">Server-Side Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-end px-6 py-4 border-t gap-3 ${
            isBlack
              ? 'border-[#1F2937] bg-[#0A0D14]'
              : isDark
              ? 'border-[#1E293B] bg-[#141E30]'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
            id="save-settings-btn"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
