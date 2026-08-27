import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, Circle, ArrowRight, BookOpen, Sparkles, Award, Clock, Building2, UserCheck, RefreshCw } from 'lucide-react';
import { recommendationApi } from '../services/api';

export const LearningPathPage = () => {
  const [loading, setLoading] = useState(true);
  const [learningPathData, setLearningPathData] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    setLoading(true);
    try {
      const res = await recommendationApi.getLearningPath();
      setLearningPathData(res.data);
      if (res.data && res.data.milestones) {
        setMilestones(res.data.milestones);
      }
    } catch (err) {
      console.error("Failed to load dynamic learning path:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (idx) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, completed: !m.completed } : m))
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-mospi-800 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Capacity Roadmap
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLearningPath}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-mospi-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
              {progressPct}% Completed
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Personalized Official Statistical Learning Path
          </h1>
          {learningPathData && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-200">
                <Building2 className="w-3 h-3" /> {learningPathData.division}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">
                <UserCheck className="w-3 h-3" /> {learningPathData.designation}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                <Award className="w-3 h-3" /> Readiness: {learningPathData.overall_readiness_score}%
              </span>
            </div>
          )}
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-1">
            Follow this calibrated milestone roadmap tailored to your specific Division and Designation benchmarks to systematically bridge gaps and record verified skill gains.
          </p>
        </div>

        {/* Grok AI Curation Note */}
        {learningPathData?.ai_curation_note && (
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {learningPathData.ai_curation_note}
            </p>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-mospi-900 h-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-6 transition flex flex-col sm:flex-row items-start justify-between gap-4 ${
              m.completed
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleComplete(idx)}
                className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition"
                title="Toggle completion status"
              >
                {m.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mospi-700 bg-mospi-50 px-2 py-0.5 rounded border border-mospi-200">
                    {m.domain}
                  </span>
                  {m.estimated_hours && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Clock className="w-3 h-3" /> {m.estimated_hours} hrs
                    </span>
                  )}
                </div>
                <h3 className={`text-sm font-bold ${m.completed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {m.description || m.desc}
                </p>
                {m.recommended_resource && (
                  <p className="text-[11px] font-semibold text-mospi-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 inline-block">
                    Recommended: {m.recommended_resource}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={m.action_link || m.link || '/hub'}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                m.completed
                  ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  : 'bg-mospi-900 text-white hover:bg-mospi-800 shadow-sm'
              }`}
            >
              <span>{m.completed ? 'Review Step' : 'Start Milestone'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
