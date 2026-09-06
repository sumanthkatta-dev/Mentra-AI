import React, { useState, useMemo } from 'react';
import type { User } from 'firebase/auth';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  ArrowRight,
  Sparkles,
  Bot,
  CheckCircle,
  Building2,
  MapPin,
  Flame,
  Check,
  Lock,
  LogIn,
  TrendingUp,
} from 'lucide-react';
import type { Opportunity } from '../types';
import { useTheme } from '../lib/theme';
import { AuthCardholder } from './AuthCardholder';

interface DiscoveryViewProps {
  user?: User | null;
  onSignIn?: () => Promise<void> | void;
  onSignOut?: () => Promise<void> | void;
  authLoading?: boolean;
  authError?: string | null;
  userName?: string;
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
  savedOpportunityIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  onGenerateRoadmapForRole: (targetRole: string) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  user = null,
  onSignIn = () => {},
  onSignOut = () => {},
  authLoading = false,
  authError = null,
  userName = 'Engineer',
  opportunities,
  onSelectOpportunity,
  savedOpportunityIds,
  onToggleSave,
  onOpenSettings,
  onGenerateRoadmapForRole,
}) => {
  const { isBlack, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'comp' | 'recent'>('match');
  const [autoApplyNotice, setAutoApplyNotice] = useState<string | null>(null);

  const filterChips = [
    { id: 'all', label: 'All Roles' },
    { id: 'remote', label: '🌐 Remote Only' },
    { id: 'tech-ai', label: '💡 Tech & AI' },
    { id: 'distributed', label: '🔀 Distributed Systems' },
    { id: 'staff-lead', label: '🏆 Staff / Lead Level' },
    { id: 'high-comp', label: '💵 $180k+ Total Comp' },
    { id: 'high-compat', label: '☑️ High Compatibility (>90%)' },
    { id: 'early-stage', label: '🚀 Early Stage / Pre-IPO' },
  ];

  // Filtering logic
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesQuery =
            opp.roleTitle.toLowerCase().includes(q) ||
            opp.companyName.toLowerCase().includes(q) ||
            opp.summary.toLowerCase().includes(q) ||
            opp.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesQuery) return false;
        }

        // Category filter
        if (activeFilter === 'remote') {
          return (
            opp.location.toLowerCase().includes('remote') ||
            opp.remoteType?.toLowerCase().includes('remote')
          );
        }
        if (activeFilter === 'tech-ai') {
          return (
            opp.tags.some((t) => ['CUDA', 'AI', 'TensorRT', 'eBPF', 'Rust'].includes(t)) ||
            opp.category === 'Tech & AI' ||
            opp.companyName.includes('AI')
          );
        }
        if (activeFilter === 'distributed') {
          return (
            opp.tags.some((t) =>
              ['Raft Consensus', 'Kubernetes', 'Distributed Storage', 'Kafka', 'gRPC'].includes(t)
            ) || opp.roleTitle.includes('Distributed')
          );
        }
        if (activeFilter === 'staff-lead') {
          return (
            opp.roleTitle.includes('Staff') ||
            opp.roleTitle.includes('Lead') ||
            opp.roleTitle.includes('Principal')
          );
        }
        if (activeFilter === 'high-comp') {
          return opp.compRange.includes('$2');
        }
        if (activeFilter === 'high-compat') {
          return opp.matchScore >= 90;
        }
        if (activeFilter === 'early-stage') {
          return (
            opp.companyBadge?.includes('SERIES') ||
            opp.companyBadge?.includes('PRE-IPO') ||
            opp.companyBadge?.includes('Series')
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.matchScore - a.matchScore;
        }
        if (sortBy === 'comp') {
          return b.compRange.localeCompare(a.compRange);
        }
        return (a.postedAgo || '').localeCompare(b.postedAgo || '');
      });
  }, [opportunities, searchQuery, activeFilter, sortBy]);

  const handleConfigureAutoApply = () => {
    setAutoApplyNotice(
      'Autonomous Pilot dispatched! Mentra will auto-screen candidate pools and initiate handshake protocols for roles exceeding 95% compatibility.'
    );
    setTimeout(() => setAutoApplyNotice(null), 5000);
  };

  // Pre-Login Guest Screen: Never show "Welcome back" or opportunity roles before logging in
  if (!user) {
    return (
      <div className="space-y-8 animate-in fade-in" id="guest-gateway-container">
        {/* Guest Hero Banner */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border transition-all ${
            isBlack
              ? 'bg-[#0A0D14] border-[#1F2937]'
              : isDark
              ? 'bg-[#151D2A] border-[#222F3E]'
              : 'bg-white border-slate-200'
          } shadow-sm relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Career Navigation</span>
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Architect Your Next Career Leap
              </h1>

              <p
                className={`text-sm sm:text-base mt-2 leading-relaxed ${
                  isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Sign in with your Google account to unlock your personalized opportunity feed, verified market salary benchmarks, and custom 4-week roadmap generation.
              </p>
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center lg:items-end justify-center min-w-[200px] text-center lg:text-right ${
                isBlack
                  ? 'bg-black border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A] border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Opportunity Pool
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-500 flex items-center gap-1">
                <Flame className="w-5 h-5 text-indigo-500" />
                <span>4,280+ Curated</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Visibility Authentication Cardholder with Google Sign-In */}
        <div className="w-full flex justify-center">
          <AuthCardholder
            user={user}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
            loading={authLoading}
            error={authError}
          />
        </div>

        {/* Locked Opportunity Teaser & Feature Highlights */}
        <div
          className={`rounded-2xl p-6 sm:p-8 border ${
            isBlack
              ? 'bg-[#0A0D14] border-[#1F2937]'
              : isDark
              ? 'bg-[#151D2A] border-[#222F3E]'
              : 'bg-white border-slate-200'
          } shadow-sm space-y-6`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2
                  className={`text-base sm:text-lg font-extrabold tracking-tight ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Curated Opportunities Locked
                </h2>
                <p className="text-xs text-slate-400">
                  5 high-affinity roles matched today across distributed systems and AI infrastructure. Sign in to unlock full role details and compensation breakdowns.
                </p>
              </div>
            </div>

            <button
              onClick={onSignIn}
              disabled={authLoading}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Unlock Roles</span>
            </button>
          </div>

          {/* Locked Role Previews with Blur Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-5 rounded-xl border relative overflow-hidden ${
                isBlack
                  ? 'bg-black/60 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/80 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Distributed Inference • Tier 1</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <Lock className="w-2.5 h-2.5" /> 98% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-300">Staff Distributed Systems Engineer</h4>
              <p className="text-xs text-slate-500 mt-1">High-concurrency model training &amp; multi-cluster fabrics</p>
              <div className="mt-3 text-xs font-extrabold text-slate-400 blur-[3px] select-none">
                $240,000 - $310,000 + 0.25% Equity
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border relative overflow-hidden ${
                isBlack
                  ? 'bg-black/60 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/80 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Cloud Acceleration • Pre-IPO</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <Lock className="w-2.5 h-2.5" /> 96% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-300">Principal AI Infrastructure Architect</h4>
              <p className="text-xs text-slate-500 mt-1">Global edge acceleration nodes &amp; tensor pipelining</p>
              <div className="mt-3 text-xs font-extrabold text-slate-400 blur-[3px] select-none">
                $230,000 - $290,000 + 0.15% Equity
              </div>
            </div>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div
              className={`p-4 rounded-xl border ${
                isBlack
                  ? 'bg-black/40 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/60 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3
                className={`text-xs font-bold ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Personalized AI Match
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Deep compatibility scoring analyzing your tech stack against verified market openings.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isBlack
                  ? 'bg-black/40 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/60 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <h3
                className={`text-xs font-bold ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Verified Total Comp
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Transparent $180,000 to $310,000+ salary benchmarks plus equity and bonus tiers.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isBlack
                  ? 'bg-black/40 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/60 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2.5">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <h3
                className={`text-xs font-bold ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Grounded Market Insights
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Real-time Google Search grounding on hiring growth rates, macro trends, and key skills.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isBlack
                  ? 'bg-black/40 border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A]/60 border-[#1E293B]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <h3
                className={`text-xs font-bold ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                4-Week Strategic Roadmaps
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Gemini AI-engineered weekly milestones to bridge skill gaps and land high-tier roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="discovery-home-container">
      {/* Auto Apply Notification Banner */}
      {autoApplyNotice && (
        <div className="p-4 rounded-xl bg-indigo-600 text-white flex items-center justify-between text-xs font-semibold shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span>{autoApplyNotice}</span>
          </div>
          <button
            onClick={() => setAutoApplyNotice(null)}
            className="text-white/80 hover:text-white px-2 py-0.5 rounded text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Welcome Banner matching Image 2 */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        } shadow-sm relative overflow-hidden`}
      >
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
              <span>Autonomous Engine Active</span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Welcome back, {userName}
            </h1>

            <p
              className={`text-sm sm:text-base mt-2 leading-relaxed ${
                isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Autonomous Career Agent is scanning{' '}
              <span className="font-semibold text-indigo-500">4,280 active opportunities</span>{' '}
              tailored to your engineering profile and compensation benchmarks.
            </p>
          </div>

          {/* Velocity Metric Card matching Image 2 */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center lg:items-end justify-center min-w-[200px] text-right ${
              isBlack
                ? 'bg-black border-[#1F2937]'
                : isDark
                ? 'bg-[#0F172A] border-[#1E293B]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Matching Velocity
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-500 flex items-center gap-1">
              <Flame className="w-5 h-5 text-indigo-500" />
              <span>+14% vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Controls matching Image 2 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937] focus-within:border-indigo-500'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] focus-within:border-indigo-500'
                : 'bg-white border-slate-200 focus-within:border-indigo-500 shadow-sm'
            }`}
          >
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search roles, companies, tech stacks, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-sm bg-transparent outline-none ${
                isBlack || isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
              id="discovery-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={onOpenSettings}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs transition cursor-pointer ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937] hover:bg-white/5 text-white'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] hover:bg-white/5 text-white'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm'
            }`}
            id="open-filters-btn"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>

        {/* Filter Chips matching Image 2 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  isActive
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm'
                    : isBlack
                    ? 'bg-[#0A0D14] text-slate-300 border-[#1F2937] hover:border-slate-700'
                    : isDark
                    ? 'bg-[#151D2A] text-slate-300 border-[#222F3E] hover:border-slate-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {chip.label}
                {isActive && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header: Mentra-Curated Opportunities matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <h2
            className={`text-xl font-extrabold tracking-tight ${
              isBlack || isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Mentra-Curated Opportunities
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {filteredOpportunities.length} Matched Today
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Sorted by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`font-semibold bg-transparent border-0 outline-none cursor-pointer ${
              isBlack || isDark ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          >
            <option value="match" className={isBlack || isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}>
              Best AI Match (Desc)
            </option>
            <option value="comp" className={isBlack || isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}>
              Highest Total Comp
            </option>
            <option value="recent" className={isBlack || isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}>
              Most Recent
            </option>
          </select>
        </div>
      </div>

      {/* Grid of Opportunity Cards matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => {
          const isSaved = savedOpportunityIds.includes(opp.id);
          return (
            <div
              key={opp.id}
              onClick={() => onSelectOpportunity(opp)}
              className={`rounded-2xl p-6 border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md ${
                isBlack
                  ? 'bg-[#0A0D14] border-[#1F2937] hover:border-indigo-500/50'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] hover:border-indigo-500/50'
                  : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
              }`}
              id={`opportunity-card-${opp.id}`}
            >
              <div>
                {/* Company info & Match header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 font-bold text-sm">
                      <Building2 className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <span className={isBlack || isDark ? 'text-white' : 'text-slate-900'}>
                          {opp.companyName}
                        </span>
                        {opp.verified && (
                          <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        )}
                        {opp.companyBadge && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {opp.companyBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{opp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Badge & Bookmark */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-sm">
                      <span>{opp.matchScore}%</span>
                      <span className="font-medium text-[10px] opacity-90">Match</span>
                    </div>
                    <button
                      onClick={(e) => onToggleSave(opp.id, e)}
                      className={`p-1.5 rounded-lg transition ${
                        isSaved
                          ? 'text-indigo-500 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Role Title */}
                <h3
                  className={`text-lg font-extrabold tracking-tight mb-2 group-hover:text-indigo-500 transition-colors ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {opp.roleTitle}
                </h3>

                {/* Summary */}
                <p
                  className={`text-xs leading-relaxed line-clamp-2 mb-4 ${
                    isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {opp.summary}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {opp.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                        isBlack
                          ? 'bg-black border border-[#1F2937] text-slate-300'
                          : isDark
                          ? 'bg-[#0F172A] border border-[#1E293B] text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Comp & Review Match Details link */}
              <div
                className={`pt-4 border-t flex items-center justify-between text-xs ${
                  isBlack
                    ? 'border-[#1F2937]'
                    : isDark
                    ? 'border-[#1E293B]'
                    : 'border-slate-100'
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Total Comp
                  </div>
                  <div
                    className={`font-extrabold text-sm sm:text-base ${
                      isBlack || isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {opp.compRange}{' '}
                    {opp.compExtra && (
                      <span className="text-xs font-normal text-slate-400">
                        {opp.compExtra}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-indigo-500 group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>Review Match Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Autonomous Pilot Dispatch Banner matching Image 2 */}
      <div
        className={`rounded-2xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        } shadow-sm`}
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3
              className={`font-extrabold text-base tracking-tight ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Autonomous Pilot Dispatch
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Mentra can pre-screen and automatically initiate handshake protocols for roles matching
              &gt;95% threshold.
            </p>
          </div>
        </div>

        <button
          onClick={handleConfigureAutoApply}
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          id="configure-auto-apply-btn"
        >
          Configure Auto-Apply
        </button>
      </div>
    </div>
  );
};
