import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { competencyApi, progressApi } from '../services/api';
import { RadarChartComp } from '../components/RadarChartComp';
import { GapCard } from '../components/GapCard';
import { 
  BarChart3, 
  BrainCircuit, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  FileText
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, gapRes, progressRes] = await Promise.all([
          competencyApi.getProfile(),
          competencyApi.getGapAnalysis(),
          progressApi.getSummary()
        ]);
        setProfile(profileRes.data);
        setGapAnalysis(gapRes.data);
        setProgressSummary(progressRes.data);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading official capacity metrics...
      </div>
    );
  }

  const criticalGaps = gapAnalysis?.gaps?.filter(g => g.gap > 0).slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header Card */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
              {user?.department || 'MoSPI'}
            </span>
            <span className="text-xs text-slate-300">
              {user?.designation || 'Statistical Cadre'}
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Capacity Dashboard: {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time competency tracking calibrated with NSSTA Greater Noida and MoSPI official statistical standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shadow transition"
          >
            <span>Diagnostic Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/studio"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Quiz Studio</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Readiness Index</span>
            <Award className="w-4 h-4 text-mospi-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {profile?.overall_readiness_score || 0}%
          </p>
          <span className="text-[11px] text-slate-500">Across 9 statistical disciplines</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Critical Gaps</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600">
            {gapAnalysis?.critical_gaps_count || 0}
          </p>
          <span className="text-[11px] text-slate-500">Requiring immediate upskilling</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Learning Gain</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            +{progressSummary?.total_learning_gain || 0}%
          </p>
          <span className="text-[11px] text-slate-500">Demonstrated competency growth</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Evaluations Taken</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {progressSummary?.quizzes_completed || 0}
          </p>
          <span className="text-[11px] text-slate-500">Diagnostic & AI quizzes submitted</span>
        </div>
      </div>

      {/* Radar Chart & AI Diagnosis Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Radar Visualization */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Competency Radar Calibration</h2>
              <p className="text-xs text-slate-500">User Current Level vs. Ministry Required Benchmark</p>
            </div>
            <Link to="/competencies" className="text-xs font-semibold text-mospi-900 hover:underline">
              View Matrix →
            </Link>
          </div>

          <RadarChartComp competencies={profile?.competencies || []} />
        </div>

        {/* AI Competency Diagnosis Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                <BrainCircuit className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">AI Capacity Diagnosis</h2>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
              {gapAnalysis?.ai_diagnosis_summary || "Complete the baseline diagnostic test to generate your personalized statistical capacity diagnosis."}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Primary Priority Domain:</span>
                <strong className="text-slate-900">{gapAnalysis?.primary_focus_domain || 'Survey Operations'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Active Gaps:</span>
                <strong className="text-slate-900">{gapAnalysis?.total_gaps_identified || 0} / 9</strong>
              </div>
            </div>
          </div>

          <Link
            to="/gap-analysis"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <span>Explore Full Gap Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top Priority Gaps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Priority Competency Gaps</h2>
            <p className="text-xs text-slate-500">Highest delta gaps requiring targeted upskilling through NSSTA & MoSPI.</p>
          </div>
          <Link to="/recommendations" className="text-xs font-semibold text-mospi-900 hover:underline">
            See All Recommendations →
          </Link>
        </div>

        {criticalGaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {criticalGaps.map((g) => (
              <GapCard key={g.competency_id} gapItem={g} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            🎉 All competencies are currently meeting benchmark requirements! Continue taking refresher quizzes in the AI Learning Studio.
          </div>
        )}
      </div>
    </div>
  );
};
