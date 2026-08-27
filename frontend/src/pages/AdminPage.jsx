import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { ShieldCheck, Users, Award, BookOpen, FileCheck, Building2 } from 'lucide-react';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading administrative metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <ShieldCheck className="w-4 h-4" />
          <span>System Administration & Cohort Analytics</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          MoSPI Capacity Building Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Platform-wide monitoring across Indian Statistical Service (ISS), Subordinate Statistical Service (SSS), and State DES cohorts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Officers Registered</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_officers_registered || 0}</p>
          <span className="text-[11px] text-slate-400">Across Central & State cadres</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Statistical Competencies</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_statistical_competencies || 0}</p>
          <span className="text-[11px] text-slate-400">Standardized Framework</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Learning Resources</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_learning_resources || 0}</p>
          <span className="text-[11px] text-slate-400">NSSTA / MoSPI / eSankhyiki</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">System Readiness Index</span>
          <p className="text-2xl font-black text-emerald-600">{stats?.system_average_readiness_score || 0}%</p>
          <span className="text-[11px] text-slate-400">Cohort Aggregate Score</span>
        </div>
      </div>

      {/* Cadres list */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Active Statistical Cadres Represented</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {stats?.cadres_represented?.map((cadre, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mospi-800" />
              <span>{cadre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
