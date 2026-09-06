import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Square,
  Copy,
  Check,
  Target,
  BookOpen,
  ArrowUpRight,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { RoadmapAnalysis, WeekPlan } from '../types';
import { useTheme } from '../lib/theme';
import { MentorChat } from './MentorChat';

interface RoadmapDisplayProps {
  roadmap: RoadmapAnalysis;
  targetRole: string;
  createdAt?: any;
  onOpenInsights?: (targetRole: string) => void;
  roadmapId?: string;
}

export const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({
  roadmap,
  targetRole,
  createdAt,
  onOpenInsights,
  roadmapId,
}) => {
  const { isBlack, isDark } = useTheme();
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const score = roadmap.resume_match_score;
  const gaps = roadmap.critical_skill_gaps || [];
  const weeksObj = roadmap['4_week_roadmap'];

  // Normalize weeks array
  const weeks: WeekPlan[] = [
    weeksObj?.week_1 || {
      week: 1,
      title: 'Week 1: Core Fundamentals & Primary Gap Closure',
      focus: 'Establish core architectural paradigms.',
      key_topics: [],
      milestone_project: 'Initial implementation',
      daily_action_items: [],
    },
    weeksObj?.week_2 || {
      week: 2,
      title: 'Week 2: Advanced Implementations & System Patterns',
      focus: 'Deepen technical proficiency.',
      key_topics: [],
      milestone_project: 'Advanced component service',
      daily_action_items: [],
    },
    weeksObj?.week_3 || {
      week: 3,
      title: 'Week 3: Production Readiness, Reliability & Scale',
      focus: 'Hardening and scale optimization.',
      key_topics: [],
      milestone_project: 'Production deployment & metrics',
      daily_action_items: [],
    },
    weeksObj?.week_4 || {
      week: 4,
      title: 'Week 4: Portfolio Capstone & Placement Mastery',
      focus: 'End-to-end integration and placement narrative.',
      key_topics: [],
      milestone_project: 'Portfolio-ready capstone showcase',
      daily_action_items: [],
    },
  ];

  const currentWeekPlan = weeks.find((w) => w.week === activeWeek) || weeks[0];

  const toggleActionItem = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(roadmap, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color logic for score
  const getScoreTheme = (val: number) => {
    if (val >= 75) {
      return {
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        badge: 'bg-indigo-600',
        label: 'Priority Hire Readiness',
      };
    }
    if (val >= 50) {
      return {
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        badge: 'bg-indigo-600',
        label: 'High Potential (Actionable Gaps)',
      };
    }
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      badge: 'bg-rose-600',
      label: 'Substantial Skill Shift Needed',
    };
  };

  const scoreTheme = getScoreTheme(score);

  const gapBorderColors = [
    'border-l-amber-400',
    'border-l-rose-400',
    'border-l-indigo-400',
  ];

  return (
    <div className="space-y-8" id="roadmap-display-root">
      {/* Overview Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all shadow-sm ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/20">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Strategy Dashboard</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {targetRole}
            </h1>
            {createdAt && (
              <p className="text-xs text-slate-400 mt-1">
                Autonomous gap analysis generated on{' '}
                {new Date(createdAt?.toDate ? createdAt.toDate() : createdAt).toLocaleDateString(
                  undefined,
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={handleCopyJson}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                isBlack
                  ? 'bg-black border-[#1F2937] text-slate-300 hover:text-white'
                  : isDark
                  ? 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{copied ? 'Copied JSON' : 'Export JSON'}</span>
            </button>

            {onOpenInsights && (
              <button
                onClick={() => onOpenInsights(targetRole)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                  isBlack
                    ? 'bg-black border-indigo-500/40 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300'
                    : isDark
                    ? 'bg-[#0F172A] border-indigo-500/40 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300'
                    : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                }`}
                title="View verified real-time Google Search salary benchmarks & hiring trends"
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Market Insights</span>
              </button>
            )}

            <button
              onClick={() => {
                document.getElementById('ai-mentor-chat-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                isBlack
                  ? 'bg-black border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  : isDark
                  ? 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:text-white hover:border-slate-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Jump to interactive AI Career Strategist Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F5A0]" />
              <span>AI Mentor Chat</span>
            </button>
          </div>
        </div>

        {/* Score & Evaluation Meter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          {/* Circular Score Visualizer */}
          <div
            className={`md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border text-center ${
              isBlack
                ? 'bg-black border-[#1F2937]'
                : isDark
                ? 'bg-[#0F172A] border-[#1E293B]'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="relative flex items-center justify-center mb-2">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-700/20"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-indigo-500"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - score / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-indigo-500">{score}</span>
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Resume Match Score
            </p>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border} border mt-2`}
            >
              {scoreTheme.label}
            </span>
          </div>

          {/* Strategic Context */}
          <div className="md:col-span-8 flex flex-col justify-center">
            <h3
              className={`text-base font-extrabold mb-2 flex items-center gap-2 ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Autonomous Gap Analysis Summary</span>
            </h3>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                isBlack || isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Autonomous gap analysis generated for <strong>{targetRole}</strong>. Your profile benchmarks
              at a{' '}
              <span className="text-indigo-500 font-bold">{score}% technical match</span>. Follow the
              4-week structured sprint below to master the architectural patterns and bridge priority
              vulnerabilities.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isBlack
                    ? 'bg-black border-[#1F2937]'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>3 Critical Technical Gaps</span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  isBlack
                    ? 'bg-black border-[#1F2937]'
                    : isDark
                    ? 'bg-[#0F172A] border-[#1E293B]'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>28-Day Execution Curriculum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Skill Gaps Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Critical Skill Gaps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gaps.map((gap, idx) => {
            const borderClass = gapBorderColors[idx % gapBorderColors.length];
            const gapCategories = ['Architecture', 'Infrastructure', 'Security & Scale'];
            const category = gapCategories[idx] || 'Engineering';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-l-4 ${borderClass} border shadow-sm flex flex-col justify-between transition-all ${
                  isBlack
                    ? 'bg-[#0A0D14] border-[#1F2937]'
                    : isDark
                    ? 'bg-[#151D2A] border-[#222F3E]'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {category} &bull; Gap #{idx + 1}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-2 leading-snug ${
                      isBlack || isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {gap}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/20 flex items-center gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sprint Priority &bull; Phase {idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured 4-Week Roadmap */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Weekly Tabs Navigation */}
        <div
          className={`p-6 border-b ${
            isBlack
              ? 'border-[#1F2937] bg-black'
              : isDark
              ? 'border-[#1E293B] bg-[#0F172A]'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                4-Week Placement Roadmap
              </h3>
              <p
                className={`text-sm mt-1 ${
                  isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Step-by-step modular progression engineered for high-bar technical interviews.
              </p>
            </div>
          </div>

          {/* Week Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weeks.map((week) => {
              const isSelected = week.week === activeWeek;
              const paddedNum = String(week.week).padStart(2, '0');
              return (
                <button
                  key={week.week}
                  onClick={() => setActiveWeek(week.week)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : isBlack
                      ? 'bg-black text-slate-300 border-[#1F2937] hover:border-slate-700'
                      : isDark
                      ? 'bg-[#0F172A] text-slate-300 border-[#222F3E] hover:border-slate-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isBlack || isDark
                        ? 'bg-white/10 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {paddedNum}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-sm block truncate">Week {week.week}</span>
                    <span
                      className={`text-[11px] truncate block ${
                        isSelected ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      Phase {week.week}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Week Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Week Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/20">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded">
                Phase 0{currentWeekPlan.week} Target
              </span>
              <h3
                className={`text-xl font-black mt-2 tracking-tight ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentWeekPlan.title}
              </h3>
            </div>
          </div>

          {/* Core Objective / Focus */}
          <div
            className={`p-4 rounded-xl border text-sm leading-relaxed ${
              isBlack
                ? 'bg-black border-[#1F2937] text-slate-300'
                : isDark
                ? 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span
              className={`font-bold block mb-1 uppercase text-[11px] tracking-wider ${
                isBlack || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Strategic Focus:
            </span>
            {currentWeekPlan.focus}
          </div>

          {/* Key Topics */}
          {currentWeekPlan.key_topics && currentWeekPlan.key_topics.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Key Technical Concepts</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentWeekPlan.key_topics.map((topic, i) => (
                  <span
                    key={i}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                      isBlack
                        ? 'bg-black border-[#1F2937] text-slate-300'
                        : isDark
                        ? 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Milestone Project */}
          {currentWeekPlan.milestone_project && (
            <div
              className={`p-5 rounded-xl border ${
                isBlack
                  ? 'bg-indigo-950/20 border-indigo-500/30'
                  : isDark
                  ? 'bg-indigo-950/30 border-indigo-500/30'
                  : 'bg-indigo-50/50 border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Weekly Proof-of-Work Milestone</span>
              </div>
              <p
                className={`text-sm font-semibold mt-1 ${
                  isBlack || isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentWeekPlan.milestone_project}
              </p>
            </div>
          )}

          {/* Daily Action Items Checklist */}
          {currentWeekPlan.daily_action_items && currentWeekPlan.daily_action_items.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Daily Execution Tasks
              </h4>
              <div className="space-y-2">
                {currentWeekPlan.daily_action_items.map((item, i) => {
                  const itemId = `w${activeWeek}-task-${i}`;
                  const isChecked = !!completedItems[itemId];
                  return (
                    <div
                      key={i}
                      onClick={() => toggleActionItem(itemId)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                        isChecked
                          ? isBlack
                            ? 'bg-black border-indigo-500/40 opacity-70'
                            : isDark
                            ? 'bg-[#0F172A] border-indigo-500/40 opacity-70'
                            : 'bg-indigo-50/40 border-indigo-200 opacity-75'
                          : isBlack
                          ? 'bg-black border-[#1F2937] hover:border-slate-700'
                          : isDark
                          ? 'bg-[#0F172A] border-[#1E293B] hover:border-slate-600'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-indigo-400 focus:outline-none cursor-pointer flex-shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <span
                        className={`text-xs leading-relaxed ${
                          isChecked
                            ? 'line-through text-slate-500'
                            : isBlack || isDark
                            ? 'text-slate-200'
                            : 'text-slate-700'
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Roadmap Screen: Chat with your AI Mentor (Lunar Chrome Design System) */}
      <div className="pt-2">
        <MentorChat roadmapId={roadmapId} targetRole={targetRole} />
      </div>
    </div>
  );
};
