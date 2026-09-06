import type { UserProfileData } from '../types';

export const INITIAL_USER_PROFILE: UserProfileData = {
  displayName: 'Alex Morgan',
  title: 'Senior Distributed Systems Engineer',
  verifiedTrack: 'Verified Principal Track',
  yoe: 7,
  bio: 'Passionate about high-throughput distributed architectures, consensus protocols, and autonomous AI infrastructure. Open to Staff / Principal roles.',
  location: 'San Francisco • Hybrid / Remote',
  searchMode: 'Active Search Mode',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  stats: {
    applicationsSubmitted: 14,
    roadmapsGenerated: 6,
    interviewsPending: 3,
    nextInterviewNotice: 'Next: Technical Round with Nexus AI Labs on Thursday',
  },
  agentStatus: {
    scanningRate: '24 Scans / Day',
    statusText: 'Evaluating matches in real-time across top-tier orgs',
    activeFilters: [
      '$230k - $340k Base',
      'Distributed Systems / Consensus',
      'Series B+ / Public',
      'Remote or Bay Area',
    ],
    recentActions: [
      {
        action: 'Custom Cover Letter & Match Profile sent',
        meta: 'Nexus AI Labs • 4h ago',
      },
      {
        action: 'Raft Consensus roadmap milestone flagged',
        meta: 'Updated profile weight • Yesterday',
      },
    ],
  },
};

export interface MockRoadmapItem {
  id: string;
  category: string;
  title: string;
  progressPercent: number;
  currentWeek: string;
  statusText: string;
  nextModule: string;
  isVerified?: boolean;
  scoreNotice?: string;
  targetRole?: string;
}

export const PROFILE_ROADMAPS: MockRoadmapItem[] = [
  {
    id: 'raft-consensus-deep-dive',
    category: 'STAFF ARCHETYPE PREP',
    title: 'Distributed Consensus & Raft Deep Dive (Prep for Nexus AI Staff Role)',
    progressPercent: 75,
    currentWeek: 'Week 3 of 4',
    statusText: '3 of 4 Modules Mastered',
    nextModule: 'Multi-Paxos vs Raft Leader Election Edge Cases',
    targetRole: 'Staff Distributed Systems Engineer',
  },
  {
    id: 'ebpf-kernel-tracing',
    category: 'KERNEL & NETWORKING',
    title: 'eBPF Linux Kernel Tracing & Network Performance',
    progressPercent: 40,
    currentWeek: 'Week 2 of 4',
    statusText: 'Subsystems & Hooks in Progress',
    nextModule: 'BCC Tools & Kernel Probe Instrumentation',
    targetRole: 'Staff Infrastructure Engineer',
  },
  {
    id: 'system-design-100m-qps',
    category: 'SYSTEMS ARCHITECTURE',
    title: 'System Design for 100M QPS Streaming Architectures',
    progressPercent: 100,
    currentWeek: 'Completed • Verified 4 weeks path',
    statusText: 'Score: 98th Percentile',
    nextModule: 'All Modules Completed',
    isVerified: true,
    scoreNotice: 'Score: 98th Percentile',
    targetRole: 'Principal Architect',
  },
];
