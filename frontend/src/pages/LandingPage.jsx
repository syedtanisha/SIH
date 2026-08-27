import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Database,
  BarChart3
} from 'lucide-react';

export const LandingPage = () => {
  const pillars = [
    {
      icon: BrainCircuit,
      title: "Competency Gap Identification",
      desc: "Deterministic gap analytics benchmark your current skills against official MoSPI and ISS cadre standards to calculate exact priority areas (Required - Current = Gap).",
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      icon: Compass,
      title: "NSSTA & MoSPI Alignment",
      desc: "Seamlessly aligns with National Statistical Systems Training Academy (NSSTA) curricula, recommending targeted official modules and division guidelines.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      icon: Sparkles,
      title: "AI Quiz Studio from Official Documents",
      desc: "Upload official reports, survey manuals, and methodological notes (PDF, DOCX, PPTX) to generate schema-enforced pedagogical MCQs with zero hallucination.",
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      icon: TrendingUp,
      title: "Verifiable Learning Delta Gains",
      desc: "Quantifies demonstrable skill progression before and after learning (e.g., Python for Statistics: 42% → 68%, +26% Gain) in a closed-loop capacity cycle.",
      color: "text-purple-600 bg-purple-50 border-purple-100"
    }
  ];

  const steps = [
    { step: "01", title: "Officer Registration", desc: "Select your cadre (ISS, SSS, State DES, MoSPI Field Operations)." },
    { step: "02", title: "Baseline Diagnostic Test", desc: "Evaluate foundational mastery across 9 core statistical domains." },
    { step: "03", title: "Competency Gap Diagnosis", desc: "Receive mathematical gap metrics and AI-curated study roadmap." },
    { step: "04", title: "Targeted Official Training", desc: "Study authentic NSSTA lab modules, SDRD survey manuals & MoSPI reports." },
    { step: "05", title: "AI Document Quiz Studio", desc: "Upload manuals & generate schema-validated evaluation quizzes." },
    { step: "06", title: "Competency Delta Update", desc: "Observe measurable skill increases (+26%) and update your profile." }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mospi-900 via-mospi-800 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            National Statistical Systems Training Academy & MoSPI Ecosystem
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            AI-Enabled Capacity Building for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400">
              India's Official Statistical System
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            An intelligent, data-driven learning ecosystem designed to identify competency gaps, recommend personalized training through NSSTA and MoSPI divisions, and generate pedagogical assessments from official learning materials.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <span>Officer Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Badges row */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 border-t border-white/10">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> MoSPI & NSSTA Cadre Framework</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-blue-400" /> Official Statistical Standards</span>
            <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-amber-400" /> eSankhyiki Data Dissemination</span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-mospi-700">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Engineered for Statistical Excellence</h2>
          <p className="text-xs sm:text-sm text-slate-600">Addressing the unique capacity building needs of official statisticians and researchers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 6-Step Closed Loop Learning Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">The Continuous Cycle</span>
            <h2 className="text-2xl sm:text-3xl font-bold">Closed-Loop Capacity Building Cycle</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The platform connects diagnostic evaluation, personalized government training, and AI document assessment into an ongoing improvement loop.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition space-y-2">
                <div className="text-amber-400 font-mono font-bold text-sm">{s.step}</div>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistical Domains Covered */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-mospi-50 border border-mospi-200 rounded-2xl p-8 text-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-lg font-bold text-mospi-900">9 Core Statistical Disciplines Benchmarked</h3>
            <p className="text-xs text-slate-600">Grounded in the methodologies of MoSPI, NSSTA, and the UN Statistical Commission.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 text-xs font-medium text-slate-700">
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">📊 Survey Methodology (NSSO)</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🏛 National Accounts (SNA 2008)</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🐍 Statistical Computing (Python/R)</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🏷 Price Statistics (CPI & IIP)</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">👥 Labour Statistics (PLFS)</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🗄 eSankhyiki Data Governance</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🛡 Statistical Quality Assurance</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">📈 Data Visualization & SDGs</span>
            <span className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">🏭 Industrial Statistics (ASI)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
