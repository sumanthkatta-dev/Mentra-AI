import React, { useState } from 'react';
import {
  Settings,
  Edit3,
  MapPin,
  Briefcase,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Bot,
  Radar,
  Calendar,
  Check,
  Plus,
  Play,
  FileCheck,
} from 'lucide-react';
import type { UserProfileData } from '../types';
import { PROFILE_ROADMAPS, type MockRoadmapItem } from '../data/profile';
import { useTheme } from '../lib/theme';
import type { User } from 'firebase/auth';

interface ProfileViewProps {
  user: User | null;
  profileData: UserProfileData;
  onOpenSettings: () => void;
  onGenerateNewRoadmap: () => void;
  onSelectRoadmapItem?: (item: MockRoadmapItem) => void;
  firestoreRoadmapsCount?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  profileData,
  onOpenSettings,
  onGenerateNewRoadmap,
  onSelectRoadmapItem,
  firestoreRoadmapsCount = 0,
}) => {
  const { isBlack, isDark } = useTheme();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profileData.bio);

  const displayName = user?.displayName || profileData.displayName;
  const avatarUrl = user?.photoURL || profileData.avatarUrl;

  return (
    <div className="space-y-8" id="profile-view-container">
      {/* User Header Profile Card matching Image 4 */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        } shadow-sm relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar with live status indicator */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-black text-2xl flex items-center justify-center border-2 border-indigo-500/40 shadow-md">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-black flex items-center justify-center text-white text-[10px] font-bold shadow">
                ✓
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {profileData.verifiedTrack || 'Verified Principal Track'}
                </span>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-indigo-400">
                {profileData.title} &bull; {profileData.yoe} YOE
              </div>

              {/* Bio */}
              {isEditingBio ? (
                <div className="space-y-2 max-w-2xl pt-1">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    rows={3}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      isBlack
                        ? 'bg-black border-[#1F2937] text-white'
                        : isDark
                        ? 'bg-[#0F172A] border-[#222F3E] text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className={`text-xs leading-relaxed max-w-2xl ${
                    isBlack || isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {bioText}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.location}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profileData.searchMode}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons matching Image 4 */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isBlack
                  ? 'bg-black border-[#1F2937] hover:border-slate-700 text-slate-300 hover:text-white'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] hover:border-slate-600 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              id="edit-profile-btn"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={onOpenSettings}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isBlack
                  ? 'bg-black border-[#1F2937] hover:border-slate-700 text-slate-300 hover:text-white'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] hover:border-slate-600 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Settings & Black Theme"
              id="open-profile-settings-btn"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards matching Image 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Applications */}
        <div
          className={`rounded-2xl p-6 border transition-all ${
            isBlack
              ? 'bg-[#0A0D14] border-[#1F2937]'
              : isDark
              ? 'bg-[#151D2A] border-[#222F3E]'
              : 'bg-white border-slate-200'
          } shadow-sm`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Applications Submitted
          </div>
          <div
            className={`text-3xl font-black ${isBlack || isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {profileData.stats.applicationsSubmitted}
          </div>
          <div className="text-xs text-indigo-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>&uarr; +3 this week &bull; 4 autonomous agent dispatched</span>
          </div>
        </div>

        {/* Stat 2: Roadmaps */}
        <div
          className={`rounded-2xl p-6 border transition-all ${
            isBlack
              ? 'bg-[#0A0D14] border-[#1F2937]'
              : isDark
              ? 'bg-[#151D2A] border-[#222F3E]'
              : 'bg-white border-slate-200'
          } shadow-sm`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Roadmaps Generated
          </div>
          <div
            className={`text-3xl font-black ${isBlack || isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {profileData.stats.roadmapsGenerated + firestoreRoadmapsCount}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            &bull; 2 active &bull; 4 completed in Cloud Firestore
          </div>
        </div>

        {/* Stat 3: Interviews */}
        <div
          className={`rounded-2xl p-6 border transition-all ${
            isBlack
              ? 'bg-[#0A0D14] border-[#1F2937]'
              : isDark
              ? 'bg-[#151D2A] border-[#222F3E]'
              : 'bg-white border-slate-200'
          } shadow-sm`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Interviews Pending
          </div>
          <div
            className={`text-3xl font-black ${isBlack || isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {profileData.stats.interviewsPending}
          </div>
          <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1 truncate">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{profileData.stats.nextInterviewNotice}</span>
          </div>
        </div>
      </div>

      {/* Two Column Content Layout matching Image 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Active Skill Roadmaps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2
                className={`text-xl font-black tracking-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Active Skill Roadmaps
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated high-velocity pathways tailored to interview rounds &amp; Staff level benchmarks
              </p>
            </div>

            <button
              onClick={onGenerateNewRoadmap}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              id="generate-new-roadmap-from-profile"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Roadmap</span>
            </button>
          </div>

          {/* List of Roadmaps matching Image 4 */}
          <div className="space-y-4">
            {PROFILE_ROADMAPS.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectRoadmapItem && onSelectRoadmapItem(item)}
                className={`rounded-2xl p-6 border transition-all cursor-pointer hover:shadow-md ${
                  isBlack
                    ? 'bg-[#0A0D14] border-[#1F2937] hover:border-indigo-500/50'
                    : isDark
                    ? 'bg-[#151D2A] border-[#222F3E] hover:border-indigo-500/50'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-1 block">
                      {item.category}
                    </span>
                    <h3
                      className={`text-base font-extrabold tracking-tight ${
                        isBlack || isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Progress Gauge */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-black text-indigo-500">
                      {item.progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800/20 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      item.progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-300">{item.currentWeek}</span>
                    <span>&bull;</span>
                    <span>{item.statusText}</span>
                  </div>

                  {item.isVerified ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <FileCheck className="w-4 h-4" />
                      <span>Skill Verified by Mentra</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-indigo-400 font-bold hover:underline">
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Next module notice */}
                {!item.isVerified && (
                  <div
                    className={`mt-3 pt-3 border-t text-[11px] font-mono flex items-center gap-1.5 ${
                      isBlack
                        ? 'border-[#1F2937] text-slate-400'
                        : isDark
                        ? 'border-[#1E293B] text-slate-400'
                        : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    <Play className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">Next Module: {item.nextModule}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Mentra Agent Status matching Image 4 */}
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937]'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E]'
                : 'bg-white border-slate-200'
            } shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-extrabold uppercase tracking-wider ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Mentra Agent Status
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Scanning</span>
              </span>
            </div>

            {/* Radar status card */}
            <div
              className={`p-4 rounded-xl border mb-5 ${
                isBlack
                  ? 'bg-black border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A] border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                  <Radar className="w-5 h-5 text-indigo-500 animate-spin" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-indigo-500">
                    {profileData.agentStatus.scanningRate}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {profileData.agentStatus.statusText}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Parameters */}
            <div className="mb-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Filter Parameters
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profileData.agentStatus.activeFilters.map((f, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                      isBlack
                        ? 'bg-black border border-[#1F2937] text-slate-300'
                        : isDark
                        ? 'bg-[#0F172A] border border-[#1E293B] text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Autonomous Actions */}
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Autonomous Actions
              </div>
              <div className="space-y-2.5">
                {profileData.agentStatus.recentActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div
                        className={`font-semibold ${
                          isBlack || isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {action.action}
                      </div>
                      <div className="text-[10px] text-slate-500">{action.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className={`w-full py-2.5 rounded-xl border font-bold text-xs transition cursor-pointer ${
                isBlack
                  ? 'bg-black border-[#1F2937] hover:border-slate-700 text-white'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] hover:border-slate-600 text-white'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
              id="adjust-agent-directives-btn"
            >
              Adjust Agent Directives
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
