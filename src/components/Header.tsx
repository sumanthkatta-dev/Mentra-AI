import React, { useState } from 'react';
import {
  LogIn,
  LogOut,
  Bell,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Compass,
  Bookmark,
  TrendingUp,
  User as UserIcon,
  Check,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { NavTab, ThemeMode } from '../types';
import { MentraLogo } from './MentraLogo';
import { useTheme } from '../lib/theme';

interface HeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  loading: boolean;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignIn,
  onSignOut,
  loading,
  activeTab,
  onTabChange,
  savedCount = 0,
  onOpenSettings,
}) => {
  const { theme, setTheme, isBlack, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Autonomous handshake initiated',
      body: 'Nexus AI Labs received your verified 96% match profile.',
      time: '12m ago',
    },
    {
      id: '2',
      title: 'New Opportunity Detected',
      body: 'Cognitive Core Labs posted Staff Distributed Systems role.',
      time: '2h ago',
    },
    {
      id: '3',
      title: 'Roadmap Milestone Cleared',
      body: 'Raft consensus state-machine module completed.',
      time: 'Yesterday',
    },
  ];

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('black');
    else setTheme('light');
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-colors border-b ${
        isBlack
          ? 'bg-[#000000]/95 border-[#1F2937] text-white backdrop-blur-md'
          : isDark
          ? 'bg-[#0F172A]/95 border-[#1E293B] text-white backdrop-blur-md'
          : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}
      id="main-app-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo matching Image 1 */}
        <div className="flex items-center gap-6">
          <MentraLogo
            theme={theme}
            size="md"
            onClick={() => onTabChange('discovery')}
            className="cursor-pointer"
          />

          {/* Navigation Links matching Image 2 */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold">
            <button
              onClick={() => onTabChange('discovery')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'discovery' || activeTab === 'opportunity-detail'
                  ? 'bg-indigo-600/10 text-indigo-500 font-extrabold'
                  : isBlack || isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-discovery-btn"
            >
              Discovery
            </button>

            <button
              onClick={() => onTabChange('saved')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-indigo-600/10 text-indigo-500 font-extrabold'
                  : isBlack || isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-saved-btn"
            >
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('roadmaps')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'roadmaps'
                  ? 'bg-indigo-600/10 text-indigo-500 font-extrabold'
                  : isBlack || isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-roadmaps-btn"
            >
              My Roadmaps
            </button>

            <button
              onClick={() => onTabChange('insights')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'insights'
                  ? 'bg-indigo-600/10 text-indigo-500 font-extrabold'
                  : isBlack || isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-insights-btn"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Career Insights</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600/10 text-indigo-500 font-extrabold'
                  : isBlack || isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-profile-btn"
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Right Controls: Theme Quick-Toggle, Notifications, Settings & User Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Theme Switcher Button */}
          <button
            onClick={cycleTheme}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isBlack
                ? 'bg-black border-indigo-500/50 text-indigo-400 hover:border-indigo-400 shadow-sm'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={`Current: ${theme.toUpperCase()} mode. Click to cycle Light, Dark, or OLED Black.`}
            id="theme-quick-toggle-btn"
          >
            {theme === 'black' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-[11px] font-bold">Black Theme</span>
              </>
            ) : theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline text-[11px]">Light</span>
              </>
            )}
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937] text-slate-400 hover:text-white'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Settings (Black theme, Agent &amp; Privacy)"
            id="header-settings-btn"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications Bell with Dot matching Image 2 */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition relative cursor-pointer ${
                isBlack
                  ? 'bg-[#0A0D14] border-[#1F2937] text-slate-400 hover:text-white'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] text-slate-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Notifications"
              id="notifications-bell-btn"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-black" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl p-4 z-50 animate-in fade-in duration-150 ${
                  isBlack
                    ? 'bg-black border-[#1F2937] text-white'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B] text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
                id="notifications-dropdown-panel"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/20">
                  <span className="font-extrabold text-xs uppercase tracking-wider">
                    Autonomous Dispatch Feed
                  </span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Live</span>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        isBlack
                          ? 'bg-[#0A0D14] border-[#1F2937]'
                          : isDark
                          ? 'bg-[#151D2A] border-[#222F3E]'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge matching Image 2 */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl cursor-pointer transition ${
                  isBlack
                    ? 'hover:bg-white/5'
                    : isDark
                    ? 'hover:bg-white/5'
                    : 'hover:bg-slate-100'
                }`}
              >
                <div className="text-right hidden sm:block">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isBlack || isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {user.displayName || user.email?.split('@')[0] || 'Engineer'}
                  </p>
                  <p className="text-[10px] text-indigo-400 leading-tight font-medium">
                    Staff Architect
                  </p>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User avatar'}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-cover border border-indigo-500/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.email ? user.email.slice(0, 2).toUpperCase() : 'AM'}
                  </div>
                )}
              </div>

              <button
                onClick={onSignOut}
                disabled={loading}
                className="text-xs font-medium text-slate-400 hover:text-rose-500 transition cursor-pointer p-1.5 rounded-lg"
                title="Sign Out"
                id="sign-out-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
              id="header-sign-in-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div
        className={`md:hidden flex items-center justify-around border-t py-2 px-2 text-xs font-semibold ${
          isBlack
            ? 'border-[#1F2937] bg-black'
            : isDark
            ? 'border-[#1E293B] bg-[#0F172A]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <button
          onClick={() => onTabChange('discovery')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'discovery'
              ? 'text-indigo-500 font-bold bg-indigo-500/10'
              : 'text-slate-400'
          }`}
        >
          Discovery
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'saved' ? 'text-indigo-500 font-bold bg-indigo-500/10' : 'text-slate-400'
          }`}
        >
          Saved ({savedCount})
        </button>
        <button
          onClick={() => onTabChange('roadmaps')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'roadmaps'
              ? 'text-indigo-500 font-bold bg-indigo-500/10'
              : 'text-slate-400'
          }`}
        >
          Roadmaps
        </button>
        <button
          onClick={() => onTabChange('insights')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'insights'
              ? 'text-indigo-500 font-bold bg-indigo-500/10'
              : 'text-slate-400'
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'profile'
              ? 'text-indigo-500 font-bold bg-indigo-500/10'
              : 'text-slate-400'
          }`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
