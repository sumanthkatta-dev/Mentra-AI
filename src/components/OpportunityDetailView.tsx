import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Copy,
  Check,
  CheckCircle,
  Building2,
  MapPin,
  Clock,
  Users,
  Zap,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  Layers,
  Activity,
  FileText,
  TrendingUp,
  Globe,
} from 'lucide-react';
import type { Opportunity } from '../types';
import { useTheme } from '../lib/theme';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onGenerateRoadmap: (targetRole: string, initialSkills?: string) => void;
  onOpenInsights?: (targetRole: string) => void;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  onBack,
  isSaved,
  onToggleSave,
  onGenerateRoadmap,
  onOpenInsights,
}) => {
  const { isBlack, isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadRoadmap = () => {
    const roleTitle = opportunity.roleTitle;
    const skillsToAudit =
      opportunity.tags.join(', ') +
      (opportunity.skillGapsAudit
        ? `, Gap Focus: ${opportunity.skillGapsAudit.gapTitle}`
        : '');
    onGenerateRoadmap(roleTitle, skillsToAudit);
  };

  const handleConfirmApply = () => {
    setApplied(true);
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-8 pb-24" id="opportunity-detail-container">
      {/* Top Action / Back Nav matching Image 3 */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            isBlack
              ? 'text-slate-300 hover:text-white hover:bg-white/5'
              : isDark
              ? 'text-slate-300 hover:text-white hover:bg-white/5'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          id="back-to-opportunities-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937] text-slate-300 hover:text-white'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            onClick={onToggleSave}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                : isBlack
                ? 'bg-[#0A0D14] border-[#1F2937] text-slate-300 hover:text-white'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E] text-slate-300 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved to Wishlist' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Opportunity Header Card matching Image 3 */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        } shadow-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 font-black text-xl flex-shrink-0 shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`font-bold text-base ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {opportunity.companyName}
                </span>
                {opportunity.verified && (
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                )}
                {opportunity.companyBadge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {opportunity.companyBadge}
                  </span>
                )}
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {opportunity.roleTitle}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{opportunity.postedAgo || 'Posted recently'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{opportunity.applicantsCount || 12} Applicants</span>
                </div>
                {opportunity.hasFastTrack && (
                  <div className="inline-flex items-center gap-1 font-bold text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Mentra Direct Fast-Track</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Match Score Radial Indicator */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-indigo-600/10 border border-indigo-500/20 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Compatibility Rating
              </div>
              <div className="text-xl font-black text-indigo-500">
                {opportunity.matchScore}% Match
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
              AI
            </div>
          </div>
        </div>

        {/* Quick Attribute Badges Row */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-700/20">
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Full-Time
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {opportunity.compRange} {opportunity.compExtra}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
            {opportunity.remoteType || 'Remote (US)'}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {opportunity.level || 'Staff Level (IC6)'}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            AI &amp; Cloud Infra
          </span>
        </div>
      </div>

      {/* Two Column Layout matching Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gemini-Curated Skill Gaps & Prep Recommendation Card */}
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
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3
                  className={`text-base font-extrabold tracking-tight ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Gemini-Curated Skill Gaps &amp; Prep Recommendation
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Profile Audit
              </span>
            </div>

            <p
              className={`text-xs leading-relaxed mb-4 ${
                isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              We cross-referenced your verified repository commits, system design patents, and
              architecture roles against {opportunity.companyName}&apos;s distributed runtime topology.
            </p>

            {/* Gap Callout Box */}
            <div
              className={`p-4 rounded-xl border mb-5 ${
                isBlack
                  ? 'bg-black border-amber-500/30'
                  : isDark
                  ? 'bg-[#0F172A] border-amber-500/30'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  !
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-500">
                    {opportunity.skillGapsAudit?.gapTitle || 'eBPF Tracing & Kernel Diagnostics'}
                  </div>
                  <div
                    className={`text-xs mt-1 leading-relaxed ${
                      isBlack || isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {opportunity.skillGapsAudit?.gapDescription ||
                      'You have 1 year of verified telemetry production experience vs. desired 3 years for low-level ring-buffer optimizations.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Roadmap CTA Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isBlack
                  ? 'bg-indigo-950/30 border-indigo-500/40'
                  : isDark
                  ? 'bg-indigo-950/40 border-indigo-500/40'
                  : 'bg-indigo-50 border-indigo-200'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Recommended Roadmap
                </div>
                <div
                  className={`text-sm font-extrabold ${
                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  &ldquo;{opportunity.skillGapsAudit?.recommendedRoadmapTitle ||
                    '4-Week eBPF & Observability Deep Dive'}&rdquo;
                </div>
              </div>

              <button
                onClick={handleLoadRoadmap}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                id="load-into-my-roadmaps-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load into My Roadmaps</span>
              </button>
            </div>
          </div>

          {/* Role Overview & Impact Metrics matching Image 3 */}
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937]'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E]'
                : 'bg-white border-slate-200'
            } shadow-sm`}
          >
            <h3
              className={`text-base font-extrabold tracking-tight mb-3 ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Role Overview &amp; Impact
            </h3>

            <p
              className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                isBlack || isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {opportunity.summary}
            </p>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-xl border text-center ${
                  isBlack
                    ? 'bg-black border-[#1F2937]'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xl font-black text-indigo-500">
                  {opportunity.metrics?.qps || '1.2M QPS'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Peak cluster throughput across internal consensus nodes
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border text-center ${
                  isBlack
                    ? 'bg-black border-[#1F2937]'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xl font-black text-indigo-500">
                  {opportunity.metrics?.latency || '< 4.8ms'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  P99 geo-replicated consensus round-trip latency
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border text-center ${
                  isBlack
                    ? 'bg-black border-[#1F2937]'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xl font-black text-indigo-500">
                  {opportunity.metrics?.uptime || 'Zero Downtime'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Continuous zero-disruption rolling protocol updates
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills & Experience Checklist matching Image 3 */}
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937]'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E]'
                : 'bg-white border-slate-200'
            } shadow-sm`}
          >
            <h3
              className={`text-base font-extrabold tracking-tight mb-4 ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Required Skills &amp; Experience
            </h3>

            <div className="space-y-3">
              {(
                opportunity.requiredSkills || [
                  'Go & Rust Production Mastery — Deep expertise writing concurrent, zero-allocation network engines with lock-free data structures.',
                  'Distributed Consensus (Raft / Paxos / Chubby) — Hands-on experience modifying or implementing state-machine replication protocols for active-active multi-region systems.',
                  'Kubernetes Operator Frameworks & Service Mesh — Designing bespoke CRDs, control loops, and low-overhead sidecar telemetry with Envoy.',
                  'High-Throughput gRPC & FlatBuffers Streaming — Serialization tuning, custom multiplexers, and hardware-accelerated TCP/RDMA pipelines.',
                  'Large-Scale Resilience & Chaos Engineering — Demonstrated track record maintaining high availability through automated partition injection and split-brain recovery.',
                ]
              ).map((skill, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs leading-relaxed ${
                      isBlack || isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accelerated Mentra Loop matching Image 3 */}
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937]'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E]'
                : 'bg-white border-slate-200'
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h3
                className={`text-base font-extrabold tracking-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Accelerated Mentra Loop
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                opportunity.acceleratedLoopSteps || [
                  {
                    step: 'STEP 1',
                    title: '45-min VP Systems Architecture Deep Dive',
                    subtitle: 'Technical alignment & consensus philosophy',
                  },
                  {
                    step: 'STEP 2',
                    title: 'Live Consensus Pair Debugging (90 min)',
                    subtitle: 'Real telemetry data & network partition scenarios',
                  },
                  {
                    step: 'STEP 3',
                    title: 'Founders & Strategic Roadmap Sync',
                    subtitle: 'Executive offer call & equity breakdown',
                  },
                ]
              ).map((loopStep, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border relative ${
                    isBlack
                      ? 'bg-black border-[#1F2937]'
                      : isDark
                      ? 'bg-[#0F172A] border-[#1E293B]'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1">
                    {loopStep.step}
                  </div>
                  <div
                    className={`text-xs font-bold leading-snug mb-1 ${
                      isBlack || isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {loopStep.title}
                  </div>
                  <div className="text-[11px] text-slate-400">{loopStep.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col) matching Image 3 */}
        <div className="space-y-6">
          {/* Autonomous Match Engine Card */}
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
                className={`text-sm font-extrabold tracking-tight uppercase tracking-wider ${
                  isBlack || isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Autonomous Match Engine
              </h3>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600"
                    strokeDasharray={`${opportunity.matchScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-indigo-500">
                    {opportunity.matchScore}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Match</span>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-500 mt-3">Exceptional Fit</div>
              <p
                className={`text-[11px] mt-1 text-center max-w-[240px] ${
                  isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {opportunity.companyName} prioritizes engineers with strong distributed consensus
                track records. You surpass 97% of active platform candidates.
              </p>
            </div>

            {/* Breakdown Progress Bars */}
            <div className="space-y-3 pt-3 border-t border-slate-700/20">
              {[
                { label: 'Core Skills Match', val: opportunity.matchBreakdown?.coreSkills || 98 },
                {
                  label: 'Experience Level (IC6 Staff)',
                  val: opportunity.matchBreakdown?.experienceLevel || 95,
                },
                { label: 'Tech Stack Alignment', val: opportunity.matchBreakdown?.techStack || 94 },
                {
                  label: 'Compensation Expectation',
                  val: opportunity.matchBreakdown?.compensation || 100,
                },
              ].map((item, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={isBlack || isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {item.label}
                    </span>
                    <span className="font-bold text-indigo-500">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Agent Insight Box */}
            <div
              className={`p-3 rounded-xl border mt-5 text-xs ${
                isBlack
                  ? 'bg-black border-[#1F2937] text-slate-300'
                  : isDark
                  ? 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-bold text-indigo-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Agent Insight</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {opportunity.matchBreakdown?.agentInsight ||
                  'Your background in Go, Raft, and high-throughput streaming systems puts you in the top 3% of applicants for this role.'}
              </p>
            </div>
          </div>

          {/* Direct Engineering Leadership Card matching Image 3 */}
          {opportunity.leadership && (
            <div
              className={`rounded-2xl p-6 border transition-all ${
                isBlack
                  ? 'bg-[#0A0D14] border-[#1F2937]'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E]'
                  : 'bg-white border-slate-200'
              } shadow-sm`}
            >
              <h3
                className={`text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 ${
                  isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Direct Engineering Leadership
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    opportunity.leadership.avatarUrl ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={opportunity.leadership.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-600/30"
                />
                <div>
                  <div
                    className={`font-bold text-sm ${
                      isBlack || isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {opportunity.leadership.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {opportunity.leadership.title}
                  </div>
                </div>
              </div>

              <blockquote
                className={`text-xs italic border-l-2 border-indigo-500 pl-3 leading-relaxed ${
                  isBlack || isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                &ldquo;{opportunity.leadership.quote}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Real-Time Career & Market Insights Trigger */}
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isBlack
                ? 'bg-[#0A0D14] border-[#1F2937]'
                : isDark
                ? 'bg-[#151D2A] border-[#222F3E]'
                : 'bg-white border-slate-200'
            } shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <TrendingUp className="w-4 h-4" />
                <span>Market Intelligence</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Google Search
              </span>
            </div>
            <h4
              className={`text-sm font-extrabold mb-1 ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Real-Time Salary &amp; Demand Data
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Explore verified compensation benchmarks, hiring growth, and tech trends for {opportunity.roleTitle}.
            </p>
            <button
              onClick={() => onOpenInsights?.(opportunity.roleTitle)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 font-bold text-xs border border-indigo-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Market Trends for this Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar matching Image 3 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t py-4 px-4 sm:px-8 shadow-2xl transition-all ${
          isBlack
            ? 'bg-[#000000]/95 border-[#1F2937] backdrop-blur-md'
            : isDark
            ? 'bg-[#0F172A]/95 border-[#1E293B] backdrop-blur-md'
            : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
              {opportunity.matchScore}%
            </div>
            <div>
              <div
                className={`font-bold text-sm leading-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {opportunity.roleTitle} &bull; {opportunity.companyName}
              </div>
              <div className="text-xs text-slate-400">
                Top 3% Candidate &bull; {opportunity.compRange}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleLoadRoadmap}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                isBlack
                  ? 'bg-black border-[#1F2937] hover:border-slate-700 text-white'
                  : isDark
                  ? 'bg-[#151D2A] border-[#222F3E] hover:border-slate-600 text-white'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Generate 4-Week Prep Roadmap</span>
            </button>

            <button
              onClick={() => setShowApplyModal(true)}
              disabled={applied}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                applied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
              id="apply-now-mentra-btn"
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Application Dispatched</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply Now with Mentra Agent</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Autonomous Application Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl ${
              isBlack
                ? 'bg-black border-[#1F2937] text-white'
                : isDark
                ? 'bg-[#0F172A] border-[#334155] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center mb-4">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight mb-1">
              Dispatch Autonomous Handshake
            </h3>
            <p
              className={`text-xs mb-4 ${
                isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Mentra Agent will transmit your verified compatibility dossier ({opportunity.matchScore}%)
              directly to {opportunity.companyName}&apos;s engineering hiring loop.
            </p>

            <div
              className={`p-3 rounded-xl border text-xs mb-5 font-mono space-y-1 ${
                isBlack
                  ? 'bg-[#0A0D14] border-[#1F2937] text-slate-300'
                  : isDark
                  ? 'bg-[#151D2A] border-[#1E293B] text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>Target: {opportunity.roleTitle}</div>
              <div>Company: {opportunity.companyName}</div>
              <div>Fast-Track: Direct VP Systems Referral</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600/40 text-xs font-semibold hover:bg-white/5 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
