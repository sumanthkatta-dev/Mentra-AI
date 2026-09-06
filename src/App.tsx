import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './lib/firebase';
import { Header } from './components/Header';
import { AuthLanding } from './components/AuthLanding';
import { AuthCardholder } from './components/AuthCardholder';
import { DiscoveryView } from './components/DiscoveryView';
import { OpportunityDetailView } from './components/OpportunityDetailView';
import { ProfileView } from './components/ProfileView';
import { RoadmapForm } from './components/RoadmapForm';
import { RoadmapDisplay } from './components/RoadmapDisplay';
import { SavedRoadmapsList } from './components/SavedRoadmapsList';
import { CareerInsights } from './components/CareerInsights';
import { SettingsModal } from './components/SettingsModal';
import { MentraLogo } from './components/MentraLogo';
import { ThemeProvider, useTheme } from './lib/theme';
import { INITIAL_OPPORTUNITIES } from './data/opportunities';
import { INITIAL_USER_PROFILE, type MockRoadmapItem } from './data/profile';
import type { NavTab, Opportunity, RoadmapAnalysis, RoadmapDocument } from './types';
import { Sparkles, ShieldCheck, Bookmark, ArrowRight, Building2, MapPin } from 'lucide-react';

function AppContent() {
  const { theme, isBlack, isDark } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('discovery');

  // Opportunities & Saved items
  const [opportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(
    INITIAL_OPPORTUNITIES[0]
  );
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mentra_saved_opps');
      return saved ? JSON.parse(saved) : ['nexus-ai-staff'];
    } catch {
      return ['nexus-ai-staff'];
    }
  });

  // Settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Roadmap prefill from Opportunity Detail
  const [prefillRole, setPrefillRole] = useState<string>('');
  const [prefillSkills, setPrefillSkills] = useState<string>('');

  // Career Insights active target role
  const [insightsRole, setInsightsRole] = useState<string>(
    'Staff Distributed Systems Engineer'
  );

  // Roadmap generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active viewed roadmap
  const [currentRoadmap, setCurrentRoadmap] = useState<{
    analysis: RoadmapAnalysis;
    targetRole: string;
    createdAt?: any;
    id?: string;
  } | null>(null);

  // Persisted roadmaps list from Firestore
  const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapDocument[]>([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(false);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
        setAuthError(null);
      },
      (err) => {
        console.error('Auth state error:', err);
        setAuthError('Authentication listener failed: ' + err.message);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Fetch and synchronize user's roadmaps in Firestore
  useEffect(() => {
    if (!user) {
      setSavedRoadmaps([]);
      setCurrentRoadmap(null);
      return;
    }

    setRoadmapsLoading(true);
    const path = 'roadmaps';
    const q = query(collection(db, path), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: RoadmapDocument[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          docs.push({
            id: docSnap.id,
            userId: data.userId,
            userEmail: data.userEmail,
            targetRole: data.targetRole,
            resumeSkills: data.resumeSkills,
            resume_match_score: data.resume_match_score,
            critical_skill_gaps: data.critical_skill_gaps,
            '4_week_roadmap': data['4_week_roadmap'],
            createdAt: data.createdAt,
          });
        });

        // Sort in memory by createdAt descending
        docs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;
          const timeB = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;
          return timeB - timeA;
        });

        setSavedRoadmaps(docs);
        setRoadmapsLoading(false);

        // Auto-select latest if none currently selected
        if (docs.length > 0 && !currentRoadmap) {
          setCurrentRoadmap({
            analysis: {
              resume_match_score: docs[0].resume_match_score,
              critical_skill_gaps: docs[0].critical_skill_gaps,
              '4_week_roadmap': docs[0]['4_week_roadmap'],
            },
            targetRole: docs[0].targetRole,
            createdAt: docs[0].createdAt,
            id: docs[0].id,
          });
        }
      },
      (error) => {
        setRoadmapsLoading(false);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle Google Sign In via Firebase Auth popup
  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentRoadmap(null);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  // Handle Toggle Save Opportunity
  const handleToggleSaveOpportunity = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedOpportunityIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('mentra_saved_opps', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save opps in localStorage', err);
      }
      return next;
    });
  };

  // Select opportunity to view details
  const handleSelectOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setActiveTab('opportunity-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Roadmap Generation Form Submission
  const handleGenerateRoadmap = async (targetRole: string, resumeSkills: string) => {
    if (!user) {
      setGenerationError('You must be signed in with Google to generate a roadmap.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Step 1: Securely acquire current Firebase ID Token for backend authentication
      const idToken = await user.getIdToken();

      // Step 2: Request backend placement strategist analysis
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          targetRole,
          resumeSkills,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      const analysisData: RoadmapAnalysis = result.data;

      // Step 3: Save strictly isolated to Cloud Firestore under user's UID
      const path = 'roadmaps';
      let newDocId: string | undefined;
      try {
        const docRef = await addDoc(collection(db, path), {
          userId: user.uid,
          userEmail: user.email || null,
          targetRole,
          resumeSkills,
          resume_match_score: analysisData.resume_match_score,
          critical_skill_gaps: analysisData.critical_skill_gaps,
          '4_week_roadmap': analysisData['4_week_roadmap'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        newDocId = docRef.id;
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.CREATE, path);
      }

      // Step 4: Display the parsed roadmap immediately on the frontend
      setCurrentRoadmap({
        analysis: analysisData,
        targetRole,
        createdAt: new Date().toISOString(),
        id: newDocId,
      });

      setActiveTab('roadmaps');

      // Smooth scroll down to the roadmap view
      setTimeout(() => {
        const element = document.getElementById('roadmap-display-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Roadmap Generation failed:', err);
      setGenerationError(
        err.message || 'Failed to generate roadmap. Please check your network and try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Bridge from Opportunity Detail / Profile to Roadmap Generator
  const handleLoadRoadmapForRole = (roleTitle: string, initialSkills?: string) => {
    setPrefillRole(roleTitle);
    if (initialSkills) {
      setPrefillSkills(initialSkills);
    }
    setActiveTab('roadmaps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Career Insights for target role
  const handleOpenInsightsForRole = (roleTitle: string) => {
    setInsightsRole(roleTitle);
    setActiveTab('insights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete Roadmap
  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this career roadmap from your account?')) {
      return;
    }

    const path = `roadmaps/${id}`;
    try {
      await deleteDoc(doc(db, 'roadmaps', id));
      if (currentRoadmap?.id === id) {
        const remaining = savedRoadmaps.filter((r) => r.id !== id);
        if (remaining.length > 0) {
          setCurrentRoadmap({
            analysis: {
              resume_match_score: remaining[0].resume_match_score,
              critical_skill_gaps: remaining[0].critical_skill_gaps,
              '4_week_roadmap': remaining[0]['4_week_roadmap'],
            },
            targetRole: remaining[0].targetRole,
            createdAt: remaining[0].createdAt,
            id: remaining[0].id,
          });
        } else {
          setCurrentRoadmap(null);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Select a previously saved roadmap
  const handleSelectRoadmap = (selected: RoadmapDocument) => {
    setCurrentRoadmap({
      analysis: {
        resume_match_score: selected.resume_match_score,
        critical_skill_gaps: selected.critical_skill_gaps,
        '4_week_roadmap': selected['4_week_roadmap'],
      },
      targetRole: selected.targetRole,
      createdAt: selected.createdAt,
      id: selected.id,
    });

    const element = document.getElementById('roadmap-display-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Saved Opportunities list
  const savedOpportunities = opportunities.filter((o) => savedOpportunityIds.includes(o.id));

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isBlack
          ? 'bg-[#000000] text-white'
          : isDark
          ? 'bg-[#0F172A] text-white'
          : 'bg-[#F8FAFC] text-[#1E293B]'
      }`}
      id="mentra-app-root"
    >
      {/* Top Header matching designs */}
      <Header
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        loading={authLoading}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedOpportunityIds.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Initializing session...
            </p>
          </div>
        ) : (
          <div>
            {/* VIEW 1: Discovery (Home) matching Image 2 */}
            {activeTab === 'discovery' && (
              <DiscoveryView
                user={user}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                authLoading={authLoading}
                authError={authError}
                userName={user?.displayName || user?.email?.split('@')[0] || 'Engineer'}
                opportunities={opportunities}
                onSelectOpportunity={handleSelectOpportunity}
                savedOpportunityIds={savedOpportunityIds}
                onToggleSave={handleToggleSaveOpportunity}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onGenerateRoadmapForRole={handleLoadRoadmapForRole}
              />
            )}

            {/* VIEW 2: Opportunity Detail matching Image 3 */}
            {activeTab === 'opportunity-detail' && selectedOpportunity && (
              <OpportunityDetailView
                opportunity={selectedOpportunity}
                onBack={() => setActiveTab('discovery')}
                isSaved={savedOpportunityIds.includes(selectedOpportunity.id)}
                onToggleSave={() => handleToggleSaveOpportunity(selectedOpportunity.id)}
                onGenerateRoadmap={handleLoadRoadmapForRole}
                onOpenInsights={handleOpenInsightsForRole}
              />
            )}

            {/* VIEW 3: Saved Opportunities & Roadmaps */}
            {activeTab === 'saved' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h1
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        isBlack || isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Saved Opportunities ({savedOpportunities.length})
                    </h1>
                    <span className="text-xs text-indigo-400 font-semibold">
                      Persistent Wishlist
                    </span>
                  </div>
                  <p
                    className={`text-xs ${isBlack || isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    High-affinity technical opportunities bookmarked for autonomous application or roadmap generation.
                  </p>
                </div>

                {savedOpportunities.length === 0 ? (
                  <div
                    className={`p-12 text-center rounded-2xl border ${
                      isBlack
                        ? 'bg-[#0A0D14] border-[#1F2937]'
                        : isDark
                        ? 'bg-[#151D2A] border-[#222F3E]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-semibold">No saved opportunities yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Browse Discovery and bookmark roles to track them here.
                    </p>
                    <button
                      onClick={() => setActiveTab('discovery')}
                      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                    >
                      Browse Discovery
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {savedOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => handleSelectOpportunity(opp)}
                        className={`rounded-2xl p-6 border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-md ${
                          isBlack
                            ? 'bg-[#0A0D14] border-[#1F2937] hover:border-indigo-500/50'
                            : isDark
                            ? 'bg-[#151D2A] border-[#222F3E] hover:border-indigo-500/50'
                            : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 font-bold text-sm">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div>
                                <div
                                  className={`font-bold text-sm ${
                                    isBlack || isDark ? 'text-white' : 'text-slate-900'
                                  }`}
                                >
                                  {opp.companyName}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{opp.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-600 text-white">
                                {opp.matchScore}% Match
                              </span>
                              <button
                                onClick={(e) => handleToggleSaveOpportunity(opp.id, e)}
                                className="p-1.5 text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition"
                                title="Remove bookmark"
                              >
                                <Bookmark className="w-4 h-4 fill-indigo-500" />
                              </button>
                            </div>
                          </div>

                          <h3
                            className={`text-lg font-extrabold tracking-tight mb-2 group-hover:text-indigo-500 transition-colors ${
                              isBlack || isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {opp.roleTitle}
                          </h3>

                          <p
                            className={`text-xs leading-relaxed line-clamp-2 mb-4 ${
                              isBlack || isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {opp.summary}
                          </p>
                        </div>

                        <div
                          className={`pt-4 border-t flex items-center justify-between text-xs ${
                            isBlack
                              ? 'border-[#1F2937]'
                              : isDark
                              ? 'border-[#1E293B]'
                              : 'border-slate-100'
                          }`}
                        >
                          <div className="font-extrabold">{opp.compRange}</div>
                          <div className="flex items-center gap-1 font-bold text-indigo-500">
                            <span>Review Match Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Saved Roadmaps from Firestore */}
                {user && (
                  <div className="pt-4">
                    <SavedRoadmapsList
                      roadmaps={savedRoadmaps}
                      selectedId={currentRoadmap?.id || null}
                      onSelect={(doc) => {
                        handleSelectRoadmap(doc);
                        setActiveTab('roadmaps');
                      }}
                      onDelete={handleDeleteRoadmap}
                      loading={roadmapsLoading}
                      userId={user.uid}
                    />
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: My Roadmaps (AI Placement Strategist Engine) */}
            {activeTab === 'roadmaps' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Header Banner */}
                <div
                  className={`rounded-2xl p-6 sm:p-8 border transition-all ${
                    isBlack
                      ? 'bg-[#0A0D14] border-[#1F2937]'
                      : isDark
                      ? 'bg-[#151D2A] border-[#222F3E]'
                      : 'bg-white border-slate-200'
                  } shadow-sm`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Autonomous Career Strategist Engine</span>
                      </div>
                      <h1
                        className={`text-2xl sm:text-3xl font-black tracking-tight ${
                          isBlack || isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Calculate 4-Week Career Trajectory
                      </h1>
                      <p
                        className={`text-sm mt-1 ${
                          isBlack || isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Input your target role and technical skills to generate an actionable 4-week roadmap
                        powered by Gemini 2.0 Flash.
                      </p>
                    </div>

                    {user && (
                      <div
                        className={`flex items-center gap-2 self-start md:self-auto px-3.5 py-2 rounded-xl border text-xs font-mono shadow-sm ${
                          isBlack
                            ? 'bg-black border-[#1F2937] text-slate-300'
                            : isDark
                            ? 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">
                          UID: {user.uid}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {!user && (
                  <div className="py-2">
                    <AuthCardholder
                      user={user}
                      onSignIn={handleSignIn}
                      onSignOut={handleSignOut}
                      loading={authLoading}
                      error={authError}
                    />
                  </div>
                )}

                {/* Input Form */}
                <RoadmapForm
                  onSubmit={handleGenerateRoadmap}
                  isSubmitting={isGenerating}
                  error={generationError}
                  initialTargetRole={prefillRole}
                  initialSkills={prefillSkills}
                />

                {/* Previously Saved Roadmaps from Firestore */}
                {user && (
                  <SavedRoadmapsList
                    roadmaps={savedRoadmaps}
                    selectedId={currentRoadmap?.id || null}
                    onSelect={handleSelectRoadmap}
                    onDelete={handleDeleteRoadmap}
                    loading={roadmapsLoading}
                    userId={user.uid}
                  />
                )}

                {/* Visual Roadmap Display */}
                {currentRoadmap && (
                  <div id="roadmap-display-section" className="pt-2">
                    <RoadmapDisplay
                      roadmap={currentRoadmap.analysis}
                      targetRole={currentRoadmap.targetRole}
                      createdAt={currentRoadmap.createdAt}
                      onOpenInsights={handleOpenInsightsForRole}
                      roadmapId={currentRoadmap.id}
                    />
                  </div>
                )}
              </div>
            )}

            {/* VIEW: Career Insights (Google Search Grounding) */}
            {activeTab === 'insights' && (
              <div className="space-y-8 animate-in fade-in">
                <CareerInsights
                  user={user}
                  initialRole={insightsRole}
                  onGenerateRoadmap={(role) => handleLoadRoadmapForRole(role)}
                  onSignInRequired={handleSignIn}
                />
              </div>
            )}

            {/* VIEW 5: Profile matching Image 4 */}
            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                profileData={INITIAL_USER_PROFILE}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onGenerateNewRoadmap={() => {
                  setActiveTab('roadmaps');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectRoadmapItem={(item: MockRoadmapItem) => {
                  if (item.targetRole) {
                    handleLoadRoadmapForRole(item.targetRole);
                  } else {
                    setActiveTab('roadmaps');
                  }
                }}
                firestoreRoadmapsCount={savedRoadmaps.length}
              />
            )}
          </div>
        )}
      </main>

      {/* Settings Modal (including Black Theme setting) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={user?.email}
        userId={user?.uid}
      />

      {/* Footer matching Image 2 */}
      <footer
        className={`border-t py-6 mt-12 transition-colors ${
          isBlack
            ? 'border-[#1F2937] bg-black text-slate-400'
            : isDark
            ? 'border-[#1E293B] bg-[#0A0D14] text-slate-400'
            : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MentraLogo theme={theme} size="sm" showText={false} />
            <span className={`font-bold ${isBlack || isDark ? 'text-white' : 'text-slate-900'}`}>
              Mentra
            </span>
            <span>&mdash; Autonomous Career Intelligence</span>
          </div>
          <div>&copy; 2025 Mentra Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
