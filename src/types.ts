export type ThemeMode = 'light' | 'dark' | 'black';

export type NavTab = 'discovery' | 'saved' | 'roadmaps' | 'insights' | 'profile' | 'opportunity-detail';

export interface SalaryTier {
  level: string;
  range: string;
}

export interface EmergingTrend {
  title: string;
  description: string;
  impact?: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface CareerInsightData {
  targetRole: string;
  asOfDate?: string;
  isFallback?: boolean;
  fallbackBadge?: string;
  average_salary_range?: string;
  year_over_year_growth_percentage?: string;
  industry_trend_summary?: string;
  marketDemand: {
    growthRate: string;
    demandLevel: string;
    summary: string;
    hiringHotspots: string[];
    timeToFill?: string;
  };
  salaryBenchmarks: {
    currency: string;
    averageBase: string;
    totalCompRange: string;
    tiers: SalaryTier[];
    equityAndBonusInsight?: string;
  };
  emergingTrends: EmergingTrend[];
  keyInDemandSkills: string[];
  marketOutlook: string;
  sources?: GroundingSource[];
  searchQueries?: string[];
}

export interface Opportunity {
  id: string;
  companyName: string;
  companyBadge?: string; // e.g. "SERIES C", "PRE-IPO", "Tier 1 AI Infrastructure"
  verified?: boolean;
  roleTitle: string;
  location: string;
  matchScore: number;
  summary: string;
  tags: string[];
  compRange: string;
  compExtra?: string;
  postedAgo?: string;
  applicantsCount?: number;
  remoteType?: string;
  level?: string;
  category?: string;
  hasFastTrack?: boolean;
  coverGradient?: string;
  leadership?: {
    name: string;
    title: string;
    quote: string;
    avatarUrl?: string;
  };
  metrics?: {
    qps?: string;
    latency?: string;
    uptime?: string;
  };
  matchBreakdown?: {
    coreSkills: number;
    experienceLevel: number;
    techStack: number;
    compensation: number;
    agentInsight: string;
  };
  skillGapsAudit?: {
    gapTitle: string;
    gapDescription: string;
    recommendedRoadmapTitle: string;
    skillsToCover: string[];
  };
  requiredSkills?: string[];
  acceleratedLoopSteps?: {
    step: string;
    title: string;
    subtitle: string;
  }[];
}

export interface UserProfileData {
  displayName: string;
  title: string;
  verifiedTrack?: string;
  yoe: number;
  bio: string;
  location: string;
  searchMode: string;
  avatarUrl?: string;
  stats: {
    applicationsSubmitted: number;
    roadmapsGenerated: number;
    interviewsPending: number;
    nextInterviewNotice: string;
  };
  agentStatus: {
    scanningRate: string;
    statusText: string;
    activeFilters: string[];
    recentActions: {
      action: string;
      meta: string;
    }[];
  };
}

export interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  key_topics: string[];
  milestone_project: string;
  daily_action_items: string[];
  recommended_resources?: string[];
}

export interface Structured4WeekRoadmap {
  week_1: WeekPlan;
  week_2: WeekPlan;
  week_3: WeekPlan;
  week_4: WeekPlan;
}

export interface RoadmapAnalysis {
  resume_match_score: number;
  critical_skill_gaps: string[];
  '4_week_roadmap': Structured4WeekRoadmap;
}

export interface RoadmapDocument {
  id?: string;
  userId: string;
  userEmail?: string | null;
  targetRole: string;
  resumeSkills: string;
  resume_match_score: number;
  critical_skill_gaps: string[];
  '4_week_roadmap': Structured4WeekRoadmap;
  createdAt?: any;
}
