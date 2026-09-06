import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, Sparkles, Wand2, AlertCircle } from 'lucide-react';
import { useTheme } from '../lib/theme';

interface RoadmapFormProps {
  onSubmit: (targetRole: string, resumeSkills: string) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  initialTargetRole?: string;
  initialSkills?: string;
}

const SAMPLE_ROLES = [
  'Staff Distributed Systems Engineer',
  'Senior Full-Stack Cloud Architect',
  'Lead Machine Learning & AI Engineer',
  'Senior Security & DevOps Platform Lead',
];

const SAMPLE_PROFILE = `Summary:
Full-Stack & Systems Developer with 5 years of experience building high-concurrency web services and distributed data backends.

Current Technical Skills:
- Languages: Go, TypeScript, Python, SQL, C++
- Distributed Systems: Kubernetes, Docker, gRPC, Raft Consensus basics, Kafka
- Databases & Storage: PostgreSQL, Redis, DynamoDB, RocksDB
- Cloud & DevOps: AWS (EKS, S3, CloudWatch), CI/CD GitHub Actions, Terraform
- Architecture: Microservices, Event-Driven Architecture, High Availability

Recent Project Experience:
- Built real-time streaming pipeline processing 150k events/sec using Go and Apache Kafka.
- Architected active-passive database failover automation minimizing failover RTO to under 3 seconds.
- Containerized core services into Kubernetes clusters with Prometheus & Grafana alerting.`;

export const RoadmapForm: React.FC<RoadmapFormProps> = ({
  onSubmit,
  isSubmitting,
  error,
  initialTargetRole = '',
  initialSkills = '',
}) => {
  const { isBlack, isDark } = useTheme();
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [resumeSkills, setResumeSkills] = useState(initialSkills);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTargetRole) setTargetRole(initialTargetRole);
    if (initialSkills) setResumeSkills(initialSkills);
  }, [initialTargetRole, initialSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!targetRole.trim()) {
      setValidationError('Please specify your Target Job Role.');
      return;
    }

    if (!resumeSkills.trim() || resumeSkills.trim().length < 20) {
      setValidationError('Please paste your current resume or skills overview (at least 20 characters).');
      return;
    }

    await onSubmit(targetRole.trim(), resumeSkills.trim());
  };

  const handleFillSample = () => {
    setTargetRole('Staff Distributed Systems Engineer');
    setResumeSkills(SAMPLE_PROFILE);
    setValidationError(null);
  };

  return (
    <div
      className={`rounded-2xl border transition-all mb-8 shadow-sm overflow-hidden ${
        isBlack
          ? 'bg-[#0A0D14] border-[#1F2937]'
          : isDark
          ? 'bg-[#151D2A] border-[#222F3E]'
          : 'bg-white border-slate-200'
      }`}
      id="roadmap-generator-form-container"
    >
      {/* Form Header */}
      <div
        className={`p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
          isBlack
            ? 'border-[#1F2937] bg-black'
            : isDark
            ? 'border-[#1E293B] bg-[#0F172A]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          <h2
            className={`text-xl font-black tracking-tight flex items-center gap-2 ${
              isBlack || isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>Placement Gap Analysis &amp; Strategy</span>
          </h2>
          <p
            className={`text-xs mt-1 ${
              isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Input your career target and technical profile to trigger the autonomous Gemini strategist.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Load Sample Profile</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Validation or API error */}
        {(validationError || error) && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-400">
                {validationError ? 'Form Incomplete' : 'Generation Error'}
              </div>
              <div className="mt-0.5">{validationError || error}</div>
            </div>
          </div>
        )}

        {/* Target Job Role */}
        <div>
          <label
            htmlFor="target-job-role"
            className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${
              isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Target Job Role
            </span>
          </label>
          <input
            id="target-job-role"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Staff Distributed Systems Engineer, Principal Cloud Architect..."
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition ${
              isBlack
                ? 'bg-black border-[#1F2937] text-white placeholder-slate-600 focus:border-indigo-500'
                : isDark
                ? 'bg-[#0F172A] border-[#222F3E] text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
            }`}
          />

          {/* Quick role suggestions */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Suggested:</span>
            {SAMPLE_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                disabled={isSubmitting}
                className={`text-xs px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                  isBlack
                    ? 'bg-black border-[#1F2937] text-slate-300 hover:border-slate-700'
                    : isDark
                    ? 'bg-[#0F172A] border-[#222F3E] text-slate-300 hover:border-slate-600'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Current Resume / Skills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="resume-skills-input"
              className={`block text-[11px] font-bold uppercase tracking-wider ${
                isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Resume &amp; Skills Overview
              </span>
            </label>
            <span className="text-xs text-slate-400">{resumeSkills.length} characters</span>
          </div>

          <textarea
            id="resume-skills-input"
            rows={7}
            value={resumeSkills}
            onChange={(e) => setResumeSkills(e.target.value)}
            disabled={isSubmitting}
            placeholder="Paste your current resume, stack, recent projects, and architectural proficiencies..."
            className={`w-full px-4 py-3 rounded-xl text-sm font-mono outline-none border transition leading-relaxed ${
              isBlack
                ? 'bg-black border-[#1F2937] text-white placeholder-slate-600 focus:border-indigo-500'
                : isDark
                ? 'bg-[#0F172A] border-[#222F3E] text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
            }`}
          />
        </div>

        {/* Submission Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Evaluated by Gemini 2.0 Flash &bull; Cloud Firestore isolated</span>
          </div>

          <button
            id="generate-roadmap-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto py-3.5 px-6 bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-xs tracking-wider shadow-lg shadow-indigo-500/20 transition disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Autonomous Career Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Calculate 4-Week Execution Roadmap</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
