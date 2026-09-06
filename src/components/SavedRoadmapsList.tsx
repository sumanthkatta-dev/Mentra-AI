import React from 'react';
import { History, Target, Trash2, Calendar, ChevronRight, ShieldCheck } from 'lucide-react';
import type { RoadmapDocument } from '../types';
import { useTheme } from '../lib/theme';

interface SavedRoadmapsListProps {
  roadmaps: RoadmapDocument[];
  selectedId: string | null;
  onSelect: (roadmap: RoadmapDocument) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  loading: boolean;
  userId: string;
}

export const SavedRoadmapsList: React.FC<SavedRoadmapsListProps> = ({
  roadmaps,
  selectedId,
  onSelect,
  onDelete,
  loading,
  userId,
}) => {
  const { isBlack, isDark } = useTheme();

  if (loading) {
    return (
      <div
        className={`rounded-2xl border p-6 shadow-sm mb-8 text-center transition-all ${
          isBlack
            ? 'bg-[#0A0D14] border-[#1F2937]'
            : isDark
            ? 'bg-[#151D2A] border-[#222F3E]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading saved roadmaps from Cloud Firestore...</p>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 mb-8 transition-all ${
        isBlack
          ? 'bg-[#0A0D14] border-[#1F2937]'
          : isDark
          ? 'bg-[#151D2A] border-[#222F3E]'
          : 'bg-white border-slate-200'
      }`}
      id="saved-roadmaps-firestore-container"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700/20 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" />
          <h3
            className={`font-black text-base tracking-tight ${
              isBlack || isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Your Saved Roadmaps ({roadmaps.length})
          </h3>
        </div>
        <div
          className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
            isBlack
              ? 'bg-black border-[#1F2937] text-slate-400'
              : isDark
              ? 'bg-[#0F172A] border-[#1E293B] text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Firestore isolated to UID: {userId.slice(0, 8)}...</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {roadmaps.map((doc) => {
          const isSelected = doc.id === selectedId;
          const score = doc.resume_match_score;
          const dateStr = doc.createdAt
            ? new Date(
                doc.createdAt?.toDate ? doc.createdAt.toDate() : doc.createdAt
              ).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            : 'Recent';

          return (
            <div
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : isBlack
                  ? 'bg-black hover:border-indigo-500/50 text-white border-[#1F2937]'
                  : isDark
                  ? 'bg-[#0F172A] hover:border-indigo-500/50 text-white border-[#1E293B]'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : score >= 70
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-slate-700/20 text-slate-400'
                    }`}
                  >
                    {score}% Match
                  </span>

                  <span
                    className={`text-[11px] ${
                      isSelected ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {dateStr}
                  </span>
                </div>

                <h4 className="font-bold text-sm line-clamp-1 mb-1">{doc.targetRole}</h4>
                <p
                  className={`text-xs line-clamp-2 ${
                    isSelected ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {doc.critical_skill_gaps?.join(' • ') || 'Autonomous technical gaps'}
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between ${
                  isSelected ? 'border-white/20' : 'border-slate-700/20'
                }`}
              >
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-white' : 'text-indigo-400'
                  }`}
                >
                  <span>View Plan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {doc.id && (
                  <button
                    type="button"
                    onClick={(e) => onDelete(doc.id!, e)}
                    className={`p-1.5 rounded-lg opacity-80 hover:opacity-100 transition cursor-pointer ${
                      isSelected
                        ? 'text-white hover:text-rose-200 hover:bg-white/10'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                    }`}
                    title="Delete Roadmap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
