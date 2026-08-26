import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, BrainCircuit, CheckCircle2, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';

export const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-mospi-700 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Award className="w-3.5 h-3.5" /> Welcome to India's Statistical Capacity Ecosystem
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.full_name || 'Officer'}!
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your profile has been created for <strong>{user?.designation || 'Statistical Cadre'}</strong> in <strong>{user?.department || 'MoSPI'}</strong>.
            Before beginning personalized learning recommendations and AI quiz generation, let's establish your initial competency baseline.
          </p>
        </div>
      </div>

      {/* 3 Step Onboarding Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900">Baseline Diagnostic</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Take an 8-question calibrated assessment covering Sampling, National Accounts, Computing, and Price Indices to establish your benchmark.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">Deterministic Gap Map</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform calculates exact gaps ($Required - Current = Gap$) and generates an AI qualitative capacity building prescription.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">iGOT & AI Quiz Studio</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Access iGOT Karmayogi CBPs, upload official statistical reports in the AI Studio, take quizzes, and track your $+26\%$ competency gain.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Ready to begin your Diagnostic Assessment?</h3>
          <p className="text-xs text-slate-500">Takes approximately 8-10 minutes. Calibrates all 9 official statistical domains.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/assessment')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold rounded-lg shadow-md transition"
          >
            <span>Start Baseline Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Skip to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
