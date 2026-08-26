import React, { useState, useEffect } from 'react';
import { progressApi } from '../services/api';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Layers, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ProgressPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressApi.getSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Error loading progress summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading longitudinal progress and competency growth records...
      </div>
    );
  }

  const breakdown = summary?.competency_breakdown || [];
  const chartData = breakdown.map((b) => ({
    name: b.name.length > 18 ? b.name.substring(0, 16) + '...' : b.name,
    fullName: b.name,
    Initial: b.initial_score,
    Current: b.current_score,
    Benchmark: b.required_benchmark,
    Gain: b.total_gain
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <TrendingUp className="w-4 h-4" />
          <span>Longitudinal Progress & Capacity Growth</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          Competency Progression Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Tracking demonstrable skill gains achieved across baseline assessments, iGOT Karmayogi coursework, and AI Learning Studio quizzes.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Overall Statistical Readiness</span>
          <p className="text-3xl font-extrabold text-slate-900">{summary?.overall_readiness_score || 0}%</p>
          <span className="text-[11px] text-slate-400">Current average across 9 competencies</span>
        </div>

        <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-emerald-800 font-semibold">Total Verified Learning Gain</span>
          <p className="text-3xl font-extrabold text-emerald-600">+{summary?.total_learning_gain || 0}%</p>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Quantified capacity improvement
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Evaluations Completed</span>
          <p className="text-3xl font-extrabold text-slate-900">{summary?.quizzes_completed || 0}</p>
          <span className="text-[11px] text-slate-400">Average Quiz Accuracy: {summary?.average_quiz_score || 0}%</span>
        </div>
      </div>

      {/* Before vs After Learning Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pre vs. Post Learning Calibration</h2>
          <p className="text-xs text-slate-500">Demonstrating initial benchmark vs. current updated proficiency</p>
        </div>

        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                contentStyle={{ fontSize: '12px', borderRadius: '0.5rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar name="Initial Benchmark" dataKey="Initial" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar name="Current Score (Post Learning)" dataKey="Current" fill="#003366" radius={[4, 4, 0, 0]} />
              <Bar name="Ministry Benchmark" dataKey="Benchmark" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competency Growth Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Competency Breakdown & Gain Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakdown.map((c) => (
            <div key={c.competency_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.domain}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{c.name}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' :
                  c.status === 'Improving' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Before: </span>
                  <strong className="text-slate-700">{c.initial_score}%</strong>
                </div>
                <div className="text-amber-600 font-bold">
                  +{c.total_gain}% Gain
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">After: </span>
                  <strong className="text-mospi-900 font-bold">{c.current_score}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Timeline */}
      {summary?.recent_events && summary.recent_events.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Longitudinal Activity Audit</h2>
          <div className="space-y-3 divide-y divide-slate-100">
            {summary.recent_events.map((evt) => (
              <div key={evt.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{evt.competency_name}</p>
                  <p className="text-[11px] text-slate-500">
                    Event: {evt.event_type.replace('_', ' ')} • {new Date(evt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{evt.delta}% Gain
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{evt.previous_score}% → {evt.new_score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
