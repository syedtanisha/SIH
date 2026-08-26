import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recommendationApi } from '../services/api';
import { ResourceCard } from '../components/ResourceCard';
import { Compass, Sparkles, BookOpen, Layers, ArrowRight } from 'lucide-react';

export const RecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await recommendationApi.getForYou();
        setData(res.data);
      } catch (err) {
        console.error("Error loading recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Matching iGOT Karmayogi, NSSTA, and MoSPI resources to your competency gaps...
      </div>
    );
  }

  const recommendations = data?.recommendations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Compass className="w-4 h-4" />
          <span>For You • AI-Curated Learning Roadmap</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          Personalized Training Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Targeting your primary competency gap in <strong className="text-amber-300">{data?.primary_focus_gap}</strong> ({data?.gap_percentage}% gap). 
          Integrating verified Competency Building Products (CBPs) from iGOT Karmayogi, NSSTA Greater Noida laboratory manuals, and MoSPI official publications.
        </p>
      </div>

      {/* AI Curation Note */}
      {data?.ai_curation_note && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-3">
          <span className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Curator's Capacity Guidance
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {data.ai_curation_note}
            </p>
          </div>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Targeted Learning Modules ({recommendations.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Multi-Source Government Catalog
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => (
            <ResourceCard
              key={idx}
              resource={item.resource}
              relevanceReason={item.relevance_reason}
              matchScore={item.match_score}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
