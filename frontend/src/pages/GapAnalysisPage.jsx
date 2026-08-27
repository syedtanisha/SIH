import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { competencyApi } from '../services/api';
import { GapCard } from '../components/GapCard';
import { BrainCircuit, AlertTriangle, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';

export const GapAnalysisPage = () => {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const res = await competencyApi.getGapAnalysis();
        setGapData(res.data);
      } catch (err) {
        console.error("Error loading gap analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Analyzing statistical competency gaps...
      </div>
    );
  }

  const gaps = gapData?.gaps || [];
  const filteredGaps = gaps.filter((g) => {
    if (filterPriority === 'All') return true;
    return g.priority === filterPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <BrainCircuit className="w-4 h-4" />
            <span>Role-Specific Deterministic & AI Gap Diagnostics</span>
          </div>
          {gapData?.user_division && (
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-900/60 border border-blue-400/40 text-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                {gapData.user_division}
              </span>
              <span className="bg-indigo-900/60 border border-indigo-400/40 text-indigo-200 px-2.5 py-0.5 rounded-full font-semibold">
                {gapData.user_designation}
              </span>
            </div>
          )}
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          Competency Gap Analysis & Capacity Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          The system evaluates your assessed competency levels against official benchmarks calibrated for your division & designation: <br />
          <code className="bg-black/30 px-2 py-0.5 rounded text-amber-300 font-mono text-xs">
            Role Required Benchmark Level - Current Assessed Level = Competency Gap
          </code>
        </p>
      </div>

      {/* AI Qualitative Diagnosis Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">AI Capacity Building Prescription</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Primary Focus Domain: <strong className="text-slate-700">{gapData?.primary_focus_domain}</strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/70 p-4 rounded-xl leading-relaxed">
          {gapData?.ai_diagnosis_summary}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['All', 'High', 'Medium', 'Low', 'Met'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterPriority === p
                  ? 'bg-mospi-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p === 'All' ? 'All Gaps' : `${p} Priority`}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing {filteredGaps.length} of {gaps.length} competencies
        </div>
      </div>

      {/* Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGaps.map((g) => (
          <GapCard key={g.competency_id} gapItem={g} />
        ))}
      </div>
    </div>
  );
};
