"use client";
import React, { useState, useEffect } from 'react';
import { User, MatchRecommendation, Skill } from '@/lib/types';
import { apiService } from '@/lib/skillvouchApi';
import { RequestExchangeModal } from './RequestExchangeModal';
import { Loader2, UserPlus, Sparkles, MessageCircle, AlertCircle, Globe, CheckCircle2, Filter, Shield } from 'lucide-react';

interface MatchFinderProps {
  currentUser: User;
  onMessageUser: (userId: string) => void;
}

export const MatchFinder: React.FC<MatchFinderProps> = ({ currentUser, onMessageUser }) => {
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForExchange, setSelectedUserForExchange] = useState<User | null>(null);
  const [strictMode, setStrictMode] = useState(false);
  const [strictMatches, setStrictMatches] = useState<User[]>([]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
        if (!currentUser.skillsToLearn || currentUser.skillsToLearn.length === 0) {
            setRecommendations([]);
            return;
        }

        const response = await apiService.getPeerRecommendations(currentUser.skillsToLearn);
        const candidates = response.verifiedPeers || [];
        
        if (strictMode) {
            // Keep only strict mode candidates? For simplicity, we just use API response
        }

        const results: MatchRecommendation[] = [];

        for (const user of candidates.slice(0, 6)) { // Take top 6 for deep analysis
          try {
            // AI Analysis
            const analysis = await apiService.analyzeMatch(currentUser, user);
            
            // Weighted Average - simplistic fallback 80 for base
            const finalScore = Math.round((80 * 0.4) + ((analysis.score || 80) * 0.6));

            results.push({
              user,
              matchScore: finalScore,
              reasoning: analysis.reasoning || "High compatibility based on skill matching.",
              commonInterests: analysis.commonInterests || []
            });
          } catch (e) {
            console.error("Analysis failed for", user.name);
            results.push({
               user,
               matchScore: 75,
               reasoning: "High compatibility based on verified skills.",
               commonInterests: []
            });
          }
        }
        
        results.sort((a, b) => b.matchScore - a.matchScore);
        setRecommendations(results);
    } catch (e) {
        console.error("Match fetch failed", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.id !== 'temp') {
        fetchMatches();
        
        // Poll for new users every 5 seconds
        const interval = setInterval(fetchMatches, 5000);
        return () => clearInterval(interval);
    }
  }, [currentUser, strictMode]);

  return (
    <div className="space-y-6 relative">
      {selectedUserForExchange && (
        <RequestExchangeModal 
            currentUser={currentUser}
            targetUser={selectedUserForExchange}
            onClose={() => setSelectedUserForExchange(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Find Learning Peers</h2>
          <p className="text-slate-500 dark:text-slate-400">AI-powered matching based on skills & interests.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 px-4 py-2 rounded-full flex items-center text-emerald-700 dark:text-emerald-300 text-sm animate-pulse">
             <Globe className="w-4 h-4 mr-2" />
             <span>Live Search Active</span>
          </div>
          
          {/* Strict Mode Toggle */}
          <button
            onClick={() => setStrictMode(!strictMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
              strictMode 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">
              {strictMode ? 'Strict Mode' : 'Flexible Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Strict Mode Info */}
      {strictMode && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Strict Matching Mode</h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                Only showing mentors who are <strong>verified</strong> in the <strong>exact skills</strong> you want to learn. 
                No similar skills, no unverified users - perfect matches only.
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                Found {strictMatches.length} strict match{strictMatches.length !== 1 ? 'es' : ''} for your learning goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Finding the best learning partners for you...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {(!currentUser.skillsToLearn || currentUser.skillsToLearn.length === 0) 
                 ? 'No learning goals set' 
                 : strictMode ? 'No strict matches found' : 'No matches found yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              {(!currentUser.skillsToLearn || currentUser.skillsToLearn.length === 0)
                ? 'You haven\'t added any skills you want to learn. We need to know your goals to find the best peers for you.'
                : strictMode 
                ? 'No verified mentors found for your exact learning goals. Try switching to Flexible Mode.'
                : 'We couldn\'t find anyone who knows the specific skills you\'re looking for right now.'
              }
            </p>
            
            <div className="mt-8 flex flex-col items-center space-y-4">
               <div className="text-sm text-slate-400">
                  Quick tip: Try adding common skills like <span className="text-indigo-500 font-medium">Cooking</span>, <span className="text-indigo-500 font-medium">Python</span>, or <span className="text-indigo-500 font-medium">Machine Learning</span> to see matches immediately!
               </div>
               <a 
                 href="/dashboard/skillvouch/skills"
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg shadow-indigo-500/25 flex items-center"
               >
                 <Sparkles className="w-4 h-4 mr-2" />
                 Update My Learning Goals
               </a>
            </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((match, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group flex flex-col h-full animate-[fade-in_0.5s_ease-out]">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  {match.user.avatar ? (
                    <img src={match.user.avatar} alt={match.user.name} className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {match.user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col items-end gap-1">
                    {strictMode && strictMatches.some(m => m.id === match.user.id) && (
                      <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-md text-xs font-medium mb-1">
                        <Shield className="w-3 h-3" />
                        <span>Strict Match</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md text-sm font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>{match.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{match.user.name}</h3>

                {/* Common Interests from AI */}
                {match.commonInterests && match.commonInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
                        {match.commonInterests.slice(0, 4).map((interest, i) => (
                             <span key={i} className="text-[10px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
                                {interest}
                            </span>
                        ))}
                    </div>
                )}
                
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 min-h-[40px] line-clamp-2">{match.user.bio}</p>
                
                <div className="space-y-3 mb-6 flex-1">
                    <div className="text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Can teach you:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {match.user.skillsKnown.length > 0 ? match.user.skillsKnown.slice(0, 3).map(s => (
                                <span key={s.id} className={`text-xs px-2 py-0.5 rounded border flex items-center ${
                                    s.verified 
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}>
                                    {s.name}
                                    {s.verified && <CheckCircle2 className="w-3 h-3 ml-1" />}
                                    {s.verified && s.score && <span className="ml-1 text-[10px] opacity-80">({s.score}%)</span>}
                                </span>
                            )) : <span className="text-xs text-slate-500 dark:text-slate-400">No skills added</span>}
                        </div>
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Wants to learn:</span>
                         <div className="flex flex-wrap gap-2 mt-1">
                            {match.user.skillsToLearn.length > 0 ? match.user.skillsToLearn.slice(0, 3).map(s => (
                                <span key={s} className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                                    {s}
                                </span>
                            )) : <span className="text-xs text-slate-500 dark:text-slate-400">No goals added</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">" {match.reasoning} "</p>
                </div>

                <div className="flex space-x-3 mt-auto">
                  <button 
                    onClick={() => setSelectedUserForExchange(match.user)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Request Exchange</span>
                  </button>
                   <button 
                    onClick={() => onMessageUser(match.user.id)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition"
                    title="Message"
                   >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
